import { Routes, Route } from 'react-router-dom'
import { Layout } from './app/layout'
import { Editor, Profile, Pro, Discover } from './pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Discover />} />
        <Route path="editor" element={<Editor />} />
        <Route path="u/:slug" element={<Profile />} />
        <Route path="pro" element={<Pro />} />
        <Route path="discover" element={<Discover />} />
      </Route>
    </Routes>
  )
}

export default App
