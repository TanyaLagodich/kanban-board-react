import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { X } from 'lucide-react'
import { useCards } from '../../hooks/useCards'
import type { Card, Priority } from '../../types'

const PRIORITIES = ['low', 'medium', 'high'] as const

export default function CardForm({
  columnId,
  card,
  onClose,
}: {
  columnId: string
  card?: Card
  onClose: () => void
}) {
  const [title, setTitle] = useState(card?.title || '')
  const [description, setDescription] = useState(card?.description || '')
  const [priority, setPriority] = useState<Priority>(card?.priority || 'medium')
  const [tags, setTags] = useState<string[]>(card?.tags || [])

  const { createCard, updateCard, cards } = useCards(columnId)

  const maxPosition = cards.length > 0 ? Math.max(...cards.map((c) => c.position)) : 0

  const addNewTagOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()

    const value = e.currentTarget.value.trim()
    if (!value) return
    if (!tags.includes(value)) {
      setTags([...tags, value])
    }
    e.currentTarget.value = ''
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (!title.trim()) return
    if (card) {
      await updateCard.mutateAsync({ id: card.id, title, description, priority, tags })
    } else {
      await createCard.mutateAsync({
        title,
        description,
        priority,
        tags,
        column_id: columnId,
        position: maxPosition + 1,
      })
    }
    onClose()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2 font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block mb-2 font-medium">
          Priority
        </label>

        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <PriorityButton
              key={p}
              name={p}
              isActive={priority === p}
              onClick={(name) => setPriority(name as Priority)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium" htmlFor="tags">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          placeholder="Type and press Enter to add tags"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={addNewTagOnEnter}
        />

        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {tags.map((tag) => (
              <Chip key={tag} onRemove={() => setTags(tags.filter((t) => t !== tag))}>
                {tag}
              </Chip>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
        <button
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          type="submit"
          disabled={createCard.isPending || updateCard.isPending}
        >
          {createCard.isPending || updateCard.isPending
            ? 'Saving...'
            : card
              ? 'Save Changes'
              : 'Create task'}
        </button>
      </div>
    </form>
  )
}

function PriorityButton({
  name,
  isActive,
  onClick,
}: {
  name: Priority
  isActive: boolean
  onClick: (name: string) => void
}) {
  return (
    <button
      type="button"
      className={`flex-1 px-4 py-2 rounded-lg border-2 capitalize transition-colors ${isActive ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:border-gray-400'}`}
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  )
}

function Chip({ children, onRemove }: { children: string; onRemove?: () => void }) {
  return (
    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center gap-2">
      {children}

      <button type="button" className="hover:text-red-600" onClick={onRemove}>
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}
