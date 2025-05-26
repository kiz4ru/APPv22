import { Users, Home, Star, Award, Shield, MessageCircle, Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function DashboardFooter() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, count: '10,000+', label: t('footerstatshappyRoommates') },
    { icon: Home, count: '5,000+', label: t('footerstatspropertiesListed') },
    { icon: Star, count: '4.8', label: t('footerstatsaverageRating') },
    { icon: Award, count: '98%', label: t('footerstatssuccessRate') }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <motion.p
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                {stat.count}
              </motion.p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white"
          >
            <Shield className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('footerfeaturesverifiedProfilestitle')}</h3>
            <p className="text-gray-600">{t('footerfeaturesverifiedProfilesdescription')}</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white"
          >
            <MessageCircle className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('footerfeaturesinstantMessagingtitle')}</h3>
            <p className="text-gray-600">{t('footerfeaturesinstantMessagingdescription')}</p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5 }}
            className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white"
          >
            <Heart className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('footerfeaturessmartMatchingtitle')}</h3>
            <p className="text-gray-600">{t('footerfeaturessmartMatchingdescription')}</p>
          </motion.div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
            <motion.a
              key={index}
              href="#"
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Icon className="h-6 w-6" />
            </motion.a>
          ))}
        </div>

        {/* Bottom Links */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-4">{t('footercopyright')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                whileHover={{ color: '#4F46E5' }}
                href="#"
                className="hover:text-indigo-600 transition-colors"
              >
                {t('footerlinksprivacyPolicy')}
              </motion.a>
              <motion.a
                whileHover={{ color: '#4F46E5' }}
                href="#"
                className="hover:text-indigo-600 transition-colors"
              >
                {t('footerlinkstermsOfService')}
              </motion.a>
              <motion.a
                whileHover={{ color: '#4F46E5' }}
                href="#"
                className="hover:text-indigo-600 transition-colors"
              >
                {t('footerlinkscontactSupport')}
              </motion.a>
              <motion.a
                whileHover={{ color: '#4F46E5' }}
                href="#"
                className="hover:text-indigo-600 transition-colors"
              >
                {t('footerlinksfaq')}
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}