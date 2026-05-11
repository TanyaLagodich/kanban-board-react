import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { DragDropProvider } from '@dnd-kit/react'
import { useColumns } from '../../hooks/useColumns'
import Column from './Column'
import ColumnForm from '../forms/ColumnForm'
import { Search, Plus, Keyboard } from 'lucide-react'

export default function Board() {
  const { columns, isLoading } = useColumns()
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const onDragEnd = async (event: any) => {
    if (event.canceled) return

    const { source, target } = event.operation
    if (!target) return

    const cardId = source.id
    const newColumnId = target.group ?? target.id
    const oldColumnId = source.initialGroup

    if (newColumnId === oldColumnId) {
      const cards = queryClient.getQueryData<Card[]>(['cards', oldColumnId]) ?? []
      const oldIndex = source.initialIndex
      const newIndex = target.index

      if (oldIndex === newIndex) return

      const reordered = [...cards]
      const [moved] = reordered.splice(oldIndex, 1)
      reordered.splice(newIndex, 0, moved)

      queryClient.setQueryData(['cards', oldColumnId], reordered)

      await Promise.all(
        reordered.map((card, index) =>
          supabase
            .from('cards')
            .update({ position: index + 1 })
            .eq('id', card.id)
        )
      )
      return
    }
    const oldCards = queryClient.getQueryData<Card[]>(['cards', oldColumnId]) ?? []
    const newCards = queryClient.getQueryData<Card[]>(['cards', newColumnId]) ?? []
    const card = oldCards.find((c) => c.id === cardId)
    if (!card) return

    queryClient.setQueryData(
      ['cards', oldColumnId],
      oldCards.filter((c) => c.id !== cardId)
    )
    queryClient.setQueryData(
      ['cards', newColumnId],
      [...newCards, { ...card, column_id: newColumnId }]
    )

    await supabase.from('cards').update({ column_id: newColumnId }).eq('id', cardId)
  }
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

        <DragDropProvider
          onDragEnd={onDragEnd}
          onDragOver={(e: any) => {
            const { source, target } = e.operation
            if (!target) return
            const sourceGroup = source.group
            const targetGroup = target.group ?? target.id
            if (sourceGroup !== targetGroup) {
              e.preventDefault()
            }
          }}
        >
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
