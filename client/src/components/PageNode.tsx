import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Handle, Position } from 'reactflow'
import { PageNode as PageNodeType } from '@/types'
import './PageNode.css'

interface PageNodeProps {
  data: PageNodeType & { label: string }
}

const PageNode: React.FC<PageNodeProps> = ({ data }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [nodeRef, setNodeRef] = useState<HTMLDivElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isPositioned, setIsPositioned] = useState(false) // 위치 계산 완료 여부

  useEffect(() => {
    if (nodeRef && showTooltip) {
      const rect = nodeRef.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 20,
      })
      // 위치 계산 완료
      setIsPositioned(true)
    }
  }, [nodeRef, showTooltip])

  const handleMouseEnter = () => {
    setShowTooltip(true)
    setImageLoaded(false)
    setIsPositioned(false) // 초기화
    
    if (nodeRef) {
      const rect = nodeRef.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 20,
      })
      // 다음 프레임에 위치 확정
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

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        ref={setNodeRef}
        className="page-node"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="page-node-content">
          <div className="page-node-title">{data.title}</div>
          <div className="page-node-route">{data.route}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />

      {showTooltip && tooltipPosition && createPortal(
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
            클릭하여 사이트로 이동
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default PageNode