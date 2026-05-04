export type Priority = 'low' | 'medium' | 'high'

export interface Column {
  id: string
  title: string
  position: number
  created_at: string
}

export interface Card {
  id: string
  title: string
  description?: string
  priority: Priority
  tags: string[]
  position: number
  column_id: string
  created_at: string
}

export type CreateCardDto = Omit<Card, 'id' | 'created_at'>
export type UpdateCardDto = Partial<Omit<Card, 'id' | 'created_at'>>

export type CreateColumnDto = Omit<Column, 'id' | 'created_at'>
