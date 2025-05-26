//import React from 'react';
import { Star, MessageCircle, Heart } from 'lucide-react';
import { User } from '../../types';
import { motion } from 'framer-motion';

interface MatchCardProps {
  user: User;
  matchPercentage: number;
  onMessage: () => void;
  onLike: () => void;
  isLiked: boolean;
}

export function MatchCard({ user, matchPercentage, onMessage, onLike, isLiked }: MatchCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative">
        <img
          src={user.photoUrl}
          alt={user.name}
          className="w-full h-64 object-cover"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md"
        >
          <span className="text-indigo-600 font-semibold">{matchPercentage}% Match</span>
        </motion.div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {user.name}, {user.age}
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1">4.8</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-gray-600 line-clamp-2">{user.bio}</p>

          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.05 }}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
              >
                {interest}
              </motion.span>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMessage}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Message</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isLiked
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>Like</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}