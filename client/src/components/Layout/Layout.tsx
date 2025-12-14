import { Outlet, useNavigate } from 'react-router-dom'

import { useWorkflow } from '../../stores/WorkflowContext'
import { Navbar } from './Navbar'

export function Layout() {
  const navigate = useNavigate()
  const { resetWorkflow } = useWorkflow()

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <Outlet />
      </main>

      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => {
            resetWorkflow()
            navigate('/')
          }}
          className="p-2 bg-white border border-slate-200 text-slate-400 rounded-full shadow-lg hover:text-slate-900 text-xs"
          title="Reset Demo"
          type="button"
        >
          ↺
        </button>
      </div>
    </div>
  )
}


