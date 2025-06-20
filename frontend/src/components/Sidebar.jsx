import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import CreateGroupModal from "./modals/CreateGroupModal.jsx";
import { useGroupStore } from "../store/useGroupStore.js";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const {
    getGroups,
    groups,
    isGroupsLoading,
    selectedGroup,
    setSelectedGroup,
  } = useGroupStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const [selectPeople, setSelectPeople] = useState(true);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;
  if (isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          <div className="flex items-center ">
            <CreateGroupModal />
          </div>
        </div>
        {/* TODO: Online filter toggle */}

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <button
          className={`btn btn-sm rounded-none ${
            selectPeople ? "bg-primary hover:bg-primary/50" : "bg-none "
          } `}
          onClick={() => setSelectPeople(!selectPeople)}
        >
          People
        </button>
        <button
          className={`btn btn-sm rounded-none ${
            !selectPeople ? "bg-primary hover:bg-primary/50" : "bg-none"
          } `}
          onClick={() => setSelectPeople(!selectPeople)}
        >
          Groups
        </button>
      </div>

      <div
        className={`overflow-y-auto w-full py-3 ${
          selectPeople ? "" : "hidden"
        } `}
      >
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>

      <div
        className={`overflow-y-auto w-full py-3 ${
          !selectPeople ? "" : "hidden"
        } `}
      >
        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => setSelectedGroup(group)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
                ${
                  selectedGroup?._id === group._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={group.groupIcon || "/avatar.png"}
                alt={group.groupName}
                className="size-12 object-cover rounded-full"
              />
            </div>

            {/* Group info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{group.groupName}</div>
            </div>
          </button>
        ))}

        {groups.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No Groups</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
