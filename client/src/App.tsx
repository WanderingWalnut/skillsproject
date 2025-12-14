import { BrowserRouter } from 'react-router-dom'

import { AppRouter } from './app/router'
import { WorkflowProvider } from './stores/WorkflowContext'

export default function App() {
  return (
    <BrowserRouter>
      <WorkflowProvider>
        <AppRouter />
      </WorkflowProvider>
    </BrowserRouter>
  )
}
