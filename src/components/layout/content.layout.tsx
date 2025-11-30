import React from 'react'

const ContentLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="flex-1 overflow-auto">
      <div className="p-4 md:p-8">{children}</div>
    </main>
  )
}

export default ContentLayout
