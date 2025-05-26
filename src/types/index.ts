// Extending the User interface with more detailed preferences and profile information
export interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  bio: string;
  photoUrl: string;
  interests: string[];
  occupation: string;
  languages: {
    language: string;
    level: 'basic' | 'intermediate' | 'fluent' | 'native';
  }[];
  preferences: {
    smoking: boolean;
    pets: boolean;
    schedule: 'early_bird' | 'night_owl' | 'flexible';
    cleanliness: 1 | 2 | 3 | 4 | 5;
    noise: 1 | 2 | 3 | 4 | 5;
    guests: 'rarely' | 'sometimes' | 'often';
    diet: 'none' | 'vegetarian' | 'vegan' | 'kosher' | 'halal';
    drinking: 'never' | 'socially' | 'regularly';
    socialLevel: 'very_private' | 'balanced' | 'very_social';
    workFromHome: boolean;
    maxRent: number;
    moveInDate: string;
    minStayDuration: number;
  };
  location: {
    city: string;
    area: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  lifestyle: {
    hobbies: string[];
    music: string[];
    movies: string[];
    sports: string[];
    cooking: boolean;
    gaming: boolean;
    traveling: boolean;
  };
  verification: {
    email: boolean;
    phone: boolean;
    government_id: boolean;
    student_id?: boolean;
    social_media?: string[];
  };
  email_verified: boolean;
  phone_verified: boolean;
  government_id_verified: boolean;
  student_id_pending: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    area: string;
  };
  amenities: string[];
  images: string[];
  bedrooms: number;
  bathrooms: number;
  available: boolean;
  virtualTourUrl?: string;
}