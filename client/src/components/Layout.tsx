import React from 'react'
import Header from './Header'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <main className="content-wrapper">
        {children}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            &copy; 2025 모두하나대축제 포트폴리오. 실제 서비스: 
            <a 
              href="https://www.모두하나대축제.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              www.모두하나대축제.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout