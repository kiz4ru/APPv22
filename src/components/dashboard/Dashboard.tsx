import { useState } from 'react';
import { Header } from '../Header';
import { MatchesSection } from '../matches/MatchesSection';
import { ErasmusSection } from '../erasmus/ErasmusSection';
import { useAuth } from '../../context/AuthContext';
import { DashboardFooter } from './DashboardFooter';
import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'matches' | 'erasmus'>('matches');
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('text_welcomDasboard')}, {user?.name}! 👋</h1>
              <p className="text-indigo-100">{t('text_pWelcom')}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">20%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
              <p className="text-indigo-100 text-sm">{t('Profile_text')}</p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveSection('matches')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeSection === 'matches'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('text_matches')}
          </button>

          <button
            onClick={() => setActiveSection('erasmus')}
            disabled={activeSection === 'erasmus'}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
            activeSection === 'erasmus'
            ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50'
            }`}
          >
            {t('Erasmus')}
          </button>
        </div>


        {/* Active Section Content */}
        {activeSection === 'matches' ? <MatchesSection /> : <ErasmusSection />}
      </main>

      <DashboardFooter />
    </div>
  );
}