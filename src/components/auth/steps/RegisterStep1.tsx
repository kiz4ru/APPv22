import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RegisterStep1Props {
  userData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack?: () => void; // <-- Añadido para el botón atrás
}

export function RegisterStep1({ userData, onUpdate, onNext, onBack }: RegisterStep1Props) {
  const { t } = useTranslation();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!userData.name || !userData.email || !userData.password || !userData.age) {
      setFieldError('All fields are required');
      return;
    }
    setFieldError(null);

    // Validar email: formato y dominio gmail
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(userData.email)) {
      setEmailError('Only valid Gmail emails are allowed');
      return;
    }
    setEmailError(null);

    // Validar edad mínima
    if (parseInt(userData.age, 10) < 18) {
      setFieldError('You must be at least 18 years old');
      return;
    }

    onNext();
  };

  return (
    <div className="w-full max-w-full mx-auto px-0">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-4 pt-8 pb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {t('register_title')}
        </h2>

        <div className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={userData.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              placeholder={t('register_name')}
              required
              autoComplete="name"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={userData.email}
              onChange={(e) => {
                onUpdate({ email: e.target.value });
                setEmailError(null);
              }}
              className="w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              placeholder={t('register_email')}
              required
              autoComplete="email"
            />
            {emailError && (
              <div className="text-red-500 text-xs mt-1">{emailError}</div>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              value={userData.password}
              onChange={(e) => onUpdate({ password: e.target.value })}
              className="w-full pl-12 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              placeholder={t('register_password')}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="relative">
            <input
              type="number"
              value={userData.age}
              onChange={(e) => onUpdate({ age: e.target.value })}
              className="w-full pl-4 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              placeholder={t('register_age')}
              min="18"
              required
            />
          </div>
        </div>

        {fieldError && (
          <div className="text-red-500 text-xs mt-3 text-center">{fieldError}</div>
        )}

        <div className="flex justify-between mt-8">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-200 text-gray-700 py-2.5 px-4 rounded-md text-base font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
            >
              {t('back') || 'Atrás'}
            </button>
          )}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2.5 px-4 rounded-md text-base font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ml-auto"
          >
            {t('register_continue')}
          </button>
        </div>
      </form>
    </div>
  );
}