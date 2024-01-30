/* eslint-disable react/prop-types */
import { useState } from 'react'
import classes from '../styles/Login.module.css';
export default function Login({ onSubmit }) {
    const [username, setUsername] = useState('');

    return (
        <>
            <div className={classes.fullscreen}>
                <h1>Welcome</h1>
                <p>What should people call you ?</p>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmit(username)
                    }}
                >
                    <input
                        type="text"
                        value={username}
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)} />
                    {/* <input type="submit" /> */}
                    <button className={classes.btn} type='submit'>Enter</button>
                </form>
            </div>
        </>
    )
}
