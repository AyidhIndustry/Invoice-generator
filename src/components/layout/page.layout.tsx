import React from 'react'
import { Sidebar } from '../sidebar'
import { RequireAuth } from '../require-auth'

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RequireAuth>
      <div className="flex h-screen bg-background flex-col md:flex-row">
        <Sidebar />
        {children}
      </div>
    </RequireAuth>
  )
}

export default PageLayout
