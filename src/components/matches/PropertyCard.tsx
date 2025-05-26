import React from 'react';
import { Property } from '../../types';
import { MapPin, Bed, Bath, Heart, Star, Video } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  onLike: () => void;
  isLiked: boolean;
}

export function PropertyCard({ property, onLike, isLiked }: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onLike}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-colors ${
            isLiked
              ? 'bg-pink-600 text-white'
              : 'bg-white text-gray-600 hover:text-pink-600'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </motion.button>
        {property.virtualTourUrl && (
          <a
            href={property.virtualTourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/75 text-white px-3 py-1 rounded-full text-sm hover:bg-black/90 transition-colors"
          >
            <Video className="h-4 w-4" />
            <span>Virtual Tour</span>
          </a>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
            <div className="flex items-center text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm text-gray-600">5.0</span>
            </div>
          </div>
          <span className="text-lg font-bold text-indigo-600">
            ${property.price.toLocaleString()}/mo
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="ml-1 text-sm truncate">{property.location.address}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4" />
            <span className="ml-1 text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4" />
            <span className="ml-1 text-sm">{property.bathrooms} Baths</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {property.amenities.map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}