import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { Camera, User, Mail } from 'lucide-react'

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore()
  const [seletedImage, setSelectedImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]

    if(!file) return;

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = async () => {
      const base64Image = reader.result
      setSelectedImage(base64Image)
      await updateProfile({profilePic: base64Image})
    }
  }

  return (
    <>
      <div className='min-h-screen pt-8'>
        <div className='flex flex-col items-center space-y-6 justify-center p-6 sm:p-12'>
          {/* Upper div */}
          <div className='w-full max-w-2xl px-6 space-y-8 bg-base-300'>
            <div className='space-y-6 mb-8'>
              <div className='flex flex-col items-center gap-4 group pt-8 text-center'>
                <div className='gap-2'>
                  <h1 className='text-2xl font-semibold'>Profile</h1>
                  <p>Your profile information</p>
                </div>
                

                {/* avatar upload section */}
                <div className='relative'>
                  <img 
                    src={seletedImage || authUser.profilePic || "/avatar.png"}
                    alt='Profile'
                    className='size-32 rounded-full object-cover border-4'
                  />
                  <label
                  htmlFor='avatar-upload'
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                  >
                    <Camera className='size-5 text-base-200'/>
                    <input 
                      type='file'
                      id='avatar-upload'
                      className='hidden'
                      accept='image/*'
                      onChange={handleImageUpload}
                      disabled={isUpdatingProfile}
                    />
                  </label>
                </div>
                <p className='text-sm'>
                  {isUpdatingProfile ? "Uploading..." : "Click the camera icon to upload your photo"}
                </p>

              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                </div>

              </div>

            </div>
          </div>

          {/* Lower div */}
          <div className='w-full max-w-2xl px-6 py-8 bg-base-300'>
            <h2 className='text-lg font-medium mb-4'>Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default ProfilePage