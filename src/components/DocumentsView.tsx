import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, Clock, Download, Edit } from 'lucide-react';
import { mockDocuments, mockBookings } from '../data/mockData';
import { UserRole } from '../App';

interface DocumentsViewProps {
  role: UserRole;
  userId: string;
}

export function DocumentsView({ role, userId }: DocumentsViewProps) {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Documents Voyageurs</h1>
          <p className="text-gray-600">Gérez les documents et signatures électroniques</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Uploader un document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-600">Total documents</span>
          </div>
          <p className="text-gray-900">{mockDocuments.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-600">Signés</span>
          </div>
          <p className="text-gray-900">
            {mockDocuments.filter(d => d.signed).length}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-gray-600">En attente</span>
          </div>
          <p className="text-gray-900">
            {mockDocuments.filter(d => !d.signed).length}
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Liste des documents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Réservation
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Date d'upload
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockDocuments.map(doc => {
                const booking = mockBookings.find(b => b.id === doc.bookingId);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-gray-900">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900 text-sm">{booking?.clientName}</p>
                        <p className="text-gray-600 text-xs">{booking?.propertyName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      {doc.signed ? (
                        <span className="flex items-center gap-2 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Signé
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-yellow-600 text-sm">
                          <Clock className="w-4 h-4" />
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        {!doc.signed && (
                          <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-6">Uploader un document</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Réservation</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sélectionner une réservation</option>
                  {mockBookings.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.clientName} - {b.propertyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Type de document</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Sélectionner un type</option>
                  <option value="contract">Contrat de location</option>
                  <option value="guide">Guide voyageur</option>
                  <option value="inventory">État des lieux</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Fichier</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-1">
                    Cliquez pour sélectionner un fichier
                  </p>
                  <p className="text-gray-500 text-xs">
                    PDF, DOC, DOCX (max 10MB)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="requireSignature"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="requireSignature" className="text-gray-700 text-sm">
                  Signature électronique requise
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  alert('Document uploadé !');
                  setShowUpload(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Uploader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
