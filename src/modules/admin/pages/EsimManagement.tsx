import { useState, useEffect } from 'react'
import { adminEsimService, type EsimResponse } from '@/modules/admin/services/esim.service'

const EsimManagement = () => {
  const [esims, setEsims] = useState<EsimResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEsim, setSelectedEsim] = useState<EsimResponse | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    fetchEsims()
  }, [statusFilter])

  const fetchEsims = async () => {
    try {
      setLoading(true)
      const data = await adminEsimService.getAllEsims(0, 100, statusFilter || undefined)
      setEsims(data)
    } catch (error) {
      console.error('Error fetching eSIMs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">eSIM Management</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="PROVISIONED">Provisioned</option>
            <option value="ACTIVATED">Activated</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* eSIMs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bundle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ICCID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {esims.map((esim) => (
              <tr key={esim.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{esim.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{esim.bundleName || esim.bundleId || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {esim.userId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {esim.orderId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {esim.iccid || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    esim.status === 'ACTIVATED' ? 'bg-green-100 text-green-800' :
                    esim.status === 'PROVISIONED' ? 'bg-blue-100 text-blue-800' :
                    esim.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {esim.status || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {esim.activatedAt ? new Date(esim.activatedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedEsim(esim)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* eSIM Detail Modal */}
      {selectedEsim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">eSIM Details</h2>
              <button
                onClick={() => setSelectedEsim(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">eSIM ID</p>
                  <p className="font-semibold">{selectedEsim.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{selectedEsim.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bundle Name</p>
                  <p className="font-semibold">{selectedEsim.bundleName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bundle ID</p>
                  <p className="font-semibold">{selectedEsim.bundleId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-semibold">{selectedEsim.userId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{selectedEsim.orderId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ICCID</p>
                  <p className="font-semibold">{selectedEsim.iccid || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Matching ID</p>
                  <p className="font-semibold">{selectedEsim.matchingId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SMDP Address</p>
                  <p className="font-semibold">{selectedEsim.smdpAddress || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Activated At</p>
                  <p className="font-semibold">
                    {selectedEsim.activatedAt ? new Date(selectedEsim.activatedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expires At</p>
                  <p className="font-semibold">
                    {selectedEsim.expiresAt ? new Date(selectedEsim.expiresAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-semibold">
                    {selectedEsim.createdAt ? new Date(selectedEsim.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EsimManagement

