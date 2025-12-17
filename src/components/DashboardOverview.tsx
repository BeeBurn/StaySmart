import React from 'react';
import { Home, Calendar, FileCheck, Users, TrendingUp, Clock, Euro, BarChart3, Activity, CheckCircle, Building2, UserCheck, AlertCircle } from 'lucide-react';
import { mockProperties, mockBookings, mockDocuments, mockCheckIns } from '../data/mockData';
import { UserRole } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardOverviewProps {
  role: UserRole;
  userId: string;
}

export function DashboardOverview({ role, userId }: DashboardOverviewProps) {
  const properties = role === 'owner' 
    ? mockProperties.filter(p => p.ownerId === userId)
    : mockProperties;
  
  const bookings = role === 'owner'
    ? mockBookings.filter(b => properties.some(p => p.id === b.propertyId))
    : mockBookings;

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  
  const documents = mockDocuments.filter(d => 
    bookings.some(b => b.id === d.bookingId)
  );
  const signedDocs = documents.filter(d => d.signed).length;

  const upcomingCheckIns = mockCheckIns.filter(ci => 
    ci.status === 'pending' && bookings.some(b => b.id === ci.bookingId)
  );

  // Calculate revenue statistics
  const calculateRevenue = () => {
    const basePrice = 150; // Prix moyen par nuit
    let totalRevenue = 0;
    let monthlyRevenue = 0;
    
    bookings.forEach(booking => {
      if (booking.status === 'confirmed') {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const revenue = nights * basePrice;
        totalRevenue += revenue;
        
        // Check if booking is this month
        const now = new Date();
        if (start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear()) {
          monthlyRevenue += revenue;
        }
      }
    });
    
    return { total: totalRevenue, monthly: monthlyRevenue };
  };

  const revenue = calculateRevenue();

  // Calculate occupancy rate
  const calculateOccupancyRate = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const totalAvailableDays = properties.length * daysInMonth;
    
    let occupiedDays = 0;
    bookings.forEach(booking => {
      if (booking.status === 'confirmed') {
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        if (start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear()) {
          const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          occupiedDays += nights;
        }
      }
    });
    
    return totalAvailableDays > 0 ? Math.round((occupiedDays / totalAvailableDays) * 100) : 0;
  };

  const occupancyRate = calculateOccupancyRate();

  // Data for monthly bookings chart - filtered by role
  const getMonthlyData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    const monthlyStats = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];
      
      // Count bookings for this month
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.startDate);
        return bookingDate.getMonth() === monthIndex;
      });
      
      // Calculate revenue for this month
      const basePrice = 150;
      let monthRevenue = 0;
      monthBookings.forEach(booking => {
        if (booking.status === 'confirmed') {
          const start = new Date(booking.startDate);
          const end = new Date(booking.endDate);
          const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          monthRevenue += nights * basePrice;
        }
      });
      
      monthlyStats.push({
        name: monthName,
        reservations: monthBookings.length,
        revenus: monthRevenue
      });
    }
    
    return monthlyStats;
  };

  const monthlyData = getMonthlyData();

  // Data for property performance pie chart - filtered by role
  const propertyPerformance = properties.slice(0, 4).map(property => {
    const propertyBookings = bookings.filter(b => b.propertyId === property.id && b.status === 'confirmed');
    return {
      name: property.name.length > 20 ? property.name.substring(0, 20) + '...' : property.name,
      value: propertyBookings.length
    };
  }).filter(p => p.value > 0); // Only show properties with bookings

  const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

  // Admin-specific stats
  const totalOwners = 2; // Nombre de propriétaires
  const avgBookingsPerProperty = Math.round(mockBookings.length / mockProperties.length);
  const pendingDocuments = mockDocuments.filter(d => !d.signed).length;

  // Owner-specific stats
  const myPropertiesNames = properties.map(p => p.name);
  const averageRevenuePerNight = properties.length > 0 ? Math.round(revenue.total / properties.length / 30) : 0;

  if (role === 'admin') {
    // ADMIN DASHBOARD - Global platform view
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Dashboard Admin - Plateforme</h1>
          <p className="text-gray-600">Vue d'ensemble de toute l'activité de la plateforme</p>
        </div>

        {/* Admin Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">+2 ce mois</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Propriétaires actifs</p>
            <p className="text-gray-900">{totalOwners}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total logements</p>
            <p className="text-gray-900">{mockProperties.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total réservations</p>
            <p className="text-gray-900">{mockBookings.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-500 p-3 rounded-lg">
                <Euro className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">+15%</span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Revenus totaux</p>
            <p className="text-gray-900">{revenue.total.toLocaleString('fr-FR')}€</p>
          </div>
        </div>

        {/* Admin Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Taux d'occupation global</span>
            </div>
            <p className="text-gray-900 mb-1">{occupancyRate}%</p>
            <p className="text-xs text-gray-500">{occupancyRate > 70 ? 'Performance excellente' : 'Performance bonne'}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">En attente validation</span>
            </div>
            <p className="text-gray-900 mb-1">{pendingBookings.length}</p>
            <p className="text-xs text-gray-500">réservations à traiter</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileCheck className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Documents en attente</span>
            </div>
            <p className="text-gray-900 mb-1">{pendingDocuments}</p>
            <p className="text-xs text-gray-500">signatures requises</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Moyenne par logement</span>
            </div>
            <p className="text-gray-900 mb-1">{avgBookingsPerProperty}</p>
            <p className="text-xs text-gray-500">réservations/logement</p>
          </div>
        </div>

        {/* Admin Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 mb-1">Performance globale</h3>
                <p className="text-sm text-gray-500">Réservations par mois (plateforme)</p>
              </div>
              <BarChart3 className="w-5 h-5 text-indigo-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="reservations" fill="#6366f1" radius={[8, 8, 0, 0]} name="Réservations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 mb-1">Revenus plateforme</h3>
                <p className="text-sm text-gray-500">Évolution (6 derniers mois)</p>
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} name="Revenus (€)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Admin Activity Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-900 mb-4">Propriétaires par performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-900">Jean Propriétaire</p>
                    <p className="text-xs text-gray-600">2 logements</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">12 rés.</p>
                  <p className="text-xs text-green-600">+25%</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-gray-900">Sophie Dupont</p>
                    <p className="text-xs text-gray-600">1 logement</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">6 rés.</p>
                  <p className="text-xs text-green-600">+15%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-gray-900 mb-4">Logements les plus actifs</h3>
            <div className="space-y-3">
              {mockProperties.slice(0, 3).map((property, idx) => {
                const propBookings = mockBookings.filter(b => b.propertyId === property.id);
                return (
                  <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 text-white p-2 rounded-lg">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-gray-900 text-sm">{property.name}</p>
                        <p className="text-xs text-gray-600">{property.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{propBookings.length}</p>
                      <p className="text-xs text-gray-600">réservations</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Admin Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Activité récente de la plateforme</h3>
          <div className="space-y-3">
            {mockBookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${booking.status === 'confirmed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <Calendar className={`w-5 h-5 ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`} />
                  </div>
                  <div>
                    <p className="text-gray-900">{booking.clientName}</p>
                    <p className="text-sm text-gray-600">{booking.propertyName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(booking.startDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // OWNER DASHBOARD - Personal properties view
  const extendedStats = [
    {
      label: 'Logements',
      value: properties.length,
      icon: Home,
      color: 'bg-blue-500',
      trend: role === 'admin' ? '+2 ce mois' : null
    },
    {
      label: 'Réservations actives',
      value: confirmedBookings.length,
      icon: Calendar,
      color: 'bg-green-500',
      trend: `+${Math.round((confirmedBookings.length / bookings.length) * 100)}%`
    },
    {
      label: 'Revenus du mois',
      value: `${revenue.monthly.toLocaleString('fr-FR')}€`,
      icon: Euro,
      color: 'bg-emerald-500',
      trend: '+12%'
    },
    {
      label: 'Taux d\'occupation',
      value: `${occupancyRate}%`,
      icon: Activity,
      color: 'bg-purple-500',
      trend: occupancyRate > 70 ? 'Excellent' : 'Bon'
    }
  ];

  const additionalStats = [
    {
      label: 'Revenus total',
      value: `${revenue.total.toLocaleString('fr-FR')}€`,
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      label: 'Documents signés',
      value: `${signedDocs}/${documents.length}`,
      subValue: `${Math.round((signedDocs / documents.length) * 100)}% complétés`,
      icon: CheckCircle,
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      label: 'En attente',
      value: pendingBookings.length,
      subValue: 'demandes à traiter',
      icon: Clock,
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      label: role === 'admin' ? 'Total propriétaires' : 'Check-ins à venir',
      value: role === 'admin' ? 2 : upcomingCheckIns.length,
      subValue: role === 'admin' ? 'comptes actifs' : 'cette semaine',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">
          {role === 'admin' ? 'Dashboard Admin' : 'Mon Dashboard'}
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre activité
        </p>
      </div>

      {/* Main Stats Cards with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {extendedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {additionalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`${stat.iconBg} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <span className="text-sm text-gray-600">{stat.label}</span>
              </div>
              <p className="text-gray-900 mb-1">{stat.value}</p>
              {stat.subValue && (
                <p className="text-xs text-gray-500">{stat.subValue}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue & Bookings Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-900 mb-1">Évolution mensuelle</h3>
              <p className="text-sm text-gray-500">Réservations et revenus (6 derniers mois)</p>
            </div>
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="reservations" fill="#6366f1" radius={[8, 8, 0, 0]} name="Réservations" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Performance Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="mb-6">
            <h3 className="text-gray-900 mb-1">Performance des logements</h3>
            <p className="text-sm text-gray-500">Répartition des réservations</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={propertyPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {propertyPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trend Line Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-gray-900 mb-1">Tendance des revenus</h3>
            <p className="text-sm text-gray-500">Revenus en euros (6 derniers mois)</p>
          </div>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenus" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              name="Revenus (€)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Check-ins à venir</h3>
          {upcomingCheckIns.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun check-in prévu</p>
          ) : (
            <div className="space-y-3">
              {upcomingCheckIns.slice(0, 5).map(ci => {
                const booking = bookings.find(b => b.id === ci.bookingId);
                if (!booking) return null;
                return (
                  <div key={ci.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-gray-900 text-sm">{booking.clientName}</p>
                      <p className="text-gray-600 text-xs">{booking.propertyName}</p>
                    </div>
                    <p className="text-blue-600 text-sm">
                      {new Date(booking.startDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-900 mb-4">Réservations récentes</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucune réservation</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 text-sm">{booking.clientName}</p>
                    <p className="text-gray-600 text-xs">{booking.propertyName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}