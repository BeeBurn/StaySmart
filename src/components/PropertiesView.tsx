import React, { useState } from 'react';
import { Home, MapPin, Plus, Edit, Eye } from 'lucide-react';
import { mockProperties, mockBookings } from '../data/mockData';
import { UserRole } from '../App';

interface PropertiesViewProps {
  role: UserRole;
  userId: string;
}

export function PropertiesView({ role, userId }: PropertiesViewProps) {
  const [showAddProperty, setShowAddProperty] = useState(false);

  const properties = role === 'owner' 
    ? mockProperties.filter(p => p.ownerId === userId)
    : mockProperties;

  const getPropertyStats = (propertyId: string) => {
    const propertyBookings = mockBookings.filter(b => b.propertyId === propertyId);
    return {
      totalBookings: propertyBookings.length,
      confirmed: propertyBookings.filter(b => b.status === 'confirmed').length,
      pending: propertyBookings.filter(b => b.status === 'pending').length
    };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">
            {role === 'owner' ? 'Mes Logements' : 'Tous les Logements'}
          </h1>
          <p className="text-gray-600">Gérez votre portfolio de logements</p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowAddProperty(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Ajouter un logement
          </button>
        )}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {properties.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">Aucun logement</h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier logement
            </p>
            {role === 'admin' && (
              <button
                onClick={() => setShowAddProperty(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ajouter un logement
              </button>
            )}
          </div>
        ) : (
          properties.map(property => {
            const stats = getPropertyStats(property.id);
            return (
              <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Property Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <Home className="w-16 h-16 text-white opacity-50" />
                </div>

                <div className="p-6">
                  <h3 className="text-gray-900 mb-2">{property.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.address}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-6">
                    {property.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-gray-900 mb-1">{stats.totalBookings}</p>
                      <p className="text-gray-600 text-xs">Réservations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-600 mb-1">{stats.confirmed}</p>
                      <p className="text-gray-600 text-xs">Confirmées</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-600 mb-1">{stats.pending}</p>
                      <p className="text-gray-600 text-xs">En attente</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4" />
                      Voir
                    </button>
                    {role === 'admin' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-gray-900 mb-6">Ajouter un logement</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Nom du logement</label>
                <input
                  type="text"
                  placeholder="Ex: Appartement Marais"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  placeholder="15 Rue de Turenne, 75003 Paris"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Description du logement..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Propriétaire</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sélectionner un propriétaire</option>
                  <option value="2">Jean Propriétaire</option>
                  <option value="4">Autre Propriétaire</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Capacité</label>
                  <input
                    type="number"
                    placeholder="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Chambres</label>
                  <input
                    type="number"
                    placeholder="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddProperty(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  alert('Logement ajouté !');
                  setShowAddProperty(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
