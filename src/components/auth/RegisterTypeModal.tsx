import { motion } from 'framer-motion';
import { User, Home, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RegisterTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'user' | 'property') => void;
}

export function RegisterTypeModal({ isOpen, onClose, onSelectType }: RegisterTypeModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-8">{t('registerTypeModalTitle')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectType('user')}
            className="flex flex-col items-center p-8 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('registerTypeModaluserTitle')}</h3>
            <p className="text-sm text-gray-500 text-center">
              {t('registerTypeModaluserDescription')}
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled
            className="flex flex-col items-center p-8 rounded-xl border-2 border-indigo-100 opacity-50 cursor-not-allowed bg-gray-50"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Home className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('registerTypeModalpropertyTitle')}</h3>
            <p className="text-sm text-gray-500 text-center">
              {t('registerTypeModalpropertyDescription', 'Próximamente podrás publicar tu propiedad y encontrar inquilinos')}
            </p>
          </motion.button>
        </div>

        <p className="mt-8 text-sm text-gray-500 text-center">
          {t('registerTypeModallater', 'Puedes añadir ambos tipos de perfiles más adelante')}
        </p>
      </motion.div>
    </div>
  );
}