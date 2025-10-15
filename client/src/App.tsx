import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import PageStructurePage from './pages/PageStructurePage'
import ApiInfoPage from './pages/ApiInfoPage'
import SqlInfoPage from './pages/SqlInfoPage'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pages" element={<PageStructurePage />} />
          <Route path="/apis" element={<ApiInfoPage />} />
          <Route path="/sql" element={<SqlInfoPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App