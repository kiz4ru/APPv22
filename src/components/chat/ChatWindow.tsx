import React, { useState } from 'react';
import { X, Send, Search, Phone, Video, MoreHorizontal, Smile } from 'lucide-react';
import { User } from '../../types';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

// Sample data for demonstration
const sampleContacts: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Creative professional',
    age: 25,
    email: 'sarah@example.com',
    interests: ['Art', 'Music'],
    occupation: 'Graphic Designer',
    languages: [
      { language: 'English', level: 'native' },
      { language: 'Spanish', level: 'intermediate' }
    ],
    preferences: {
      smoking: false,
      pets: true,
      schedule: 'early_bird',
      cleanliness: 5,
      noise: 3,
      guests: 'sometimes',
      diet: 'vegetarian',
      drinking: 'socially',
      socialLevel: 'balanced',
      workFromHome: true,
      maxRent: 1200,
      moveInDate: '2024-05-01',
      minStayDuration: 6
    },
    location: {
      city: 'San Francisco',
      area: 'Mission'
    },
    lifestyle: {
      hobbies: ['painting', 'yoga'],
      music: ['Jazz', 'Classical'],
      movies: ['Drama', 'Documentary'],
      sports: ['Yoga', 'Running'],
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
    email_verified: true,
    phone_verified: true,
    government_id_verified: true,
    student_id_pending: false
  },
  {
    id: '2',
    name: 'John Doe',
    photoUrl: 'https://images.unsplash.com/photo-1502767089025-6572583495b9',
    bio: 'Tech enthusiast',
    age: 30,
    email: 'john@example.com',
    interests: ['Gaming', 'Tech'],
    occupation: 'Software Engineer',
    languages: [
      { language: 'English', level: 'native' },
      { language: 'German', level: 'basic' }
    ],
    preferences: {
      smoking: false,
      pets: false,
      schedule: 'night_owl',
      cleanliness: 4,
      noise: 2,
      guests: 'rarely',
      diet: 'none',
      drinking: 'never',
      socialLevel: 'very_private',
      workFromHome: false,
      maxRent: 1500,
      moveInDate: '2024-06-01',
      minStayDuration: 3
    },
    location: {
      city: 'San Francisco',
      area: 'SoMa'
    },
    lifestyle: {
      hobbies: ['gaming', 'coding'],
      music: ['Rock', 'Electronic'],
      movies: ['Sci-fi', 'Action'],
      sports: ['Basketball', 'Swimming'],
      cooking: false,
      gaming: true,
      traveling: false
    },
    verification: {
      email: true,
      phone: true,
      government_id: true,
      student_id: false,
      social_media: ['twitter']
    },
    email_verified: true,
    phone_verified: true,
    government_id_verified: true,
    student_id_pending: false
  }
];
const sampleMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    text: 'Hi! I saw your profile and I think wed be great roommates. Are you still looking?',
    timestamp: new Date('2024-03-10T10:00:00')
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Hey Sarah! Yes, I am! I loved your profile too. Your cleanliness preferences match mine perfectly.',
    timestamp: new Date('2024-03-10T10:05:00')
  }
];

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [selectedContact, setSelectedContact] = useState<User | null>(sampleContacts[0]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredContacts = sampleContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-[800px] h-[600px] bg-white rounded-lg shadow-xl flex overflow-hidden z-50">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-73px)]">
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedContact?.id === contact.id ? 'bg-blue-50' : ''
              }`}
            >
              <img
                src={contact.photoUrl}
                alt={contact.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-500 truncate">{contact.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center">
                <img
                  src={selectedContact.photoUrl}
                  alt={selectedContact.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedContact.location.area}, {selectedContact.location.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-blue-600">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="text-gray-600 hover:text-blue-600">
                  <Video className="h-5 w-5" />
                </button>
                <button className="text-gray-600 hover:text-blue-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Smile className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}