import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { startMockLogs } from './utils/mockGenerator.ts'

startMockLogs(); // 2초마다 mock 로그 push 시작

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
