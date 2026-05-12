import { useRef } from 'react'
import { isSortable } from '@dnd-kit/dom/sortable'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Card } from '../types'

export function useBoardDnd() {
  const queryClient = useQueryClient()
  const dropUpdate = useRef<{ cardId?: string; oldColumnId?: string; newColumnId?: string }>({})

  const onDragOver = (e: DragOverEvent) => {
    const { source, target } = e.operation
    if (!target || !isSortable(source)) return
    if (target.id === source.id) return

    const sourceGroup = source.group as string
    const targetGroup = (isSortable(target) ? (target.group ?? target.id) : target.id) as string

    if (sourceGroup !== targetGroup) {
      dropUpdate.current = {
        cardId: source.id as string,
        oldColumnId: sourceGroup,
        newColumnId: targetGroup,
      }

      const oldCards = queryClient.getQueryData<Card[]>(['cards', sourceGroup]) ?? []
      const newCards = queryClient.getQueryData<Card[]>(['cards', targetGroup]) ?? []
      const card = oldCards.find((c) => c.id === source.id)
      if (!card) return

      queryClient.setQueryData(
        ['cards', sourceGroup],
        oldCards.filter((c) => c.id !== source.id)
      )
      queryClient.setQueryData(
        ['cards', targetGroup],
        [...newCards, { ...card, column_id: targetGroup }]
      )
      return
    }

    const cards = queryClient.getQueryData<Card[]>(['cards', sourceGroup]) ?? []
    const oldIndex = source.index
    const newIndex = isSortable(target) ? target.index : cards.length
    if (oldIndex === newIndex) return

    const reordered = [...cards]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    queryClient.setQueryData(['cards', sourceGroup], reordered)
  }

  const onDragEnd = async (e: DragEndEvent) => {
    if (e.canceled) return

    const { source, target } = e.operation
    if (!source || !target || !isSortable(source)) return

    const { cardId, oldColumnId, newColumnId } = dropUpdate.current

    if (cardId && newColumnId && oldColumnId !== newColumnId) {
      await supabase.from('cards').update({ column_id: newColumnId }).eq('id', cardId)
      dropUpdate.current = {}
    }

    const sourceGroup = source.group as string
    const cards = queryClient.getQueryData<Card[]>(['cards', sourceGroup]) ?? []
    await Promise.all(
      cards.map((card, index) =>
        supabase
          .from('cards')
          .update({ position: index + 1 })
          .eq('id', card.id)
      )
    )
  }

  return { onDragOver, onDragEnd }
}
