import React, { useState } from 'react';
import { Users, Plus, Mail, Phone, Home, Edit, Trash2, RefreshCw, Copy, Check } from 'lucide-react';
import { mockProperties } from '../data/mockData';
import { UserRole } from '../App';

interface OwnersViewProps {
  role: UserRole;
  userId: string;
}

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  propertiesCount: number;
}

// Mock owners data
const mockOwners: Owner[] = [
  {
    id: '2',
    name: 'Jean Propriétaire',
    email: 'proprietaire@example.com',
    phone: '+33 6 12 34 56 78',
    createdAt: '2025-01-15',
    propertiesCount: 2
  },
  {
    id: '4',
    name: 'Sophie Dupont',
    email: 'sophie.dupont@example.com',
    phone: '+33 6 98 76 54 32',
    createdAt: '2025-02-10',
    propertiesCount: 1
  }
];

export function OwnersView({ role, userId }: OwnersViewProps) {
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [owners, setOwners] = useState<Owner[]>(mockOwners);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [passwordCopied, setPasswordCopied] = useState(false);

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%&*';
    
    let password = '';
    // Assurer au moins un de chaque type
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Remplir le reste
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mélanger le mot de passe
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setFormData({ ...formData, password });
  };

  const copyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOwner: Owner = {
      id: String(Date.now()),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      createdAt: new Date().toISOString().split('T')[0],
      propertiesCount: 0
    };

    setOwners([...owners, newOwner]);
    setFormData({ name: '', email: '', phone: '', password: '' });
    setShowAddOwner(false);
    alert('Propriétaire ajouté avec succès !');
  };

  const handleDelete = (ownerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) {
      setOwners(owners.filter(o => o.id !== ownerId));
      alert('Propriétaire supprimé');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Gestion des Propriétaires</h1>
          <p className="text-gray-600">Gérez les comptes propriétaires et leurs accès</p>
        </div>
        <button
          onClick={() => setShowAddOwner(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un propriétaire
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-gray-600">Total propriétaires</span>
          </div>
          <p className="text-gray-900">{owners.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Home className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-600">Total logements</span>
          </div>
          <p className="text-gray-900">{mockProperties.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-600">Nouveaux ce mois</span>
          </div>
          <p className="text-gray-900">
            {owners.filter(o => {
              const date = new Date(o.createdAt);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Owners List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Liste des propriétaires</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Propriétaire
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Logements
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {owners.map(owner => {
                const ownerProperties = mockProperties.filter(p => p.ownerId === owner.id);
                return (
                  <tr key={owner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-gray-900">{owner.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{owner.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{owner.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{ownerProperties.length}</span>
                        <span className="text-gray-600 text-sm">logement{ownerProperties.length > 1 ? 's' : ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {new Date(owner.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(owner.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Owner Modal */}
      {showAddOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-6">Ajouter un propriétaire</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Nom complet *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Mot de passe *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    minLength={6}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      title="Copier le mot de passe"
                    >
                      {passwordCopied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                      title="Générer un mot de passe"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">Minimum 6 caractères</p>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Générer un mot de passe sécurisé
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note :</strong> Un email de bienvenue avec les identifiants sera envoyé au propriétaire.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOwner(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}