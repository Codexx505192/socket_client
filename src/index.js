import React from "react";
import { createRoot }  from 'react-dom/client'
import { BrowserRouter as Router} from 'react-router-dom'
import App from './components/App'
import "./styles/main.css"
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
<Router>
<App />
</Router>
)