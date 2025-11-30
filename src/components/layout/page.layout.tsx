import React from 'react'
import { Sidebar } from '../sidebar'

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      <Sidebar />
      {children}
    </div>
  )
}

export default PageLayout
