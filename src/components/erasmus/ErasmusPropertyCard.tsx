import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, GraduationCap, Wifi, Video } from 'lucide-react';
import { Property } from '../../types';

interface ErasmusPropertyCardProps {
  property: Property;
}

export function ErasmusPropertyCard({ property }: ErasmusPropertyCardProps) {
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
        <div className="absolute top-2 left-2">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Erasmus Friendly
          </span>
        </div>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        
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
          <div className="flex items-center">
            <GraduationCap className="h-4 w-4" />
            <span className="ml-1 text-sm">Student Area</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs flex items-center gap-1"
            >
              {amenity === 'WiFi' && <Wifi className="h-3 w-3" />}
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-2xl font-bold text-indigo-600">
            €{property.price}
            <span className="text-sm text-gray-500 font-normal">/month</span>
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            Contact
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}