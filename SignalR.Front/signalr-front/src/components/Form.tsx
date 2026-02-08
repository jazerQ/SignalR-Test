import { useState } from "react";

interface FormProps 
{
    onSubmit: (userName: string, chatRoom: string) => void; //функция из App
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
    /* чтобы достать значение из инпутов, нужно использовать стейты */
    /* буду использовать два стейта, первый стейт  хранит username*/
    const [userName, setUserName] = useState("");
    /* второй стейт хранит чатРум */
    const [chatRoom, setChatRoom] = useState("");   
    
    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(userName, chatRoom);
    } ;

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl mb-4 font-bold">Онлайн чат</h2>

            <input 
                type="text"
                name="name"
                value={userName}
                /* и потом в этих инпутах  при ихменении я буду менять значение переменной */
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Введите ваше имя"
                className="w-full mb-4 p-2 border rounded"
            />

            <input 
                type="text"
                name="chatRoom"
                value={chatRoom}
                onChange={(e) => setChatRoom(e.target.value)}
                placeholder="Введи Id чата"
                className="w-full mb-4 p-2 border rounded"
            />

            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Присоединиться
            </button>

        </form>
    );
};

export default Form;