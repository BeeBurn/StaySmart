import React, { useState } from 'react';
import { MessageSquare, Mail, Smartphone, Send, Plus } from 'lucide-react';
import { mockMessages, mockBookings, messageTemplates } from '../data/mockData';
import { UserRole } from '../App';

interface MessagesViewProps {
  role: UserRole;
  userId: string;
}

export function MessagesView({ role, userId }: MessagesViewProps) {
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const messages = mockMessages;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return Mail;
      case 'SMS':
        return Smartphone;
      case 'WhatsApp':
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Email':
        return 'bg-blue-100 text-blue-700';
      case 'SMS':
        return 'bg-green-100 text-green-700';
      case 'WhatsApp':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Messages Automatiques</h1>
          <p className="text-gray-600">Gérez vos communications avec les voyageurs</p>
        </div>
        <button
          onClick={() => setShowSendMessage(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Send className="w-5 h-5" />
          Envoyer un message
        </button>
      </div>

      {/* Templates */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <h2 className="text-gray-900 mb-4">Templates de messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messageTemplates.map(template => {
            const Icon = getIcon(template.type);
            return (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getTypeColor(template.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-gray-900">{template.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(template.type)}`}>
                    {template.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{template.content}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Historique des messages</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun message envoyé
            </div>
          ) : (
            messages.map(message => {
              const Icon = getIcon(message.type);
              const booking = mockBookings.find(b => b.id === message.bookingId);
              return (
                <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(message.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-gray-900">{message.templateName}</p>
                          <p className="text-gray-600 text-sm">
                            {booking?.clientName} • {booking?.propertyName}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(message.type)}`}>
                            {message.type}
                          </span>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(message.sentAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <p className="text-gray-700 text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Send Message Modal */}
      {showSendMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-gray-900 mb-6">Envoyer un message</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Type de message</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sélectionner un type</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Template</label>
                <select 
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Sélectionner un template</option>
                  {messageTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Destinataire</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sélectionner une réservation</option>
                  {mockBookings.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.clientName} - {b.propertyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contenu du message..."
                  value={
                    selectedTemplate 
                      ? messageTemplates.find(t => t.id === selectedTemplate)?.content 
                      : ''
                  }
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSendMessage(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  alert('Message envoyé !');
                  setShowSendMessage(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}