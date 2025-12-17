import React, { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  LayoutDashboard,
  Home,
  Calendar,
  MessageSquare,
  FileText,
  CheckSquare,
  LogOut,
} from 'lucide-react';

interface DashboardOwnerProps {
  accessToken: string;
  profile: any;
  onLogout: () => void;
}

type View = 'overview' | 'properties' | 'bookings' | 'messages' | 'documents';

export function DashboardOwner({ accessToken, profile, onLogout }: DashboardOwnerProps) {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02dccded/properties`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02dccded/bookings`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const menuItems = [
    { id: 'overview' as View, icon: LayoutDashboard, label: 'Vue d\'ensemble' },
    { id: 'properties' as View, icon: Home, label: 'Mes logements' },
    { id: 'bookings' as View, icon: Calendar, label: 'Planning' },
    { id: 'messages' as View, icon: MessageSquare, label: 'Messages' },
    { id: 'documents' as View, icon: FileText, label: 'Documents' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-emerald-900 text-white w-full md:w-64 p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-white mb-1">ConciergePro</h1>
          <p className="text-emerald-200 text-sm">
            {profile?.name}
            <span className="block text-xs text-emerald-300 mt-1">Propriétaire</span>
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100 hover:bg-emerald-800 transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {currentView === 'overview' && (
          <div>
            <h2 className="mb-6">Mon tableau de bord</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Mes logements</span>
                  <Home className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-gray-900">{properties.length}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Réservations</span>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-900">{bookings.length}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Confirmées</span>
                  <CheckSquare className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-900">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </p>
              </div>
            </div>

            {bookings.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-900 mb-4">Prochaines réservations</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => {
                    const property = properties.find((p) => p.id === booking.property_id);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-gray-900">{booking.client_name}</p>
                          <p className="text-gray-500 text-sm">{property?.name || 'Logement'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 text-sm">
                            {new Date(booking.start_date).toLocaleDateString('fr-FR')} -{' '}
                            {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'properties' && (
          <div>
            <h2 className="text-gray-900 mb-6">Mes logements</h2>

            {properties.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun logement pour le moment</p>
                <p className="text-gray-400 text-sm mt-2">
                  Contactez votre administrateur pour ajouter des logements
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-gray-900 mb-2">{property.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{property.address}</p>
                    {property.description && (
                      <p className="text-gray-500 text-sm">{property.description}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-600 text-sm">
                        Réservations:{' '}
                        <span className="text-gray-900">
                          {bookings.filter((b) => b.property_id === property.id).length}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'bookings' && (
          <div>
            <h2 className="text-gray-900 mb-6">Planning des réservations</h2>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune réservation pour le moment</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700">Logement</th>
                        <th className="px-6 py-3 text-left text-gray-700">Client</th>
                        <th className="px-6 py-3 text-left text-gray-700">Dates</th>
                        <th className="px-6 py-3 text-left text-gray-700">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => {
                        const property = properties.find((p) => p.id === booking.property_id);
                        return (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-gray-900">{property?.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-900">{booking.client_name}</td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(booking.start_date).toLocaleDateString('fr-FR')} -{' '}
                              {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 text-sm rounded-full ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'messages' && (
          <div>
            <h2 className="text-gray-900 mb-6">Messages automatiques</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500">
                Configurez vos templates de messages automatiques
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Envoi automatique lors de la confirmation, 24h avant le check-in, etc.
              </p>
            </div>
          </div>
        )}

        {currentView === 'documents' && (
          <div>
            <h2 className="text-gray-900 mb-6">Documents voyageurs</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500">Gérez les documents de vos voyageurs</p>
              <p className="text-gray-400 text-sm mt-2">
                Upload, signature électronique, et suivi des documents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
