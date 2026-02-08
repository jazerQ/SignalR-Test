import { HubConnectionBuilder } from "@microsoft/signalr";
import Form from "./components/Form";

function App() {
  const joinChat = async (userName: string, chatRoom: string) => {
    var connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5018/chat")
      .withAutomaticReconnect()
      .build();

    /* я подписался на метод ReceiveMessage из IChatClient */
    connection.on("ReceiveMessage", (userName: string, message: string) => {
      console.log(userName);
      console.log(message);
    });

    try{
      await connection.start();
      await connection.invoke("JoinChat", { userName, chatRoom }); // с помощью invoke() я могу вызвать метод хаба, который указан на сервере

      console.log("Присоединился к чату!");
      console.log(connection);
    }catch(error){
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Form onSubmit={joinChat}/>
    </div>
  );
}

export default App;
