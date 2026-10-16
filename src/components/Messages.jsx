import React from 'react'
import styles from '../styles/Messages.module.css'

const Messages = ({ messages, name }) => {
  return (
    <div className={styles.messages}>
         {messages.map(({ user, message }, i) => {
            
            const userName = user?.name || ''
            const currentName = name || ''

          

            const itsMe = userName.trim().toLowerCase() === currentName.trim().toLowerCase()
             const className = itsMe ? styles.me : styles.user

            return(
                <div key={i} className={`${styles.message} ${className}`}>
                <span className={styles.user}>
                    {userName || 'Unknown'}
                </span>

                <div className={styles.r}>
                 <span className={styles.text}>{message}</span>
                </div>
                </div>
            )
         })}
    </div>
  )
}

export default Messages