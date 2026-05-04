import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { CreateColumnDto, Column } from '../types'

const fetchColumns = async (): Promise<Column[]> => {
  const { data, error } = await supabase.from('columns').select('*').order('position')

  if (error) throw error
  return data
}

export function useColumns() {
  const queryClient = useQueryClient()

  const { data: columns = [], isLoading } = useQuery({
    queryKey: ['columns'],
    queryFn: fetchColumns,
  })

  const createColumn = useMutation({
    mutationFn: async (dto: CreateColumnDto) => {
      const { error } = await supabase.from('columns').insert(dto)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['columns'] }),
  })

  const updateColumn = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase.from('columns').update({ title }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['columns'] }),
  })

  const deleteColumn = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('columns').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['columns'] }),
  })

  return { columns, isLoading, createColumn, updateColumn, deleteColumn }
}
