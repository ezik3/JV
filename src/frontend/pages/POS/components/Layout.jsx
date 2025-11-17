import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  Table2,
  Menu,
  Package,
  BarChart3,
  Users,
  Settings,
  LogOut
} from 'lucide-react'

export default function POSLayout({ children }) {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', path: '/venue/pos/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/venue/pos/orders', icon: ShoppingCart },
    { name: 'Kitchen', path: '/venue/pos/kitchen', icon: ChefHat },
    { name: 'Tables', path: '/venue/pos/tables', icon: Table2 },
    { name: 'Menu', path: '/venue/pos/menu', icon: Menu },
    { name: 'Inventory', path: '/venue/pos/inventory', icon: Package },
    { name: 'Analytics', path: '/venue/pos/analytics', icon: BarChart3 },
    { name: 'Staff', path: '/venue/pos/staff', icon: Users },
    { name: 'Settings', path: '/venue/pos/settings', icon: Settings },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Nocturne POS</h1>
          <p className="text-sm text-gray-400 mt-1">Venue Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              // Handle logout
              console.log('Logout clicked')
            }}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
