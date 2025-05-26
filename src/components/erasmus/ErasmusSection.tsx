import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, Search, MapPin, GraduationCap, Users, Filter, Euro, Calendar } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { ErasmusPropertyCard } from './ErasmusPropertyCard';
import { ErasmusRoommateCard } from './ErasmusRoommateCard';
import { Property, User } from '../../types';

const countries = [
  { 
    code: 'IT', 
    name: 'Italy', 
    flag: '🇮🇹', 
    universities: ['University of Bologna', 'Sapienza University', 'Politecnico di Milano'],
    cities: ['Rome', 'Milan', 'Bologna', 'Florence']
  },
  { 
    code: 'ES', 
    name: 'Spain', 
    flag: '🇪🇸', 
    universities: ['Universidad de Barcelona', 'Universidad Complutense de Madrid', 'Universidad de Valencia'],
    cities: ['Barcelona', 'Madrid', 'Valencia', 'Seville']
  },
  { 
    code: 'FR', 
    name: 'France', 
    flag: '🇫🇷', 
    universities: ['Sorbonne University', 'Sciences Po Paris', 'University of Lyon'],
    cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse']
  }
];

// Sample data for each country
const countryData: Record<string, { properties: Property[], students: (User & { university: string; studyProgram: string })[] }> = {
  IT: {
    properties: [
      {
        id: 'it1',
        title: 'Charming Apartment near Sapienza',
        description: 'Beautiful apartment in the heart of Rome, perfect for students',
        price: 800,
        location: { address: 'Via del Corso 12', city: 'Rome', area: 'Centro Storico' },
        amenities: ['WiFi', 'Study Area', 'Washing Machine', 'Balcony'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'],
        bedrooms: 2,
        bathrooms: 1,
        available: true,
        virtualTourUrl: 'https://example.com/tour/it1'
      },
      {
        id: 'it2',
        title: 'Modern Studio in Milan',
        description: 'Contemporary studio apartment near Politecnico',
        price: 900,
        location: { address: 'Via Torino 45', city: 'Milan', area: 'Navigli' },
        amenities: ['Air Conditioning', 'Gym', 'Bike Storage', 'Security'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
        bedrooms: 1,
        bathrooms: 1,
        available: true
      },
      {
        id: 'it3',
        title: 'Historic Apartment in Bologna',
        description: 'Stunning apartment in a historic building',
        price: 750,
        location: { address: 'Via Zamboni 33', city: 'Bologna', area: 'University District' },
        amenities: ['High Ceilings', 'Furnished', 'Garden Access', 'Study Room'],
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb'],
        bedrooms: 2,
        bathrooms: 1,
        available: true
      }
    ],
    students: [
      {
        id: 'its1',
        name: 'Marco Rossi',
        age: 23,
        email: 'marco@student.it',
        bio: 'Architecture student from Milan, passionate about design and photography',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        interests: ['Architecture', 'Photography', 'Travel'],
        preferences: {
          smoking: false,
          pets: true,
          schedule: 'flexible',
          cleanliness: 4,
          guests: 'sometimes'
        },
        location: { city: 'Rome', area: 'Centro' },
        university: 'Sapienza University',
        studyProgram: 'Architecture'
      },
      {
        id: 'its2',
        name: 'Sofia Conti',
        age: 22,
        email: 'sofia@student.it',
        bio: 'Medical student looking for quiet roommates who enjoy occasional social activities',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        interests: ['Medicine', 'Yoga', 'Cooking'],
        preferences: {
          smoking: false,
          pets: false,
          schedule: 'early_bird',
          cleanliness: 5,
          guests: 'rarely'
        },
        location: { city: 'Bologna', area: 'University District' },
        university: 'University of Bologna',
        studyProgram: 'Medicine'
      },
      {
        id: 'its3',
        name: 'Luca Bianchi',
        age: 24,
        email: 'luca@student.it',
        bio: 'Engineering student who loves sports and technology',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        interests: ['Engineering', 'Sports', 'Technology'],
        preferences: {
          smoking: false,
          pets: true,
          schedule: 'night_owl',
          cleanliness: 4,
          guests: 'sometimes'
        },
        location: { city: 'Milan', area: 'Navigli' },
        university: 'Politecnico di Milano',
        studyProgram: 'Engineering'
      }
    ]
  },
  // Add similar data for ES and FR...
};

export function ErasmusSection() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'roommates'>('properties');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<Set<string>>(new Set());
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedCity(null);
    setSelectedUniversity(null);
  };

  const getFilteredContent = () => {
    if (!selectedCountry) return { properties: [], students: [] };

    const countryContent = countryData[selectedCountry];
    if (!countryContent) return { properties: [], students: [] };

    let { properties, students } = countryContent;

    // Apply filters
    if (selectedCity) {
      properties = properties.filter(p => p.location.city === selectedCity);
      students = students.filter(s => s.location.city === selectedCity);
    }

    if (selectedUniversity) {
      students = students.filter(s => s.university === selectedUniversity);
      properties = properties.filter(p => 
        p.location.area.toLowerCase().includes('university') || 
        p.description.toLowerCase().includes(selectedUniversity.toLowerCase())
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      properties = properties.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
      students = students.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.bio.toLowerCase().includes(query)
      );
    }

    properties = properties.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    students = students.filter(s => s.age >= ageRange[0] && s.age <= ageRange[1]);

    if (selectedAmenities.size > 0) {
      properties = properties.filter(p => 
        p.amenities.some(a => selectedAmenities.has(a))
      );
    }

    return { properties, students };
  };

  const { properties, students } = getFilteredContent();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <GraduationCap className="h-8 w-8" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Erasmus Student Housing</h2>
          <p className="text-lg text-indigo-100 mb-8">
            Find your perfect home and connect with fellow students during your Erasmus adventure
          </p>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country
              </label>
              <CountrySelector
                countries={countries}
                selectedCountry={selectedCountry}
                onSelect={handleCountrySelect}
              />
            </div>

            {selectedCountry && (
              <>
                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={selectedCity || ''}
                    onChange={(e) => setSelectedCity(e.target.value || null)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Cities</option>
                    {countries.find(c => c.code === selectedCountry)?.cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* University Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University
                  </label>
                  <select
                    value={selectedUniversity || ''}
                    onChange={(e) => setSelectedUniversity(e.target.value || null)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Universities</option>
                    {countries.find(c => c.code === selectedCountry)?.universities.map(uni => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide Filters' : 'Show Advanced Filters'}</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (€)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full p-2 border rounded-md"
                        placeholder="Min"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full p-2 border rounded-md"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Age Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Range
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        value={ageRange[0]}
                        onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                        className="w-full p-2 border rounded-md"
                        placeholder="Min"
                        min="18"
                        max="35"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={ageRange[1]}
                        onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                        className="w-full p-2 border rounded-md"
                        placeholder="Max"
                        min="18"
                        max="35"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['WiFi', 'Study Area', 'Gym', 'Balcony', 'Washing Machine'].map((amenity) => (
                        <button
                          key={amenity}
                          onClick={() => {
                            setSelectedAmenities(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(amenity)) {
                                newSet.delete(amenity);
                              } else {
                                newSet.add(amenity);
                              }
                              return newSet;
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedAmenities.has(amenity)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Content Tabs */}
      <div className="flex gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('properties')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            activeTab === 'properties'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>Properties</span>
          </div>
        </motion.button>
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
            <span>Erasmus Students</span>
          </div>
        </motion.button>
      </div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        {selectedCountry ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activeTab === 'properties' ? (
              properties.map((property) => (
                <ErasmusPropertyCard key={property.id} property={property} />
              ))
            ) : (
              students.map((student) => (
                <ErasmusRoommateCard key={student.id} student={student} />
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-12"
          >
            <Globe2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">Select a country to view available properties and students</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}