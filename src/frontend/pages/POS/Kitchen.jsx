import { useEffect, useState } from 'react'
import POSLayout from './components/Layout'
import { usePOS } from './contexts/POSContext'
import withPOSProvider from './utils/withPOSProvider'
import { Clock, ChefHat, CheckCircle, AlertCircle } from 'lucide-react'

function Kitchen() {
  const { orders, updateOrderStatus } = usePOS()
  const [filter, setFilter] = useState('active') // 'active' | 'all'

  // Filter orders for kitchen display
  const kitchenOrders = orders.filter(order => {
    if (filter === 'active') {
      return order.status === 'pending' || order.status === 'preparing'
    }
    return true
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'served':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTimeElapsed = (createdAt) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMinutes = Math.floor((now - created) / 1000 / 60)

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes === 1) return '1 min ago'
    return `${diffMinutes} mins ago`
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus)
  }

  return (
    <POSLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat size={32} className="text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kitchen Display</h1>
                <p className="text-gray-600 mt-1">Real-time order monitoring</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('active')}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-colors
                  ${filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                Active Orders
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-colors
                  ${filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                All Orders
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Preparing</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {orders.filter(o => o.status === 'preparing').length}
                </p>
              </div>
              <ChefHat className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Ready</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {kitchenOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <ChefHat size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders</h3>
            <p className="text-gray-600">
              {filter === 'active' ? 'No active orders at the moment' : 'No orders yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchenOrders.map((order) => (
              <div
                key={order.id}
                className={`
                  bg-white rounded-lg shadow-lg border-2 overflow-hidden
                  ${getStatusColor(order.status)}
                `}
              >
                {/* Order Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      #{order.order_number}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{getTimeElapsed(order.created_at)}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {order.table_number && (
                      <span className="font-medium">Table {order.table_number}</span>
                    )}
                    {order.customer_name && (
                      <span className="ml-2">• {order.customer_name}</span>
                    )}
                    {order.order_type && order.order_type !== 'dine_in' && (
                      <span className="ml-2 uppercase font-medium">• {order.order_type}</span>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 bg-white">
                  <div className="space-y-2 mb-4">
                    {order.order_items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {item.quantity}x {item.name}
                          </span>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-1">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                      <p className="text-sm font-medium text-yellow-900">
                        Special Instructions:
                      </p>
                      <p className="text-sm text-yellow-800 mt-1">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'served')}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                      >
                        Mark Served
                      </button>
                    )}

                    {order.status === 'served' && (
                      <div className="flex-1 text-center py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium">
                        Completed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </POSLayout>
  )
}

export default withPOSProvider(Kitchen)
