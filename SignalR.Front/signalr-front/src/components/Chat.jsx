import { useState } from "react";
import { Message } from "./Message"

export const Chat = ({ messages, chatRoom, closeChat, sendMessage }) => {
    const [message, setMessage] = useState("");

    const onSendMessage = () => {
        sendMessage(message);
        setMessage("");
    };

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
          <div className="flex gap-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage();
                    }
                }}
                placeholder="Введите сообщение"
                rows={2}
                className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={onSendMessage} className="
                bg-blue-500
                hover:bg-blue-600
                text-white
                font-semibold
                py-2 px-4
                rounded
                shadow
                transition-colors
                duration-200
              ">
                  Отправить
              </button>
          </div>
      </div>
    );
}