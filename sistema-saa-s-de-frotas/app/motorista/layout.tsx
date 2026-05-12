'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Truck, Hop as Home, ClipboardCheck, MapPin, Fuel, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Início', href: '/motorista', icon: Home },
  { name: 'Inspeção', href: '/motorista/inspecao', icon: ClipboardCheck },
  { name: 'Minha Viagem', href: '/motorista/viagem', icon: MapPin },
  { name: 'Abastecimento', href: '/motorista/abastecimento', icon: Fuel },
]

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/motorista" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">OLIVEIRA FROTAS</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'M'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name}</span>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="sm:hidden fixed inset-0 top-16 z-40 bg-background">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
            <hr className="my-4 border-border" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 w-full"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </nav>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden sm:flex w-16 bg-card border-r border-border flex-col items-center py-4 gap-4 shrink-0">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'p-3 rounded-lg transition-colors relative group',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="absolute left-full ml-2 px-2 py-1 rounded bg-popover text-popover-foreground text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {item.name}
                </span>
              </Link>
            )
          })}
          <div className="flex-1" />
          <button
            onClick={handleLogout}
            className="p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 pb-24 sm:pb-4 overflow-auto">
          {children}
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border z-40 safe-area-bottom">
        <div className="h-full grid grid-cols-4 gap-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                <span className={cn('font-medium', isActive && 'text-primary')}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
