import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import Form from "./components/Form.jsx";
import {useState} from "react";
import {Chat} from "./components/Chat.jsx";

type ChatMessage = {
  userName: string;
  message: string;
};

function App() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [chatRoom, setChatRoom] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const joinChat = async (userName: string, chatRoom: string) => {
    var connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5018/chat")
      .withAutomaticReconnect()
      .build();

    /* я подписался на метод ReceiveMessage из IChatClient */
    connection.on("ReceiveMessage", (userName: string, message: string) => {
      setMessages((messages) => {
        return [...messages, {userName, message}];
      })
    });

    try{
      await connection.start();
      await connection.invoke("JoinChat", { userName, chatRoom }); // с помощью invoke() я могу вызвать метод хаба, который указан на сервере

      setConnection(connection);
      setChatRoom(chatRoom);
    }catch(error){
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {connection ? <Chat closeChat={null} messages={messages} chatRoom={chatRoom} /> : <Form onSubmit={joinChat}/>}
    </div>
  );
}

export default App;
