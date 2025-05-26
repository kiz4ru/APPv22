import React from 'react';
import { motion } from 'framer-motion';

interface Country {
  code: string;
  name: string;
  flag: string;
  universities: string[];
}

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: string | null;
  onSelect: (countryCode: string) => void;
}

export function CountrySelector({ countries, selectedCountry, onSelect }: CountrySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {countries.map((country) => (
        <motion.button
          key={country.code}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(country.code)}
          className={`p-3 rounded-lg border transition-colors ${
            selectedCountry === country.code
              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
              : 'border-gray-200 hover:border-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{country.flag}</span>
            <span className="text-sm font-medium">{country.name}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}