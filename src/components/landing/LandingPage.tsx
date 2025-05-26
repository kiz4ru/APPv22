// LandingPage con traducción automática con react-i18next
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { Globe2, ChevronDown, Star, Facebook, Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'eus', name: 'Esukera' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: 'Chinese' },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Graduate Student',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    contentkey: 'testimonial_1',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Young Professional',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    contentkey: 'testimonial_2',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Software Engineer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    contentkey: 'testimonial_3',
    rating: 5
  }
];

export function LandingPage() {
  const { t } = useTranslation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [, setAuthMode] = useState<'login' | 'register'>('login');
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const changeLanguage = (language: { code: string; name: string }) => {
    i18n.changeLanguage(language.code);
    setSelectedLanguage(language);
    setShowLanguages(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
       <header className="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Icons.Home className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-indigo-600">LIVINGLINKED</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <button className="text-gray-600 hover:text-indigo-600 transition-colors">
              {t('propertyInfo')}
            </button>
            <button className="text-gray-600 hover:text-indigo-600 transition-colors">
              {t('aboutUs')}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Globe2 className="h-4 w-4" />
                <span>{selectedLanguage.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showLanguages && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language);
                        setShowLanguages(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleAuth('login')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors transform hover:scale-105 duration-200 shadow-md hover:shadow-lg"
            >
              {t('login')}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-4 pb-6 space-y-4 shadow-md">
          <button className="block text-gray-700 w-full text-left">{t('propertyInfo')}</button>
          <button className="block text-gray-700 w-full text-left">{t('aboutUs')}</button>
          <div>
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center space-x-1 text-gray-700"
            >
              <Globe2 className="h-4 w-4" />
              <span>{selectedLanguage.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showLanguages && (
              <div className="mt-2 w-full bg-white rounded-md shadow-md">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      changeLanguage(language);
                      setShowLanguages(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleAuth('login')}
            className="w-full px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            {t('login')}
          </button>
        </div>
      )}
    </header>

      {/* Hero Section */}
      {/* Hero Section with Video Background */}
      {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src="https://www.pexels.com/download/video/4781506/" type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{t('find')}</span>
              <span className="block mb-2 text-indigo-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>{t('live')}</span>
              <span className="block text-indigo-200 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>{t('connect')}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              {t('hero_subtitle')}
            </p>
            <button
              onClick={() => handleAuth('register')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-full text-lg font-semibold hover:from-indigo-700 hover:to-indigo-900 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: '1s' }}
            >
              {t('createAccount')}
            </button>
          </div>
        </section>


      {/* Features Section */}
      {/* Features Section */}
      <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('smartMatching')}</h3>
            <p className="text-gray-600">{t('smartMatching_desc')}</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('verifiedProfiles')}</h3>
            <p className="text-gray-600">{t('verifiedProfiles_desc')}</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('virtualTours')}</h3>
            <p className="text-gray-600">{t('virtualTours_desc')}</p>
          </div>
        </div>
      </div>
    </section>


      {/* Rest of the sections remain unchanged */}
      {/* Testimonials */}
      {/* Testimonials */}
       <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">{t('testimonials')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{t(testimonial.contentkey)}</p>
              <div className="flex text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


      {/* Footer */}
            {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer_about')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400">{t('aboutUs')}</a></li>
              <li><a href="#" className="hover:text-indigo-400">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400">Press</a></li>
              <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer_support')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400">Safety Center</a></li>
              <li><a href="#" className="hover:text-indigo-400">Community Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer_legal')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer_connect')}</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-indigo-400"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-indigo-400"><Twitter className="h-6 w-6" /></a>
              <a href="https://www.instagram.com/livinglinkedd/" className="hover:text-indigo-400"><Instagram className="h-6 w-6" /></a>
              <a href="https://www.linkedin.com/in/livinglinked-73a431365" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <h4 className="text-sm font-semibold mb-2">Download our app</h4>
            <div className="flex space-x-2">
              <a href="#" className="hover:opacity-80">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/1280px-Download_on_the_App_Store_RGB_blk.svg.png" alt="App Store" className="h-10" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src="https://static.vecteezy.com/system/resources/previews/024/170/871/non_2x/badge-google-play-and-app-store-button-download-free-png.png" alt="Play Store" className="h-10" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 LivingLinked. {t('footer_rights')}</p>
        </div>
      </div>
    </footer>



      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}