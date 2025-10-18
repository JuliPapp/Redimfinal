// @ts-nocheck
// Este archivo está diseñado para Deno (Supabase Edge Functions)
// Los imports con npm:, jsr: y node: son válidos en Deno
// TypeScript en VS Code mostrará errores pero el código funciona correctamente en Supabase

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

const app = new Hono();
// Middleware - CORS with explicit configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: false,
}));
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// ==================== KV STORE FUNCTIONS ====================
const KV_TABLE = 'kv_store_636f4a29';

const kv = {
  get: async (key: string): Promise<any> => {
    const { data, error } = await supabase.from(KV_TABLE).select("value").eq("key", key).maybeSingle();
    if (error) throw new Error(error.message);
    return data?.value;
  },
  
  set: async (key: string, value: any): Promise<void> => {
    const { error } = await supabase.from(KV_TABLE).upsert({ key, value });
    if (error) throw new Error(error.message);
  },
  
  del: async (key: string): Promise<void> => {
    const { error } = await supabase.from(KV_TABLE).delete().eq("key", key);
    if (error) throw new Error(error.message);
  },
  
  mget: async (keys: string[]): Promise<any[]> => {
    const { data, error } = await supabase.from(KV_TABLE).select("value").in("key", keys);
    if (error) throw new Error(error.message);
    return data?.map((d) => d.value) ?? [];
  },
  
  mset: async (keys: string[], values: any[]): Promise<void> => {
    const { error } = await supabase.from(KV_TABLE).upsert(keys.map((k, i) => ({ key: k, value: values[i] })));
    if (error) throw new Error(error.message);
  },
  
  mdel: async (keys: string[]): Promise<void> => {
    const { error } = await supabase.from(KV_TABLE).delete().in("key", keys);
    if (error) throw new Error(error.message);
  },
  
  getByPrefix: async (prefix: string): Promise<any[]> => {
    const { data, error } = await supabase.from(KV_TABLE).select("key, value").like("key", prefix + "%");
    if (error) throw new Error(error.message);
    return data?.map((d) => d.value) ?? [];
  }
};

// Encryption helpers
const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY') || crypto.randomBytes(32).toString('hex');
const algorithm = 'aes-256-cbc';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  try {
    // Check if data is encrypted (has ':' separator)
    if (!text.includes(':')) {
      // Data is not encrypted, return as is
      return text;
    }
    
    const parts = text.split(':');
    if (parts.length !== 2) {
      // Invalid format, return as is
      return text;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Error decrypting data, returning original:', error);
    // If decryption fails, return original text (might be unencrypted data)
    return text;
  }
}

// Helper to verify user
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    console.log('No auth header provided');
    return null;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found in auth header');
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) {
    console.error('Error verifying user:', error.message);
    return null;
  }
  if (!user) {
    console.log('No user found for token');
    return null;
  }
  return user;
}

// Helper to get user profile
async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

// ==================== AUTH ROUTES ====================

// Get user profile
app.get('/auth/profile', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile) {
      // If profile doesn't exist, create a basic one
      console.log('Creating basic profile for user:', user.id);
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
          gender: user.user_metadata?.gender || null,
          age: user.user_metadata?.age || null,
          role: 'disciple',
          leader_id: null
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return c.json({ error: 'Failed to create profile' }, 500);
      }

      // Fetch the newly created profile
      const newProfile = await getUserProfile(user.id);
      if (!newProfile) {
        return c.json({ error: 'Profile not found after creation' }, 500);
      }
      
      return c.json({ profile: newProfile });
    }

    return c.json({ profile });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Internal server error while fetching profile' }, 500);
  }
});

// Sign up as disciple
app.post('/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, gender, age, leaderId } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password and name are required' }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since we don't have email server configured
      user_metadata: { name, gender, age }
    });

    if (authError) {
      console.error('Error creating user:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        gender: gender || null,
        age: age || null,
        role: 'disciple',
        leader_id: leaderId || null
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return c.json({ error: 'Failed to create profile' }, 500);
    }

    return c.json({ 
      success: true,
      user: authData.user
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Create leader (admin only)
app.post('/auth/create-leader', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: 'Only admins can create leaders' }, 403);
    }

    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password and name are required' }, 400);
    }

    // Create leader user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    });

    if (authError) {
      console.error('Error creating leader:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create leader profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'leader',
        leader_id: null
      });

    if (profileError) {
      console.error('Error creating leader profile:', profileError);
      return c.json({ error: 'Failed to create leader profile' }, 500);
    }

    return c.json({ 
      success: true,
      leader: { id: authData.user.id, email, name, role: 'leader' }
    });
  } catch (error) {
    console.error('Create leader error:', error);
    return c.json({ error: 'Internal server error while creating leader' }, 500);
  }
});

// ==================== CHECK-IN ROUTES ====================

// Old Supabase table-based routes removed - now using KV store below

// ==================== COMMUNITY ROUTES ====================

// Get available leaders
app.get('/leaders', async (c) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('role', 'leader')
      .order('name');

    if (error) {
      console.error('Error fetching leaders:', error);
      
      // Check if table doesn't exist
      if (error.message && (error.message.includes('relation') || error.message.includes('does not exist'))) {
        return c.json({ 
          error: 'Database not configured. Please run setup SQL script first.',
          leaders: [] 
        }, 200);
      }
      
      return c.json({ error: 'Failed to fetch leaders', leaders: [] }, 500);
    }

    return c.json({ leaders: data || [] });
  } catch (error) {
    console.error('Get leaders error:', error);
    return c.json({ error: 'Internal server error while fetching leaders', leaders: [] }, 500);
  }
});

// Get leader's disciples (leader only)
app.get('/disciples', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can view disciples' }, 403);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, created_at, leader_id')
      .eq('leader_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching disciples:', error);
      return c.json({ error: 'Failed to fetch disciples' }, 500);
    }

    console.log(`Leader ${user.id} fetched disciples - found ${data?.length || 0} disciples`);
    if (data && data.length > 0) {
      console.log('Disciples:', data.map((d: any) => ({ id: d.id, name: d.name, leader_id: d.leader_id })));
    }

    return c.json({ disciples: data });
  } catch (error) {
    console.error('Get disciples error:', error);
    return c.json({ error: 'Internal server error while fetching disciples' }, 500);
  }
});

// Get available disciples (disciples without a leader or pending request) - leader only
app.get('/available-disciples', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can view available disciples' }, 403);
    }

    // Try with leader_request_id first, fall back if column doesn't exist
    let query = supabase
      .from('profiles')
      .select('id, name, email, created_at')
      .eq('role', 'disciple')
      .is('leader_id', null)
      .order('created_at', { ascending: false });

    // Try to filter by leader_request_id if it exists
    try {
      query = query.is('leader_request_id', null);
    } catch (e) {
      console.warn('leader_request_id column not found, using legacy mode');
    }

    const { data, error } = await query;

    if (error) {
      // If error is about missing column, try without it
      if (error.message && error.message.includes('leader_request_id')) {
        console.warn('⚠️ Database migration needed: Run the SQL script in DATABASE_MIGRATION.md');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('id, name, email, created_at')
          .eq('role', 'disciple')
          .is('leader_id', null)
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('Error fetching available disciples:', fallbackError);
          return c.json({ error: 'Failed to fetch available disciples' }, 500);
        }

        return c.json({ availableDisciples: fallbackData, legacyMode: true });
      }

      console.error('Error fetching available disciples:', error);
      return c.json({ error: 'Failed to fetch available disciples' }, 500);
    }

    return c.json({ availableDisciples: data });
  } catch (error) {
    console.error('Get available disciples error:', error);
    return c.json({ error: 'Internal server error while fetching available disciples' }, 500);
  }
});

// Get pending requests for a leader
app.get('/pending-requests', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can view pending requests' }, 403);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, created_at')
      .eq('leader_request_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      // If column doesn't exist, return empty array (legacy mode)
      if (error.code === '42703' || (error.message && error.message.includes('leader_request_id'))) {
        console.warn('⚠️ Database migration needed: Run the SQL script in DATABASE_MIGRATION.md');
        console.warn('⚠️ Running in legacy mode - request system disabled until migration');
        return c.json({ pendingRequests: [], legacyMode: true });
      }

      console.error('Error fetching pending requests:', error);
      return c.json({ error: 'Failed to fetch pending requests' }, 500);
    }

    return c.json({ pendingRequests: data });
  } catch (error) {
    console.error('Get pending requests error:', error);
    return c.json({ error: 'Internal server error while fetching pending requests' }, 500);
  }
});

