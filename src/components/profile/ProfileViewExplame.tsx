import React, {useEffect, useState } from 'react';
import {
  Camera, Edit2, MapPin, Calendar, Mail, Phone, Shield,
  Star, Settings, X, Music, Gamepad, Plane, Utensils,
  Globe, Book, DollarSign, Clock, Sun, Moon, Users,
  Coffee, Wine, Cigarette, Dog, Home, Briefcase
} from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext'; // o el nombre correcto
import {supabase} from '../../lib/supabase'; // o el nombre correcto



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
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
      {icon}
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSave}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-900">{value}</p>
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
  const { user } = useAuth(); // o el nombre correcto
  const [profileData, setProfileData] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'info'>('photos');
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile data:', error);
        } else {
          setProfileData(data);
        }
      }
    };

    fetchProfileData();
  }, [user]);

   if (!isOpen || !profileData) return null;

  /*const [activeTab, setActiveTab] = useState<'photos' | 'info'>('photos');
    const [profileData, setProfileData] = useState<User>({
    id: '1',
    name: 'Alex Thompson',
    age: 27,
    email: 'alex@example.com',
    bio: 'Passionate about music, photography, and finding the perfect living space. Always up for good conversations and sharing creative ideas.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    interests: ['Photography', 'Music', 'Hiking', 'Cooking'],
    occupation: 'Software Engineer',
    languages: [
      { language: 'English', level: 'native' },
      { language: 'Spanish', level: 'intermediate' }
    ],
    preferences: {
      smoking: false,
      pets: true,
      schedule: 'early_bird',
      cleanliness: 4,
      noise: 3,
      guests: 'sometimes',
      diet: 'none',
      drinking: 'socially',
      socialLevel: 'balanced',
      workFromHome: true,
      maxRent: 1500,
      moveInDate: '2024-04-01',
      minStayDuration: 6
    },
    location: {
      city: 'San Francisco',
      area: 'Hayes Valley',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    },
    lifestyle: {
      hobbies: ['Photography', 'Hiking', 'Cooking'],
      music: ['Rock', 'Jazz', 'Electronic'],
      movies: ['Sci-fi', 'Documentary'],
      sports: ['Running', 'Yoga'],
      cooking: true,
      gaming: false,
      traveling: true
    },
    verification: {
      email: true,
      phone: true,
      government_id: true,
      student_id: false,
      social_media: ['linkedin', 'instagram']
    },
    email_verified: true, // Agregado
    phone_verified: true, // Agregado
    government_id_verified: true, // Agregado
    student_id_pending: false // Agregado
  });*/

  /*const [images, setImages] = useState([
    profileData.photoUrl,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4'
  ]);*/
  const [images, setImages] = useState<string[]>([]);
    useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
  
        if (error) {
          console.error('Error fetching profile data:', error);
        } else {
          // Mapea el campo si es necesario
          setProfileData({
            ...data,
            photoUrl: data.photo_url // <-- mapea si tu campo en la BD es photo_url
          });
        }
      }
    };
  
    fetchProfileData();
  }, [user]);
  if (!isOpen) return null;

  const handleImageUpload = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImages = [...images];
          newImages[index] = e.target?.result as string;
          setImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handlePreferenceChange = (key: keyof typeof profileData.preferences, value: any) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 p-6">
              <div className="flex flex-col items-center">
                <img
                  src={profileData.photoUrl}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <h2 className="mt-4 text-xl font-semibold">{profileData.name}</h2>
                <p className="text-gray-500">{profileData.age} years old</p>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{profileData.location.city}</span>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Profile Completion</h3>
                  <span className="text-indigo-600">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-gray-900 mb-4">Verification</h3>
                <div className="space-y-3">
                  {Object.entries(profileData.verification).map(([key, value]) => {
                    if (typeof value === 'boolean') {
                      return (
                        <div key={key} className={`flex items-center ${value ? 'text-green-600' : 'text-gray-400'}`}>
                          <Shield className="h-4 w-4 mr-2" />
                          <span className="text-sm capitalize">{key.replace('_', ' ')} {value ? 'Verified' : 'Pending'}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'photos'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'info'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Information
                </button>
              </div>

              {activeTab === 'photos' ? (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] group overflow-hidden rounded-lg"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => handleImageUpload(index)}
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Camera className="h-8 w-8 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <EditableField
                        label="Occupation"
                        value={profileData.occupation}
                        onSave={(value) => setProfileData(prev => prev ? { ...prev, occupation: value } : prev)}
                        icon={<Briefcase className="h-5 w-5 text-gray-400" />}
                      />
                      <EditableField
                        label="Location"
                        value={`${profileData.location.city}, ${profileData.location.area}`}
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
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">About Me</h3>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => prev ? { ...prev, bio: e.target.value } : prev)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={4}
                    />
                  </div>

                  {/* Preferences */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Living Preferences</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Habits */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Habits & Preferences</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { icon: <Cigarette className="h-5 w-5" />, label: 'Smoking', key: 'smoking' },
                            { icon: <Dog className="h-5 w-5" />, label: 'Pets', key: 'pets' },
                            { icon: <Wine className="h-5 w-5" />, label: 'Drinking', key: 'drinking' },
                            { icon: <Home className="h-5 w-5" />, label: 'Work from Home', key: 'workFromHome' }
                          ].map((pref) => (
                            <div
                              key={pref.key}
                              className={`p-4 rounded-lg border ${
                                profileData.preferences[pref.key as keyof typeof profileData.preferences]
                                  ? 'border-indigo-600 bg-indigo-50'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                {pref.icon}
                                <input
                                  type="checkbox"
                                  checked={profileData.preferences[pref.key as keyof typeof profileData.preferences] as boolean}
                                  onChange={(e) => handlePreferenceChange(pref.key as keyof typeof profileData.preferences, e.target.checked)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                              </div>
                              <p className="mt-2 text-sm font-medium text-gray-700">{pref.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Schedule and Cleanliness */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule Preference
                          </label>
                          <select
                            value={profileData.preferences.schedule}
                            onChange={(e) => handlePreferenceChange('schedule', e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="early_bird">Early Bird</option>
                            <option value="night_owl">Night Owl</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cleanliness Level
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={() => handlePreferenceChange('cleanliness', level)}
                                className={`p-2 rounded-md ${
                                  profileData.preferences.cleanliness >= level
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                <Star className="h-5 w-5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Languages</h3>
                    <div className="space-y-2">
                      {profileData.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md">
                          <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-400" />
                            <span className="font-medium">{lang.language}</span>
                          </div>
                          <span className="text-sm text-gray-500 capitalize">{lang.level}</span>
                        </div>
                      ))}
                      <button
                        className="w-full p-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:border-indigo-500 hover:text-indigo-600"
                      >
                        + Add Language
                      </button>
                    </div>
                  </div>

                  {/* Interests and Lifestyle */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Interests & Lifestyle</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                          <button className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-indigo-500 hover:text-indigo-600">
                            + Add Interest
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(profileData.lifestyle)
                            .filter(([_ , value]) => typeof value === 'boolean')
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className={`p-3 rounded-lg border ${
                                  value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="capitalize text-sm font-medium">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}