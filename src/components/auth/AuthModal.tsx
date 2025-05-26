import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../context/AuthContext';
import { RegisterTypeModal } from './RegisterTypeModal';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'registerType'>('login');
  const { login, register } = useAuth();
  const [error, setError] = useState('');
  const [, setShowRegisterType] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    try {
      await login(email, password);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleRegister = async (userData: any) => {
    setError('');
    const file = userData.photoFile;
    let photoUrl = '/profile/default-avatar.png'; // Ruta pública de la imagen por defecto
    try {
      // 1. Registrar usuario (sin foto)
      const { user, error: registerError } = await register(userData);
      if (registerError) throw registerError;
      if (!user || !user.id) throw new Error('No se pudo crear el usuario.');

      // 2. Si el usuario subió una imagen, intenta subirla
      if (file && file instanceof File) {
        const validTypes = ['image/jpeg', 'image/png'];
        if (validTypes.includes(file.type) && file.size <= 50 * 1024 * 1024) {
          const fileExt = file.name.split('.').pop();
          const filePath = `${user.id}/${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true,
            });
          if (!uploadError) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            if (data && data.publicUrl) {
              photoUrl = data.publicUrl;
            }
          }
        }
      }
      // 3. Actualiza el perfil con la URL de la imagen (sea subida o default)
      await supabase
        .from('user_profiles')
        .update({ photo_url: photoUrl })
        .eq('id', user.id);
      onClose();
      window.location.reload();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error en el registro');
    }
  };

  // Solo permitimos usuario normal, propietario está comentado para el futuro
  const handleSelectType = (type: 'user' | 'property') => {
    setShowRegisterType(false);
    if (type === 'user') {
      setMode('register');
    }
    // else if (type === 'property') {
    //   // Aquí podrías navegar a /register-property en el futuro
    // }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 w-full max-w-md md:max-w-xl">
        <div className="relative bg-white rounded-lg shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {mode === 'registerType' && (
              <RegisterTypeModal
                isOpen={true}
                onClose={() => setMode('login')}
                onSelectType={handleSelectType}
              />
            )}

            {mode === 'login' && (
              <LoginForm
                onSubmit={handleLogin}
                onForgotPassword={() => {}}
                onCreateAccount={() => setMode('registerType')}
              />
            )}

            {mode === 'register' && (
              <RegisterForm
                onSubmit={handleRegister}
                onBack={() => setMode('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}