import React, { useState } from 'react'
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
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (nodeRef) {
      const rect = nodeRef.getBoundingClientRect()
      setTooltipPosition({
        top: rect.bottom + 16, // 노드 하단 + 여백
        left: rect.left + rect.width / 2, // 노드 중앙
      })
    }
    setShowTooltip(true)
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
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        <div className="page-node-content">
          <div className="page-node-title">{data.title}</div>
          <div className="page-node-route">{data.route}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />

      {showTooltip && createPortal(
        <div 
          className="page-node-tooltip-portal"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="tooltip-header">
            <h4 className="tooltip-title">{data.title}</h4>
            <span className="tooltip-route">{data.route}</span>
          </div>
          <p className="tooltip-description">{data.description}</p>
          {data.features && data.features.length > 0 && (
            <div className="tooltip-features">
              <h5 className="tooltip-features-title">주요 기능</h5>
              <ul className="tooltip-features-list">
                {data.features.slice(0, 4).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="tooltip-screenshot">
            <img
              src={data.screenshot}
              alt={data.title}
              loading="lazy"
            />
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