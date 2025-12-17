import React, { useState } from 'react';
import { Calendar, Plus, MapPin, User, Clock } from 'lucide-react';
import { mockBookings, mockProperties } from '../data/mockData';
import { UserRole } from '../App';

interface PlanningViewProps {
  role: UserRole;
  userId: string;
}

export function PlanningView({ role, userId }: PlanningViewProps) {
  const [showAddBooking, setShowAddBooking] = useState(false);

  const properties = role === 'owner' 
    ? mockProperties.filter(p => p.ownerId === userId)
    : mockProperties;
  
  const bookings = role === 'owner'
    ? mockBookings.filter(b => properties.some(p => p.id === b.propertyId))
    : mockBookings;

  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const getDuration = (start: string, end: string) => {
    const days = Math.ceil(
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} ${days > 1 ? 'nuits' : 'nuit'}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Planning des Réservations</h1>
          <p className="text-gray-600">Gérez vos réservations et disponibilités</p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowAddBooking(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle réservation
          </button>
        )}
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <h2 className="text-gray-900">Calendrier</h2>
        </div>
        
        {/* Simple timeline view */}
        <div className="space-y-4">
          {properties.map(property => {
            const propertyBookings = sortedBookings.filter(b => b.propertyId === property.id);
            return (
              <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-900 mb-3">{property.name}</h3>
                <div className="space-y-2">
                  {propertyBookings.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune réservation</p>
                  ) : (
                    propertyBookings.map(booking => (
                      <div
                        key={booking.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          booking.status === 'confirmed'
                            ? 'bg-green-50 border-green-500'
                            : 'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-gray-900 text-sm">{booking.clientName}</p>
                              <div className="flex items-center gap-2 text-gray-600 text-xs mt-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(booking.startDate).toLocaleDateString('fr-FR')} - {new Date(booking.endDate).toLocaleDateString('fr-FR')}
                                </span>
                                <span>• {getDuration(booking.startDate, booking.endDate)}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* List View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Liste des réservations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Logement
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{booking.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{booking.propertyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {new Date(booking.startDate).toLocaleDateString('fr-FR')} - {new Date(booking.endDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {getDuration(booking.startDate, booking.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status === 'confirmed' ? 'Confirmé' : 
                       booking.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Booking Modal */}
      {showAddBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-4">Nouvelle Réservation</h3>
            <p className="text-gray-600 text-sm mb-6">
              Formulaire d'ajout de réservation (à implémenter)
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddBooking(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowAddBooking(false)}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
