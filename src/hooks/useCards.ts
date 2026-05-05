import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Card, CreateCardDto, UpdateCardDto } from '../types'

const fetchCards = async (columnId: string): Promise<Card[]> => {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('column_id', columnId)
    .order('position')

  if (error) throw error
  return data
}

export function useCards(columnId: string) {
  const queryClient = useQueryClient()

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['cards', columnId],
    queryFn: () => fetchCards(columnId),
  })

  const createCard = useMutation({
    mutationFn: async (dto: CreateCardDto) => {
      const { error } = await supabase.from('cards').insert(dto)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', columnId] })
    },
  })

  const updateCard = useMutation({
    mutationFn: async ({ id, ...data }: UpdateCardDto) => {
      const { error } = await supabase.from('cards').update(data).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', columnId] })
    },
  })

  const deleteCard = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cards').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', columnId] })
    },
  })

  return { cards, isLoading, createCard, updateCard, deleteCard }
}
