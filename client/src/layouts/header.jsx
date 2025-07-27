import { FiMenu } from "react-icons/fi";
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useLogout from '../hooks/useLogout'

import '../App.css'


import { FaHome } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { MdDashboard } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";;

function Header() {
  let logout = useLogout();
  let { auth, setAuth } = useAuth();
  let { pathname } = useLocation();
  let [menu, setMenu] = useState(false);

  console.log(auth.profileImage)


  let links = [
   { path: '/dashboard', name: 'Dashboard' }, { path: '/leaderboard', name: 'Leaderboard' }, { path: '/watchlist', name: 'Watchlist' }, { path: '/changePassword', name: 'Change Password' },
  ]

  let icons = {
    'Home': <FaHome />,
    'Change Password': <RiLockPasswordFill />,
    'Transactions': <GrTransaction />,
    'Dashboard': <MdDashboard />,
  }


  useEffect(() => {
    setMenu(false);
    window.scroll(0, 0)
  }, [pathname])

  return (
    <div className='header w-screen h-[65px] bg-black shadow-sm shadow-[#ffffff] fixed z-1 top-0 flex justify-center'>
      <div className='headerContainer flex justify-between items-center w-[85%]'>
        <div className='logoContainer text-white hover:text-[#4242FA] font-serif font-bold text-2xl cursor:pointer'>
          <FiMenu onClick={() => { setMenu(true) }} />
        </div>

        <ul className='headerMiddle w-[50%] hidden md:flex text-white font-medium text-md lg:text-xl font-poppins justify-evenly items-center'>
          <NavLink to='/watchlist'>
            <li>Watchlist</li>
          </NavLink>
          <NavLink to='/portfolio'>
            <li>Portfolio</li>
          </NavLink>
          <NavLink to='/leaderboard'>
            <li>Leaderboard</li>
          </NavLink>
        </ul>

        <Link to={`/portfolio`} className='flex items-center gap-4'>

          <div className='profileContainer'>
            <div className="flex items-center space-x-4">
              <img src={auth.user.profileImageUrl} className="w-10 h-10 rounded-full" />
              <span className="text-white font-medium">
                {auth.user.coins} Coins
              </span>
            </div>
          </div>
        </Link>
      </div>

      {menu && <div className="menuContainer w-screen h-screen fixed z-10 flex flex-row-reverse">

        <div className="right-0 top-0 bg-amber-100 w-full h-screen blur-xs opacity-20 z-10" onClick={() => { setMenu(false) }}>
        </div>


        <div className="left top-0 left-0 w-auto lg:w-[30%] h-screen bg-[#12101D] z-11 text-black flex flex-col px-4 py-8 gap-6">

          <ul className='footer flex justify-between items-center py-3 font-normal text-[16px] md:text-[18px] rounded-lg place-content-center px-1 gap-1
          bg-[#1E1A31] md:px-8'>
            <span className='profileImage pt-1'>
              <img src={auth.user.profileImageUrl} className='h-10 w-10 text-white rounded-full' />
            </span>
            <div className="profileright flex flex-col">
              <span className="name font-bold flex place-content-end text-white">{auth?.user?.username}</span>
              <span className="cursor-pointer text-[14px] md:text-[16px] text-[#7b7b7e]" onClick={() => { logout() }}>
                logout
              </span>
            </div>
          </ul>

          <ul className='body flex flex-col self-start gap-4 text-white w-full px-2'>
            {links.map((ele, idx) => {
              return <NavLink to={ele.path} key={idx} className='py-3 font-normal text-[16px] md:text-[18px] rounded-lg hover:bg-[#1E1A31]   place-content-center flex align-center justify-start px-5 gap-1 w-full'>
                <span className="icon pt-1">{icons[ele.name]}</span>
                <span className="name">{ele.name}</span>
              </NavLink>
            })}
          </ul>

        </div>

      </div>}

    </div>
  )
}


export default Header
