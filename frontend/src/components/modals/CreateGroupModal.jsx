import React, { useState } from "react";
import { Plus, Camera, User, Loader2 } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { useGroupStore } from "../../store/useGroupStore";

const CreateGroupModal = () => {
  const [onNext, setOnNext] = useState(false)

  const { users } = useChatStore();
  const { isCreatingGroup, createGroup } = useGroupStore();

  const [selectedUsers, setSelectedUsers] = useState([])
  const [groupName, setGroupName] = useState('')
  const [groupIcon, setGroupIcon] = useState('')


  const resetForm = () => {
    setGroupIcon('')
    setGroupName('')
    setSelectedUsers([])
    setOnNext(false)
  }

  const onCheckedValue = (e) => {
    const { checked, value } = e.target 
    if(checked){
      setSelectedUsers([...selectedUsers, value])
    }
    else{
      setSelectedUsers(selectedUsers.filter((item) => item !== value))
    }
  }



  const handleImageUpload = (e) => {
    const file = e.target.files[0]

    if(!file) return;

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result
      setGroupIcon(base64Image)
      
    }

  }

  const validateForm = () => {
    if(!groupName.trim()) return toast.error("Full name is required.")

    return true
  }

  const handleCreateGroup = () => {
    const success = validateForm()

    if (success === true) {
      createGroup({groupName, groupIcon, members: selectedUsers})
    }
    
    document.getElementById("my_modal_5").close()
    resetForm()
  }

  

  return (
    <div>
      <button
        className="btn btn-sm"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        Create <Plus className="size-4" />
      </button>

      <dialog id="my_modal_5" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{!onNext ? 'Users' : 'Create'}</h3>

          <div className={`overflow-y-auto w-full h-80 py-3 ${onNext ? 'hidden' : ''}`}>
            {users.map((user) => (
              <button
                key={user._id}
                className="w-full p-2 flex items-center justify-between gap-3 border-b-2"
              >
                <div className="flex items-center gap-2">
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.name}
                      className="size-12 object-cover rounded-full"
                    />
                  </div>

                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                  </div>
                </div>
                <div className="felx items-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedUsers.includes(user._id)}
                    value={user._id}
                    onChange={onCheckedValue}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className={`w-full h-80 py-3 ${!onNext ? 'hidden' : ''}`}>
            <div className="space-y-6 mb-8">
              <div className="flex flex-col items-center gap-4 group text-center">
                <div className="gap-2">
                  <p>Your Group Icon</p>
                </div>

      
                <div className="relative">
                  <img
                    src={groupIcon || "/avatar.png"}
                    alt="Profile"
                    className="size-28 rounded-full object-cover border-4"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 `}
                  >
                    <Camera className="size-5 text-base-200" />
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      // disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <p className="text-sm">
                  {/* {isUpdatingProfile
                    ? "Uploading..."
                    : "Click the camera icon to upload your photo"} */}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Group Name
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter group name" 
                    className="input input-primary input-md w-full" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-4 ">
            <button className={`btn btn-primary ${!selectedUsers.length > 0 ? 'hidden' : ''}`} onClick={() => setOnNext(!onNext)}>
              {!onNext ? 'Next': 'Back'}
            </button>
            
            <button className={`btn btn-primary ${!onNext ? 'hidden' : ''}`} 
              onClick={() => handleCreateGroup()}
            >
              {isCreatingGroup ? (
                  <Loader2 className='size-5 animate-spin'/>
                ) : (
                  "Create"
                ) }
            </button>

            <form method="dialog">
              <button className="btn" onClick={resetForm}>Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreateGroupModal;
