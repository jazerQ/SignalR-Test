import { useState } from "react";
import { Message } from "./Message"

export const Chat = ({ messages, chatRoom, closeChat }) => {
    return (
      <div className="w-1/2 bg-white p-8 rounded shadow-lg">
          <div className="flex flex-row justify-between mb-5">
              <h2 className="text-2xl mb-4 font-bold">{chatRoom}</h2>
              <button onClick={closeChat} className="text-red-500 hover:text-red-700 font-bold">
                  ✕
              </button>
          </div>
          <div className="flex flex-col overflow-auto scroll-smooth h-96 gap-3 pb-3">
              {messages.map((messageInfo, index) => (
                  <Message messageInfo={messageInfo} key={index} />
              ))}
          </div>
      </div>
    );
}