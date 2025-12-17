import React from 'react';
import { FileText, MapPin, Calendar, LogOut, CheckCircle, Clock } from 'lucide-react';
import { User } from '../App';
import { mockBookings, mockDocuments, mockCheckIns } from '../data/mockData';

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
}

export function ClientDashboard({ user, onLogout }: ClientDashboardProps) {
  const userBookings = mockBookings.filter(b => b.clientId === user.id);
  const userDocs = mockDocuments.filter(doc => 
    userBookings.some(b => b.id === doc.bookingId)
  );
  const userCheckIns = mockCheckIns.filter(ci => 
    userBookings.some(b => b.id === ci.bookingId)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Bienvenue, {user.name}</h1>
            <p className="text-gray-600 text-sm">Gérez vos réservations et documents</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Réservations */}
        <section className="mb-8">
          <h2 className="text-gray-900 mb-4">Mes Réservations</h2>
          <div className="grid gap-4">
            {userBookings.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Aucune réservation
              </div>
            ) : (
              userBookings.map(booking => {
                const checkIn = userCheckIns.find(ci => ci.bookingId === booking.id);
                return (
                  <div key={booking.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-gray-900 mb-1">{booking.propertyName}</h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>Paris, France</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {booking.status === 'confirmed' ? 'Confirmé' : 
                         booking.status === 'pending' ? 'En attente' : 'Annulé'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-gray-700 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.startDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.endDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {checkIn && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                        {checkIn.status === 'done' ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Check-in effectué le {new Date(checkIn.checkinTime!).toLocaleDateString('fr-FR')}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span>Check-in prévu le {new Date(booking.startDate).toLocaleDateString('fr-FR')} à 15h00</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Documents */}
        <section className="mb-8">
          <h2 className="text-gray-900 mb-4">Mes Documents</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {userDocs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucun document disponible
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {userDocs.map(doc => {
                  const booking = userBookings.find(b => b.id === doc.bookingId);
                  return (
                    <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-900">{doc.fileName}</p>
                          <p className="text-sm text-gray-600">
                            {booking?.propertyName} • {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {doc.signed ? (
                          <span className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Signé
                          </span>
                        ) : (
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Signer le document
                          </button>
                        )}
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Télécharger
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Guide digital */}
        <section>
          <h2 className="text-gray-900 mb-4">Guides Digitaux</h2>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-white mb-2">Guide du Voyageur</h3>
            <p className="text-indigo-100 mb-6">
              Découvrez tous les conseils et informations pour profiter de votre séjour
            </p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Consulter le guide
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
