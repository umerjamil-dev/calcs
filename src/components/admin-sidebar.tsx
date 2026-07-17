import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  CreditCard,
  Bell,
  ChevronDown,
  Menu,
  X,
  Warehouse,
  Settings,
} from 'lucide-react'
import { logo } from '@/assets'
import { cn } from '@/lib/utils'

interface SubItem {
  label: string
  path: string
}

interface MenuItem {
  label: string
  icon: React.ReactNode
  path?: string
  children?: SubItem[]
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
  {
    label: 'Products',
    icon: <Package size={18} />,
    children: [
      { label: 'All Products', path: '/admin/products' },
      { label: 'Add Product', path: '/admin/products/add' },
      { label: 'Categories', path: '/admin/categories' },
      { label: 'Subcategories', path: '/admin/subcategories' },
      { label: 'Brands', path: '/admin/brands' },
      { label: 'Product Types', path: '/admin/product-types' },
      { label: 'Engine Types', path: '/admin/engine-types' },
    ],
  },
  {
    label: 'Retailers',
    icon: <Users size={18} />,
    children: [
      { label: 'All Retailers', path: '/admin/retailers' },
      { label: 'Add Retailer', path: '/admin/retailers/add' },
    ],
  },
  {
    label: 'Distributors',
    icon: <Truck size={18} />,
    children: [
      { label: 'All Distributors', path: '/admin/distributors' },
      { label: 'Add Distributor', path: '/admin/distributors/add' },
    ],
  },
  {
    label: 'Orders',
    icon: <ShoppingCart size={18} />,
    children: [
      { label: 'All Orders', path: '/admin/orders' },
      { label: 'New Orders', path: '/admin/orders/new' },
      { label: 'Assigned Orders', path: '/admin/orders/assigned' },
      { label: 'Processing Orders', path: '/admin/orders/processing' },
      { label: 'Shipped Orders', path: '/admin/orders/shipped' },
      { label: 'Delivered Orders', path: '/admin/orders/delivered' },
      { label: 'Cancelled Orders', path: '/admin/orders/cancelled' },
      
    ],
  },
  {
    label: 'Payments',
    icon: <CreditCard size={18} />,
    children: [
      { label: 'Receive Payment', path: '/admin/payments/receive' },
      { label: 'Payment History', path: '/admin/payments/history' },
      { label: 'Outstanding Balance', path: '/admin/payments/outstanding' },
    ],
  },
//   {
//     label: 'Reports',
//     icon: <BarChart3 size={18} />,
//     children: [
//       { label: 'Sales Report', path: '/admin/reports/sales' },
//       { label: 'Orders Report', path: '/admin/reports/orders' },
//       { label: 'Retailer Report', path: '/admin/reports/retailers' },
//       { label: 'Distributor Report', path: '/admin/reports/distributors' },
//       { label: 'Product Sales Report', path: '/admin/reports/products' },
//       { label: 'Payment Report', path: '/admin/reports/payments' },
//     ],
//   },
  {
    label: 'Inventory',
    icon: <Warehouse size={18} />,
    children: [
      { label: 'Stock', path: '/admin/inventory/stock' },
      { label: 'Low Stock', path: '/admin/inventory/low-stock' },
      { label: 'Stock History', path: '/admin/inventory/history' },
    ],
  }, 
  { label: 'Notifications', icon: <Bell size={18} />, path: '/admin/notifications' },
  { label: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
]

export function AdminSidebar() {
  const location = useLocation()
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    menuItems.forEach((item) => {
      if (item.children && item.children.some((c) => location.pathname.startsWith(c.path))) {
        initial[item.label] = true
      }
    })
    return initial  
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggle = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const renderItem = (item: MenuItem) => {
    const isOpen = !!open[item.label]
    const hasChildren = !!item.children?.length
    const isActive = item.path ? location.pathname === item.path : item.children?.some((c) => location.pathname.startsWith(c.path))

    return (
      <div key={item.label} className="mb-2">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggle(item.label)}
            className={cn(
              'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive ? 'bg-primary-main/10 text-primary-main' : 'text-foreground/80 hover:bg-muted hover:text-foreground'
            )}
          >
            <span className="flex items-center gap-3">
              <span className="text-muted-foreground">{item.icon}</span>
              {item.label}
            </span>
            <ChevronDown size={16} className={cn('text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
          </button>
        ) : (
          <NavLink
            to={item.path || '#'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive: active }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-primary-main/10 text-primary-main' : 'text-foreground/80 hover:bg-muted hover:text-foreground'
              )
            }
          >
            <span className="text-muted-foreground">{item.icon}</span>
            {item.label}
          </NavLink>
        )}

        {hasChildren && isOpen && (
          <div className="mt-1 ml-4 space-y-1 border-l border-border/60 pl-3">
            {item.children?.map((child) => (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-1.5 text-sm transition-colors',
                    isActive ? 'font-medium text-primary-main' : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex h-full flex-col ">
      <div className="flex flex-col   gap-2 border-b border-border/60 px-4 pt-2">
        <img src={logo} alt="Mal Pakistan" className=" w-30  object-contain" />
        <div>
          <p className="text-md font-bold text-foreground">Mal Pakistan</p>
          <p className="text-sm text-muted-foreground">Admin Portal</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">{menuItems.map(renderItem)}</nav>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3.5 z-30 flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-white text-foreground lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-border/60 bg-white lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r border-border/60 bg-white transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <img src={logo} alt="Mal Pakistan" className="h-8 object-contain" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="h-[calc(100vh-60px)] overflow-y-auto px-3 py-4">{menuItems.map(renderItem)}</nav>
      </aside>
    </>
  )
}
