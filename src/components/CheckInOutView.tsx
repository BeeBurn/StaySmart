import React, { useState } from 'react';
import { DoorOpen, DoorClosed, Bell, MapPin, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import { mockCheckIns, mockBookings } from '../data/mockData';
import { UserRole } from '../App';

interface CheckInOutViewProps {
  role: UserRole;
  userId: string;
}

export function CheckInOutView({ role, userId }: CheckInOutViewProps) {
  const [showGuideModal, setShowGuideModal] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Check-in / Check-out</h1>
        <p className="text-gray-600">
          Gérez les arrivées et départs, envoyez des notifications automatiques
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DoorOpen className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-600">Check-ins à venir</span>
          </div>
          <p className="text-gray-900">
            {mockCheckIns.filter(ci => ci.status === 'pending' && !ci.checkoutTime).length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-600">Check-ins effectués</span>
          </div>
          <p className="text-gray-900">
            {mockCheckIns.filter(ci => ci.status === 'done').length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <DoorClosed className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-600">Check-outs à venir</span>
          </div>
          <p className="text-gray-900">
            {mockCheckIns.filter(ci => ci.checkinTime && !ci.checkoutTime).length}
          </p>
        </div>
      </div>

      {/* Check-ins List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-gray-900">Arrivées et départs</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Bell className="w-4 h-4" />
            Envoyer notifications
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {mockCheckIns.map(checkIn => {
            const booking = mockBookings.find(b => b.id === checkIn.bookingId);
            if (!booking) return null;

            return (
              <div key={checkIn.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    checkIn.status === 'done' 
                      ? 'bg-green-100' 
                      : 'bg-yellow-100'
                  }`}>
                    <DoorOpen className={`w-6 h-6 ${
                      checkIn.status === 'done' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 mb-1">{booking.propertyName}</h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <User className="w-4 h-4" />
                          <span>{booking.clientName}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        checkIn.status === 'done'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {checkIn.status === 'done' ? 'Effectué' : 'En attente'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <DoorOpen className="w-4 h-4" />
                          <span className="text-sm">Check-in</span>
                        </div>
                        <p className="text-gray-900 text-sm">
                          {new Date(booking.startDate).toLocaleDateString('fr-FR')} à 15:00
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-purple-600 mb-1">
                          <DoorClosed className="w-4 h-4" />
                          <span className="text-sm">Check-out</span>
                        </div>
                        <p className="text-gray-900 text-sm">
                          {new Date(booking.endDate).toLocaleDateString('fr-FR')} à 11:00
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                        <Bell className="w-4 h-4 inline mr-1" />
                        Envoyer rappel
                      </button>
                      <button 
                        onClick={() => setShowGuideModal(true)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Voir guide digital
                      </button>
                      {checkIn.status === 'pending' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Marquer comme effectué
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Automated Notifications Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Notifications automatiques</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-900">Rappel 24h avant check-in</p>
                <p className="text-gray-600 text-sm">
                  Envoyer instructions et code d'accès
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-900">Message de bienvenue</p>
                <p className="text-gray-600 text-sm">
                  Envoyer lors du check-in
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <DoorClosed className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-900">Instructions check-out</p>
                <p className="text-gray-600 text-sm">
                  Envoyer le matin du départ
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Guide Digital Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-gray-900">Guide Digital du Voyageur</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-gray-900 mb-2">Informations d'accès</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <strong>Code d'accès :</strong> 4582
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>WiFi :</strong> MaisonParis / password123
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 mb-2">Équipements</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Cuisine équipée</li>
                  <li>✓ Lave-linge</li>
                  <li>✓ TV et Netflix</li>
                  <li>✓ Chauffage central</li>
                </ul>
              </div>

              <div>
                <h4 className="text-gray-900 mb-2">Recommandations locales</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm">Boulangerie du coin</p>
                      <p className="text-gray-600 text-xs">5 min à pied - Meilleure baguette du quartier</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm">Restaurant Le Marais</p>
                      <p className="text-gray-600 text-xs">10 min à pied - Cuisine française authentique</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 mb-2">Contact d'urgence</h4>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm">
                    En cas d'urgence, contactez-nous au : <strong>+33 6 12 34 56 78</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
