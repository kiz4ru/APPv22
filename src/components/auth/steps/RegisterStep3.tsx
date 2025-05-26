import React from 'react';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RegisterStep3Props {
  userData: any;
  onUpdate: (data: any) => void;
  onSubmit: (userData: any) => void | Promise<void>;
  onBack?: () => void;
  loading?: boolean;  
}

export function RegisterStep3({ userData, onUpdate, onSubmit, onBack, loading }: RegisterStep3Props) {
  const { t } = useTranslation();
  const MAX_FILE_SIZE_MB = 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.bio) {
      alert('Por favor completa tu perfil.');
      return;
    }
    if (userData.photoFile && userData.photoFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert('La imagen es demasiado grande. El máximo permitido es 50MB.');
      return;
    }
    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('registerStep3completeProfile')}
      </h2>

      <div className="space-y-6">
        {/* Foto de perfil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('registerStep3profilePicture')}
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="w-64 flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-indigo-50">
              <Camera className="w-8 h-8 text-indigo-600" />
              <span className="mt-2 text-base leading-normal text-gray-600">
                {t('registerStep3selectPhoto')}
              </span>              
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const validTypes = ['image/jpeg', 'image/png'];
                    const allowedExtensions = ['jpg', 'jpeg', 'png'];
                    const fileExt = file.name.split('.').pop()?.toLowerCase();
                    if (!validTypes.includes(file.type) || !fileExt || !allowedExtensions.includes(fileExt)) {
                      alert('Solo se permiten imágenes JPG o PNG.');
                      return;
                    }
                    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                      alert('La imagen es demasiado grande. El máximo permitido es 50MB.');
                      return;
                    }
                    onUpdate({ photoFile: file });
                  } else {
                    // Si el usuario borra la selección, elimina la foto
                    onUpdate({ photoFile: undefined });
                  }
                }}
              />
            </label>
          </div>
          {userData.photoFile && (
            <div className="mt-4 flex justify-center">
              <img
                src={URL.createObjectURL(userData.photoFile)}
                alt={t('registerStep3.profilePreview')}
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('registerStep3bio')}
          </label>
          <textarea
            value={userData.bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder={t('registerStep3bioPlaceholder')}
            required
          />
        </div>
      </div>

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
          disabled={loading}
          className={`bg-indigo-600 text-white py-2.5 px-4 rounded-md text-base font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ml-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {t('registerStep3completeRegistration')}
        </button>
      </div>
    </form>
  );
}