// Get current leader info (disciple gets info about their assigned leader)
app.get('/my-leader', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'disciple') {
      return c.json({ error: 'Only disciples can view leader info' }, 403);
    }

    if (!profile.leader_id) {
      return c.json({ leader: null });
    }

    // Get leader info
    const leaderProfile = await getUserProfile(profile.leader_id);
    if (!leaderProfile) {
      return c.json({ leader: null });
    }

    return c.json({ 
      leader: {
        id: leaderProfile.id,
        name: leaderProfile.name,
        email: leaderProfile.email
      }
    });
  } catch (error) {
    console.error('Get leader info error:', error);
    return c.json({ leader: null });
  }
});

// Get leader info for pending request (disciple gets info about who requested)
app.get('/request-info', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'disciple') {
      return c.json({ error: 'Only disciples can view request info' }, 403);
    }

    // Check if leader_request_id exists in profile
    if (!profile.leader_request_id) {
      return c.json({ hasRequest: false });
    }

    // Get leader info
    const leaderProfile = await getUserProfile(profile.leader_request_id);
    if (!leaderProfile) {
      return c.json({ hasRequest: false });
    }

    return c.json({ 
      hasRequest: true,
      leader: {
        id: leaderProfile.id,
        name: leaderProfile.name,
        email: leaderProfile.email
      }
    });
  } catch (error) {
    console.error('Get request info error:', error);
    // If error is about missing column, return no request
    return c.json({ hasRequest: false, legacyMode: true });
  }
});

// Send accompaniment request to disciple (creates pending request)
app.post('/assign-disciple', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can send requests' }, 403);
    }

    const body = await c.req.json();
    const { discipleId } = body;

    if (!discipleId) {
      return c.json({ error: 'Disciple ID is required' }, 400);
    }

    // Verify the disciple exists and is actually a disciple
    const discipleProfile = await getUserProfile(discipleId);
    if (!discipleProfile || discipleProfile.role !== 'disciple') {
      return c.json({ error: 'Invalid disciple ID' }, 400);
    }

    // Check if disciple already has a leader
    if (discipleProfile.leader_id) {
      return c.json({ error: 'This person already has a leader' }, 400);
    }

    // Check if disciple already has a pending request (if column exists)
    if (discipleProfile.leader_request_id) {
      return c.json({ error: 'This person already has a pending request' }, 400);
    }

    // Try to create pending request (stored in leader_request_id)
    const { error } = await supabase
      .from('profiles')
      .update({ leader_request_id: user.id })
      .eq('id', discipleId);

    if (error) {
      // If column doesn't exist, fall back to direct assignment (legacy mode)
      if (error.code === '42703' || (error.message && error.message.includes('leader_request_id'))) {
        console.warn('⚠️ Database migration needed: Assigning directly without request system');
        console.warn('⚠️ Run the SQL script in DATABASE_MIGRATION.md to enable the request system');
        
        const { error: legacyError } = await supabase
          .from('profiles')
          .update({ leader_id: user.id })
          .eq('id', discipleId);

        if (legacyError) {
          console.error('Error assigning disciple (legacy mode):', legacyError);
          return c.json({ error: 'Failed to assign disciple' }, 500);
        }

        return c.json({ 
          success: true, 
          message: 'Disciple assigned directly (legacy mode)',
          legacyMode: true 
        });
      }

      console.error('Error sending request:', error);
      return c.json({ error: 'Failed to send request' }, 500);
    }

    return c.json({ success: true, message: 'Request sent successfully' });
  } catch (error) {
    console.error('Send request error:', error);
    return c.json({ error: 'Internal server error while sending request' }, 500);
  }
});

// Cancel request or unassign disciple
app.post('/unassign-disciple', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can unassign disciples' }, 403);
    }

    const body = await c.req.json();
    const { discipleId } = body;

    if (!discipleId) {
      return c.json({ error: 'Disciple ID is required' }, 400);
    }

    // Verify the disciple belongs to this leader (unless admin)
    const discipleProfile = await getUserProfile(discipleId);
    if (!discipleProfile) {
      return c.json({ error: 'Disciple not found' }, 404);
    }

    if (profile.role !== 'admin' && 
        discipleProfile.leader_id !== user.id && 
        discipleProfile.leader_request_id !== user.id) {
      return c.json({ error: 'You can only unassign your own disciples' }, 403);
    }

    // Remove the leader from the disciple (both confirmed and pending)
    const { error } = await supabase
      .from('profiles')
      .update({ 
        leader_id: null,
        leader_request_id: null
      })
      .eq('id', discipleId);

    if (error) {
      console.error('Error unassigning disciple:', error);
      return c.json({ error: 'Failed to unassign disciple' }, 500);
    }

    return c.json({ success: true, message: 'Request cancelled successfully' });
  } catch (error) {
    console.error('Unassign disciple error:', error);
    return c.json({ error: 'Internal server error while unassigning disciple' }, 500);
  }
});

// Accept accompaniment request (disciple accepts leader)
app.post('/accept-request', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'disciple') {
      return c.json({ error: 'Only disciples can accept requests' }, 403);
    }

    if (!profile.leader_request_id) {
      return c.json({ error: 'No pending request found' }, 400);
    }

    // Move request to confirmed leader
    const { error } = await supabase
      .from('profiles')
      .update({ 
        leader_id: profile.leader_request_id,
        leader_request_id: null
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error accepting request:', error);
      return c.json({ error: 'Failed to accept request' }, 500);
    }

    return c.json({ success: true, message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Accept request error:', error);
    return c.json({ error: 'Internal server error while accepting request' }, 500);
  }
});

// Reject accompaniment request (disciple rejects leader)
app.post('/reject-request', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'disciple') {
      return c.json({ error: 'Only disciples can reject requests' }, 403);
    }

    if (!profile.leader_request_id) {
      return c.json({ error: 'No pending request found' }, 400);
    }

    // Remove pending request
    const { error } = await supabase
      .from('profiles')
      .update({ leader_request_id: null })
      .eq('id', user.id);

    if (error) {
      console.error('Error rejecting request:', error);
      return c.json({ error: 'Failed to reject request' }, 500);
    }

    return c.json({ success: true, message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Reject request error:', error);
    return c.json({ error: 'Internal server error while rejecting request' }, 500);
  }
});

// Update disciple's leader
app.post('/update-leader', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { leaderId } = body;

    // Verify leader exists
    if (leaderId) {
      const leaderProfile = await getUserProfile(leaderId);
      if (!leaderProfile || leaderProfile.role !== 'leader') {
        return c.json({ error: 'Invalid leader ID' }, 400);
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ leader_id: leaderId || null })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating leader:', error);
      return c.json({ error: 'Failed to update leader' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Update leader error:', error);
    return c.json({ error: 'Internal server error while updating leader' }, 500);
  }
});

// Change accompaniment mode (personal/community)
app.post('/change-mode', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { mode } = body;

    if (!mode || (mode !== 'personal' && mode !== 'community')) {
      return c.json({ error: 'Invalid mode. Must be "personal" or "community"' }, 400);
    }

    const profile = await getUserProfile(user.id);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updateData: any = {};
    const privacyKey = `privacy:${user.id}`;
    
    if (mode === 'personal') {
      // Save current leader_id before removing it
      if (profile.leader_id) {
        await kv.set(privacyKey, {
          hide_checkins: true,
          previous_leader_id: profile.leader_id,
          changed_at: new Date().toISOString()
        });
        console.log(`Saved previous leader ${profile.leader_id} for user ${user.id}`);
      } else {
        await kv.set(privacyKey, {
          hide_checkins: true,
          changed_at: new Date().toISOString()
        });
      }
      
      updateData.leader_id = null;
      console.log(`User ${user.id} changing to personal mode - setting leader_id to null`);
    } else if (mode === 'community') {
      // Try to restore previous leader
      const privacyData = await kv.get(privacyKey) as any;
      
      if (privacyData?.previous_leader_id) {
        // Restore the previous leader
        updateData.leader_id = privacyData.previous_leader_id;
        console.log(`Restoring previous leader ${privacyData.previous_leader_id} for user ${user.id}`);
        
        // Update privacy data
        await kv.set(privacyKey, {
          hide_checkins: false,
          changed_at: new Date().toISOString()
        });
      } else {
        // No previous leader to restore, just update privacy
        await kv.set(privacyKey, {
          hide_checkins: false,
          changed_at: new Date().toISOString()
        });
        console.log(`User ${user.id} changing to community mode but no previous leader to restore`);
      }
    }

    // Only update profile if there are changes
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error changing mode:', error);
        return c.json({ error: 'Failed to change mode' }, 500);
      }
    }

    console.log(`Successfully changed mode to ${mode} for user ${user.id}`);

    // Fetch updated profile
    const updatedProfile = await getUserProfile(user.id);
    if (!updatedProfile) {
      return c.json({ error: 'Profile not found after update' }, 500);
    }

    console.log(`Profile after mode change:`, { 
      id: updatedProfile.id, 
      name: updatedProfile.name, 
      role: updatedProfile.role,
      leader_id: updatedProfile.leader_id,
      mode
    });

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Change mode error:', error);
    return c.json({ error: 'Internal server error while changing mode' }, 500);
  }
});

