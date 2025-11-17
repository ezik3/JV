import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import POSLayout from './components/Layout'
import { usePOS } from './contexts/POSContext'
import withPOSProvider from './utils/withPOSProvider'
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react'

function Dashboard() {
  const { orders, loading } = usePOS()
  const [stats, setStats] = useState({
    todaySales: 0,
    activeOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0
  })

  useEffect(() => {
    if (orders.length > 0) {
      // Calculate today's stats
      const today = new Date().toDateString()
      const todayOrders = orders.filter(
        order => new Date(order.created_at).toDateString() === today
      )

      const activeOrders = orders.filter(
        order => order.status === 'pending' || order.status === 'preparing'
      ).length

      const completedOrders = todayOrders.filter(
        order => order.status === 'served'
      ).length

      const todaySales = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)

      const averageOrderValue = todayOrders.length > 0
        ? todaySales / todayOrders.length
        : 0

      setStats({
        todaySales,
        activeOrders,
        completedOrders,
        averageOrderValue
      })
    }
  }, [orders])

  if (loading) {
    return (
      <POSLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </POSLayout>
    )
  }

  return (
    <POSLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your venue overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Sales */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.todaySales.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.activeOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.completedOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-gray-400" size={48} />
                <p className="text-gray-600 mt-4">No orders yet</p>
                <Link
                  to="/venue/pos/orders"
                  className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Order
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-3 h-3 rounded-full
                        ${order.status === 'pending' ? 'bg-yellow-400' : ''}
                        ${order.status === 'preparing' ? 'bg-blue-400' : ''}
                        ${order.status === 'ready' ? 'bg-green-400' : ''}
                        ${order.status === 'served' ? 'bg-gray-400' : ''}
                      `} />
                      <div>
                        <p className="font-medium text-gray-900">
                          Order #{order.order_number}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.table_number ? `Table ${order.table_number}` : 'Pickup'}
                          {order.customer_name && ` • ${order.customer_name}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${Number(order.total || 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          {order.status}
                        </p>
                      </div>
                      <Clock className="text-gray-400" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/venue/pos/orders"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors text-center"
          >
            <ShoppingCart className="mx-auto mb-3" size={32} />
            <h3 className="text-lg font-bold">New Order</h3>
            <p className="text-sm mt-1 opacity-90">Create a new order</p>
          </Link>

          <Link
            to="/venue/pos/kitchen"
            className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition-colors text-center"
          >
            <Users className="mx-auto mb-3" size={32} />
            <h3 className="text-lg font-bold">Kitchen Display</h3>
            <p className="text-sm mt-1 opacity-90">View active orders</p>
          </Link>

          <Link
            to="/venue/pos/tables"
            className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition-colors text-center"
          >
            <Users className="mx-auto mb-3" size={32} />
            <h3 className="text-lg font-bold">Manage Tables</h3>
            <p className="text-sm mt-1 opacity-90">View table status</p>
          </Link>
        </div>
      </div>
    </POSLayout>
  )
}

export default withPOSProvider(Dashboard)
