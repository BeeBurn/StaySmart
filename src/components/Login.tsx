import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { User } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Mock users database
const mockUsers = [
  {
    id: '1',
    email: 'admin@conciergerie.com',
    password: 'admin123',
    role: 'admin' as const,
    name: 'Admin Conciergerie'
  },
  {
    id: '2',
    email: 'proprietaire@example.com',
    password: 'owner123',
    role: 'owner' as const,
    name: 'Jean Propriétaire'
  },
  {
    id: '3',
    email: 'client@example.com',
    password: 'client123',
    role: 'client' as const,
    name: 'Marie Voyageur'
  }
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      onLogin({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-3 rounded-full">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-center text-gray-900 mb-2">
            Plateforme Conciergerie
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Connectez-vous à votre compte
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Se connecter
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Comptes de démonstration :</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setEmail('admin@conciergerie.com');
                  setPassword('admin123');
                  const user = mockUsers.find(u => u.email === 'admin@conciergerie.com');
                  if (user) {
                    onLogin({
                      id: user.id,
                      email: user.email,
                      role: user.role,
                      name: user.name
                    });
                  }
                }}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-3 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Admin / Conciergerie</p>
                    <p className="text-xs text-indigo-600">Accès complet à tous les logements</p>
                  </div>
                  <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Connexion rapide</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setEmail('proprietaire@example.com');
                  setPassword('owner123');
                  const user = mockUsers.find(u => u.email === 'proprietaire@example.com');
                  if (user) {
                    onLogin({
                      id: user.id,
                      email: user.email,
                      role: user.role,
                      name: user.name
                    });
                  }
                }}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-3 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Propriétaire</p>
                    <p className="text-xs text-emerald-600">Accès à vos logements uniquement</p>
                  </div>
                  <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">Connexion rapide</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setEmail('client@example.com');
                  setPassword('client123');
                  const user = mockUsers.find(u => u.email === 'client@example.com');
                  if (user) {
                    onLogin({
                      id: user.id,
                      email: user.email,
                      role: user.role,
                      name: user.name
                    });
                  }
                }}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Client / Voyageur</p>
                    <p className="text-xs text-blue-600">Accès à vos réservations et documents</p>
                  </div>
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Connexion rapide</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}