// Get disciple overview (leader only)
app.get('/disciple/:discipleId/overview', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can view disciple data' }, 403);
    }

    const discipleId = c.req.param('discipleId');

    // Verify disciple belongs to this leader
    const discipleProfile = await getUserProfile(discipleId);
    if (!discipleProfile || (discipleProfile.leader_id !== user.id && profile.role !== 'admin')) {
      return c.json({ error: 'You can only view your own disciples' }, 403);
    }

    // Get last 30 days of check-ins (only risk levels and dates for privacy)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('check_ins')
      .select('id, risk_level, created_at')
      .eq('user_id', discipleId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching disciple overview:', error);
      return c.json({ error: 'Failed to fetch disciple data' }, 500);
    }

    return c.json({ 
      disciple: {
        id: discipleProfile.id,
        name: discipleProfile.name,
        email: discipleProfile.email
      },
      checkIns: data
    });
  } catch (error) {
    console.error('Get disciple overview error:', error);
    return c.json({ error: 'Internal server error while fetching disciple data' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// CHECK-IN ROUTES
// ============================================

// Save check-in
app.post('/checkins', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { checkInData, rootAnalysis } = body;

    if (!checkInData || !rootAnalysis) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create check-in entry
    const checkInId = crypto.randomUUID();
    const checkIn = {
      id: checkInId,
      user_id: user.id,
      struggles: checkInData.struggles,
      intensity: checkInData.intensity,
      trigger: checkInData.trigger || null,
      emotions: checkInData.emotions,
      identified_roots: rootAnalysis.identifiedRoots,
      timestamp: rootAnalysis.timestamp || new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // Get existing check-ins
    const checkInsKey = `checkins:${user.id}`;
    const existingCheckIns = (await kv.get(checkInsKey)) || [];

    // Add new check-in
    const updatedCheckIns = [checkIn, ...existingCheckIns];

    // Keep only last 100 check-ins per user
    const checkInsToSave = updatedCheckIns.slice(0, 100);
    await kv.set(checkInsKey, checkInsToSave);

    return c.json({ 
      success: true, 
      checkIn,
      message: 'Check-in saved successfully' 
    });
  } catch (error) {
    console.error('Save check-in error:', error);
    return c.json({ error: 'Failed to save check-in' }, 500);
  }
});

// Get user's check-ins
app.get('/checkins', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const checkInsKey = `checkins:${user.id}`;
    const checkIns = (await kv.get(checkInsKey)) || [];

    return c.json({ checkIns });
  } catch (error) {
    console.error('Get check-ins error:', error);
    return c.json({ error: 'Failed to fetch check-ins' }, 500);
  }
});

// Get check-ins for a specific disciple (leader access)
app.get('/checkins/:discipleId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can view disciple check-ins' }, 403);
    }

    const discipleId = c.req.param('discipleId');
    
    // Verify the disciple is assigned to this leader
    const discipleProfile = await getUserProfile(discipleId);
    if (!discipleProfile) {
      return c.json({ error: 'Disciple not found' }, 404);
    }

    // Check privacy settings first
    const privacyKey = `privacy:${discipleId}`;
    const privacyData = await kv.get(privacyKey) as any;
    
    // Check if disciple has hidden their check-ins (personal mode)
    if (privacyData?.hide_checkins || !discipleProfile.leader_id) {
      console.log(`Disciple ${discipleId} (${discipleProfile.name}) is in personal mode - denying access to check-ins`);
      return c.json({ 
        error: 'walking_alone',
        message: 'Este discípulo ha elegido caminar solo por ahora',
        disciple: {
          id: discipleProfile.id,
          name: discipleProfile.name,
          email: discipleProfile.email
        }
      }, 403);
    }

    // Check if disciple belongs to this leader
    if (discipleProfile.leader_id !== user.id && profile.role !== 'admin') {
      return c.json({ error: 'You can only view check-ins of your disciples' }, 403);
    }

    const checkInsKey = `checkins:${discipleId}`;
    const checkIns = (await kv.get(checkInsKey)) || [];

    return c.json({ 
      checkIns,
      disciple: {
        id: discipleProfile.id,
        name: discipleProfile.name,
        email: discipleProfile.email
      }
    });
  } catch (error) {
    console.error('Get disciple check-ins error:', error);
    return c.json({ error: 'Failed to fetch check-ins' }, 500);
  }
});

// Get check-in statistics
app.get('/checkins-stats', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const checkInsKey = `checkins:${user.id}`;
    const checkIns = (await kv.get(checkInsKey)) || [];

    // Calculate statistics
    const total = checkIns.length;
    const last7Days = checkIns.filter((c: any) => {
      const checkInDate = new Date(c.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return checkInDate >= sevenDaysAgo;
    }).length;

    const last30Days = checkIns.filter((c: any) => {
      const checkInDate = new Date(c.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return checkInDate >= thirtyDaysAgo;
    }).length;

    // Most common struggles
    const struggleCounts: Record<string, number> = {};
    checkIns.forEach((c: any) => {
      c.struggles?.forEach((s: string) => {
        struggleCounts[s] = (struggleCounts[s] || 0) + 1;
      });
    });

    // Most common roots
    const rootCounts: Record<string, number> = {};
    checkIns.forEach((c: any) => {
      c.identified_roots?.forEach((r: string) => {
        rootCounts[r] = (rootCounts[r] || 0) + 1;
      });
    });

    // Average intensity
    const avgIntensity = total > 0
      ? checkIns.reduce((sum: number, c: any) => sum + (c.intensity || 0), 0) / total
      : 0;

    return c.json({
      total,
      last7Days,
      last30Days,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      topStruggles: Object.entries(struggleCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([struggle, count]) => ({ struggle, count })),
      topRoots: Object.entries(rootCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([root, count]) => ({ root, count }))
    });
  } catch (error) {
    console.error('Get check-in stats error:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

// Get leader statistics (aggregated stats from all disciples)
app.get('/leader-stats', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can view leader stats' }, 403);
    }

    // Get all disciples
    const { data: disciples, error: disciplesError } = await supabase
      .from('profiles')
      .select('id, name, email')
      .eq('leader_id', user.id);

    if (disciplesError) {
      console.error('Error fetching disciples:', disciplesError);
      return c.json({ error: 'Failed to fetch disciples' }, 500);
    }

    const disciplesList = disciples || [];
    
    // Aggregate stats from all disciples
    let totalCheckIns = 0;
    let checkInsThisWeek = 0;
    let totalIntensity = 0;
    let intensityCount = 0;
    const discipleActivity: Array<{ id: string; name: string; checkIns: number }> = [];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const disciple of disciplesList) {
      const checkInsKey = `checkins:${disciple.id}`;
      const checkIns = (await kv.get(checkInsKey)) || [];
      
      const discipleCheckInsCount = checkIns.length;
      totalCheckIns += discipleCheckInsCount;

      // Count check-ins this week
      const weeklyCheckIns = checkIns.filter((c: any) => {
        const checkInDate = new Date(c.created_at);
        return checkInDate >= sevenDaysAgo;
      }).length;
      checkInsThisWeek += weeklyCheckIns;

      // Calculate average intensity
      checkIns.forEach((c: any) => {
        if (c.intensity) {
          totalIntensity += c.intensity;
          intensityCount++;
        }
      });

      // Track disciple activity
      discipleActivity.push({
        id: disciple.id,
        name: disciple.name,
        checkIns: discipleCheckInsCount
      });
    }

    const avgIntensity = intensityCount > 0 
      ? Math.round((totalIntensity / intensityCount) * 10) / 10 
      : 0;

    // Sort disciples by activity
    discipleActivity.sort((a, b) => b.checkIns - a.checkIns);

    // Calculate trend (comparing this week to previous week)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    
    let checkInsPreviousWeek = 0;
    for (const disciple of disciplesList) {
      const checkInsKey = `checkins:${disciple.id}`;
      const checkIns = (await kv.get(checkInsKey)) || [];
      
      const previousWeekCheckIns = checkIns.filter((c: any) => {
        const checkInDate = new Date(c.created_at);
        return checkInDate >= fourteenDaysAgo && checkInDate < sevenDaysAgo;
      }).length;
      checkInsPreviousWeek += previousWeekCheckIns;
    }

    const trend = checkInsPreviousWeek > 0
      ? Math.round(((checkInsThisWeek - checkInsPreviousWeek) / checkInsPreviousWeek) * 100)
      : 0;

    return c.json({
      totalCheckIns,
      checkInsThisWeek,
      avgIntensity,
      trend,
      activeDisciplesCount: disciplesList.length,
      mostActiveDisciples: discipleActivity.slice(0, 3),
      needsAttention: discipleActivity.filter(d => d.checkIns === 0).slice(0, 3)
    });
  } catch (error) {
    console.error('Get leader stats error:', error);
    return c.json({ error: 'Failed to fetch leader statistics' }, 500);
  }
});

