import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useGroupStore = create((set, get) => ({
  groups: [],
  messages: [],
  isUpdatingGroupIcon: false,
  isCreatingGroup: false,
  isGroupsLoading: false,
  selectedGroup: null,
  isMessageLoading: false,

  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

  createGroup: async (groupData) => {
    set({ isCreatingGroup: true });
    try {
      const res = await axiosInstance.post("/group/create", groupData);
      if (res) {
        toast.success("Group Created Successfully!");
      }
    } catch (error) {
      toast.error(error.response.data.messages);
      console.log(error.messages);
    } finally {
      set({ isCreatingGroup: false });
    }
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/group/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.messages);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  getGroupMessages: async (groupId) => {
    set({ isMessageLoading: true })
    try {
      const res = await axiosInstance.get(`/group/messages/${groupId}`)
      set({messages: res.data})
    } catch (error) {
      toast.error(error.response.data.messages)
    } finally {
      set({ isMessageLoading: false })
    }
  },

  sendGroupMessages: async (messageData) => {
    const { messages, selectedGroup } = get() 
    try {
      const res = await axiosInstance.put(`/group/send/${selectedGroup._id}`, messageData)
      set({ messages: [...messages, res.data]})
    } catch (error) {
      toast.error(error.response.data.messages)
    }
  }
}));
