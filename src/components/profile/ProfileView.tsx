import React, { useEffect, useState } from 'react';
import {
  Camera, Edit2, MapPin, Shield, Star, X,
  Globe, Cigarette, Dog, Wine, Home, Briefcase
} from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Lock } from 'lucide-react';

interface ProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  icon?: React.ReactNode;
}

function EditableField({ label, value, onSave, icon }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50">
      {icon}
      <div className="flex-1">
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
        {isEditing ? (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
            />
            <button
              onClick={handleSave}
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-900 text-xs sm:text-sm truncate">{value}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-indigo-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfileView({ isOpen, onClose }: ProfileViewProps) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'info'>('photos');
  const [images, setImages] = useState<string[]>([]);

  const defaultPreferences = {
    smoking: false,
    pets: false,
    schedule: 'flexible',
    cleanliness: 3,
    noise: 3,
    guests: 'sometimes',
    diet: 'none',
    drinking: 'socially',
    socialLevel: 'balanced',
    workFromHome: false,
    maxRent: 0,
    moveInDate: '',
    minStayDuration: 1
  };

  const defaultLifestyle = {
    hobbies: [],
    music: [],
    movies: [],
    sports: [],
    cooking: false,
    gaming: false,
    traveling: false
  };

  const defaultLocation = {
    city: '',
    area: ''
  };

    useEffect(() => {
    if (!user) return;
  
    const fetchProfileData = async () => {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
  
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      const { data: languages } = await supabase
        .from('user_languages')
        .select('*')
        .eq('user_id', user.id);
  
      const { data: location } = await supabase
        .from('user_locations')
        .select('*')
        .eq('user_id', user.id)
        .single();
  
      setProfileData({
        ...profile,
        preferences: preferences || defaultPreferences,
        languages: languages || [],
        location: location || defaultLocation,
        lifestyle: profile?.lifestyle || defaultLifestyle,
        interests: profile?.interests || [],
      });
  
      // Usa directamente el campo photo_url
      setImages([profile?.photo_url || './default-avatar.png']);
    };
  
    fetchProfileData();
  }, [user]);

  if (!isOpen || !profileData) return null;

  const handlePreferenceChange = (
    key: keyof typeof profileData.preferences,
    value: any
  ) => {
    setProfileData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value
        }
      };
    });
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;

    const { preferences, languages, location, ...profileFields } = profileData;
    await supabase
      .from('user_profiles')
      .update(profileFields)
      .eq('id', profileData.id);

    if (preferences) {
      await supabase
        .from('user_preferences')
        .upsert({ user_id: profileData.id, ...preferences });
    }

    if (location) {
      await supabase
        .from('user_locations')
        .upsert({ user_id: profileData.id, ...location });
    }

    if (languages) {
      await supabase
        .from('user_languages')
        .delete()
        .eq('user_id', profileData.id);
      if (languages.length > 0) {
        await supabase
          .from('user_languages')
          .insert(languages.map(lang => ({
            user_id: profileData.id,
            language: lang.language,
            level: lang.level
          })));
      }
    }

    alert('Perfil actualizado correctamente');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className="
          w-full h-full flex items-center justify-center
          p-0 sm:p-4
        "
      >
        <div
          className="
            bg-white rounded-t-2xl sm:rounded-xl shadow-2xl
            w-full h-full
            max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl
            sm:h-auto
            relative
            flex flex-col
            sm:flex-none
            overflow-hidden
          "
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col sm:flex-row h-full sm:h-auto overflow-hidden">
            {/* Sidebar */}
            <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 p-4 sm:p-6 flex-shrink-0">
              <div className="flex flex-col items-center">
                <img
                  src={profileData.photoUrl || images[0] || './default-avatar.png'}
                  alt={profileData.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <h2 className="mt-2 sm:mt-4 text-lg sm:text-xl font-semibold text-center">{profileData.name}</h2>
                <p className="text-gray-500 text-xs sm:text-sm">{profileData.age} years old</p>
                <div className="flex items-center mt-1 sm:mt-2 text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-xs sm:text-sm">{profileData.location?.city || ''}</span>
                </div>
              </div>
              <div className="mt-6 sm:mt-8">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h3 className="font-medium text-gray-900 text-xs sm:text-base">Profile Completion</h3>
                  <span className="text-indigo-600 text-xs sm:text-base">20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <div className="mt-6 sm:mt-8">
                <h3 className="font-medium text-gray-900 mb-2 sm:mb-4 text-xs sm:text-base">Verification</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center text-green-600 text-xs sm:text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="capitalize">Identidad Verified</span>
                  </div>
                  <div className="flex items-center text-green-600 text-xs sm:text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="capitalize">Email Verified</span>
                  </div>
                  <div className="flex items-center text-green-600 text-xs sm:text-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="capitalize">Teléfono Verified</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-56px)] sm:max-h-[80vh]">
              <div className="flex space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-base ${
                    activeTab === 'photos'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-base ${
                    activeTab === 'info'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Information
                </button>
              </div>
                {/* Photos Tab */}
                {activeTab === 'photos' ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:grid-rows-2 sm:gap-4">
                  {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] group overflow-hidden rounded-lg"
                  >
                    {images[index] ? (
                    <img
                      src={images[index]}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    )}
                    <button
                    disabled
                    className="absolute inset-0 bg-black bg-opacity-50 opacity-100 flex items-center justify-center cursor-not-allowed"
                    title="Subida de imágenes deshabilitada temporalmente"
                    >
                    <Lock className="h-8 w-8 text-white" />
                    </button>
                    {index === 0 && (
                    <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                      Perfil
                    </span>
                    )}
                  </div>
                  ))}
                </div>
                ) : (
                <div className="space-y-4 sm:space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2 sm:mb-4 text-sm sm:text-base">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <EditableField
                        label="Occupation"
                        value={profileData.occupation}
                        onSave={(value) =>
                          setProfileData(prev => prev ? { ...prev, occupation: value } : prev)
                        }
                        icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                      />
                      <EditableField
                        label="Location"
                        value={`${profileData.location?.city || ''}, ${profileData.location?.area || ''}`}
                        onSave={(value) => {
                          const [city, area] = value.split(',').map(s => s.trim());
                          setProfileData(prev => {
                            if (!prev) return prev;
                            return {
                              ...prev,
                              location: { ...prev.location, city, area }
                            };
                          });
                        }}
                        icon={<MapPin className="h-5 w-5 text-gray-400" />}
                      />
                    </div>
                  </div>
                  {/* About Me */}
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">About Me</h3>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData(prev => prev ? { ...prev, bio: e.target.value } : prev)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm"
                      rows={4}
                    />
                  </div>
                  {/* Preferences */}
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2 sm:mb-4 text-sm sm:text-base">Living Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      {/* Habits */}
                      <div className="space-y-2 sm:space-y-4">
                        <h4 className="font-medium text-gray-900 text-xs sm:text-base">Habits & Preferences</h4>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          {[
                            { icon: <Cigarette className="h-5 w-5" />, label: 'Smoking', key: 'smoking' },
                            { icon: <Dog className="h-5 w-5" />, label: 'Pets', key: 'pets' },
                            { icon: <Wine className="h-5 w-5" />, label: 'Drinking', key: 'drinking' },
                            { icon: <Home className="h-5 w-5" />, label: 'Work from Home', key: 'workFromHome' }
                          ].map((pref) => (
                            <div
                              key={pref.key}
                              className={`p-2 sm:p-4 rounded-lg border ${
                                profileData.preferences[pref.key as keyof typeof profileData.preferences]
                                  ? 'border-indigo-600 bg-indigo-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                {pref.icon}
                                <input
                                  type="checkbox"
                                  checked={
                                    profileData.preferences[pref.key as keyof typeof profileData.preferences] as boolean
                                  }
                                  onChange={(e) =>
                                    handlePreferenceChange(pref.key as keyof typeof profileData.preferences, e.target.checked)
                                  }
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                              </div>
                              <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-700">{pref.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Schedule and Cleanliness */}
                      <div className="space-y-2 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Schedule Preference
                          </label>
                          <select
                            value={profileData.preferences.schedule}
                            onChange={(e) => handlePreferenceChange('schedule', e.target.value)}
                            className="w-full p-2 border rounded-md text-xs sm:text-sm"
                          >
                            <option value="early_bird">Early Bird</option>
                            <option value="night_owl">Night Owl</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Cleanliness Level
                          </label>
                          <div className="flex space-x-1 sm:space-x-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={() => handlePreferenceChange('cleanliness', level)}
                                className={`p-1 sm:p-2 rounded-md ${
                                  profileData.preferences.cleanliness >= level
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Languages */}
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2 sm:mb-4 text-sm sm:text-base">Languages</h3>
                    <div className="space-y-1 sm:space-y-2">
                      {profileData.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between p-1 sm:p-2 bg-white rounded-md">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <span className="font-medium text-xs sm:text-sm">{lang.language}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500 capitalize">{lang.level}</span>
                        </div>
                      ))}
                      <button
                        className="w-full p-1 sm:p-2 border border-dashed border-gray-300 rounded-md text-xs sm:text-sm text-gray-500 hover:border-indigo-500 hover:text-indigo-600"
                      >
                        + Add Language
                      </button>
                    </div>
                  </div>
                  {/* Interests and Lifestyle */}
                  <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2 sm:mb-4 text-sm sm:text-base">Interests & Lifestyle</h3>
                    <div className="space-y-2 sm:space-y-4">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Interests</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {(profileData.interests || []).map((interest, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 sm:px-3 sm:py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                          <button className="px-2 py-1 sm:px-3 sm:py-1 border border-dashed border-gray-300 rounded-full text-xs sm:text-sm text-gray-500 hover:border-indigo-500 hover:text-indigo-600">
                            + Add Interest
                          </button>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Activities</h4>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          {Object.entries(profileData.lifestyle)
                            .filter(([_ , value]) => typeof value === 'boolean')
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className={`p-2 sm:p-3 rounded-lg border ${
                                  value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="capitalize text-xs sm:text-sm font-medium">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={typeof value === 'boolean' ? value : undefined}
                                    onChange={(e) => setProfileData(prev => {
                                      if (!prev) return prev;
                                      return {
                                        ...prev,
                                        lifestyle: {
                                          ...prev.lifestyle,
                                          [key]: e.target.checked
                                        }
                                      };
                                    })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="mt-4 sm:mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-xs sm:text-base w-full sm:w-auto"
                  >
                    Guardar cambios
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
