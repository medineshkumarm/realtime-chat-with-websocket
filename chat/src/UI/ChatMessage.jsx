import classes from '../styles/ChatMessage.module.css';
export default function ChatMessage({ message, sender }) {
    return (
        <>
            <li className={classes.msgcontent}>{message}</li>
            <li className={classes.msgsender}>{sender}</li>


        </>
    )
}
