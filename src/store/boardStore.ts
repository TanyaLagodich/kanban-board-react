import { create } from 'zustand'
import type { Card } from '../types'

interface BoardStore {
  activeCard: Card | null
  isCardModalOpen: boolean
  isColumnFormOpen: boolean
  searchQuery: string

  setActiveCard: (card: Card | null) => void
  openCardModal: (card?: Card) => void
  closeCardModal: () => void
  toggleColumnForm: () => void
  setSearchQuery: (query: string) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  activeCard: null,
  isCardModalOpen: false,
  isColumnFormOpen: false,
  searchQuery: '',

  setActiveCard: (card) => set({ activeCard: card }),
  openCardModal: (card) => set({ activeCard: card, isCardModalOpen: true }),
  closeCardModal: () => set({ activeCard: null, isCardModalOpen: false }),
  toggleColumnForm: () => set((state) => ({ isColumnFormOpen: !state.isColumnFormOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