// ============================================
// SPIRITUAL LIBRARY ROUTES
// ============================================

// Get all library resources
app.get('/library', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const resources = await kv.get('library:resources') || [];
    
    return c.json({ resources });
  } catch (error) {
    console.error('Get library error:', error);
    return c.json({ error: 'Failed to fetch resources' }, 500);
  }
});

// Add resource (leader/admin only)
app.post('/library', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can add resources' }, 403);
    }

    const body = await c.req.json();
    const { title, description, type, content, url, category } = body;

    if (!title || !description || !type || !category) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const resources = await kv.get('library:resources') || [];
    
    const newResource = {
      id: crypto.randomUUID(),
      title,
      description,
      type,
      content: content || '',
      url: url || '',
      category,
      created_by: user.id,
      created_at: new Date().toISOString()
    };

    await kv.set('library:resources', [...resources, newResource]);

    return c.json({ success: true, resource: newResource });
  } catch (error) {
    console.error('Add resource error:', error);
    return c.json({ error: 'Failed to add resource' }, 500);
  }
});

// Update resource (leader/admin only, can only edit own resources)
app.put('/library/:resourceId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can update resources' }, 403);
    }

    const resourceId = c.req.param('resourceId');
    const body = await c.req.json();
    const { title, description, type, content, url, category } = body;

    if (!title || !description || !type || !category) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const resources = await kv.get('library:resources') || [];
    const resourceIndex = resources.findIndex((r: any) => r.id === resourceId);
    
    if (resourceIndex === -1) {
      return c.json({ error: 'Resource not found' }, 404);
    }

    // Check if user owns the resource (admins can edit any resource)
    if (resources[resourceIndex].created_by !== user.id && profile.role !== 'admin') {
      return c.json({ error: 'You can only edit resources you created' }, 403);
    }

    // Update resource
    resources[resourceIndex] = {
      ...resources[resourceIndex],
      title,
      description,
      type,
      content: content || '',
      url: url || '',
      category,
      updated_at: new Date().toISOString()
    };

    await kv.set('library:resources', resources);

    return c.json({ success: true, resource: resources[resourceIndex] });
  } catch (error) {
    console.error('Update resource error:', error);
    return c.json({ error: 'Failed to update resource' }, 500);
  }
});

// Delete resource (leader/admin only)
app.delete('/library/:resourceId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can delete resources' }, 403);
    }

    const resourceId = c.req.param('resourceId');
    const resources = await kv.get('library:resources') || [];
    
    const resource = resources.find((r: any) => r.id === resourceId);
    if (!resource) {
      return c.json({ error: 'Resource not found' }, 404);
    }

    // Check if user owns the resource (admins can delete any resource)
    if (resource.created_by !== user.id && profile.role !== 'admin') {
      return c.json({ error: 'You can only delete resources you created' }, 403);
    }
    
    const updatedResources = resources.filter((r: any) => r.id !== resourceId);
    await kv.set('library:resources', updatedResources);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete resource error:', error);
    return c.json({ error: 'Failed to delete resource' }, 500);
  }
});

// ============================================
// MEETING SCHEDULING ROUTES
// ============================================

// Get leader's time slots
app.get('/time-slots', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can view their time slots' }, 403);
    }

    const key = `time_slots:${user.id}`;
    const slots = await kv.get(key);
    
    return c.json({ timeSlots: slots || [] });
  } catch (error) {
    console.error('Get time slots error:', error);
    return c.json({ error: 'Failed to fetch time slots' }, 500);
  }
});

// Get leader's time slots (for disciples)
app.get('/leader-time-slots/:leaderId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const leaderId = c.req.param('leaderId');
    const key = `time_slots:${leaderId}`;
    const slots = await kv.get(key);
    
    return c.json({ timeSlots: slots || [] });
  } catch (error) {
    console.error('Get leader time slots error:', error);
    return c.json({ error: 'Failed to fetch time slots' }, 500);
  }
});

// Add time slot (leader only)
app.post('/time-slots', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can add time slots' }, 403);
    }

    const body = await c.req.json();
    const { day, start_time, end_time } = body;

    if (!day || !start_time || !end_time) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const key = `time_slots:${user.id}`;
    const slots = (await kv.get(key)) || [];
    
    const newSlot = {
      id: crypto.randomUUID(),
      day,
      start_time,
      end_time,
      is_available: true
    };

    await kv.set(key, [...slots, newSlot]);

    return c.json({ success: true, slot: newSlot });
  } catch (error) {
    console.error('Add time slot error:', error);
    return c.json({ error: 'Failed to add time slot' }, 500);
  }
});

// Delete time slot
app.delete('/time-slots/:slotId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const slotId = c.req.param('slotId');
    const key = `time_slots:${user.id}`;
    const slots = (await kv.get(key)) || [];
    
    const updatedSlots = slots.filter((s: any) => s.id !== slotId);
    await kv.set(key, updatedSlots);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete time slot error:', error);
    return c.json({ error: 'Failed to delete time slot' }, 500);
  }
});

// Request meeting (disciple)
app.post('/request-meeting', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'disciple') {
      return c.json({ error: 'Only disciples can request meetings' }, 403);
    }

    const body = await c.req.json();
    const { time_slot_id, leader_id } = body;

    if (!time_slot_id || !leader_id) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get leader's time slots
    const slotsKey = `time_slots:${leader_id}`;
    const slots = (await kv.get(slotsKey)) || [];
    const slot = slots.find((s: any) => s.id === time_slot_id);

    if (!slot || !slot.is_available) {
      return c.json({ error: 'Time slot not available' }, 400);
    }

    // Mark slot as unavailable
    const updatedSlots = slots.map((s: any) =>
      s.id === time_slot_id ? { ...s, is_available: false } : s
    );
    await kv.set(slotsKey, updatedSlots);

    // Create meeting
    const meetingId = crypto.randomUUID();
    const meeting = {
      id: meetingId,
      disciple_id: user.id,
      disciple_name: profile.name,
      leader_id,
      time_slot_id,
      day: slot.day,
      start_time: slot.start_time,
      end_time: slot.end_time,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Save meeting for both users
    const discipleMeetingsKey = `meetings:${user.id}`;
    const leaderMeetingsKey = `meetings:${leader_id}`;
    
    const discipleMeetings = (await kv.get(discipleMeetingsKey)) || [];
    const leaderMeetings = (await kv.get(leaderMeetingsKey)) || [];

    // Get leader name
    const leaderProfile = await getUserProfile(leader_id);
    const meetingForDisciple = { ...meeting, leader_name: leaderProfile?.name || 'Líder' };

    await kv.set(discipleMeetingsKey, [...discipleMeetings, meetingForDisciple]);
    await kv.set(leaderMeetingsKey, [...leaderMeetings, meeting]);

    return c.json({ success: true, meeting });
  } catch (error) {
    console.error('Request meeting error:', error);
    return c.json({ error: 'Failed to request meeting' }, 500);
  }
});

