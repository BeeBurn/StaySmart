import React, { useState } from 'react';
import { LayoutDashboard, Calendar, MessageSquare, FileText, DoorOpen, LogOut, Home } from 'lucide-react';
import { User } from '../App';
import { DashboardOverview } from './DashboardOverview';
import { PlanningView } from './PlanningView';
import { MessagesView } from './MessagesView';
import { DocumentsView } from './DocumentsView';
import { CheckInOutView } from './CheckInOutView';
import { PropertiesView } from './PropertiesView';

interface OwnerDashboardProps {
  user: User;
  onLogout: () => void;
}

type TabType = 'dashboard' | 'properties' | 'planning' | 'messages' | 'documents' | 'checkin';

export function OwnerDashboard({ user, onLogout }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties' as const, label: 'Mes Logements', icon: Home },
    { id: 'planning' as const, label: 'Planning', icon: Calendar },
    { id: 'messages' as const, label: 'Messages', icon: MessageSquare },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'checkin' as const, label: 'Check-in/out', icon: DoorOpen }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-white mb-1">Espace Propriétaire</h2>
          <p className="text-emerald-200 text-sm">{user.name}</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-700 text-white'
                    : 'text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-200 hover:bg-emerald-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 overflow-auto">
        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardOverview role="owner" userId={user.id} />}
          {activeTab === 'properties' && <PropertiesView role="owner" userId={user.id} />}
          {activeTab === 'planning' && <PlanningView role="owner" userId={user.id} />}
          {activeTab === 'messages' && <MessagesView role="owner" userId={user.id} />}
          {activeTab === 'documents' && <DocumentsView role="owner" userId={user.id} />}
          {activeTab === 'checkin' && <CheckInOutView role="owner" userId={user.id} />}
        </div>
      </main>
    </div>
  );
}
