import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Router from './routes/Router'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Router />
    </BrowserRouter>
  )
}

export default App