import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../styles/Chat.module.css'
import Messages from './Messages'

const socket = io.connect('https://online-chat-gzg8.onrender.com')

const Chat = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  
  const [params, setParams] = useState({ room: "", name: "" })
  const [state, setState] = useState([])
  const [users, setUsers] = useState([]) 
  const [message, setMessage] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  
  const emojiRef = useRef(null)

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search))
    setParams(searchParams)
    socket.emit('join', searchParams)
  }, [search])

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setState((_state) => [..._state, data])
    })
    
    
    socket.on('joinRoom', ({ data: { users } }) => {
      setUsers(users)
    })
  }, [])

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const leftRoom = () => {
    socket.emit('leftRoom', { params })
    navigate('/')
  }

  const handleChange = ({ target: { value } }) => setMessage(value)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!message.trim()) return

    socket.emit('sendMessage', { message, params })

    setMessage("")
  }

  // При выборе эмодзи вставляем его в инпут и закрываем пикер
  const onEmojiClick = ({ emoji }) => {
    setMessage((prev) => `${prev} ${emoji}`)
    setIsOpen(false) 
  }

  return (
    <section className={styles.chatBack}>
    <div className={styles.container}>
      <div className={styles.room_container}>
        
     
        <header className={styles.room_header}>
          <div className={styles.room_title}>{params.room}</div>
          <div className={styles.room_status}>{users.length} users in this room</div>
          
          <button className={styles.btn_leave} onClick={leftRoom}>
            Left the room
          </button>
        </header>

       
        <main className={styles.room_content}>
          <div className={styles.messages_list}>
            <Messages messages={state} name={params.name} />
          </div>
        </main>

        
        <form onSubmit={handleSubmit}>
          <footer className={styles.room_footer}>
            <div className={styles.chat_form}>
              <input 
                type="text" 
                className={styles.chat_input} 
                placeholder="What do you want to say?" 
                name='message' 
                value={message} 
                onChange={handleChange}
                autoComplete='off'
                required
              />
            </div>

            <div className={styles.emoji_bl} ref={emojiRef}>
              <div className={styles.emoji} onClick={() => setIsOpen((prev) => !prev)}>
                <img src="./img/emoji.png" alt="emoji" />
              </div>

              {isOpen && (
                <div className={styles.rm} >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick} 
                    />
                </div>
              )}

              <button type="submit" className={styles.btn_send}>
                Send a message
              </button>
            </div>
          </footer>
        </form>

      </div>
    </div>
    </section>
  )
}

export default Chat