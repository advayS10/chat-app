import { create } from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuthStore.js'

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],

    getUsers: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get('/message/user')
            set({ users: res.data})
        } catch (error) {
            toast.error(error.response.data.messages)
        }
        finally{
            set({ isUserLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data })
        } catch (error) {
            toast.error(error.response.data.messages)
        }
        finally{
            set({isMessagesLoading: false})
        }
    },

    sendMessages: async (messageData) => {
        const {messages,selectedUser} = get()
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({messages: [...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;

            set({ messages: [...get().messages, newMessage]})
        })

    }, 

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket

        socket.off("newMessage")

    },

    setSelectedUser: (selectedUser) => set({selectedUser}) 
}))