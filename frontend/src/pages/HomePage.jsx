import React, { useContext, useState } from 'react'
import SideBar from '../components/SideBar.jsx'
import ChatContainer from '../components/ChatContainer.jsx'
import RightSideBar from '../components/RightSideBar.jsx'
import { ChatContext } from '../../context/ChatContext.jsx'

const HomePage = () => {
  const {selectedUser, rightBarToggle, screen} = useContext(ChatContext);

 

 
  return (
    <div className={` ${screen ?'border w-full h-screen sm:px-[15%] sm:py-[5%]' : 'border w-full h-screen'} `}>
    <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2x1
    overflow-hidden h-[100%] grid grid-cols-1 relative ${(selectedUser && rightBarToggle) ?
      'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'grid grid-cols-[1fr_2fr]' }`}>
        <SideBar />
        <ChatContainer />
        <RightSideBar />
      </div>
    </div>
  )
}

export default HomePage
