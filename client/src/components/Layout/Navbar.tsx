import { Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useWorkflow } from '../../stores/WorkflowContext'

export function Navbar() {
  const { resetWorkflow } = useWorkflow()

  return (
    <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-lg text-slate-900 cursor-pointer"
        onClick={resetWorkflow}
      >
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
          <Activity className="text-white" size={18} />
        </div>
        AI Predictor <span className="font-normal text-slate-400 text-sm hidden sm:inline">| Operations View</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-slate-600">System Live</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-medium text-xs">
          JD
        </div>
      </div>
    </nav>
  )
}


