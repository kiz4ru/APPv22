//import React from 'react';
import { Property } from '../types';
import { MapPin, Bed, Bath, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:text-pink-600">
          <Heart className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{property.title}</h3>
          <span className="text-lg font-bold text-indigo-600">
            ${property.price}/mo
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="ml-1 text-sm">{property.location.address}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4" />
            <span className="ml-1 text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4" />
            <span className="ml-1 text-sm">{property.bathrooms} Baths</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}