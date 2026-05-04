import { useState } from 'react'
import { useColumns } from '../../hooks/useColumns'
import Modal from '../ui/Modal'

interface Props {
  onClose: () => void
}

export default function ColumnForm({ onClose }: Props) {
  const [title, setTitle] = useState('')
  const { columns, createColumn } = useColumns()

  const handleSubmit = async () => {
    if (!title.trim()) return
    await createColumn.mutateAsync({
      title: title.trim(),
      position: columns.length + 1,
    })
    onClose()
  }

  return (
    <Modal title="New Column" onClose={onClose}>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Column Title</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g., To Do, In Progress, Done"
          className="w-full px-4 py-3 border-2 border-blue-500 rounded-xl focus:outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={createColumn.isPending || !title.trim()}
          className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createColumn.isPending ? 'Creating...' : 'Create Column'}
        </button>
      </div>
    </Modal>
  )
}
