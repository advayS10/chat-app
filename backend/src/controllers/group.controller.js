import cloudinary from "../lib/cloudinary.js"
import Group from "../models/group.model.js"
import Message from "../models/message.model.js"

export const createGroup = async (req, res) => {
    try {
        const {groupName, groupIcon, members} = req.body
        const userId = req.user._id
        let imageUrl
        if(groupIcon){
            const uploadResponse = await cloudinary.uploader.upload(groupIcon)
            imageUrl = uploadResponse.secure_url
        }
        
        const newGroup = new Group({
            groupName,
            groupIcon: imageUrl,
            admin: [userId],
            members: [...members, userId],
        })

        await newGroup.save()

        res.status(200).json(newGroup)
    } catch (error) {
        console.log("Error in createGroup", error.message)
        res.status(500).json({ message: "Internal Server Error"})
    }

}

export const getGroupForSidebar = async (req, res) => {
    try {
        const userId = req.user._id
        const filteredGroups = await Group.find({ members: {$in: [userId]}}).select('-message')

        res.status(200).json(filteredGroups)
    } catch (error) {
        console.log("Error in getGroupForSidebar", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getGroupMessages = async (req, res) => {
    try {
        const myId = req.user._id
        const {id:groupId} = req.params

        const group = await Group.find({ _id: groupId}).populate('message')

        res.status(200).json(group)

    } catch (error) {
        console.log("Error in getGroupMessages", error.message)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

export const sendGroupMessages = async (req, res) => {
    try {
        const {text, image} = req.body
        const {id:groupId} = req.params
        const userId = req.user._id

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId: userId,
            text,
            image: imageUrl
        })

        await newMessage.save()
        
        console.log(newMessage)

        const groupMessage = await Group.findOneAndUpdate({ _id: groupId}, {
            $push: {message: newMessage}
        })

        //todo: realtime functionality

        res.status(200).json(groupMessage)
    } catch (error) {
        console.log("Error in sendGroupMessages", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const updateGroup = async (req, res) => {
    try {
        const {id:groupId} = req.params
        const {groupName, groupIcon, admin, members} = req.body

        let imageUrl
        if(groupIcon){
            const uploadResponse = await cloudinary.uploader.upload(groupIcon)
            imageUrl = uploadResponse.secure_url
        }

        const updatedGroup = await Group.findByIdAndUpdate({_id:groupId}, 
            {
                groupName,
                groupIcon: imageUrl, 
                $push: {
                    admin: admin,
                    members: members
                }
            },
            {
                new: true
            }
        )

        res.status(200).json(updatedGroup)

    } catch (error) {
        console.log("Error in updateGroup", error.message)
        res.status(500).json({ message:"Internal Server Error" })
    }
}

export const deleteGroup = async (req, res) => {
    try {
        const {id:groupId} = req.params
        
        const group = await Group.find({ _id: groupId})

        if(!group){
            res.status(404).json({message: "Group not found."})
        }

        const deleteGroup = await Group.findByIdAndDelete({_id: groupId})

        if(deleteGroup){
            res.status(200).json({ message: "Group Deleted Successfully."})
        }
        
    } catch (error) {
        console.log("Error in deleteGroup", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}