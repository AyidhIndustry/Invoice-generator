import {
  LayoutDashboard,
  FileText,
  BarChart3,
  ShoppingCart,
  Settings,
  Truck,
  Wrench,
} from 'lucide-react'

export const sidebarLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/invoices', label: 'Invoices', icon: FileText },
  { href: '/quotations', label: 'Quotations', icon: BarChart3 },
  { href: '/delivery-notes', label: 'Delivery Notes', icon: Truck },
  { href: '/purchases', label: 'Purchases', icon: ShoppingCart },
  { href: '/maintenance-report', label: 'Maintenance Report', icon: Wrench },
  { href: '/quaterly-report', label: 'Quarterly Report', icon: BarChart3 },
  { href: '/settings', label: 'Company Info', icon: Settings },
]
