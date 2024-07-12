import React from "react";

const Message = ({ user, message }) => {
  console.log({ user, message });
  return (
    <div className="gap-5">
      {user ? (
        <div className="flex justify-start">
          <div
            className={`text-base border-2 border-black pl-2 rounded-lg mt-2 w-[50%]`}
          >
            {`You : ${message}`}
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <div
            className={`text-base border-2 border-gray-300 pl-2 rounded-lg mt-2 w-[50%]`}
          >
            {`Me: ${message}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
