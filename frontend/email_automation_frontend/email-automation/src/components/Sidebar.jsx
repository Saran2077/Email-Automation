import { Link, useLocation } from 'react-router-dom'
import { UsersIcon, InboxIcon, ChartBarIcon } from '@heroicons/react/24/outline'

function Sidebar() {
  const location = useLocation()
  
  const navigation = [
    { name: 'Customer Data', href: '/customers', icon: UsersIcon },
    { name: 'Recipients', href: '/recipients', icon: ChartBarIcon },
    { name: 'Mailbox', href: '/mailbox', icon: InboxIcon },
  ]

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-gray-800">Email Automation</h1>
      </div>
      <nav className="mt-5 px-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              location.pathname === item.href
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
          >
            <item.icon
              className={`${
                location.pathname === item.href ? 'text-gray-500' : 'text-gray-400'
              } mr-3 h-6 w-6`}
            />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar 