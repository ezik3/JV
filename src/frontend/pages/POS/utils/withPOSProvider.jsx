import { POSProvider } from '../contexts/POSContext'

/**
 * Higher-Order Component to wrap POS pages with POSProvider
 * Usage: export default withPOSProvider(YourComponent)
 */
export default function withPOSProvider(Component) {
  return function WrappedComponent(props) {
    return (
      <POSProvider>
        <Component {...props} />
      </POSProvider>
    )
  }
}
