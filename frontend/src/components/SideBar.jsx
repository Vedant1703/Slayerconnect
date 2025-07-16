import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ChatContext } from '../../context/ChatContext.jsx';

const SideBar = () => {
   
    const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, screen, setScreen} = useContext(ChatContext);

    const { logout, onlineUsers, authUser } = useContext(AuthContext);
    const [input, setInput] = useState(false);
    
    const navigate = useNavigate();
 const toggleScreen = ()=>{
    setScreen(!screen);
    console.log("sceen shifted")
  }
  let scrn = assets.smallscreen;
  if (screen) {
    scrn = assets.fullscreen;
  }
    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())): users;

    useEffect(()=>{
        getUsers();

    },[onlineUsers])

console.log("Users inside SideBar:", users);

    return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl relative overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
            {/* <img src={assets.logo_icon} alt="" className='max-h-8 relative group ' /> */}
            <img src={assets.logo} alt="logo" className='max-w-50  px-2 align-middle ' />
            {/* <div className='relative py-2 group'> 
                <img src={assets.menu_icon}
                alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border-gray-600 text-grey-100 hidden group-hover:block'>
                
            <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
            <hr className='my-2 border-t border-gray-500'/>
            <p onClick={()=>logout()}
            className='cursor-pointer text-sm'>Logout</p>
            </div>
            </div> */}
          
            
        </div>


        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt="search" className='w-3' />
            <input onChange={(e)=>setInput(e.target.value)}
             type="text" className='bg-transparent. border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
        </div>
      </div>
 
     <div className='flex flex-col'>
        {filteredUsers.map((user, index)=>(
            <div onClick={()=>{setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]:0}))}}
            key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                <img src={user?.profilePic || assets.avatar_icon} alt=""  className='w-[35px] aspect-[1/1] rounded-full'/>
                <div className='flex flex-col leading-5'>
                    <p>{user.fullName}</p>
                    {
                        onlineUsers.includes(user._id)
                        ? <span className='text-green-400 text-xs'>Online</span>
                        : <span className='text-neutral-400 text-xs'>Offline</span>
                    }

                </div>
                {unseenMessages[user._id] >0 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 '>{unseenMessages[user._id]}</p>}
            </div>

        ))}
     
       
      </div>
      

       <div className='text-white  flex absolute left-0 right-0 bottom-0  items-center border-t border-gray-600 mb-2 '>
        <hr className='bottom border-orange-50'/>
         <div className='flex items-center  left-0 right-0 gap-3 py-3 mx-4  '>

            <img src={ authUser.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full'/>
            <p 
            className='flex-1 text-lg text-white font-thin flex items-center gap-2'>
                {authUser.fullName}
                
                </p>
               
                
        </div>
           <div className='absolute right-0 group px-4 flex items-center space-x-2'> 
                <img src={assets.menu_icon}
                alt="Menu" className='max-h-5 cursor-pointer' />
               <img onClick={toggleScreen}
         src={scrn} alt="" className='max-h-8 cursor-pointer' />
            <div className='absolute bottom-full right-0 z-20 w-50 p-5 rounded-md bg-[#282142] border-gray-600 text-grey-100 hidden group-hover:block'>
                
            <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
            <hr className='my-2 border-t border-gray-500'/>
            <p onClick={()=>logout()}
            className='cursor-pointer text-sm'>Logout</p>
            </div>
            </div>
           
        </div>
    </div>
    
  )
}

export default SideBar
