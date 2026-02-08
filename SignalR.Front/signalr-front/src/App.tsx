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

  /* функция подключения к чату */
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

  /* функция которая отправляет сообщения в чат, вызывает функцию из хаба */
  const sendMessage = async (message: string) => {
    if(connection !== null)
      await connection.invoke("SendMessage", message);
  };

  /* функция закрытия чата */
  const closeChat = async () => {
    if(connection !== null)
      await connection.stop();

    setConnection(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {connection ? <Chat closeChat={closeChat} messages={messages} chatRoom={chatRoom} sendMessage={sendMessage} /> : <Form onSubmit={joinChat}/>}
    </div>
  );
}

export default App;
