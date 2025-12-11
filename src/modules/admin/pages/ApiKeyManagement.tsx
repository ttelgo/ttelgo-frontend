import { useState, useEffect } from 'react'
import { apiKeyService } from '@/modules/admin/services/apikey.service'
import { apiKeyConfig } from '@/shared/utils/apiKeyConfig'
import type { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest, ApiUsageStats } from '@/shared/types'

const ApiKeyManagement = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)
  const [usageStats, setUsageStats] = useState<ApiUsageStats | null>(null)
  const [showUsageStats, setShowUsageStats] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    keyName: '',
    customerName: '',
    customerEmail: '',
    rateLimitPerMinute: 60,
    rateLimitPerHour: 1000,
    rateLimitPerDay: 10000,
    allowedIps: [],
    scopes: [],
    notes: ''
  })

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      setLoading(true)
      const data = await apiKeyService.getAllApiKeys()
      setApiKeys(data)
    } catch (error) {
      console.error('Error fetching API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const created = await apiKeyService.createApiKey(formData)
      console.log('Created API key response:', created) // Debug log
      console.log('API Key value:', created.apiKey) // Debug log
      
      // Check if apiKey exists in the response
      if (created && created.apiKey && created.apiKey.trim() !== '') {
        console.log('Setting new API key in state:', created.apiKey.substring(0, 20) + '...')
        setNewApiKey(created.apiKey)
        // Automatically configure the API key for frontend use if this is the frontend key
        if (formData.keyName.toLowerCase().includes('frontend') || 
            formData.customerName.toLowerCase().includes('ttelgo')) {
          apiKeyConfig.setApiKey(created.apiKey)
          console.log('API key automatically configured for frontend use')
        }
        // Don't close form or reset until user closes modal
        await fetchApiKeys()
      } else {
        console.error('API key not found in response:', created)
        alert('API key was created but could not be displayed. Please regenerate it.')
        await fetchApiKeys()
        setShowForm(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      alert('Failed to create API key: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingKey) return
    
    try {
      const updateData: UpdateApiKeyRequest = {
        keyName: formData.keyName,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        rateLimitPerMinute: formData.rateLimitPerMinute,
        rateLimitPerHour: formData.rateLimitPerHour,
        rateLimitPerDay: formData.rateLimitPerDay,
        allowedIps: formData.allowedIps,
        scopes: formData.scopes,
        expiresAt: formData.expiresAt,
        notes: formData.notes
      }
      
      await apiKeyService.updateApiKey(editingKey.id, updateData)
      await fetchApiKeys()
      setShowForm(false)
      setEditingKey(null)
      resetForm()
    } catch (error) {
      console.error('Error updating API key:', error)
      alert('Failed to update API key')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this API key?')) return
    
    try {
      await apiKeyService.deleteApiKey(id)
      await fetchApiKeys()
    } catch (error) {
      console.error('Error deleting API key:', error)
      alert('Failed to delete API key')
    }
  }

  const handleRegenerate = async (id: number) => {
    if (!confirm('Are you sure you want to regenerate this API key? The old key will no longer work.')) return
    
    try {
      const regenerated = await apiKeyService.regenerateApiKey(id)
      if (regenerated.apiKey) {
        setNewApiKey(regenerated.apiKey)
        // Update stored API key if this is the one currently in use
        const currentKey = apiKeyConfig.getApiKey()
        const keyToUpdate = apiKeys.find(k => k.id === id)
        if (keyToUpdate && currentKey && keyToUpdate.apiKey === currentKey) {
          apiKeyConfig.setApiKey(regenerated.apiKey)
          console.log('Regenerated API key automatically configured for frontend use')
        }
      }
      await fetchApiKeys()
    } catch (error) {
      console.error('Error regenerating API key:', error)
      alert('Failed to regenerate API key')
    }
  }

  const handleViewUsage = async (key: ApiKey) => {
    try {
      const stats = await apiKeyService.getUsageStats(key.id, 30)
      setUsageStats(stats)
      setSelectedKey(key)
      setShowUsageStats(true)
    } catch (error) {
      console.error('Error fetching usage stats:', error)
      alert('Failed to load usage statistics')
    }
  }

  const resetForm = () => {
    setFormData({
      keyName: '',
      customerName: '',
      customerEmail: '',
      rateLimitPerMinute: 60,
      rateLimitPerHour: 1000,
      rateLimitPerDay: 10000,
      allowedIps: [],
      scopes: [],
      expiresAt: undefined,
      notes: ''
    })
    setEditingKey(null)
    setNewApiKey(null)
  }

  const startEdit = (key: ApiKey) => {
    setEditingKey(key)
    setFormData({
      keyName: key.keyName,
      customerName: key.customerName,
      customerEmail: key.customerEmail,
      rateLimitPerMinute: key.rateLimitPerMinute,
      rateLimitPerHour: key.rateLimitPerHour,
      rateLimitPerDay: key.rateLimitPerDay,
      allowedIps: key.allowedIps || [],
      scopes: key.scopes || [],
      expiresAt: key.expiresAt,
      notes: key.notes || ''
    })
    setShowForm(true)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create New API Key
          </button>
        </div>

        {/* New API Key Modal */}
        {newApiKey && newApiKey.trim() !== '' && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={(e) => {
            // Don't close when clicking inside the modal
            if (e.target === e.currentTarget) {
              if (confirm('Are you sure you have saved the API key? You won\'t be able to see it again.')) {
                setNewApiKey(null)
              }
            }
          }}>
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl w-full mx-4 border-4 border-yellow-400">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">API Key Generated Successfully!</h2>
                <p className="text-red-600 font-semibold text-lg mb-1">⚠️ IMPORTANT: Save this key now!</p>
                <p className="text-gray-600 text-sm">You won't be able to see it again after closing this dialog.</p>
              </div>
              
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your API Key:</label>
                <div className="bg-white border border-gray-400 rounded p-4 mb-4">
                  <code className="text-base font-mono break-all text-gray-900 select-all">{newApiKey}</code>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                  <p className="text-sm text-blue-800 font-semibold mb-2">How to use this API key:</p>
                  <p className="text-xs text-blue-700 mb-1">• Add this header to your API requests:</p>
                  <code className="text-xs bg-white px-2 py-1 rounded block mb-2">X-API-Key: {newApiKey.substring(0, 20)}...</code>
                  <p className="text-xs text-blue-700">• Share this key securely with your vendor/customer</p>
                  <p className="text-xs text-blue-700 mt-2">• For frontend use, click "Use for Frontend" below</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    apiKeyConfig.setApiKey(newApiKey)
                    alert('✅ API key configured for frontend use! The frontend will now use this key for all API requests.')
                  }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Use for Frontend
                </button>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(newApiKey)
                      alert('✅ API key copied to clipboard!')
                    } catch (err) {
                      // Fallback for older browsers
                      const textArea = document.createElement('textarea')
                      textArea.value = newApiKey
                      document.body.appendChild(textArea)
                      textArea.select()
                      document.execCommand('copy')
                      document.body.removeChild(textArea)
                      alert('✅ API key copied to clipboard!')
                    }
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy API Key
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([`TTelGo API Key\n\nAPI Key: ${newApiKey}\n\nGenerated: ${new Date().toLocaleString()}\n\n⚠️ Keep this key secure and do not share publicly.`], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `ttelgo-api-key-${Date.now()}.txt`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download as Text File
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you have saved the API key? You won\'t be able to see it again.')) {
                      setNewApiKey(null)
                      setShowForm(false)
                      resetForm()
                    }
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  I've Saved It - Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingKey ? 'Edit API Key' : 'Create New API Key'}
            </h2>
            <form onSubmit={editingKey ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                  <input
                    type="text"
                    required
                    value={formData.keyName}
                    onChange={(e) => setFormData({ ...formData, keyName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (per minute)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.rateLimitPerMinute}
                    onChange={(e) => setFormData({ ...formData, rateLimitPerMinute: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (per hour)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.rateLimitPerHour}
                    onChange={(e) => setFormData({ ...formData, rateLimitPerHour: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (per day)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.rateLimitPerDay}
                    onChange={(e) => setFormData({ ...formData, rateLimitPerDay: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowed IP Addresses (Optional)</label>
                <p className="text-xs text-gray-500 mb-2">Enter one IP per line. Leave empty to allow all IPs. Use * for wildcard.</p>
                <textarea
                  value={formData.allowedIps?.join('\n') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    allowedIps: e.target.value.split('\n').filter(ip => ip.trim() !== '') 
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                  rows={4}
                  placeholder="192.168.1.1&#10;10.0.0.0/24&#10;*"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scopes/Permissions (Optional)</label>
                <p className="text-xs text-gray-500 mb-2">Enter one scope per line. Format: METHOD:/api/endpoint/** or use * for all endpoints.</p>
                <textarea
                  value={formData.scopes?.join('\n') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    scopes: e.target.value.split('\n').filter(scope => scope.trim() !== '') 
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                  rows={4}
                  placeholder="GET:/api/plans/**&#10;POST:/api/orders/**&#10;*"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingKey ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* API Keys Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{key.keyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{key.customerName}</div>
                    <div className="text-sm text-gray-500">{key.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      key.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatNumber(key.totalRequests || 0)}</div>
                    <div className="text-xs text-gray-500">{formatNumber(key.requestsToday || 0)} today</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewUsage(key)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Usage
                      </button>
                      <button
                        onClick={() => startEdit(key)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRegenerate(key.id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Regenerate
                      </button>
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Usage Stats Modal */}
        {showUsageStats && selectedKey && usageStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Usage Statistics - {selectedKey.keyName}</h2>
                <button
                  onClick={() => {
                    setShowUsageStats(false)
                    setSelectedKey(null)
                    setUsageStats(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold">{formatNumber(usageStats.totalRequests)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-2xl font-bold">{formatNumber(usageStats.requestsToday)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold">{formatNumber(usageStats.requestsThisWeek)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold">{usageStats.averageResponseTime.toFixed(2)}ms</p>
                </div>
              </div>

              {usageStats.topEndpoints && usageStats.topEndpoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Top Endpoints</h3>
                  <div className="space-y-2">
                    {usageStats.topEndpoints.map((endpoint, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{endpoint.endpoint}</span>
                        <span className="text-sm font-semibold">{formatNumber(endpoint.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiKeyManagement

