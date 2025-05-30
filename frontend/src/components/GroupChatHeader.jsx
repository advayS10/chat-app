import React from "react";
import { useGroupStore } from "../store/useGroupStore";

const GroupChatHeader = () => {
    const { selectedGroup, setSelectedGroup } = useGroupStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedGroup.groupIcon || "/avatar.png"}
                alt={selectedGroup.groupName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedGroup.groupName}</h3>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedGroup(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default GroupChatHeader;
