import { FiMenu } from "react-icons/fi";
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useLogout from '../hooks/useLogout'

import '../App.css'

import { FaHome } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

export default function Header() {
  let logout = useLogout();
  let { auth, setAuth } = useAuth();
  let { pathname } = useLocation();
  let [menu, setMenu] = useState(false);

  let links = [
    { path: '/dashboard', name: 'Dashboard', icon: <MdDashboard /> },
    { path: '/leaderboard', name: 'Leaderboard', icon: <FaHome /> },
    { path: '/watchlist', name: 'Watchlist', icon: <GrTransaction /> },
  ]

  useEffect(() => {
    setMenu(false);
    window.scroll(0, 0)
  }, [pathname])

  return (
    <div className='header w-screen h-[70px] bg-black shadow-lg fixed z-50 top-0 flex justify-center border-b border-gray-800'>
      <div className='headerContainer flex justify-between items-center w-[90%] max-w-6xl'>
        {/* Menu Button */}
        <div className='logoContainer text-white hover:text-gray-300 cursor-pointer transition-colors'>
          <FiMenu 
            onClick={() => { setMenu(true) }} 
            className="text-2xl"
          />
        </div>

        {/* App Name */}
        <div className='text-white text-xl md:text-2xl font-bold'>
          DStocks
        </div>

        {/* User Info */}
        <Link to={`/portfolio`} className='flex items-center gap-4 hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors'>
          <div className='profileContainer'>
            <div className="flex items-center space-x-3">
              <img 
                src={auth.user?.profileImageUrl} 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white" 
                alt="Profile"
              />
              <span className="text-white font-medium text-sm md:text-base hidden md:block">
                {auth.user?.coins} Coins
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Sidebar Menu */}
      {menu && (
        <div className="menuContainer w-screen h-screen fixed z-50 flex">
          {/* Backdrop */}
          <div 
            className="bg-black/50 w-full h-screen" 
            onClick={() => { setMenu(false) }}
          ></div>

          {/* Sidebar */}
          <div className="w-80 h-screen bg-white shadow-xl absolute left-0 top-0 flex flex-col p-6">
            {/* User Profile Section */}
            <div className='flex items-center gap-4 pb-6 border-b border-gray-200 mb-6'>
              <img 
                src={auth.user?.profileImageUrl} 
                className='h-12 w-12 rounded-full border-2 border-black' 
                alt="Profile"
              />
              <div className="flex flex-col">
                <span className="font-bold text-black text-lg">{auth?.user?.username}</span>
                <span 
                  className="cursor-pointer text-gray-600 hover:text-black transition-colors"
                  onClick={() => { logout() }}
                >
                  Sign Out
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <ul className='body flex flex-col gap-2'>
              {links.map((ele, idx) => (
                <NavLink 
                  to={ele.path} 
                  key={idx}
                  className={({ isActive }) => 
                    `flex items-center gap-4 py-4 px-4 font-medium text-lg rounded-lg transition-all ${
                      isActive 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                    }`
                  }
                >
                  <span className="text-xl">{ele.icon}</span>
                  <span>{ele.name}</span>
                </NavLink>
              ))}
            </ul>

            {/* Quick Stats */}
            <div className='mt-auto pt-6 border-t border-gray-200'>
              <div className='bg-gray-100 rounded-lg p-4'>
                <div className='text-black font-bold text-lg mb-2'>
                  Portfolio Value
                </div>
                <div className='text-gray-600 text-sm'>
                  Track your investments
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}