// Get meetings
app.get('/meetings', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const key = `meetings:${user.id}`;
    const meetings = (await kv.get(key)) || [];
    
    // Format meetings for display
    const formattedMeetings = meetings.map((m: any) => ({
      id: m.id,
      date: m.day,
      time: `${m.start_time} - ${m.end_time}`,
      status: m.status,
      leader_name: m.leader_name,
      disciple_name: m.disciple_name,
      reschedule_requested: m.reschedule_requested || false,
      reschedule_reason: m.reschedule_reason,
      original_date: m.original_date,
      original_time: m.original_time
    }));

    return c.json({ meetings: formattedMeetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    return c.json({ error: 'Failed to fetch meetings' }, 500);
  }
});

// Confirm meeting (leader only)
app.post('/meetings/:meetingId/confirm', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can confirm meetings' }, 403);
    }

    const meetingId = c.req.param('meetingId');
    const key = `meetings:${user.id}`;
    const meetings = (await kv.get(key)) || [];
    
    const meeting = meetings.find((m: any) => m.id === meetingId);
    if (!meeting) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    // Update meeting status for both users
    const updatedMeetings = meetings.map((m: any) =>
      m.id === meetingId ? { ...m, status: 'confirmed' } : m
    );
    await kv.set(key, updatedMeetings);

    // Update for disciple
    const discipleKey = `meetings:${meeting.disciple_id}`;
    const discipleMeetings = (await kv.get(discipleKey)) || [];
    const updatedDiscipleMeetings = discipleMeetings.map((m: any) =>
      m.id === meetingId ? { ...m, status: 'confirmed' } : m
    );
    await kv.set(discipleKey, updatedDiscipleMeetings);

    return c.json({ success: true });
  } catch (error) {
    console.error('Confirm meeting error:', error);
    return c.json({ error: 'Failed to confirm meeting' }, 500);
  }
});

// Cancel meeting
app.post('/meetings/:meetingId/cancel', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const meetingId = c.req.param('meetingId');
    const key = `meetings:${user.id}`;
    const meetings = (await kv.get(key)) || [];
    
    const meeting = meetings.find((m: any) => m.id === meetingId);
    if (!meeting) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    // Mark time slot as available again
    const leaderId = meeting.leader_id || user.id;
    const slotsKey = `time_slots:${leaderId}`;
    const slots = (await kv.get(slotsKey)) || [];
    const updatedSlots = slots.map((s: any) =>
      s.id === meeting.time_slot_id ? { ...s, is_available: true } : s
    );
    await kv.set(slotsKey, updatedSlots);

    // Update meeting status for both users
    const updatedMeetings = meetings.map((m: any) =>
      m.id === meetingId ? { ...m, status: 'cancelled' } : m
    );
    await kv.set(key, updatedMeetings);

    // Update for the other user
    const otherUserId = meeting.disciple_id === user.id ? meeting.leader_id : meeting.disciple_id;
    if (otherUserId) {
      const otherKey = `meetings:${otherUserId}`;
      const otherMeetings = (await kv.get(otherKey)) || [];
      const updatedOtherMeetings = otherMeetings.map((m: any) =>
        m.id === meetingId ? { ...m, status: 'cancelled' } : m
      );
      await kv.set(otherKey, updatedOtherMeetings);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Cancel meeting error:', error);
    return c.json({ error: 'Failed to cancel meeting' }, 500);
  }
});

// Cancel confirmed meeting (both leader and disciple can do this)
app.post('/meetings/:meetingId/cancel-confirmed', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const meetingId = c.req.param('meetingId');
    const key = `meetings:${user.id}`;
    const meetings = (await kv.get(key)) || [];
    
    const meeting = meetings.find((m: any) => m.id === meetingId);
    if (!meeting) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    if (meeting.status !== 'confirmed') {
      return c.json({ error: 'Meeting is not confirmed' }, 400);
    }

    const profile = await getUserProfile(user.id);
    
    // If disciple cancels, make slot available again
    // If leader cancels, slot stays unavailable
    if (profile?.role === 'disciple') {
      const leaderId = meeting.leader_id;
      const slotsKey = `time_slots:${leaderId}`;
      const slots = (await kv.get(slotsKey)) || [];
      const updatedSlots = slots.map((s: any) =>
        s.id === meeting.time_slot_id ? { ...s, is_available: true } : s
      );
      await kv.set(slotsKey, updatedSlots);
    }

    // Update meeting status for both users
    const updatedMeetings = meetings.map((m: any) =>
      m.id === meetingId ? { ...m, status: 'cancelled' } : m
    );
    await kv.set(key, updatedMeetings);

    // Update for the other user
    const otherUserId = meeting.disciple_id === user.id ? meeting.leader_id : meeting.disciple_id;
    if (otherUserId) {
      const otherKey = `meetings:${otherUserId}`;
      const otherMeetings = (await kv.get(otherKey)) || [];
      const updatedOtherMeetings = otherMeetings.map((m: any) =>
        m.id === meetingId ? { ...m, status: 'cancelled' } : m
      );
      await kv.set(otherKey, updatedOtherMeetings);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Cancel confirmed meeting error:', error);
    return c.json({ error: 'Failed to cancel meeting' }, 500);
  }
});

// Request reschedule (leader only)
app.post('/meetings/:meetingId/request-reschedule', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || (profile.role !== 'leader' && profile.role !== 'admin')) {
      return c.json({ error: 'Only leaders can request reschedule' }, 403);
    }

    const meetingId = c.req.param('meetingId');
    const body = await c.req.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return c.json({ error: 'Reason is required' }, 400);
    }

    const key = `meetings:${user.id}`;
    const meetings = (await kv.get(key)) || [];
    
    const meeting = meetings.find((m: any) => m.id === meetingId);
    if (!meeting) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    if (meeting.status !== 'confirmed') {
      return c.json({ error: 'Can only reschedule confirmed meetings' }, 400);
    }

    // Update meeting with reschedule request
    const updatedMeetings = meetings.map((m: any) =>
      m.id === meetingId 
        ? { 
            ...m, 
            reschedule_requested: true, 
            reschedule_reason: reason,
            original_date: m.date,
            original_time: m.time
          } 
        : m
    );
    await kv.set(key, updatedMeetings);

    // Update for disciple
    const discipleKey = `meetings:${meeting.disciple_id}`;
    const discipleMeetings = (await kv.get(discipleKey)) || [];
    const updatedDiscipleMeetings = discipleMeetings.map((m: any) =>
      m.id === meetingId 
        ? { 
            ...m, 
            reschedule_requested: true, 
            reschedule_reason: reason,
            original_date: m.date,
            original_time: m.time
          } 
        : m
    );
    await kv.set(discipleKey, updatedDiscipleMeetings);

    return c.json({ success: true });
  } catch (error) {
    console.error('Request reschedule error:', error);
    return c.json({ error: 'Failed to request reschedule' }, 500);
  }
});

// Approve reschedule (disciple only)
app.post('/meetings/:meetingId/approve-reschedule', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'disciple') {
      return c.json({ error: 'Only disciples can approve reschedule' }, 403);
    }

    const meetingId = c.req.param('meetingId');
    const key = `meetings:${user.id}`;
    const meetings = (await kv.get(key)) || [];
    
    const meeting = meetings.find((m: any) => m.id === meetingId);
    if (!meeting) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    if (!meeting.reschedule_requested) {
      return c.json({ error: 'No reschedule request found' }, 400);
    }

    // Make time slot available again
    const leaderId = meeting.leader_id;
    const slotsKey = `time_slots:${leaderId}`;
    const slots = (await kv.get(slotsKey)) || [];
    const updatedSlots = slots.map((s: any) =>
      s.id === meeting.time_slot_id ? { ...s, is_available: true } : s
    );
    await kv.set(slotsKey, updatedSlots);

    // Cancel the meeting
    const updatedMeetings = meetings.map((m: any) =>
      m.id === meetingId ? { ...m, status: 'cancelled' } : m
    );
    await kv.set(key, updatedMeetings);

    // Update for leader
    const leaderKey = `meetings:${meeting.leader_id}`;
    const leaderMeetings = (await kv.get(leaderKey)) || [];
    const updatedLeaderMeetings = leaderMeetings.map((m: any) =>
      m.id === meetingId ? { ...m, status: 'cancelled' } : m
    );
    await kv.set(leaderKey, updatedLeaderMeetings);

    return c.json({ success: true });
  } catch (error) {
    console.error('Approve reschedule error:', error);
    return c.json({ error: 'Failed to approve reschedule' }, 500);
  }
});

