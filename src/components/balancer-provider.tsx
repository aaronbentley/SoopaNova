import { Provider as ReactWrapBalancerProvider } from 'react-wrap-balancer'

const BalancerProvider = ({ children }: { children: React.ReactNode }) => (
    <ReactWrapBalancerProvider>{children}</ReactWrapBalancerProvider>
)

export default BalancerProvider
