import { useState } from 'react'
import type { Column as ColumnType, Card as CardType } from '../../types'
import { useColumns } from '../../hooks/useColumns'
import { Pencil, Trash, Plus } from 'lucide-react'
import Modal from '../ui/Modal'
import CardForm from '../forms/CardForm'
import { useCards } from '../../hooks/useCards'
import Card from './Card'
interface Props {
  column: ColumnType
}

export default function Column({ column }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(column.title)
  const [activeCard, setActiveCard] = useState<CardType | null | 'new'>(null)
  const { updateColumn, deleteColumn } = useColumns()
  const { cards, deleteCard } = useCards(column.id)

  const handleSave = async () => {
    if (!title.trim() || title === column.title) {
      setIsEditing(false)
      return
    }
    await updateColumn.mutateAsync({ id: column.id, title: title.trim() })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this column? All tasks in it will be lost.'))
      return
    await deleteColumn.mutateAsync(column.id)
  }

  const handleDeleteCard = async (cardId: string) => {
    await deleteCard.mutateAsync(cardId)
  }
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-4 min-w-80 max-w-80">
      {isEditing && (
        <Modal title="Edit Column" onClose={() => setIsEditing(false)}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Column Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full px-4 py-3 border-2 border-blue-500 rounded-xl focus:outline-none text-gray-700"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateColumn.isPending || !title.trim()}
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {updateColumn.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </Modal>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">
            {column.title}
            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-sm">
              {cards.length}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Edit column"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>

          <button
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Delete column"
            onClick={handleDelete}
          >
            <Trash className="lucide-trash-2 w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <button
        className="mb-3 p-2 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        onClick={() => setActiveCard('new')}
      >
        <Plus className="w-4 h-4" />
        <span>Add Task</span>
      </button>

      {activeCard !== null && (
        <Modal
          title={activeCard === 'new' ? 'New Task' : 'Edit Task'}
          onClose={() => setActiveCard(null)}
        >
          <CardForm
            columnId={column.id}
            card={activeCard === 'new' ? undefined : activeCard}
            onClose={() => setActiveCard(null)}
          />
        </Modal>
      )}

      <div className="flex-1 flex flex-col gap-3 min-h-32 p-2 rounded-lg transition-colors border-2 border-transparent">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onEdit={() => setActiveCard(card)}
            onDelete={() => handleDeleteCard(card.id)}
          />
        ))}
      </div>
    </div>
  )
}