// Reject reschedule (disciple only)
app.post('/meetings/:meetingId/reject-reschedule', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'disciple') {
      return c.json({ error: 'Only disciples can reject reschedule' }, 403);
    }

    const meetingId = c.req.param('meetingId');
    const key = `meetings:${user.id}`;
    const meetings = (await kv.get(key)) || [];
    
    const meeting = meetings.find((m: any) => m.id === meetingId);
    if (!meeting) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    if (!meeting.reschedule_requested) {
      return c.json({ error: 'No reschedule request found' }, 400);
    }

    // Remove reschedule request, keep meeting as confirmed
    const updatedMeetings = meetings.map((m: any) =>
      m.id === meetingId 
        ? { 
            ...m, 
            reschedule_requested: false, 
            reschedule_reason: undefined,
            original_date: undefined,
            original_time: undefined
          } 
        : m
    );
    await kv.set(key, updatedMeetings);

    // Update for leader
    const leaderKey = `meetings:${meeting.leader_id}`;
    const leaderMeetings = (await kv.get(leaderKey)) || [];
    const updatedLeaderMeetings = leaderMeetings.map((m: any) =>
      m.id === meetingId 
        ? { 
            ...m, 
            reschedule_requested: false, 
            reschedule_reason: undefined,
            original_date: undefined,
            original_time: undefined
          } 
        : m
    );
    await kv.set(leaderKey, updatedLeaderMeetings);

    return c.json({ success: true });
  } catch (error) {
    console.error('Reject reschedule error:', error);
    return c.json({ error: 'Failed to reject reschedule' }, 500);
  }
});

// ==================== AI-POWERED CHECK-IN ROUTES ====================

// Root test route (no prefix)
app.get('/test', async (c) => {
  console.log('=== ROOT TEST ROUTE HIT ===');
  return c.json({ message: 'Root test route working! Server is responding.' });
});

// Health check routes (without prefix for testing base URL)
app.get('/', async (c) => {
  console.log('=== ROOT HEALTH CHECK ===');
  console.log('Request method:', c.req.method);
  console.log('Request path:', c.req.path);
  console.log('Request headers:', Object.fromEntries(c.req.raw.headers.entries()));
  return c.json({ 
    status: 'ok', 
    message: 'Camino de Restauración server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (c) => {
  console.log('=== HEALTH CHECK ===');
  return c.json({ 
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Test route with prefix
app.get('/test', async (c) => {
  console.log('=== PREFIXED TEST ROUTE HIT ===');
  console.log('Request method:', c.req.method);
  console.log('Request path:', c.req.path);
  console.log('Request headers.host:', c.req.header('host'));
  return c.json({ message: 'Prefixed test route working!' });
});

// Start conversational check-in
app.post('/checkin/start-conversation', async (c) => {
  console.log('=== START CONVERSATION ROUTE HIT ===');
  console.log('Request method:', c.req.method);
  console.log('Request path:', c.req.path);
  console.log('Request headers.host:', c.req.header('host'));
  console.log('Request headers.authorization:', c.req.header('Authorization') ? 'present' : 'missing');
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    console.log('User verified:', user ? user.id : 'null');
    if (!user) {
      console.log('Returning 401 - Unauthorized');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Generate a conversation ID
    const conversationId = globalThis.crypto.randomUUID();
    
    // Get user's recent check-in history for context
    const checkInsKey = `checkins:${user.id}`;
    const checkIns = ((await kv.get(checkInsKey)) || []) as any[];
    const recentCheckIns = checkIns.slice(-5); // Last 5 check-ins

    // Initial system message
    const systemMessage = {
      role: 'system',
      content: `Eres una IA cristiana que acompaña a personas que luchan con mentiras y pecados.
Tu misión es ayudar a descubrir las raíces espirituales y emocionales detrás de sus luchas, usando la Biblia (traducción: Nueva Versión Internacional - NVI) y un lenguaje humano cercano.
Tratá a cada persona por su nombre si lo proporciona.
Liderá la conversación para mirar más allá del síntoma y explorar hábitos, pecados, raíces, vivencias y traumas que contribuyen al problema actual.

IMPORTANTE: Durante la conversación, debés identificar:
1. Las LUCHAS ESPECÍFICAS (ej: fornicación, lujuria, pornografía, masturbación, mentira, ira, etc.)
2. La INTENSIDAD de cada lucha en una escala del 1 al 10 (donde 1 es mínima y 10 es máxima)

REGLAS DE CONVERSACIÓN:
- Hacé UNA sola pregunta por turno.
- Sé breve y natural (2–3 oraciones).
- Cuando la persona mencione una lucha, preguntá sobre su intensidad del 1 al 10 de manera natural.
- Evitá consejos médicos o psicológicos y diagnósticos clínicos.
- Citá versículos o principios SOLO cuando el contexto lo justifique y señalá que son NVI.
- No inventes datos: si algo no está claro, decí que necesitás más información.
- Si hay señales de riesgo (autolesión/suicidio/violencia), orientá a pedir ayuda inmediata: emergencia 911 (Argentina) y apoyo pastoral. Podés mencionar líneas de ayuda locales (p. ej., CAS: 135 en CABA/GBA y 011-5275-1135 en el resto del país), aclarando que verifique números actualizados.

ESTILO:
- Tono empático, cálido y directo (rioplatense), sin sermonear.
- Priorizá: (1) emociones/trigger, (2) luchas e intensidad, (3) raíces, (4) pasos bíblicos y prácticos medibles cuando corresponda.
- No des más de un paso por turno; mantené el foco y pedí permiso para profundizar.

GUIDE_OPEN (inicio de conversación):
Saludá brevemente, validá lo que la persona pueda estar sintiendo y hacé una sola pregunta para ubicar contexto (emociones, momento del día, situación).

GUIDE_STRUGGLES (identificando luchas):
Cuando la persona empiece a compartir, preguntá específicamente: ¿Con qué luchas estás batallando? (ej: pornografía, lujuria, fornicación, mentira, ira, etc.)
Después, para cada lucha mencionada, preguntá: ¿Qué tan intensa sentís esta lucha del 1 al 10?

GUIDE_ROOTS (explorando raíces):
Indagá sobre patrones (emociones previas, búsqueda de validación, soledad, rechazo, heridas de infancia, intimidad con Dios). Una pregunta concreta por turno.

GUIDE_SCRIPTURE (versículos cuando aplique):
Si corresponde, citá 1 versículo NVI breve y explicá por qué aplica a ESA raíz específica (1–2 oraciones). No más de una cita por turno.

GUIDE_ACTION (pasos prácticos):
Ofrecé 1 acción práctica, específica y medible para esta semana. Pedí consentimiento antes de proponer más.

La persona acaba de iniciar un check-in. Comenzá con GUIDE_OPEN: saludo breve y una pregunta para ubicar contexto.`
    };

    // First message changes based on time of day
    const hour = new Date().getHours();
    let greeting = 'Buenas noches';
    if (hour >= 6 && hour < 12) {
      greeting = 'Buenos días';
    } else if (hour >= 12 && hour < 20) {
      greeting = 'Buenas tardes';
    }
    
    const firstMessage = {
      role: 'assistant',
      content: `${greeting}, ¿cómo te sentís hoy?`
    };

    // Store conversation in KV with system message and first AI message
    const conversationKey = `conversation:${conversationId}`;
    await kv.set(conversationKey, {
      id: conversationId,
      user_id: user.id,
      messages: [systemMessage, firstMessage],
      created_at: new Date().toISOString(),
      status: 'active'
    });

    console.log('✅ Conversation started with fixed first message');

    return c.json({
      conversationId,
      message: firstMessage.content
    });
  } catch (error) {
    console.error('Start conversation error:', error);
    return c.json({ error: 'Failed to start conversation' }, 500);
  }
});

// Continue conversation
app.post('/checkin/conversation/:conversationId', async (c) => {
  console.log('=== CONTINUE CONVERSATION ROUTE HIT ===');
  console.log('Request method:', c.req.method);
  console.log('Request path:', c.req.path);
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      console.log('User verification failed in continue conversation');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const conversationId = c.req.param('conversationId');
    const body = await c.req.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return c.json({ error: 'Message is required' }, 400);
    }

    // Get conversation
    const conversationKey = `conversation:${conversationId}`;
    const conversation = await kv.get(conversationKey) as any;

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404);
    }

    if (conversation.user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: message
    };
    conversation.messages.push(userMessage);

    // Get AI response
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Continue conversation - OpenAI API key present?', openaiApiKey ? 'Yes' : 'No');
    
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY not configured');
      return c.json({ 
        error: 'OpenAI API key not configured',
        details: 'La variable OPENAI_API_KEY no está configurada'
      }, 500);
    }

    console.log('Calling OpenAI API for continuation...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: conversation.messages,
        temperature: 0.7,
        max_tokens: 200
      })
    });

    console.log('OpenAI API continuation response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API continuation error:', errorText);
      
      let errorMessage = 'Failed to generate AI response';
      let details = errorText;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          details = errorJson.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      
      return c.json({ 
        error: errorMessage,
        details: details,
        status: response.status
      }, 500);
    }

    console.log('✅ OpenAI continuation successful');

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    // Update conversation
    conversation.messages.push(aiMessage);
    conversation.updated_at = new Date().toISOString();
    await kv.set(conversationKey, conversation);

    return c.json({
      message: aiMessage.content
    });
  } catch (error) {
    console.error('Continue conversation error:', error);
    return c.json({ error: 'Failed to continue conversation' }, 500);
  }
});

