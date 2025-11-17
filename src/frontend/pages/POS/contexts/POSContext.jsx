import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

const POSContext = createContext()

export const usePOS = () => {
  const context = useContext(POSContext)
  if (!context) {
    throw new Error('usePOS must be used within POSProvider')
  }
  return context
}

export const POSProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentVenue, setCurrentVenue] = useState('default')
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    fetchMenuItems()
    fetchTables()
    fetchOrders()
    subscribeToOrders()

    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      setLoading(false)
    }
    getUser()
  }, [currentVenue])

  // Fetch menu items from Supabase
  const fetchMenuItems = async () => {
    try {
      // For now, using mock data - will connect to actual menu table later
      const mockMenu = [
        { id: '1', name: 'Vodka Tonic', price: 12.00, category: 'Drinks', image_url: null },
        { id: '2', name: 'Margarita', price: 14.00, category: 'Drinks', image_url: null },
        { id: '3', name: 'Wings', price: 16.00, category: 'Food', image_url: null },
      ]
      setMenuItems(mockMenu)
    } catch (error) {
      console.error('Error fetching menu:', error)
    }
  }

  // Fetch tables from Supabase
  const fetchTables = async () => {
    try {
      const { data, error } = await supabase
        .from('venue_tables')
        .select('*')
        .order('table_number')

      if (error) throw error
      setTables(data || [])
    } catch (error) {
      console.error('Error fetching tables:', error)
    }
  }

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  // Subscribe to real-time order updates
  const subscribeToOrders = () => {
    const subscription = supabase
      .channel('orders_channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order update:', payload)
          fetchOrders() // Refresh orders on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  // Add item to cart
  const addToCart = (item, quantity = 1) => {
    const existingItem = cart.find(i => i.id === item.id)

    if (existingItem) {
      setCart(cart.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      ))
    } else {
      setCart([...cart, { ...item, quantity }])
    }
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId))
  }

  // Update cart item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(cart.map(i =>
        i.id === itemId ? { ...i, quantity } : i
      ))
    }
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Calculate cart totals
  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  // Create new order
  const createOrder = async (orderData) => {
    try {
      const { subtotal, tax, total } = getCartTotal()

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_number: orderData.table_number,
          customer_name: orderData.customer_name,
          status: 'pending',
          subtotal,
          tax,
          total,
          staff_id: currentUser?.id,
          order_type: orderData.order_type || 'dine_in',
          notes: orderData.notes
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Insert order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        modifiers: item.modifiers || {},
        notes: item.notes || ''
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart and refresh orders
      clearCart()
      fetchOrders()

      return { success: true, order }
    } catch (error) {
      console.error('Error creating order:', error)
      return { success: false, error }
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error

      fetchOrders()
      return { success: true }
    } catch (error) {
      console.error('Error updating order:', error)
      return { success: false, error }
    }
  }

  const value = {
    // State
    currentUser,
    currentVenue,
    cart,
    orders,
    menuItems,
    tables,
    loading,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    createOrder,
    updateOrderStatus,
    fetchOrders,
    fetchTables,
    setCurrentVenue,
  }

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}
