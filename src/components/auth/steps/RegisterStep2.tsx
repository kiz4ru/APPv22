// filepath: [RegisterStep2.tsx](http://_vscodecontentref_/1)
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RegisterStep2Props {
  userData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function RegisterStep2({ userData, onUpdate, onNext, onBack }: RegisterStep2Props) {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="w-full max-w-full mx-auto px-0">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-4 pt-8 pb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          {t('preferences_title')}
        </h2>

        <div className="space-y-5">
          {/* Cleanliness */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              {t('preferences_cleanliness')}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={userData.preferences.cleanliness}
              onChange={(e) =>
                onUpdate({
                  preferences: {
                    ...userData.preferences,
                    cleanliness: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t('cleanliness_low')}</span>
              <span>{t('cleanliness_high')}</span>
            </div>
          </div>

          {/* Noise */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              {t('preferences_noise')}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={userData.preferences.noise}
              onChange={(e) =>
                onUpdate({
                  preferences: {
                    ...userData.preferences,
                    noise: parseInt(e.target.value),
                  },
                })
              }
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t('noise_low')}</span>
              <span>{t('noise_high')}</span>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              {t('preferences_schedule')}
            </label>
            <select
              value={userData.preferences.schedule}
              onChange={(e) =>
                onUpdate({
                  preferences: {
                    ...userData.preferences,
                    schedule: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
            >
              <option value="early_bird">{t('schedule_early')}</option>
              <option value="night_owl">{t('schedule_night')}</option>
              <option value="flexible">{t('schedule_flexible')}</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userData.preferences.smoking}
                onChange={(e) =>
                  onUpdate({
                    preferences: {
                      ...userData.preferences,
                      smoking: e.target.checked,
                    },
                  })
                }
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-base text-gray-700">{t('preferences_smoking')}</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={userData.preferences.pets}
                onChange={(e) =>
                  onUpdate({
                    preferences: {
                      ...userData.preferences,
                      pets: e.target.checked,
                    },
                  })
                }
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-base text-gray-700">{t('preferences_pets')}</span>
            </label>
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
            className="bg-indigo-600 text-white py-2.5 px-4 rounded-md text-base font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ml-auto"
          >
            {t('register_continue')}
          </button>
        </div>
      </form>
    </div>
  );
}