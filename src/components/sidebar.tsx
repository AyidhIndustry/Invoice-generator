'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { useState } from 'react'
import { Menu, Power, X } from 'lucide-react'
import { sidebarLinks } from '@/data/sidebar-links'
import { useAuth } from '@/context/auth.context'
import { Button } from './ui/button'

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const {logout} = useAuth()

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 hover:bg-muted rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:relative w-64 border-r border-border bg-sidebar text-sidebar-foreground min-h-screen p-6 transition-transform duration-300 z-30',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="mb-12 mt-12 md:mt-0">
          <Link
            href="/"
            className="block mb-6"
            onClick={() => setIsOpen(false)}
          >
            <Image
              src="/logo-dark.png"
              alt="Ayidh Dossary"
              width={240}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider">
            Invoice Manager
          </p>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium',
                pathname === href
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              )}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <Button
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            className='w-full'
          >
            <Power/>
            Logout
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
