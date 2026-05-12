import { useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { useColumns } from '../../hooks/useColumns'
import Column from './Column'
import ColumnForm from '../forms/ColumnForm'
import { Search, Plus, Keyboard } from 'lucide-react'
import { useBoardDnd } from '../../hooks/useBoardDnd'

export default function Board() {
  const { columns, isLoading } = useColumns()
  const [showForm, setShowForm] = useState(false)
  const { onDragOver, onDragEnd } = useBoardDnd()
  if (isLoading) return <p>Loading...</p>

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
              <p className="text-gray-600">{columns.length} columns * 2 tasks</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                onClick={() => setShowForm(true)}
              >
                <Plus className="w-4 h-4" />
                <span>Add Column</span>
              </button>

              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Keyboard className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-full px-6 py-6">
        {showForm && <ColumnForm onClose={() => setShowForm(false)} />}

        <DragDropProvider onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
          </div>
        </DragDropProvider>
      </div>
    </div>
  )
}
