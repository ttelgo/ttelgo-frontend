/**
 * BundleList Component
 * Example component showing how to use the plans service
 */

import { useState, useEffect } from 'react'
import { plansService, type Bundle } from '../services/plans.service'

export const BundleList = () => {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        setLoading(true)
        const data = await plansService.getBundles()
        setBundles(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bundles')
        console.error('Error fetching bundles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBundles()
  }, [])

  if (loading) {
    return <div className="p-4">Loading bundles...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Bundles ({bundles.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">{bundle.name || bundle.id}</h3>
            <p className="text-gray-600">{bundle.description}</p>
            <div className="mt-2">
              <span className="text-2xl font-bold">${bundle.price}</span>
              <span className="text-gray-600 ml-2">{bundle.currency}</span>
            </div>
            <div className="mt-2 text-sm">
              <span>{bundle.data}</span> • <span>{bundle.validity}</span>
            </div>
            {bundle.countryIso && (
              <div className="mt-2 text-xs text-gray-500">
                Country: {bundle.countryIso}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

