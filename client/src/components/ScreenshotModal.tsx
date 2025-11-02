import React from 'react'
import { createPortal } from 'react-dom'
import './ScreenshotModal.css'

export interface ScreenshotModalProps {
  isOpen: boolean
  onClose: () => void
  screenshot: string
  title: string
  route: string
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  screenshot,
  title,
  route,
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return createPortal(
    <div
      className="screenshot-modal-overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="screenshot-modal-title"
    >
      <div className="screenshot-modal-container">
        <div className="screenshot-modal-header">
          <div className="screenshot-modal-info">
            <h2 id="screenshot-modal-title" className="screenshot-modal-title">
              {title}
            </h2>
            <span className="screenshot-modal-route">{route}</span>
          </div>
          <button
            className="screenshot-modal-close"
            onClick={onClose}
            aria-label="닫기"
            type="button"
          >
            ✕
          </button>
        </div>
        
        <div className="screenshot-modal-body">
          <img
            src={screenshot}
            alt={`${title} 스크린샷`}
            className="screenshot-modal-image"
          />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ScreenshotModal