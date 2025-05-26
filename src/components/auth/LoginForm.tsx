import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Apple } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  loading?: boolean;
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onCreateAccount,
  loading = false,
}: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('login_error') || 'Por favor completa todos los campos.');
      return;
    }

    if (!isValidEmail(email)) {
      setError(t('login_invalid_email') || 'Introduce un correo electrónico válido.');
      return;
    }

    onSubmit({email, password});
  };

  const SocialButton = ({
    icon,
    label,
  }: {
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      type="button"
      disabled
      className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl px-6 pt-8 pb-10 transition-all duration-300"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {t('login_title') || 'Inicia sesión'}
        </h2>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              {t('login_email') || 'Correo electrónico'}
            </label>
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('login_email') || 'Correo electrónico'}
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              {t('login_password') || 'Contraseña'}
            </label>
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={t('login_password') || 'Contraseña'}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 py-2 px-4 rounded-md text-white transition-all ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2'
          }`}
        >
          {t('login_button') || 'Entrar'}
        </button>

        {/* Divider & Socials */}
        <div className="mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t('login_or_continue') || 'o continúa con'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SocialButton
              icon={
                <img
                  src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                  alt="Google"
                  className="h-5 w-5"
                />
              }
              label="Google"
            />
            <SocialButton
              icon={<Apple className="h-5 w-5 text-gray-400" />}
              label="Apple"
            />
          </div>

          <p className="text-xs text-center text-gray-400 mt-3 italic">
            {t('login_soon') || 'Próximamente más opciones'}
          </p>
        </div>

        {/* Links */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {t('login_forgot') || '¿Olvidaste tu contraseña?'}
          </button>
          <button
            type="button"
            onClick={onCreateAccount}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {t('login_create') || 'Crear cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
}
