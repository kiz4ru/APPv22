//import React from 'react';
import { User } from '../types';
import { Heart, MessageCircle, Star } from 'lucide-react';

interface UserCardProps {
  user: User;
  compatibilityScore: number;
}

export function UserCard({ user, compatibilityScore }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={user.photoUrl}
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-2">
          <div className="text-sm font-semibold text-indigo-600">
            {compatibilityScore}% Match
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{user.name}, {user.age}</h3>
          <div className="flex items-center text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm">4.8</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {user.interests.map((interest, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
            >
              {interest}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <button className="flex items-center text-gray-600 hover:text-indigo-600">
            <MessageCircle className="h-5 w-5" />
            <span className="ml-1 text-sm">Message</span>
          </button>
          <button className="flex items-center text-gray-600 hover:text-pink-600">
            <Heart className="h-5 w-5" />
            <span className="ml-1 text-sm">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}