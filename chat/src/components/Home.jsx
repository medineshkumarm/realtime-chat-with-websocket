/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket';
import classes from '../styles/Home.module.css';
import e from 'cors';
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
        // .preventDefault();

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
            <div className={classes.chatArea}>
                <div className={classes.messageContainer}>
                    {/* Render messages */}
                    {messages.map((msg, index) => (
                        <ul key={index} className={classes.message}>
                            {console.log("sender: " + msg.sender, "content: " + msg.content)}
                            <strong>{msg.sender}:</strong> {msg.content}
                            {/* <li className={classes.msgsender}>{msg.sender}</li>
                            <li className={classes.msgcontent}>{msg.content}</li> */}
                        </ul>
                    ))}
                </div>
                <div className={classes.chatInput}>
                    <input
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className={classes.btn} onClick={sendMessage}>send</button>
                    {/* <form onSubmit={sendMessage}>
                        <input
                            type='text'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className={classes.btn} type='submit'>send</button>
                    </form> */}

                </div>
            </div>
        </>
    )
}
