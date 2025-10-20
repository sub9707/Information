import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Handle, Position } from 'reactflow'
import { TableNodeData } from '@/types'
import './TableNode.css'

interface TableNodeProps {
  data: TableNodeData
}

const TableNode: React.FC<TableNodeProps> = ({ data }) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [nodeRef, setNodeRef] = useState<HTMLDivElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)
  const [isPositioned, setIsPositioned] = useState(false)

  useEffect(() => {
    if (nodeRef && showTooltip) {
      const rect = nodeRef.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 20,
      })
      setIsPositioned(true)
    }
  }, [nodeRef, showTooltip])

  const handleMouseEnter = () => {
    setShowTooltip(true)
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
    setTooltipPosition(null)
    setIsPositioned(false)
  }

  const primaryKeys = data.columns.filter(col => col.key === 'PRI')
  const foreignKeys = data.columns.filter(col => col.key === 'MUL' || col.key === 'UNI')
  const regularColumns = data.columns.filter(col => !col.key || (col.key !== 'PRI' && col.key !== 'MUL' && col.key !== 'UNI'))

  // 카테고리별 색상
  const categoryColors: Record<string, string> = {
    core: '#3b82f6',
    auth: '#10b981',
    event: '#f59e0b',
    content: '#8b5cf6',
    analytics: '#06b6d4',
    security: '#ef4444',
    admin: '#ec4899',
  }

  const borderColor = categoryColors[data.category] || '#3b82f6'

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        ref={setNodeRef}
        className="table-node"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ borderColor }}
      >
        <div className="table-node-header" style={{ backgroundColor: `${borderColor}15` }}>
          <div className="table-node-title">{data.tableName}</div>
          <div className="table-node-category">{data.category}</div>
        </div>
        <div className="table-node-body">
          <div className="table-node-description">{data.description}</div>
          <div className="table-node-stats">
            <span>{data.columns.length} columns</span>
            {data.relationships.length > 0 && (
              <span>→ {data.relationships.length} relations</span>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />

      {showTooltip && tooltipPosition && createPortal(
        <div 
          className={`table-node-tooltip-portal ${isPositioned ? 'positioned' : ''}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="tooltip-header">
            <h4 className="tooltip-title">{data.tableName}</h4>
            <div className="tooltip-meta">
              <span className="tooltip-category" style={{ backgroundColor: `${borderColor}20`, color: borderColor }}>
                {data.category}
              </span>
              <span className="tooltip-description">{data.description}</span>
            </div>
          </div>

          <div className="tooltip-body">
            {/* 왼쪽: 컬럼 정보 */}
            <div className="tooltip-columns">
              <h5 className="section-title">Columns</h5>
              <div className="columns-list">
                {primaryKeys.length > 0 && (
                  <div className="column-group">
                    <div className="column-group-title">Primary Keys</div>
                    {primaryKeys.map((col, idx) => (
                      <div key={idx} className="column-item primary">
                        <span className="column-name">{col.name}</span>
                        <span className="column-type">{col.type}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {foreignKeys.length > 0 && (
                  <div className="column-group">
                    <div className="column-group-title">Foreign Keys</div>
                    {foreignKeys.map((col, idx) => (
                      <div key={idx} className="column-item foreign">
                        <span className="column-name">{col.name}</span>
                        <span className="column-type">{col.type}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {regularColumns.length > 0 && regularColumns.slice(0, 5).map((col, idx) => (
                  <div key={idx} className="column-item">
                    <span className="column-name">{col.name}</span>
                    <span className="column-type">{col.type}</span>
                  </div>
                ))}
                
                {regularColumns.length > 5 && (
                  <div className="column-item more">
                    +{regularColumns.length - 5} more columns
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 샘플 데이터 */}
            <div className="tooltip-sample-data">
              <h5 className="section-title">Sample Data</h5>
              {data.sampleData.length > 0 ? (
                <div className="sample-table-container">
                  <table className="sample-table">
                    <thead>
                      <tr>
                        {Object.keys(data.sampleData[0]).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.sampleData.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((value, vIdx) => (
                            <td key={vIdx}>{String(value)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="no-data">샘플 데이터 없음</div>
              )}
            </div>
          </div>

          {data.relationships.length > 0 && (
            <div className="tooltip-footer">
              <strong>Relationships:</strong> {data.relationships.join(', ')}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}

export default TableNode