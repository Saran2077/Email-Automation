// import { Link, useLocation } from 'react-router-dom'
// import { UsersIcon, InboxIcon, ChartBarIcon } from '@heroicons/react/24/outline'

// function Sidebar() {
//   const location = useLocation()
  
//   const navigation = [
//     { name: 'Customer Data', href: '/customers', icon: UsersIcon },
//     { name: 'Recipients', href: '/recipients', icon: ChartBarIcon },
//     { name: 'Mailbox', href: '/mailbox', icon: InboxIcon },
//   ]

//   return (
//     <div className="w-64 bg-white shadow-lg">
//       <div className="flex h-16 items-center justify-center border-b">
//         <h1 className="text-xl font-bold text-gray-800">Email Automation</h1>
//       </div>
//       <nav className="mt-5 px-2">
//         {navigation.map((item) => (
//           <Link
//             key={item.name}
//             to={item.href}
//             className={`${
//               location.pathname === item.href
//                 ? 'bg-gray-100 text-gray-900'
//                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//             } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
//           >
//             <item.icon
//               className={`${
//                 location.pathname === item.href ? 'text-gray-500' : 'text-gray-400'
//               } mr-3 h-6 w-6`}
//             />
//             {item.name}
//           </Link>
//         ))}
//       </nav>
//     </div>
//   )
// }

// export default Sidebar 

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UsersIcon, InboxIcon, ChartBarIcon, ChevronLeftIcon, ChevronRightIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { 
      name: 'Customer Data', 
      href: '/customers', 
      icon: UsersIcon,
      description: 'Manage customer information'
    },
    { 
      name: 'Recipients', 
      href: '/recipients', 
      icon: ChartBarIcon,
      description: 'View and manage recipients'
    },
    { 
      name: 'Mailbox', 
      href: '/mailbox', 
      icon: InboxIcon,
      description: 'Access your mailbox'
    },
  ];

  const NavigationItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={`
          group relative flex items-center p-2 my-1
          rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
          }
        `}
      >
        <item.icon
          className={`
            w-6 h-6 transition-colors duration-200
            ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}
          `}
        />
        
        {!isCollapsed && (
          <span className="ml-3 text-sm font-medium whitespace-nowrap">
            {item.name}
          </span>
        )}
        
        {isCollapsed && (
          <div className="absolute left-14 bg-white px-2 py-1 rounded-md shadow-lg
            invisible opacity-0 group-hover:visible group-hover:opacity-100
            transition-all duration-200 z-50 whitespace-nowrap">
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        <Bars3Icon className="w-6 h-6 text-gray-600" />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-full bg-white
          transition-all duration-300 ease-in-out 
          ${isCollapsed ? 'w-18' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col shadow-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 ">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">
              Email Automation
            </h1>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:block hidden"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-hidden px-3 py-4">
          {navigation.map((item) => (
            <NavigationItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <UsersIcon className="w-4 h-4 text-blue-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;