import { useState } from 'react';
import * as Icons from 'lucide-react';
import { ChatWindow } from './chat/ChatWindow';
import { ProfileView } from './profile/ProfileView';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Globe2, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'eus', name: 'Euskera' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese' },
];

export function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const changeLanguage = (language: { code: string; name: string }) => {
    i18n.changeLanguage(language.code);
    setSelectedLanguage(language);
    setShowLanguageMenu(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Icons.Home className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LIVINGLINKED</span>
            </div>

            {/* Buscador solo en desktop */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search for roommates or properties..."
                />
              </div>
            </div>

            {/* Iconos solo en desktop */}
            <nav className="hidden md:flex items-center space-x-4">
              {/* Selector de idioma */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <Globe2 className="h-5 w-5" />
                  <span>{selectedLanguage.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="p-2 text-gray-600 hover:text-indigo-600 relative">
                <Icons.Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 text-gray-600 hover:text-indigo-600 flex items-center"
                >
                  <img
                    src={user?.photoUrl || 'https://openclipart.org/image/800px/346569'}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setIsProfileOpen(true);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icons.UserCircle className="h-4 w-4 mr-2" />
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <Icons.LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Botón hamburguesa solo en móvil */}
            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(true)}
            >
              <Icons.Menu className="h-7 w-7 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

            {/* Menú lateral móvil */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Menú deslizante */}
          <div className="bg-white w-72 p-6 flex flex-col gap-6 shadow-xl relative">
            {/* Botón para cerrar el menú */}
            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition-colors"
            >
              <Icons.X className="h-6 w-6" />
            </button>
      
            {/* Selector de idioma en móvil */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Globe2 className="h-5 w-5" />
                <span>{selectedLanguage.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showLanguageMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language);
                        setShowLanguageMenu(false); // Cierra el menú de idiomas
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
      
            {/* Otros elementos del menú móvil */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Icons.UserCircle className="h-5 w-5" />
              <span>Profile Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <Icons.LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ProfileView isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}