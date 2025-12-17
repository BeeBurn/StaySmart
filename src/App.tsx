import React, { useState } from 'react';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { ClientDashboard } from './components/ClientDashboard';

export type UserRole = 'admin' | 'owner' | 'client';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  description: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  clientId: string;
  clientName: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Message {
  id: string;
  bookingId: string;
  type: 'SMS' | 'Email' | 'WhatsApp';
  templateName: string;
  content: string;
  sentAt: string;
}

export interface Document {
  id: string;
  bookingId: string;
  fileName: string;
  fileUrl: string;
  signed: boolean;
  uploadedAt: string;
}

export interface CheckIn {
  id: string;
  bookingId: string;
  checkinTime: string | null;
  checkoutTime: string | null;
  status: 'pending' | 'done';
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser.role === 'admin' && (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'owner' && (
        <OwnerDashboard user={currentUser} onLogout={handleLogout} />
      )}
      {currentUser.role === 'client' && (
        <ClientDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
