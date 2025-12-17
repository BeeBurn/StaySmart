import React, { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  LayoutDashboard,
  Home,
  Calendar,
  MessageSquare,
  FileText,
  CheckSquare,
  BarChart3,
  LogOut,
  Plus,
} from 'lucide-react';

interface DashboardAdminProps {
  accessToken: string;
  profile: any;
  onLogout: () => void;
}

type View = 'overview' | 'properties' | 'bookings' | 'messages' | 'documents' | 'checkins' | 'stats';

export function DashboardAdmin({ accessToken, profile, onLogout }: DashboardAdminProps) {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchProperties();
    fetchBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02dccded/stats`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  const createProperty = async () => {
    const name = prompt('Nom du logement:');
    const address = prompt('Adresse:');
    const description = prompt('Description:');

    if (!name || !address) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02dccded/properties`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name, address, description }),
        }
      );

      if (response.ok) {
        await fetchProperties();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    if (properties.length === 0) {
      alert('Veuillez d\'abord créer un logement');
      return;
    }

    const property_id = properties[0].id;
    const client_name = prompt('Nom du client:');
    const client_email = prompt('Email du client:');
    const start_date = prompt('Date de début (YYYY-MM-DD):');
    const end_date = prompt('Date de fin (YYYY-MM-DD):');

    if (!client_name || !client_email || !start_date || !end_date) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-02dccded/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            property_id,
            client_name,
            client_email,
            start_date,
            end_date,
            status: 'confirmed',
          }),
        }
      );

      if (response.ok) {
        await fetchBookings();
        await fetchStats();
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview' as View, icon: LayoutDashboard, label: 'Vue d\'ensemble' },
    { id: 'properties' as View, icon: Home, label: 'Logements' },
    { id: 'bookings' as View, icon: Calendar, label: 'Réservations' },
    { id: 'messages' as View, icon: MessageSquare, label: 'Messages' },
    { id: 'documents' as View, icon: FileText, label: 'Documents' },
    { id: 'checkins' as View, icon: CheckSquare, label: 'Check-in/out' },
    { id: 'stats' as View, icon: BarChart3, label: 'Statistiques' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-indigo-900 text-white w-full md:w-64 p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-white mb-1">ConciergePro</h1>
          <p className="text-indigo-200 text-sm">
            {profile?.name}
            <span className="block text-xs text-indigo-300 mt-1">
              {profile?.role === 'admin' ? 'Administrateur' : 'Propriétaire'}
            </span>
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
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-100 hover:bg-indigo-800'
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition-colors mt-8"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {currentView === 'overview' && (
          <div>
            <h2 className="mb-6">Tableau de bord</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Logements</span>
                  <Home className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-gray-900">{stats?.total_properties || 0}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Réservations</span>
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-900">{stats?.total_bookings || 0}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Documents signés</span>
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-gray-900">
                  {stats?.signed_documents || 0} / {stats?.total_documents || 0}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Messages envoyés</span>
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-gray-900">{stats?.total_messages || 0}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-gray-900 mb-4">Réservations récentes</h3>
              {bookings.length === 0 ? (
                <p className="text-gray-500">Aucune réservation pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-900">{booking.client_name}</p>
                        <p className="text-gray-500 text-sm">{booking.client_email}</p>
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
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'properties' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Logements</h2>
              <button
                onClick={createProperty}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                Ajouter un logement
              </button>
            </div>

            {properties.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Aucun logement pour le moment</p>
                <button
                  onClick={createProperty}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Créer votre premier logement
                </button>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Réservations</h2>
              <button
                onClick={createBooking}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                Nouvelle réservation
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Aucune réservation pour le moment</p>
                <button
                  onClick={createBooking}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Créer votre première réservation
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700">Client</th>
                        <th className="px-6 py-3 text-left text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-gray-700">Dates</th>
                        <th className="px-6 py-3 text-left text-gray-700">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900">{booking.client_name}</td>
                          <td className="px-6 py-4 text-gray-600">{booking.client_email}</td>
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
                      ))}
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
                Fonctionnalité de messages automatiques en cours de développement
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Vous pourrez créer des templates SMS/Email/WhatsApp et configurer des déclencheurs automatiques
              </p>
            </div>
          </div>
        )}

        {currentView === 'documents' && (
          <div>
            <h2 className="text-gray-900 mb-6">Documents voyageurs</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500">
                Fonctionnalité de gestion documentaire en cours de développement
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Upload, signature électronique, et historique des documents
              </p>
            </div>
          </div>
        )}

        {currentView === 'checkins' && (
          <div>
            <h2 className="text-gray-900 mb-6">Check-in / Check-out</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-500">
                Fonctionnalité de check-in/out automatisé en cours de développement
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Notifications automatiques et guides digitaux pour les voyageurs
              </p>
            </div>
          </div>
        )}

        {currentView === 'stats' && (
          <div>
            <h2 className="text-gray-900 mb-6">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-900 mb-4">Réservations</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-gray-900">{stats?.total_bookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confirmées</span>
                    <span className="text-green-600">{stats?.confirmed_bookings || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En attente</span>
                    <span className="text-yellow-600">{stats?.pending_bookings || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-gray-900 mb-4">Documents</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-gray-900">{stats?.total_documents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Signés</span>
                    <span className="text-green-600">{stats?.signed_documents || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En attente</span>
                    <span className="text-yellow-600">
                      {(stats?.total_documents || 0) - (stats?.signed_documents || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
