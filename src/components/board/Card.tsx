import { Pencil, Trash, Tag } from 'lucide-react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { Card } from '../../types'

const priorityColor = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
}

export default function Card({
  card,
  index,
  onEdit,
  onDelete,
}: {
  card: Card
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  const { ref } = useSortable({
    id: card.id,
    index: index,
    group: card.column_id,
    type: 'item',
    accept: ['item'],
  })

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow opacity-100"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="flex-1">{card.title}</h3>
        {card.id.slice(0, 4)}

        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Edit task"
            onClick={onEdit}
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Delete task"
            onClick={onDelete}
          >
            <Trash className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {card.description && <p className="text-gray-600 mb-3">{card.description}</p>}

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${priorityColor[card.priority]}`} />
          <span className="text-gray-500 capitalize">{card.priority}</span>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <Tag className="w-3 h-3 text-gray-400" />
          {card.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
