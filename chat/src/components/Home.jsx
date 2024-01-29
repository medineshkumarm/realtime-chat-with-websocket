/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket';

// const renderUsersList = users => {
//     return (
//         <ul>
//             {Object.keys(users).map(uuid => {
//                 return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
//             })}
//         </ul>
//     )
// }

export default function Home({ username }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const WS_URL = 'ws://127.0.0.1:8000';
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
        queryParams: { username }
    })

    const sendMessage = () => {

        sendJsonMessage({
            type: "text",
            content: message
        });

        setMessage('');
    }
    useEffect(() => {
        if (lastJsonMessage && lastJsonMessage.type === 'text') {
            // Add the received message to the messages list
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    type: 'text',
                    content: lastJsonMessage.content,
                    sender: lastJsonMessage.sender
                }
            ]);
        }
        // Add logic for other message types if needed
    }, [lastJsonMessage]);


    return (
        <>
            {/* {lastJsonMessage && <p>user: {renderUsersList(lastJsonMessage)}</p>} */}
            <div>
                <div>
                    {/* Render messages */}
                    {messages.map((msg, index) => (
                        <p key={index}>
                            <strong>{msg.sender}:</strong> {msg.content}
                        </p>
                    ))}
                </div>
            </div>
            <input
                type='text'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>send</button>
        </>
    )
}
