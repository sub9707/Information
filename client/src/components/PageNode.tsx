import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Handle, Position } from 'reactflow'
import { PageNode as PageNodeType } from '@/types'
import ScreenshotModal from './ScreenshotModal'
import './PageNode.css'

interface PageNodeProps {
  data: PageNodeType & { label: string }
}

const PageNode: React.FC<PageNodeProps> = ({ data }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [nodeRef, setNodeRef] = useState<HTMLDivElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isPositioned, setIsPositioned] = useState(false)

  useEffect(() => {
    if (nodeRef && showTooltip && !showModal) {
      const rect = nodeRef.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 20,
      })
      setIsPositioned(true)
    }
  }, [nodeRef, showTooltip, showModal])

  const handleMouseEnter = () => {
    // 모달이 열려있으면 툴팁 표시 안함
    if (showModal) return

    setShowTooltip(true)
    setImageLoaded(false)
    setIsPositioned(false)

    if (nodeRef) {
      const rect = nodeRef.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 20,
      })
      requestAnimationFrame(() => {
        setIsPositioned(true)
      })
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
    setImageLoaded(false)
    setTooltipPosition(null)
    setIsPositioned(false)
  }

  const handleClick = () => {
    const baseUrl = 'https://www.모두하나대축제.com'
    const url = `${baseUrl}${data.route}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // 스크린샷이 없으면 모달 열지 않음
    if (!data.screenshot) {
      return
    }

    // 호버 툴팁 숨기기
    setShowTooltip(false)
    
    // 모달 열기
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        ref={setNodeRef}
        className="page-node"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleRightClick}
        onContextMenu={handleClick}
      >
        <div className="page-node-content">
          <div className="page-node-title">{data.title}</div>
          <div className="page-node-route">{data.route}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />

      {/* 호버 툴팁 - 모달이 열려있을 때는 표시 안함 */}
      {showTooltip && !showModal && tooltipPosition && createPortal(
        <div
          className={`page-node-tooltip-portal ${isPositioned ? 'positioned' : ''}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="tooltip-header">
            <h4 className="tooltip-title">{data.title}</h4>
            <span className="tooltip-route">{data.route}</span>
          </div>

          <div className="tooltip-body">
            {data.screenshot ? (
              <div className="tooltip-screenshot">
                {!imageLoaded && (
                  <div className="screenshot-skeleton">
                    <div className="skeleton-shimmer"></div>
                  </div>
                )}
                <img
                  src={data.screenshot}
                  alt={data.title}
                  className={`screenshot-image ${imageLoaded ? 'loaded' : ''}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </div>
            ) : null}

            <div className="tooltip-content">
              <p className="tooltip-description">{data.description}</p>

              {data.features && data.features.length > 0 && (
                <div className="tooltip-features">
                  <h5 className="tooltip-features-title">주요 기능</h5>
                  <ul className="tooltip-features-list">
                    {data.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="tooltip-footer">
            좌클릭으로 사진 확대 / 우클릭하여 사이트로 이동
          </div>
        </div>,
        document.body
      )}

      {/* 스크린샷 모달 */}
      <ScreenshotModal
        isOpen={showModal}
        onClose={handleCloseModal}
        screenshot={data.screenshot}
        title={data.title}
        route={data.route}
      />
    </>
  )
}

export default PageNode