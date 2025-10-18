import { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreenWithDnd } from './components/HomeScreenWithDnd';
import { LeaderDashboard } from './components/LeaderDashboard';
import { CheckInChoice } from './components/CheckInChoice';
import { CheckInScreen } from './components/CheckInScreen';
import { ConversationalCheckIn } from './components/ConversationalCheckIn';
import { RootQuestionsScreen } from './components/RootQuestionsScreen';
import { CrisisScreen } from './components/CrisisScreen';
import { DailyPlanScreen } from './components/DailyPlanScreen';
import { CheckInHistory } from './components/CheckInHistory';
import { SpiritualLibrary } from './components/SpiritualLibrary';
import { AdminPanel } from './components/AdminPanel';
import { Toaster } from './components/ui/sonner';
import { createClient } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';
import { API_URLS } from './utils/api';

export type CheckInData = {
  struggles: string[];
  intensity: number;
  trigger?: string;
  emotions: string[];
};

export type RootAnalysis = {
  identifiedRoots: string[];
  checkInData: CheckInData;
  timestamp: Date;
};

type UserProfile = {
  id: string;
  email: string;
  name: string;
  gender?: string | null;
  age?: number | null;
  role: string;
  leader_id: string | null;
};

type AppState = 
  | { screen: 'auth' }
  | { screen: 'onboarding' }
  | { screen: 'home' }
  | { screen: 'checkin-choice' }
  | { screen: 'checkin' }
  | { screen: 'checkin-conversational' }
  | { screen: 'history' }
  | { screen: 'library' }
  | { screen: 'admin-panel' }
  | { screen: 'root-questions'; checkInData: CheckInData }
  | { screen: 'crisis'; checkInData: CheckInData }
  | { screen: 'daily-plan'; analysis: RootAnalysis };

