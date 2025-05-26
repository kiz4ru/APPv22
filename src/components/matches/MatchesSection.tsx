import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
//import { MatchCard } from './MatchCard';
import { PropertyCard } from './PropertyCard';
import { Property } from '../../types';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
//import i18n from '../../i18n';
import { MapPin, DollarSign, BedDouble, Users, Heart, Star,  Camera} from 'lucide-react';




// Sample data for properties and people
const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Loft in SoMa',
    description: 'Stunning loft with high ceilings and modern amenities',
    price: 2800,
    location: { address: '123 Main St', city: 'San Francisco', area: 'SoMa' },
    amenities: ['In-unit Laundry', 'Gym', 'Roof Deck', 'Parking'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
    bedrooms: 2,
    bathrooms: 2,
    available: true,
    virtualTourUrl: 'https://example.com/tour/1'
  },
  {
    id: '2',
    title: 'Charming Victorian',
    description: 'Beautiful Victorian home with original details',
    price: 3200,
    location: { address: '456 Oak St', city: 'San Francisco', area: 'Hayes Valley' },
    amenities: ['Hardwood Floors', 'Garden', 'Fireplace', 'Storage'],
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb'],
    bedrooms: 3,
    bathrooms: 2,
    available: true
  },
  {
    id: '3',
    title: 'Luxury High-Rise',
    description: 'High-end apartment with stunning views',
    price: 4500,
    location: { address: '789 Market St', city: 'San Francisco', area: 'Financial District' },
    amenities: ['Doorman', 'Pool', 'Spa', 'Concierge'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750'],
    bedrooms: 2,
    bathrooms: 2,
    available: true
  }
];

type SimpleUser = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo_url: string;
};

