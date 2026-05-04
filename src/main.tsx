import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// remove after testing
import { supabase } from './lib/supabase'
const { data, error } = await supabase.from('columns').select('*')
console.log('columns:', data)
console.log('error:', error)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
