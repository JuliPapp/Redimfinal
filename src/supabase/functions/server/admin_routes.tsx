// ============================================
// ADMIN ROUTES - PDF Management for OpenAI
// ============================================
// 
// INSTRUCCIONES: Copiar y pegar este código al final de /supabase/functions/server/index.tsx
// justo ANTES de la línea "Deno.serve(app.fetch);"

// Get assistant status
app.get('/make-server-636f4a29/admin/assistant-status', async (c) => {
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
app.get('/make-server-636f4a29/admin/files', async (c) => {
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
app.post('/make-server-636f4a29/admin/upload-pdf', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await getUserProfile(user.id);
    if (!profile || profile.role !== 'admin') {
      return c.json({ error: 'Only admins can upload files' }, 403);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500);
    }

    // Get the file from the request
    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate PDF
    if (!file.type.includes('pdf')) {
      return c.json({ error: 'Only PDF files are allowed' }, 400);
    }

    // Upload to OpenAI
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
      const error = await uploadResponse.text();
      console.error('OpenAI upload error:', error);
      return c.json({ error: 'Failed to upload file to OpenAI' }, 500);
    }

    const uploadedFile = await uploadResponse.json();
    console.log('✅ File uploaded to OpenAI:', uploadedFile.id);

    // Get or create assistant
    let assistantId = await kv.get('openai:assistant_id') as string | null;
    
    if (!assistantId) {
      // Create new assistant with File Search
      console.log('Creating new assistant with File Search...');
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
          model: 'gpt-4o',
          tools: [{ type: 'file_search' }],
          tool_resources: {
            file_search: {
              vector_stores: [{
                file_ids: [uploadedFile.id]
              }]
            }
          }
        })
      });

      if (!createResponse.ok) {
        const error = await createResponse.text();
        console.error('Error creating assistant:', error);
        return c.json({ error: 'Failed to create assistant' }, 500);
      }

      const assistant = await createResponse.json();
      assistantId = assistant.id;
      await kv.set('openai:assistant_id', assistantId);
      console.log('✅ Assistant created:', assistantId);

      return c.json({ 
        success: true, 
        file: uploadedFile,
        assistantId,
        assistantCreated: true
      });
    } else {
      // Update existing assistant to add the new file
      console.log('Updating existing assistant with new file...');
      
      // Get current assistant
      const getResponse = await fetch(`https://api.openai.com/v1/assistants/${assistantId}`, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!getResponse.ok) {
        const error = await getResponse.text();
        console.error('Error getting assistant:', error);
        return c.json({ error: 'Failed to get assistant' }, 500);
      }

      const assistant = await getResponse.json();
      
      // Get current vector store or create new one
      let vectorStoreId = assistant.tool_resources?.file_search?.vector_store_ids?.[0];
      
      if (vectorStoreId) {
        // Add file to existing vector store
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
          const error = await addFileResponse.text();
          console.error('Error adding file to vector store:', error);
          return c.json({ error: 'Failed to add file to vector store' }, 500);
        }

        console.log('✅ File added to existing vector store');
      } else {
        // Create new vector store and update assistant
        const updateResponse = await fetch(`https://api.openai.com/v1/assistants/${assistantId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2'
          },
          body: JSON.stringify({
            tool_resources: {
              file_search: {
                vector_stores: [{
                  file_ids: [uploadedFile.id]
                }]
              }
            }
          })
        });

        if (!updateResponse.ok) {
          const error = await updateResponse.text();
          console.error('Error updating assistant:', error);
          return c.json({ error: 'Failed to update assistant' }, 500);
        }

        console.log('✅ Assistant updated with new vector store');
      }

      return c.json({ 
        success: true, 
        file: uploadedFile,
        assistantId,
        assistantUpdated: true
      });
    }
  } catch (error) {
    console.error('Upload PDF error:', error);
    return c.json({ error: 'Failed to upload PDF' }, 500);
  }
});

// Delete file from OpenAI
app.delete('/make-server-636f4a29/admin/files/:fileId', async (c) => {
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
