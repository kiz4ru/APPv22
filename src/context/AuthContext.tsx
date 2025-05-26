import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<{ user: User | null; error: any }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

// Y en el value del provider:


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Al montar, comprueba si hay sesión activa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session) {
        fetchUserProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Escucha cambios de sesión (logout/login)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);


  const fetchUserProfile = async (userId: string) => {
    try {
      // First check if user profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking user profile:', fetchError);
        return;
      }

      // If profile doesn't exist, don't try to fetch full profile
      if (!existingProfile) {
        return;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_preferences (*),
          user_locations (*),
          user_interests (interest),
          user_languages (language, level)
        `)
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (profile) {
        setUser(transformProfileToUser(profile));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const transformProfileToUser = (profile: any): User => {
    return {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      email: profile.email,
      bio: profile.bio || '',
      photoUrl: profile.photo_url || '',
      occupation: profile.occupation || '',
      interests: profile.user_interests?.map((i: any) => i.interest) || [],
      languages: profile.user_languages || [],
      preferences: {
        smoking: profile.user_preferences?.smoking || false,
        pets: profile.user_preferences?.pets || false,
        schedule: profile.user_preferences?.schedule || 'flexible',
        cleanliness: profile.user_preferences?.cleanliness || 3,
        noise: profile.user_preferences?.noise || 3,
        guests: profile.user_preferences?.guests || 'sometimes',
        diet: profile.user_preferences?.diet || 'none',
        drinking: profile.user_preferences?.drinking || 'socially',
        socialLevel: profile.user_preferences?.social_level || 'balanced',
        workFromHome: profile.user_preferences?.work_from_home || false,
        maxRent: profile.user_preferences?.max_rent || 0,
        moveInDate: profile.user_preferences?.move_in_date || '',
        minStayDuration: profile.user_preferences?.min_stay_duration || 6
      },
      location: {
        city: profile.user_locations?.city || '',
        area: profile.user_locations?.area || ''
      },
      lifestyle: {
        hobbies: [],
        music: [],
        movies: [],
        sports: [],
        cooking: false,
        gaming: false,
        traveling: false
      },
      verification: {
        email: profile.email_verified || false,
        phone: profile.phone_verified || false,
        government_id: profile.government_id_verified || false,
        student_id: profile.student_id_pending || false
      },
      email_verified: profile.email_verified || false,
      phone_verified: profile.phone_verified || false,
      government_id_verified: profile.government_id_verified || false,
      student_id_pending: profile.student_id_pending || false
    };
  };

  const register = async (userData: any) => {
    try {
      // Check password length
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', userData.email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create auth user
      const { data: authData } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (!authData.user) throw new Error('Failed to create user');
      const user = authData.user;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles') // ✅ Nueva tabla
        .insert({
          id: user.id,
          name: userData.name,
          email: userData.email,
          age: userData.age,
          bio: userData.bio || '',
          photo_url: userData.photoUrl || '',
          occupation: userData.occupation || '',
          email_verified: false,
          phone_verified: false,
          government_id_verified: false,
          student_id_pending: false
        });


      if (profileError) throw profileError;

      // Create related records in transaction-like manner
      const promises = [];

      // Preferences
      if (userData.preferences) {
        promises.push(
          supabase
            .from('user_preferences')
            .insert({
              user_id: authData.user.id,
              ...userData.preferences,
              noise: userData.preferences.noise || 3 // Add default noise preference
            })
        );
      }

      // Location
      if (userData.location) {
        promises.push(
          supabase
            .from('user_locations')
            .insert({
              user_id: authData.user.id,
              ...userData.location
            })
        );
      }

      // Interests
      if (userData.interests?.length > 0) {
        promises.push(
          supabase
            .from('user_interests')
            .insert(
              userData.interests.map((interest: string) => ({
                user_id: user.id,
                interest
              }))
            )
        );
      }

      // Languages
      if (userData.languages?.length > 0) {
        promises.push(
          supabase
            .from('user_languages')
            .insert(
              userData.languages.map((lang: any) => ({
                user_id: user.id,
                ...lang
              }))
            )
        );
      }

      // Wait for all insertions to complete
      await Promise.all(promises);

      // Fetch complete profile
      await fetchUserProfile(authData.user.id);

      // Fetch the full user profile and transform it to your User type
      const { data: profile, error: profileFetchError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_preferences (*),
          user_locations (*),
          user_interests (interest),
          user_languages (language, level)
        `)
        .eq('id', user.id)
        .maybeSingle();

      if (profileFetchError || !profile) {
        return { user: null, error: profileFetchError || 'Profile not found' };
      }

      const fullUser = transformProfileToUser(profile);

      return { user: fullUser, error: null };
    } catch (error: any) {
      console.error('Error in registration process:', error);
      await supabase.auth.signOut();
      // Retorna el error para que lo puedas manejar fuera
      return { user: null, error };
    }
  };

  const login = async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}