export function MatchesSection() {

  const [people, setPeople] = useState<SimpleUser[]>([]);
  
  useEffect(() => {
    const fetchPeople = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, name, age, bio, photo_url');
      if (!error && data) setPeople(data);
    };
    fetchPeople();
  }, []);

  const [activeTab, setActiveTab] = useState<'roommates' | 'properties'>('roommates');
  const [showFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [searchQuery] = useState('');
  
  // Enhanced filters
  const [filters, setFilters] = useState({
    location: '',
    ageRange: [18, 50],
    priceRange: [0, 5000],
    moveInDate: '',
    stayDuration: 0,
    lifestyle: {
      smoking: null as boolean | null,
      pets: null as boolean | null,
      drinking: null as 'never' | 'socially' | 'regularly' | null,
      diet: null as 'none' | 'vegetarian' | 'vegan' | 'kosher' | 'halal' | null,
      schedule: null as 'early_bird' | 'night_owl' | 'flexible' | null,
      socialLevel: null as 'very_private' | 'balanced' | 'very_social' | null,
      cleanliness: 0,
      workFromHome: null as boolean | null
    },
    interests: new Set<string>(),
    languages: new Set<string>(),
    amenities: new Set<string>()
  });

  // Function to filter properties
  const getFilteredProperties = () => {
    return sampleProperties.filter(property => {
      const matchesSearch = searchQuery === '' || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = !filters.location || 
        property.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.location.area.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesPrice = property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1];
      
      const matchesAmenities = filters.amenities.size === 0 || 
        property.amenities.some(amenity => filters.amenities.has(amenity));

      return matchesSearch && matchesLocation && matchesPrice && matchesAmenities;
    });
  };

  // Function to filter people

  {/*const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
  };*/}

  const handleLike = (id: string) => {
    setLikedItems(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

   const { t } = useTranslation();

  //const filteredContent = activeTab === 'properties' ? 
    //getFilteredProperties() :
    people.filter(person => {
      const matchesSearch = searchQuery === '' || 
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesAge = person.age >= filters.ageRange[0] && 
        person.age <= filters.ageRange[1];

      return matchesSearch && matchesAge;
    });

  return (
    <div>
      {/* Search and Filter Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('roommates')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === 'roommates'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{t('text_People')}</span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('properties')}
              disabled
              className="px-6 py-2 rounded-full font-medium transition-colors bg-gray-300 text-gray-400 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <BedDouble className="h-5 w-5" />
                <span>{t('text_property')}</span>
              </div>
            </motion.button>
          </div>

            {/*<div className="flex items-center gap-4 opacity-50 pointer-events-none select-none">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100"
              disabled
            >
              <Filter className="h-5 w-5" />
              <span>{t('input_filters')}</span>
            </motion.button>
            </div>*/}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Filters */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">{t('Location & Basics')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Location')}
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter location"
                            className="pl-10 w-full p-2 border rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('Price Range')}
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="number"
                              value={filters.priceRange[0]}
                              onChange={(e) => setFilters(prev => ({
                                ...prev,
                                priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                              }))}
                              className="pl-10 w-full p-2 border rounded-md"
                              placeholder={(t('Min'))}
                            />
                          </div>
                          <span className="text-gray-500">{t('to')}</span>
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="number"
                              value={filters.priceRange[1]}
                              onChange={(e) => setFilters(prev => ({
                                ...prev,
                                priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                              }))}
                              className="pl-10 w-full p-2 border rounded-md"
                              placeholder={(t('Max'))}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lifestyle Filters */}
                  {activeTab === 'roommates' && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Lifestyle</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Age Range')}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={filters.ageRange[0]}
                              onChange={(e) => setFilters(prev => ({
                                ...prev,
                                ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                              }))}
                              className="w-full p-2 border rounded-md"
                              placeholder="Min"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                              type="number"
                              value={filters.ageRange[1]}
                              onChange={(e) => setFilters(prev => ({
                                ...prev,
                                ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                              }))}
                              className="w-full p-2 border rounded-md"
                              placeholder={(t('Max'))}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('schedule')}
                          </label>
                          <select
                            value={filters.lifestyle.schedule || ''}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              lifestyle: {
                                ...prev.lifestyle,
                                schedule: e.target.value as any || null
                              }
                            }))}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="">{t('Any')}</option>
                            <option value="early_bird">{t('Early Bird')}</option>
                            <option value="night_owl">{t('Night Owl')}</option>
                            <option value="flexible">{t('Flexible')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amenities/Interests */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">
                      {activeTab === 'properties' ? 'Amenities' : 'Interests'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeTab === 'properties' ? (
                        // Property amenities
                        ['Gym', 'Parking', 'Pool', 'Laundry', 'Balcony'].map((amenity) => (
                          <button
                            key={amenity}
                            onClick={() => setFilters(prev => {
                              const newAmenities = new Set(prev.amenities);
                              if (newAmenities.has(amenity)) {
                                newAmenities.delete(amenity);
                              } else {
                                newAmenities.add(amenity);
                              }
                              return { ...prev, amenities: newAmenities };
                            })}
                            className={`px-3 py-1 rounded-full text-sm ${
                              filters.amenities.has(amenity)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {amenity}
                          </button>
                        ))
                      ) : (
                        // People interests
                        ['Music', 'Art', 'Tech', 'Sports', 'Travel', 'Food'].map((interest) => (
                          <button
                            key={interest}
                            onClick={() => setFilters(prev => {
                              const newInterests = new Set(prev.interests);
                              if (newInterests.has(interest)) {
                                newInterests.delete(interest);
                              } else {
                                newInterests.add(interest);
                              }
                              return { ...prev, interests: newInterests };
                            })}
                            className={`px-3 py-1 rounded-full text-sm ${
                              filters.interests.has(interest)
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {interest}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Filter Tags */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">Quick Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeTab === 'roommates' ? (
                      people.map((person) => (
                        <motion.div
                          key={person.id}
                          variants={{
                            hidden: { y: 20, opacity: 0 },
                            visible: { y: 0, opacity: 1 }
                          }}
                          layout
                        >
                          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                            <img
                              src={person.photo_url || '/default-avatar.png'}
                              alt={person.name}
                              className="w-28 h-28 rounded-full object-cover mb-3"
                            />
                            <h3 className="text-lg font-semibold text-center">{person.name}, {person.age}</h3>
                            <p className="text-gray-500 text-center mt-2">{person.bio}</p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      // Property quick filters
                      [
                        { icon: <Star className="h-4 w-4" />, label: 'Luxury' },
                        { icon: <Heart className="h-4 w-4" />, label: 'Pet Friendly' },
                        { icon: <Camera className="h-4 w-4" />, label: 'Virtual Tour' },
                        { icon: <MapPin className="h-4 w-4" />, label: 'City Center' },
                        { icon: <Users className="h-4 w-4" />, label: 'Shared' },
                        { icon: <BedDouble className="h-4 w-4" />, label: 'Furnished' }
                      ].map((tag) => (
                        <button
                          key={tag.label}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
                        >
                          {tag.icon}
                          <span>{tag.label}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'roommates' ? (
            people.map((person) => (
              <motion.div
                key={person.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                layout
              >
                <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                  <img
                    src={person.photo_url || '/default-avatar.png'}
                    alt={person.name}
                    className="w-28 h-28 rounded-full object-cover mb-3"
                  />
                  <h3 className="text-lg font-semibold text-center">{person.name}, {person.age}</h3>
                  <p className="text-gray-500 text-center mt-2">{person.bio}</p>
                </div>
              </motion.div>
            ))
          ) : (
            getFilteredProperties().map((property) => (
              <motion.div
                key={property.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                layout
              >
                <PropertyCard
                  property={property}
                  onLike={() => handleLike(property.id)}
                  isLiked={likedItems.has(property.id)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}