const RISK_STRUGGLES = ['auto-lesion', 'pensamientos-suicidas'];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [state, setState] = useState<AppState>({ screen: 'auth' });
  const [isLoading, setIsLoading] = useState(true);
  const [accompanimentMode, setAccompanimentMode] = useState<'personal' | 'community'>('personal');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSpecialAdmin, setIsSpecialAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkSession();
    loadTheme();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setAccessToken(null);
        setState({ screen: 'auth' });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        if (session?.access_token) {
          setAccessToken(session.access_token);
        }
      } else if (event === 'SIGNED_IN' && session) {
        // Session is handled by handleAuthSuccess
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const checkSession = async () => {
    setIsLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        // Clear invalid session
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }
      
      if (session?.user && session?.access_token) {
        // Fetch profile
        const response = await fetch(API_URLS.profile(), {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(session.user);
          setProfile(data.profile);
          setAccessToken(session.access_token);
          
          // Check for special admin access
          const isAdmin = 
            data.profile.role === 'admin' && 
            data.profile.name.toUpperCase() === 'ADMIN';
          setIsSpecialAdmin(isAdmin);
          
          // Load accompaniment mode from localStorage (only for disciples)
          if (data.profile.role === 'disciple') {
            const savedMode = localStorage.getItem(`accompaniment_mode_${session.user.id}`);
            if (savedMode === 'community' || savedMode === 'personal') {
              setAccompanimentMode(savedMode);
            } else {
              // Default based on leader_id
              const mode = data.profile.leader_id ? 'community' : 'personal';
              setAccompanimentMode(mode);
              localStorage.setItem(`accompaniment_mode_${session.user.id}`, mode);
            }
          }
          
          // Leaders and admins skip onboarding
          if (data.profile.role === 'leader' || data.profile.role === 'admin') {
            setState({ screen: 'home' });
            return;
          }

          // Check onboarding for disciples
          const onboardingKey = `onboarding_${session.user.id}`;
          const onboardingDone = localStorage.getItem(onboardingKey);
          
          if (onboardingDone === 'true') {
            setState({ screen: 'home' });
          } else {
            setState({ screen: 'onboarding' });
          }
        } else {
          // If unauthorized, could be expired token - try refresh first
          if (response.status === 401) {
            console.log('Access denied, attempting to refresh session...');
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError || !refreshData.session) {
              console.log('Session expired, please sign in again');
              await supabase.auth.signOut();
            } else {
              console.log('Session refreshed successfully, retrying...');
              // Retry with new token
              const retryResponse = await fetch(API_URLS.profile(), {
                headers: {
                  'Authorization': `Bearer ${refreshData.session.access_token}`
                }
              });
              
              if (retryResponse.ok) {
                const data = await retryResponse.json();
                setUser(refreshData.session.user);
                setProfile(data.profile);
                setAccessToken(refreshData.session.access_token);
                
                // Check for special admin access
                const isAdmin = 
                  data.profile.role === 'admin' && 
                  data.profile.name.toUpperCase() === 'ADMIN';
                setIsSpecialAdmin(isAdmin);
                
                // Load accompaniment mode
                if (data.profile.role === 'disciple') {
                  const savedMode = localStorage.getItem(`accompaniment_mode_${refreshData.session.user.id}`);
                  if (savedMode === 'community' || savedMode === 'personal') {
                    setAccompanimentMode(savedMode);
                  } else {
                    const mode = data.profile.leader_id ? 'community' : 'personal';
                    setAccompanimentMode(mode);
                    localStorage.setItem(`accompaniment_mode_${refreshData.session.user.id}`, mode);
                  }
                }
                
                // Set screen
                if (data.profile.role === 'leader' || data.profile.role === 'admin') {
                  setState({ screen: 'home' });
                } else {
                  const onboardingKey = `onboarding_${refreshData.session.user.id}`;
                  const onboardingDone = localStorage.getItem(onboardingKey);
                  setState(onboardingDone === 'true' ? { screen: 'home' } : { screen: 'onboarding' });
                }
              } else {
                const errorText = await retryResponse.text();
                console.log('Authentication failed after refresh:', errorText);
                await supabase.auth.signOut();
              }
            }
          } else {
            const errorText = await response.text();
            console.log('Profile fetch error:', response.status, errorText);
          }
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // On any error, try to sign out to clear invalid state
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (authUser: any, userProfile: UserProfile, isAdmin = false) => {
    setUser(authUser);
    setProfile(userProfile);
    setIsSpecialAdmin(isAdmin);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        setAccessToken(session.access_token);
      }
    });

    // Load or set accompaniment mode (only for disciples)
    if (userProfile.role === 'disciple') {
      const savedMode = localStorage.getItem(`accompaniment_mode_${authUser.id}`);
      if (savedMode === 'community' || savedMode === 'personal') {
        setAccompanimentMode(savedMode);
      } else {
        const mode = userProfile.leader_id ? 'community' : 'personal';
        setAccompanimentMode(mode);
        localStorage.setItem(`accompaniment_mode_${authUser.id}`, mode);
      }
    }

    // Leaders and admins skip onboarding
    if (userProfile.role === 'leader' || userProfile.role === 'admin') {
      setState({ screen: 'home' });
      return;
    }

    // Disciples go through onboarding
    const onboardingKey = `onboarding_${authUser.id}`;
    const onboardingDone = localStorage.getItem(onboardingKey);
    
    if (onboardingDone === 'true') {
      setState({ screen: 'home' });
    } else {
      setState({ screen: 'onboarding' });
    }
  };

  const handleOnboardingComplete = (mode: 'personal' | 'community') => {
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, 'true');
      setAccompanimentMode(mode);
      localStorage.setItem(`accompaniment_mode_${user.id}`, mode);
      setState({ screen: 'home' });
    }
  };

  const handleViewHistory = () => {
    setState({ screen: 'history' });
  };

  const handleViewLibrary = () => {
    setState({ screen: 'library' });
  };

  const handleViewAdminPanel = () => {
    setState({ screen: 'admin-panel' });
  };

  const handleCheckInComplete = (data: CheckInData) => {
    const hasRiskStruggles = data.struggles.some(s => RISK_STRUGGLES.includes(s));
    
    if (hasRiskStruggles) {
      setState({ screen: 'crisis', checkInData: data });
    } else {
      setState({ screen: 'root-questions', checkInData: data });
    }
  };

  const handleCrisisComplete = () => {
    if (state.screen === 'crisis') {
      setState({ screen: 'root-questions', checkInData: state.checkInData });
    }
  };

  const handleRootAnalysisComplete = async (analysis: RootAnalysis) => {
    // Save to Supabase
    if (accessToken) {
      try {
        await fetch(API_URLS.checkins(), {
          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              checkInData: analysis.checkInData,
              rootAnalysis: {
                identifiedRoots: analysis.identifiedRoots,
                timestamp: analysis.timestamp
              }
            })
          }
        );
      } catch (error) {
        console.error('Error saving check-in:', error);
      }
    }

    setState({ screen: 'daily-plan', analysis });
  };

  const handleBackToHome = () => {
    setState({ screen: 'home' });
  };

  const handleCancelCheckIn = () => {
    setState({ screen: 'home' });
  };

  const handleStartCheckIn = () => {
    setState({ screen: 'checkin-choice' });
  };

  const handleSelectTraditionalCheckIn = () => {
    setState({ screen: 'checkin' });
  };

  const handleSelectConversationalCheckIn = () => {
    setState({ screen: 'checkin-conversational' });
  };

  const handleConversationalCheckInComplete = async (checkIn: any) => {
    setState({ screen: 'home' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAccessToken(null);
    setIsSpecialAdmin(false);
    setState({ screen: 'auth' });
  };

  const handleModeChange = async (newMode: 'personal' | 'community') => {
    if (!accessToken || !user) return;

    try {
      // Update local state immediately for instant UI feedback
      const oldMode = accompanimentMode;
      setAccompanimentMode(newMode);
      localStorage.setItem(`accompaniment_mode_${user.id}`, newMode);

      // Update server
      const response = await fetch(API_URLS.changeMode(), {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ mode: newMode })
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update profile state with new data from server (includes restored leader_id if applicable)
        if (data.profile) {
          setProfile(data.profile);
          console.log('Mode changed successfully:', { 
            mode: newMode, 
            leader_id: data.profile.leader_id 
          });
        }
      } else {
        console.error('Error changing mode:', await response.text());
        // Revert on error
        setAccompanimentMode(oldMode);
        localStorage.setItem(`accompaniment_mode_${user.id}`, oldMode);
      }
    } catch (error) {
      console.error('Error changing mode:', error);
      // Revert on error
      const oldMode = newMode === 'personal' ? 'community' : 'personal';
      setAccompanimentMode(oldMode);
      localStorage.setItem(`accompaniment_mode_${user.id}`, oldMode);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
        <Toaster />
      </>
    );
  }

  if (!user || !profile || !accessToken) {
    return (
      <>
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      {(() => {
        switch (state.screen) {
          case 'auth':
            return <AuthScreen onAuthSuccess={handleAuthSuccess} />;

          case 'onboarding':
            return <OnboardingScreen onComplete={handleOnboardingComplete} />;
          
          case 'home':
            // Show different home screens based on role
            if (profile.role === 'leader' || profile.role === 'admin') {
              return (
                <LeaderDashboard
                  leaderName={profile.name}
                  accessToken={accessToken}
                  projectId={projectId}
                  theme={theme}
                  onLogout={handleLogout}
                  onViewLibrary={handleViewLibrary}
                  onViewAdminPanel={isSpecialAdmin ? handleViewAdminPanel : undefined}
                  onThemeToggle={toggleTheme}
                />
              );
            }
            
            // Disciples see the normal home screen
            return (
              <HomeScreenWithDnd
                mode={accompanimentMode}
                userName={profile.name}
                accessToken={accessToken}
                theme={theme}
                onStartCheckIn={handleStartCheckIn}
                onViewHistory={handleViewHistory}
                onViewResources={handleViewLibrary}
                onLogout={handleLogout}
                onModeChange={handleModeChange}
                onThemeToggle={toggleTheme}
              />
            );
          
          case 'checkin-choice':
            return (
              <CheckInChoice
                onSelectTraditional={handleSelectTraditionalCheckIn}
                onSelectConversational={handleSelectConversationalCheckIn}
                onBack={handleBackToHome}
              />
            );

          case 'checkin':
            return (
              <CheckInScreen
                onComplete={handleCheckInComplete}
                onCancel={handleCancelCheckIn}
              />
            );

          case 'checkin-conversational':
            return (
              <ConversationalCheckIn
                accessToken={accessToken}
                projectId={projectId}
                onComplete={handleConversationalCheckInComplete}
                onBack={handleBackToHome}
              />
            );
          
          case 'history':
            return (
              <CheckInHistory
                accessToken={accessToken}
                projectId={projectId}
                onBack={handleBackToHome}
              />
            );
          
          case 'library':
            return (
              <SpiritualLibrary
                userRole={profile.role as 'leader' | 'disciple' | 'admin'}
                accessToken={accessToken}
                projectId={projectId}
                onBack={handleBackToHome}
              />
            );
          
          case 'admin-panel':
            return (
              <AdminPanel
                accessToken={accessToken}
                projectId={projectId}
                onBack={handleBackToHome}
              />
            );
          
          case 'root-questions':
            return (
              <RootQuestionsScreen
                checkInData={state.checkInData}
                onComplete={handleRootAnalysisComplete}
                onCancel={handleCancelCheckIn}
              />
            );
          
          case 'crisis':
            return <CrisisScreen onComplete={handleCrisisComplete} />;
          
          case 'daily-plan':
            return (
              <DailyPlanScreen
                analysis={state.analysis}
                mode={accompanimentMode}
                onBack={handleBackToHome}
              />
            );
          
          default:
            return null;
        }
      })()}
      <Toaster />
    </>
  );
}
