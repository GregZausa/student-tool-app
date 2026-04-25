import React from 'react'
import { Link } from 'react-router-dom'

const RouteComponent = ({link, icon: Icon, title, desc}) => {
  return (
    <div className="mb-10">
          <Link
            to={link}
            className="block p-6 hover:scale-102 rounded-2xl border border-slate-800 bg-linear-to-br from-slate-950 via-slate-800 to-slate-950  transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-slate-200">
                  <div className="text-center items-center gap-2.5 flex">
                    <Icon size={20} /> <span>{title}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                 {desc}
                </p>
              </div>
              <span className="text-2xl">→</span>
            </div>
          </Link>
        </div>
  )
}

export default RouteComponent
