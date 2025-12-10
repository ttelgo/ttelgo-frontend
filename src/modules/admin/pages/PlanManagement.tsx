import { useState, useEffect, useMemo } from 'react'
import { adminPlansService } from '@/modules/admin/services/plans.service'
import type { Bundle } from '@/shared/types'

const PlanManagement = () => {
  // All plans loaded in background
  const [allPlans, setAllPlans] = useState<Bundle[]>([])
  const [loadingAll, setLoadingAll] = useState(true)
  
  // Displayed plans (filtered and paginated)
  const [displayedBundles, setDisplayedBundles] = useState<Bundle[]>([])
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('') // Selected region for regional filter
  const [availableRegions, setAvailableRegions] = useState<string[]>([]) // Available regions
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage] = useState(20) // 20 plans per page
  const [searchInput, setSearchInput] = useState('') // Search input (not debounced for instant feedback)

  // Load first page immediately, then continue loading all plans in background
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoadingAll(true)
        
        // Step 1: Load first page immediately to show something to user
        console.log('Loading first page of plans...')
        const firstPageResponse = await adminPlansService.getAllPlans(1, perPage, 'asc')
        const firstPagePlans = firstPageResponse.bundles || []
        console.log(`Loaded first page: ${firstPagePlans.length} plans`)
        setAllPlans(firstPagePlans) // Show first page immediately
        
        // Step 2: Continue loading all plans in background
        console.log('Loading all plans in background...')
        const allPlansResponse = await adminPlansService.getAllPlansComplete()
        const allPlans = allPlansResponse.bundles || []
        console.log(`Loaded all plans: ${allPlans.length} plans`)
        setAllPlans(allPlans) // Replace with all plans when done
      } catch (error) {
        console.error('Error loading plans:', error)
        // Keep first page if available, otherwise empty
        if (allPlans.length === 0) {
          setAllPlans([])
        }
      } finally {
        setLoadingAll(false)
      }
    }
    
    loadPlans()
  }, [])

  // Fetch available regions from API when Regional filter is selected
  useEffect(() => {
    if (filter === 'regional') {
      const loadRegions = async () => {
        try {
          const regions = await adminPlansService.getAvailableRegions()
          setAvailableRegions(regions)
        } catch (error) {
          console.error('Error loading regions:', error)
          setAvailableRegions([])
        }
      }
      loadRegions()
    } else {
      setAvailableRegions([])
      setSelectedRegion('')
    }
  }, [filter])

  // Filter and search plans (client-side)
  const filteredPlans = useMemo(() => {
    let filtered = [...allPlans]

    // Apply filter
    if (filter === 'local') {
      filtered = filtered.filter(bundle => bundle.type === 'Local')
    } else if (filter === 'regional') {
      filtered = filtered.filter(bundle => bundle.type === 'Regional')
      
      // If a region is selected, filter by that region
      if (selectedRegion && selectedRegion.trim()) {
        filtered = filtered.filter(bundle => {
          // Check if any country in the bundle belongs to the selected region
          return bundle.countryObjects?.some(c => 
            c.region?.toLowerCase() === selectedRegion.toLowerCase()
          ) || false
        })
      }
    } else if (filter === 'global') {
      filtered = filtered.filter(bundle => bundle.type === 'Global')
    }
    // 'all' shows all plans, no filter needed

    // Apply search
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase().trim()
      filtered = filtered.filter(bundle => 
        bundle.name?.toLowerCase().includes(searchLower) ||
        bundle.description?.toLowerCase().includes(searchLower) ||
        bundle.countryName?.toLowerCase().includes(searchLower) ||
        bundle.countryIso?.toLowerCase().includes(searchLower) ||
        bundle.countryObjects?.some(c => 
          c.name?.toLowerCase().includes(searchLower) ||
          c.iso?.toLowerCase().includes(searchLower) ||
          c.region?.toLowerCase().includes(searchLower)
        )
      )
    }

    return filtered
  }, [allPlans, filter, selectedRegion, searchInput])

  // Paginate filtered plans
  const totalPages = Math.ceil(filteredPlans.length / perPage)
  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    return filteredPlans.slice(startIndex, endIndex)
  }, [filteredPlans, currentPage, perPage])

  // Update displayed bundles when paginated plans change
  useEffect(() => {
    setDisplayedBundles(paginatedPlans)
    // Reset to page 1 if current page is beyond available pages
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [paginatedPlans, totalPages, currentPage])

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setCurrentPage(1)
    setSearchInput('')
    setSelectedRegion('') // Reset region when changing filter
  }

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    setCurrentPage(1) // Reset to page 1 when region changes
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Don't block UI - show content immediately, loading happens in background

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Plan Management</h1>
              {loadingAll && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Loading plans...</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {loadingAll && allPlans.length === 0 ? (
                <span className="text-gray-500">Loading first page...</span>
              ) : loadingAll && allPlans.length > 0 ? (
                <>
                  <span className="text-gray-500">Loaded {allPlans.length} plans • Loading more in background...</span>
                </>
              ) : allPlans.length > 0 ? (
                <>
                  Total: {allPlans.length} plans • 
                  Filtered: {filteredPlans.length} plans • 
                  Page {currentPage} of {totalPages} • 
                  Showing {displayedBundles.length} plan{displayedBundles.length !== 1 ? 's' : ''} on this page
                </>
              ) : (
                <span className="text-gray-500">No plans loaded yet</span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Plans</option>
              <option value="local">Local Plans</option>
              <option value="regional">Regional Plans</option>
              <option value="global">Global Plans</option>
            </select>
            
            {/* Region selector - only show when Regional filter is selected */}
            {filter === 'regional' && (
              <select
                value={selectedRegion}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
                disabled={loadingAll && availableRegions.length === 0}
              >
                <option value="">
                  {loadingAll && availableRegions.length === 0 
                    ? 'Loading regions...' 
                    : availableRegions.length === 0 
                    ? 'No regions available' 
                    : 'All Regions'}
                </option>
                {availableRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative inline-block">
            <input
              type="text"
              placeholder="Search plans by name, description, or country..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Controls - Top */}
      {!loadingAll && filteredPlans.length > 0 && (
        <div className="mb-4 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      {/* Bundles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loadingAll && allPlans.length === 0 ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading plans from eSIMGo...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedBundles.map((bundle) => (
              <tr key={bundle.name}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{bundle.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {bundle.type || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bundle.countryName || bundle.countryIso || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {bundle.dataAmount || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bundle.durationDays ? `${bundle.durationDays} days` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${bundle.price || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedBundle(bundle)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Empty State */}
      {!loadingAll && filteredPlans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">
            {searchInput.trim() 
              ? `No plans found matching "${searchInput}". Try a different search term.` 
              : `No plans found for "${filter}" filter.`}
          </p>
        </div>
      )}

      {/* Bundle Detail Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Bundle Details</h2>
              <button
                onClick={() => setSelectedBundle(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{selectedBundle.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{selectedBundle.type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-semibold">{selectedBundle.countryName || selectedBundle.countryIso || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data Amount</p>
                  <p className="font-semibold">{selectedBundle.dataAmount || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{selectedBundle.durationDays ? `${selectedBundle.durationDays} days` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold">${selectedBundle.price || '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Currency</p>
                  <p className="font-semibold">{selectedBundle.currency || 'USD'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Region</p>
                  <p className="font-semibold">{selectedBundle.region || 'N/A'}</p>
                </div>
              </div>
              {selectedBundle.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{selectedBundle.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlanManagement

