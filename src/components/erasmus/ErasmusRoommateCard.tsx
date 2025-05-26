import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, MessageCircle, Globe2 } from 'lucide-react';
import { User } from '../../types';

interface ErasmusRoommateCardProps {
  student: User & { university: string; studyProgram: string };
}

export function ErasmusRoommateCard({ student }: ErasmusRoommateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative">
        <img
          src={student.photoUrl}
          alt={student.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-xl font-semibold text-white">
            {student.name}, {student.age}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <GraduationCap className="h-4 w-4" />
          <span className="text-sm">{student.university}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Globe2 className="h-4 w-4" />
          <span className="text-sm">{student.studyProgram}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{student.location.city}, {student.location.area}</span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{student.bio}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {student.interests.map((interest, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
            >
              {interest}
            </span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Connect</span>
        </motion.button>
      </div>
    </motion.div>
  );
}