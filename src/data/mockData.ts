import { Property, Booking, Message, Document, CheckIn } from '../App';

export const mockProperties: Property[] = [
  {
    id: 'p1',
    ownerId: '2',
    name: 'Appartement Marais',
    address: '15 Rue de Turenne, 75003 Paris',
    description: 'Charmant 2 pièces au cœur du Marais'
  },
  {
    id: 'p2',
    ownerId: '2',
    name: 'Studio Montmartre',
    address: '8 Rue Lepic, 75018 Paris',
    description: 'Studio cosy avec vue sur Sacré-Cœur'
  },
  {
    id: 'p3',
    ownerId: '4',
    name: 'Loft Saint-Germain',
    address: '25 Rue de Seine, 75006 Paris',
    description: 'Loft moderne avec terrasse'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    propertyId: 'p1',
    clientId: '3',
    clientName: 'Marie Voyageur',
    propertyName: 'Appartement Marais',
    startDate: '2025-12-20',
    endDate: '2025-12-27',
    status: 'confirmed'
  },
  {
    id: 'b2',
    propertyId: 'p2',
    clientId: '5',
    clientName: 'Pierre Durand',
    propertyName: 'Studio Montmartre',
    startDate: '2025-12-18',
    endDate: '2025-12-22',
    status: 'confirmed'
  },
  {
    id: 'b3',
    propertyId: 'p1',
    clientId: '6',
    clientName: 'Sophie Martin',
    propertyName: 'Appartement Marais',
    startDate: '2026-01-05',
    endDate: '2026-01-12',
    status: 'pending'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    bookingId: 'b1',
    type: 'Email',
    templateName: 'Confirmation de réservation',
    content: 'Bonjour Marie, votre réservation est confirmée pour l\'Appartement Marais du 20 au 27 décembre.',
    sentAt: '2025-12-01T10:30:00'
  },
  {
    id: 'm2',
    bookingId: 'b1',
    type: 'SMS',
    templateName: 'Rappel check-in',
    content: 'Rappel : votre check-in est prévu demain à 15h. Code d\'accès : 4582',
    sentAt: '2025-12-19T14:00:00'
  },
  {
    id: 'm3',
    bookingId: 'b2',
    type: 'WhatsApp',
    templateName: 'Instructions check-out',
    content: 'Merci pour votre séjour ! Check-out avant 11h. Laissez les clés dans la boîte.',
    sentAt: '2025-12-22T08:00:00'
  }
];

export const mockDocuments: Document[] = [
  {
    id: 'd1',
    bookingId: 'b1',
    fileName: 'Contrat_Location_Marais.pdf',
    fileUrl: '#',
    signed: true,
    uploadedAt: '2025-12-01T10:30:00'
  },
  {
    id: 'd2',
    bookingId: 'b1',
    fileName: 'Guide_Voyageur_Marais.pdf',
    fileUrl: '#',
    signed: false,
    uploadedAt: '2025-12-01T10:30:00'
  },
  {
    id: 'd3',
    bookingId: 'b3',
    fileName: 'Contrat_Location_Marais.pdf',
    fileUrl: '#',
    signed: false,
    uploadedAt: '2025-12-10T15:20:00'
  }
];

export const mockCheckIns: CheckIn[] = [
  {
    id: 'c1',
    bookingId: 'b1',
    checkinTime: '2025-12-20T15:00:00',
    checkoutTime: null,
    status: 'pending'
  },
  {
    id: 'c2',
    bookingId: 'b2',
    checkinTime: '2025-12-18T16:30:00',
    checkoutTime: null,
    status: 'done'
  }
];

export const messageTemplates = [
  {
    id: 't1',
    name: 'Confirmation de réservation',
    type: 'Email',
    content: 'Bonjour {client_name}, votre réservation est confirmée pour {property_name} du {start_date} au {end_date}.'
  },
  {
    id: 't2',
    name: 'Rappel check-in',
    type: 'SMS',
    content: 'Rappel : votre check-in est prévu demain à 15h. Code d\'accès : {access_code}'
  },
  {
    id: 't3',
    name: 'Instructions check-out',
    type: 'WhatsApp',
    content: 'Merci pour votre séjour ! Check-out avant 11h. Laissez les clés dans la boîte.'
  },
  {
    id: 't4',
    name: 'Bienvenue',
    type: 'Email',
    content: 'Bienvenue à {property_name} ! Vous trouverez toutes les informations dans le guide digital.'
  }
];
