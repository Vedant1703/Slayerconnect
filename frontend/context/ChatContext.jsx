import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{
     const [screen, setScreen]= useState(false);
    const [messages, setMessages]= useState([]);
    const [users, setUsers] = useState([]);
    const [ selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
 const [rightBarToggle, setRightBarToggle] = useState(false);
    const {socket, axios} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = async ()=>{
        try {
            const {data} = await axios.get("/api/messages/users");
            console.log("Fetched users:", data);
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);

            } else {
            console.error("Failed to fetch users:", data.message);
        }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.message);

        }
    }

// function to get messages for selected user
const getMessages = async (userId)=>{
    try {
        const { data } = await axios.get(`/api/messages/${userId}`);
        if(data.success){
            setMessages(data.messages)
        }

    } catch (error) {
        console.error("Error fetching messages:", error);
         toast.error(error.message);
    }
}

// function to send message to selected user
const sendMessage = async (messageData)=>{
    try {
        if (!selectedUser) return;

        const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
        if (data.success) {
            setMessages((prevMessages)=>[...prevMessages, data.newMessage])
        }else{
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
}

// function to subscribe to message for selected user
// const subscribeToMessage = async ()=>{
//     if(!socket){
//         return
//     }else{
//         socket.on("newMessage" ,(newMessage)=>{
//             if(selectedUser && newMessage.senderId === selectedUser._id){
//                 newMessage.seen = true;
//                 setMessages((prevMessages)=>[...prevMessages, newMessage]);
//                 // axios.put(`/api/messages/mark/${newMessage._id}`);
//                 axios.put(`/api/messages/mark/${newMessage._id}`).catch(err => {
//     console.error("Error marking message as seen:", err);
// });


//             }else{
//                 setUnseenMessages((prevUnseenMessages)=>({
//                     ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
//                 }))
//             }
//         })
//     }
// }
const subscribeToMessage = () => {
    if (!socket) return;

    const handler = async (newMessage) => {
        console.log("Received new message via socket:", newMessage);

        if (selectedUser && newMessage.senderId === selectedUser._id) {
            // Currently chatting with the sender; append message live and mark seen
            newMessage.seen = true;
            setMessages((prev) => [...prev, newMessage]);
            try {
                await axios.put(`/api/messages/mark/${newMessage._id}`);
            } catch (err) {
                console.error("Error marking message as seen:", err);
            }
        } else {
            // Not actively chatting; increment unseen count
            setUnseenMessages((prev) => ({
                ...prev,
                [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
            }));
        }
    };

    socket.on("newMessage", handler);

    return () => {
        socket.off("newMessage", handler);
    };
};


// Function to unscribe from messages
// const unsubscribeFromMessages= ()=>{
//     if(socket) socket.off("newMessage");
// }
// useEffect(()=>{
//     subscribeToMessage();
//     return()=> unsubscribeFromMessages();

// }, [socket,selectedUser])

// useEffect(() => {
//     if (!socket) return;
//     subscribeToMessage();
//     return unsubscribeFromMessages();
// }, [socket, selectedUser]);

useEffect(() => {
    if (!socket) return;

    const unsubscribe = subscribeToMessage();
    return unsubscribe;
}, [socket, selectedUser]);


    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        rightBarToggle,setRightBarToggle,
        screen,setScreen
    }
    return (
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}