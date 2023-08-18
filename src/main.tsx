import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Route, Router } from 'wouter'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Router>
        <Route path="/" component={App} />
    </Router>
)
