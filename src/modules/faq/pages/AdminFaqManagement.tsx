import { useState, useEffect } from 'react'
import { faqService } from '@/modules/faq/services/faq.service'
import type { FAQ } from '@/shared/types'
import { faqsData } from '@/modules/faq/utils/faqsData'

const AdminFaqManagement = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    displayOrder: 0,
    isActive: true,
    category: ''
  })

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      setLoading(true)
      const data = await faqService.getAllFaqsAdmin()
      setFaqs(data || [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingFaq) {
        await faqService.updateFaq(editingFaq.id, formData)
      } else {
        await faqService.createFaq(formData)
      }
      setShowForm(false)
      setEditingFaq(null)
      resetForm()
      fetchFaqs()
      alert(editingFaq ? 'FAQ updated successfully!' : 'FAQ created successfully!')
    } catch (error) {
      console.error('Error saving FAQ:', error)
      alert('Failed to save FAQ. Please try again.')
    }
  }

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      displayOrder: faq.displayOrder || 0,
      isActive: faq.isActive !== undefined ? faq.isActive : true,
      category: faq.category || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return
    try {
      await faqService.deleteFaq(id)
      fetchFaqs()
      alert('FAQ deleted successfully!')
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      alert('Failed to delete FAQ.')
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      displayOrder: 0,
      isActive: true,
      category: ''
    })
  }

  const handleQuickAdd = (index: number) => {
    const faqData = faqsData[index]
    setFormData({
      question: faqData.question,
      answer: faqData.answer,
      displayOrder: faqData.displayOrder || 0,
      isActive: faqData.isActive !== undefined ? faqData.isActive : true,
      category: faqData.category || ''
    })
    setShowForm(true)
  }

  return (
    <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetForm()
                  setEditingFaq(null)
                  setShowForm(true)
                }}
                className="px-4 py-2 bg-telgo-red text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add New FAQ
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-6 border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">
                {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telgo-red focus:border-transparent"
                    placeholder="Enter question"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telgo-red focus:border-transparent"
                    placeholder="Enter answer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telgo-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telgo-red focus:border-transparent"
                      placeholder="Optional category"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-telgo-red focus:ring-telgo-red border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-telgo-red text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingFaq(null)
                      resetForm()
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quick Add Buttons */}
          {!showForm && faqs.length === 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Quick Add FAQs:</h3>
              <div className="flex flex-wrap gap-2">
                {faqsData.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAdd(index)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  >
                    Add: {faq.question.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-telgo-red"></div>
              <p className="mt-4 text-gray-600">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No FAQs found. Create your first FAQ above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {faqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                          {faq.question}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{faq.category || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{faq.displayOrder || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            faq.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-telgo-red hover:text-red-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
    </div>
  )
}

export default AdminFaqManagement