// Analyze conversation and generate restoration plan
app.post('/checkin/analyze/:conversationId', async (c) => {
  console.log('=== ANALYZE CONVERSATION ROUTE HIT ===');
  console.log('Request method:', c.req.method);
  console.log('Request path:', c.req.path);
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      console.log('User verification failed in analyze conversation');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const conversationId = c.req.param('conversationId');

    // Get conversation
    const conversationKey = `conversation:${conversationId}`;
    const conversation = await kv.get(conversationKey) as any;

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404);
    }

    if (conversation.user_id !== user.id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // Ask AI to analyze and create restoration plan
    const analysisPrompt = {
      role: 'system',
      content: `Analiza toda esta conversación con profundidad e identifica:

1. LUCHAS ESPECÍFICAS Y SU INTENSIDAD:
   - Extraé TODAS las luchas específicas que la persona mencionó (ej: pornografía, lujuria, fornicación, masturbación, mentira, ira, etc.)
   - Para cada lucha, identificá la intensidad del 1 al 10 que mencionó
   - Si no mencionó intensidad para alguna lucha, estimá basándote en el contexto de la conversación
   - Formato: cada lucha debe tener su nombre y su intensidad

2. RAÍCES ESPIRITUALES Y EMOCIONALES (máximo 3 más importantes):
   - ¿Qué heridas profundas o necesidades insatisfechas están impulsando las luchas?
   - Sé ESPECÍFICO basándote en lo que la persona compartió
   - Ejemplos: "falta de intimidad con Dios manifestada en sequedad espiritual", "herida de rechazo paterno que busca validación en relaciones", "soledad profunda que no ha sido procesada", "identidad quebrantada por abuso en la infancia", etc.

3. PLAN DE RESTAURACIÓN PERSONALIZADO:

a) 2-3 VERSÍCULOS BÍBLICOS (Nueva Versión Internacional - NVI) que hablen directamente a LAS RAÍCES (no a los síntomas):
   - Elegí versículos que traigan sanidad, identidad en Cristo, y liberación
   - Escribí el texto completo del versículo NVI
   - Explicá cómo aplica específicamente a lo que esta persona está viviendo
   - Usá tono rioplatense natural

b) 2-3 ORACIONES GUIADAS cortas pero poderosas:
   - Que aborden las raíces identificadas
   - En primera persona ("Padre, reconozco que...")
   - Que incluyan confesión, sanidad y declaración de verdad
   - Lenguaje cercano y humano

c) 3-4 ACCIONES PRÁCTICAS concretas, específicas y medibles para esta semana:
   - NO genéricas ("leer la Biblia"), sino específicas ("Leer Efesios 1:3-14 cada mañana y anotar 1 verdad de identidad en Cristo")
   - Que ataquen directamente las raíces
   - Que sean realizables y medibles
   - Lenguaje directo y práctico

4. RESUMEN: Un mensaje breve (2-3 oraciones) con tono empático, cálido y cercano (rioplatense), mencionando específicamente lo que la persona compartió. Aliento genuino sin sermonear.

IMPORTANTE:
- Todos los versículos deben ser de la traducción NVI
- Usá lenguaje rioplatense natural ("vos", "tu", formas verbales argentinas)
- Tono cálido y directo, sin formalidad excesiva
- Evitá lenguaje clínico o de diagnóstico

Responde SOLO en formato JSON válido:
{
  "struggles": [
    {
      "name": "nombre de la lucha (ej: pornografía, lujuria, etc.)",
      "intensity": 7
    }
  ],
  "identified_roots": ["raíz específica 1", "raíz específica 2", "raíz específica 3"],
  "biblical_verses": [
    {
      "reference": "Libro Cap:Vers (NVI)",
      "text": "Texto completo del versículo en NVI",
      "application": "Cómo este versículo habla directamente a tu situación específica - tono cercano y rioplatense"
    }
  ],
  "guided_prayers": [
    "Padre, reconozco que... [oración personalizada con lenguaje natural]",
    "Señor, traigo ante ti... [oración personalizada con lenguaje natural]"
  ],
  "practical_actions": [
    "Acción específica y medible 1",
    "Acción específica y medible 2",
    "Acción específica y medible 3"
  ],
  "summary": "Mensaje personal de aliento que refleje lo compartido - tono rioplatense cálido y directo"
}`
    };

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    console.log('Analysis - OpenAI API key present?', openaiApiKey ? 'Yes' : 'No');
    
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY not configured for analysis');
      return c.json({ 
        error: 'OpenAI API key not configured',
        details: 'La variable OPENAI_API_KEY no está configurada'
      }, 500);
    }

    const messages = [
      ...conversation.messages,
      analysisPrompt,
      {
        role: 'user',
        content: 'Por favor analiza nuestra conversación y genera el plan de restauración.'
      }
    ];

    console.log('Calling OpenAI API for analysis...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })
    });

    console.log('OpenAI API analysis response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API analysis error:', errorText);
      
      let errorMessage = 'Failed to analyze conversation';
      let details = errorText;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          details = errorJson.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      
      return c.json({ 
        error: errorMessage,
        details: details,
        status: response.status
      }, 500);
    }

    console.log('✅ OpenAI analysis successful');

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    // Create check-in entry
    const checkIn = {
      id: globalThis.crypto.randomUUID(),
      user_id: user.id,
      conversation_id: conversationId,
      created_at: new Date().toISOString(),
      type: 'conversational',
      struggles: analysis.struggles || [],
      identified_roots: analysis.identified_roots || [],
      biblical_verses: analysis.biblical_verses || [],
      guided_prayers: analysis.guided_prayers || [],
      practical_actions: analysis.practical_actions || [],
      summary: analysis.summary || '',
      conversation_messages: conversation.messages.filter((m: any) => m.role !== 'system')
    };

    // Save check-in
    const checkInsKey = `checkins:${user.id}`;
    const checkIns = ((await kv.get(checkInsKey)) || []) as any[];
    checkIns.push(checkIn);
    await kv.set(checkInsKey, checkIns);

    // Mark conversation as completed
    conversation.status = 'completed';
    conversation.check_in_id = checkIn.id;
    await kv.set(conversationKey, conversation);

    return c.json({
      checkIn: checkIn
    });
  } catch (error) {
    console.error('Analyze conversation error:', error);
    return c.json({ error: 'Failed to analyze conversation' }, 500);
  }
});

// ============================================
// ADMIN ROUTES - PDF Management for OpenAI
// ============================================

// Get assistant status
app.get('/admin/assistant-status', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: 'Only admins can access this endpoint' }, 403);
    }

    const assistantId = await kv.get('openai:assistant_id');
    
    return c.json({ 
      assistantId: assistantId || null,
      hasAssistant: !!assistantId
    });
  } catch (error) {
    console.error('Get assistant status error:', error);
    return c.json({ error: 'Failed to get assistant status' }, 500);
  }
});

// List uploaded files
app.get('/admin/files', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: 'Only admins can access this endpoint' }, 403);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }

    // List files with purpose 'assistants'
    const response = await fetch('https://api.openai.com/v1/files', {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI list files error:', error);
      return c.json({ error: 'Failed to list files from OpenAI' }, 500);
    }

    const data = await response.json();
    // Filter only files for assistants
    const assistantFiles = data.data.filter((f: any) => f.purpose === 'assistants');
    
    return c.json({ files: assistantFiles });
  } catch (error) {
    console.error('List files error:', error);
    return c.json({ error: 'Failed to list files' }, 500);
  }
});

// Upload PDF to OpenAI
app.post('/admin/upload-pdf', async (c) => {
  try {
    console.log('📤 Starting PDF upload process...');
    
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      console.error('❌ Unauthorized: No user found');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'admin') {
      console.error('❌ Forbidden: User is not admin', { role: profile?.role });
      return c.json({ error: 'Only admins can upload files' }, 403);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY not configured in environment');
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }
    console.log('✅ OpenAI API Key found');

    // Get the file from the request
    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('❌ No file provided in request');
      return c.json({ error: 'No file provided' }, 400);
    }

    console.log('📁 File received:', { name: file.name, size: file.size, type: file.type });

    // Validate PDF
    if (!file.type.includes('pdf')) {
      console.error('❌ Invalid file type:', file.type);
      return c.json({ error: 'Only PDF files are allowed' }, 400);
    }

    // STEP 1: Upload file to OpenAI
    console.log('📤 STEP 1: Uploading file to OpenAI...');
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('purpose', 'assistants');

    const uploadResponse = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: uploadFormData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ OpenAI File Upload Error:');
      console.error('Status:', uploadResponse.status);
      console.error('Response:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Error Details:', JSON.stringify(errorJson, null, 2));
        return c.json({ 
          error: 'Failed to upload file to OpenAI', 
          details: errorJson 
        }, uploadResponse.status);
      } catch (e) {
        return c.json({ 
          error: 'Failed to upload file to OpenAI', 
          details: errorText 
        }, uploadResponse.status);
      }
    }

    const uploadedFile = await uploadResponse.json();
    console.log('✅ File uploaded to OpenAI:', uploadedFile.id);

    // STEP 2: Get or create assistant and vector store
    let assistantId = await kv.get('openai:assistant_id') as string | null;
    let vectorStoreId = await kv.get('openai:vector_store_id') as string | null;
    
    if (!assistantId || !vectorStoreId) {
      console.log('🆕 No assistant/vector store found. Creating new ones...');
      
      // STEP 2A: Create Vector Store
      console.log('📦 STEP 2A: Creating Vector Store...');
      const vectorStoreResponse = await fetch('https://api.openai.com/v1/vector_stores', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          name: 'Camino de Restauración - Knowledge Base'
        })
      });

      if (!vectorStoreResponse.ok) {
        const errorText = await vectorStoreResponse.text();
        console.error('❌ OpenAI Vector Store Creation Error:');
        console.error('Status:', vectorStoreResponse.status);
        console.error('Response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Error Details:', JSON.stringify(errorJson, null, 2));
          return c.json({ 
            error: 'Failed to create vector store', 
            details: errorJson 
          }, vectorStoreResponse.status);
        } catch (e) {
          return c.json({ 
            error: 'Failed to create vector store', 
            details: errorText 
          }, vectorStoreResponse.status);
        }
      }

      const vectorStore = await vectorStoreResponse.json();
      vectorStoreId = vectorStore.id;
      console.log('✅ Vector store created:', vectorStoreId);
      await kv.set('openai:vector_store_id', vectorStoreId);

      // STEP 2B: Create Assistant
      console.log('🤖 STEP 2B: Creating Assistant...');
      const createResponse = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          name: 'Camino de Restauración - Asistente Espiritual',
          instructions: `Eres un asistente espiritual especializado en restauración de identidad sexual y sanidad emocional desde una perspectiva cristiana.

Tu propósito es:
1. Escuchar con empatía y sin juicio las luchas del usuario
2. Hacer preguntas sabias para identificar raíces espirituales y emocionales detrás de las luchas
3. Utilizar los documentos de referencia proporcionados para dar consejos bíblicos precisos
4. Identificar patrones como falta de intimidad con Dios, heridas familiares, abuso, rechazo, soledad, etc.
5. Registrar explícitamente las luchas mencionadas (fornicación, lujuria, pornografía, etc.) y su intensidad del 1 al 10

Cuando el usuario mencione una lucha, siempre pregunta: "¿Del 1 al 10, qué tan intensa fue esa lucha?"

Sé compasivo, directo y sabio. Usa un tono cálido pero profesional. Consulta los documentos de referencia para dar respuestas fundamentadas en las Escrituras y principios de restauración.`,
          model: 'gpt-4o-mini',
          tools: [{ type: 'file_search' }],
          tool_resources: {
            file_search: {
              vector_store_ids: [vectorStoreId]
            }
          }
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('❌ OpenAI Assistant Creation Error:');
        console.error('Status:', createResponse.status);
        console.error('Response:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Error Details:', JSON.stringify(errorJson, null, 2));
          console.error('Message:', errorJson.error?.message);
          console.error('Type:', errorJson.error?.type);
          console.error('Code:', errorJson.error?.code);
          return c.json({ 
            error: 'Failed to create assistant', 
            details: errorJson 
          }, createResponse.status);
        } catch (e) {
          console.error('Could not parse error as JSON');
          return c.json({ 
            error: 'Failed to create assistant', 
            details: errorText 
          }, createResponse.status);
        }
      }

      const assistant = await createResponse.json();
      assistantId = assistant.id;
      console.log('✅ Assistant created:', assistantId);
      await kv.set('openai:assistant_id', assistantId);
    } else {
      console.log('✅ Using existing assistant:', assistantId);
      console.log('✅ Using existing vector store:', vectorStoreId);
    }

    // STEP 3: Add file to vector store
    console.log('➕ STEP 3: Adding file to vector store...');
    const addFileResponse = await fetch(
      `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          file_id: uploadedFile.id
        })
      }
    );

    if (!addFileResponse.ok) {
      const errorText = await addFileResponse.text();
      console.error('❌ Error adding file to vector store:');
      console.error('Status:', addFileResponse.status);
      console.error('Response:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Error Details:', JSON.stringify(errorJson, null, 2));
        return c.json({ 
          error: 'Failed to add file to vector store', 
          details: errorJson 
        }, addFileResponse.status);
      } catch (e) {
        return c.json({ 
          error: 'Failed to add file to vector store', 
          details: errorText 
        }, addFileResponse.status);
      }
    }

    const vectorStoreFile = await addFileResponse.json();
    console.log('✅ File added to vector store');
    console.log('📊 File status:', vectorStoreFile.status);
    console.log('🎉 Upload process completed successfully!');

    return c.json({ 
      success: true, 
      file: uploadedFile,
      assistantId,
      vectorStoreId,
      fileStatus: vectorStoreFile.status,
      message: 'PDF uploaded and added to knowledge base successfully'
    });
  } catch (error) {
    console.error('❌ Upload PDF error (catch block):');
    console.error('Error name:', error?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', error);
    return c.json({ 
      error: 'Failed to upload PDF', 
      details: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      }
    }, 500);
  }
});

// Delete file from OpenAI
app.delete('/admin/files/:fileId', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: 'Only admins can delete files' }, 403);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }

    const fileId = c.req.param('fileId');

    // Delete from OpenAI
    const deleteResponse = await fetch(`https://api.openai.com/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`
      }
    });

    if (!deleteResponse.ok) {
      const error = await deleteResponse.text();
      console.error('OpenAI delete error:', error);
      return c.json({ error: 'Failed to delete file from OpenAI' }, 500);
    }

    console.log('✅ File deleted from OpenAI:', fileId);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    return c.json({ error: 'Failed to delete file' }, 500);
  }
});

// Catch-all for undefined routes
app.all('*', (c) => {
  console.log('404 - Route not found:', c.req.method, c.req.url);
  return c.json({ 
    error: 'Route not found',
    method: c.req.method,
    path: c.req.path
  }, 404);
});

Deno.serve(app.fetch);