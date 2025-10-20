import { memo, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Handle, Position } from 'reactflow'
import { TableNodeData } from '@/types'
import { CATEGORY_INFO } from '@/constants/database'
import './TableNode.css'

interface TableNodeProps {
  data: TableNodeData
  selected?: boolean
}

const TableNode = memo(({ data, selected }: TableNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const nodeRef = useRef<HTMLDivElement>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (nodeRef.current && showTooltip && !showModal) {
      const rect = nodeRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      
      const tooltipWidth = 420
      const spaceOnRight = viewportWidth - rect.right
      
      if (spaceOnRight < tooltipWidth + 20) {
        setTooltipPosition({
          top: rect.top + rect.height / 2,
          left: rect.left - tooltipWidth - 20
        })
      } else {
        setTooltipPosition({
          top: rect.top + rect.height / 2,
          left: rect.right + 20
        })
      }
    }
  }, [showTooltip, showModal])

  const categoryInfo = CATEGORY_INFO[data.category]
  const borderColor = categoryInfo?.color || '#3b82f6'

  const columns = data.columns || []
  const primaryKeys = data.primaryKeys || []
  const foreignKeys = data.foreignKeys || []
  const relationships = data.relationships || []
  const sampleData = data.sampleData || []

  const primaryKeyColumns = columns.filter(col => primaryKeys.includes(col.name))
  const foreignKeyColumns = columns.filter(col => foreignKeys.includes(col.name))
  const regularColumns = columns.filter(
    col => !primaryKeys.includes(col.name) && !foreignKeys.includes(col.name)
  )

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowModal(true)
    setShowTooltip(false)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  // 샘플 데이터 렌더링
  const renderSampleData = () => {
    if (!sampleData || sampleData.length === 0) {
      return <p className="no-data">샘플 데이터가 없습니다</p>
    }

    // 표시할 컬럼 선택 (최대 8개)
    const displayColumns = columns.slice(0, 8)
    
    return (
      <div className="sample-data-container">
        <div className="sample-data-table-wrapper">
          <table className="sample-data-table">
            <thead>
              <tr>
                {displayColumns.map(col => (
                  <th key={col.name}>{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.slice(0, 5).map((row, idx) => (
                <tr key={idx}>
                  {displayColumns.map(col => (
                    <td key={col.name}>
                      {row[col.name] !== null && row[col.name] !== undefined 
                        ? String(row[col.name]) 
                        : <span className="null-value">NULL</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sampleData.length > 5 && (
          <p className="sample-data-note">... {sampleData.length - 5}개의 행이 더 있습니다</p>
        )}
        {columns.length > 8 && (
          <p className="sample-data-note">{columns.length - 8}개의 컬럼이 더 있습니다</p>
        )}
      </div>
    )
  }

  const renderColumnsList = (cols: typeof columns, className: string) => (
    <ul className={`column-list ${className}`}>
      {cols.map(col => (
        <li key={col.name}>
          <span className="column-name">{col.name}</span>
          <span className="column-type">{col.type}</span>
          {col.comment && <span className="column-comment">{col.comment}</span>}
        </li>
      ))}
    </ul>
  )

  const renderTooltipContent = () => (
    <>
      <div className="tooltip-header" style={{ borderBottomColor: borderColor }}>
        <span className="tooltip-icon">{categoryInfo?.icon || '📦'}</span>
        <div>
          <h3 className="tooltip-title">{data.displayName}</h3>
          <p className="tooltip-subtitle">{data.description}</p>
        </div>
      </div>

      <div className="tooltip-body">
        <div className="tooltip-section">
          <h4 className="tooltip-section-title">Primary Keys</h4>
          {primaryKeyColumns.length > 0 ? (
            renderColumnsList(primaryKeyColumns, 'primary-keys')
          ) : (
            <p className="no-data">없음</p>
          )}
        </div>

        {foreignKeyColumns.length > 0 && (
          <div className="tooltip-section">
            <h4 className="tooltip-section-title">Foreign Keys</h4>
            {renderColumnsList(foreignKeyColumns, 'foreign-keys')}
          </div>
        )}

        {regularColumns.length > 0 && (
          <div className="tooltip-section">
            <h4 className="tooltip-section-title">Columns ({regularColumns.length})</h4>
            <div className="column-list-container">
              {renderColumnsList(regularColumns.slice(0, 10), '')}
              {regularColumns.length > 10 && (
                <p className="more-columns">... {regularColumns.length - 10}개 더 있음</p>
              )}
            </div>
          </div>
        )}

        {relationships.length > 0 && (
          <div className="tooltip-section">
            <h4 className="tooltip-section-title">Relationships</h4>
            <div className="relationships-list">
              {relationships.map((rel, idx) => (
                <span key={`${rel}-${idx}`} className="relationship-badge">{rel}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )

  const renderModalContent = () => (
    <>
      <div className="modal-header" style={{ borderBottomColor: borderColor }}>
        <div className="modal-header-content">
          <span className="modal-icon">{categoryInfo?.icon || '📦'}</span>
          <div>
            <h2 className="modal-title">{data.displayName}</h2>
            <p className="modal-subtitle">{data.description}</p>
          </div>
        </div>
        <button className="modal-close" onClick={closeModal}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="modal-body">
        <div className="modal-section">
          <h3 className="modal-section-title">Primary Keys</h3>
          {primaryKeyColumns.length > 0 ? (
            renderColumnsList(primaryKeyColumns, 'primary-keys')
          ) : (
            <p className="no-data">없음</p>
          )}
        </div>

        {foreignKeyColumns.length > 0 && (
          <div className="modal-section">
            <h3 className="modal-section-title">Foreign Keys</h3>
            {renderColumnsList(foreignKeyColumns, 'foreign-keys')}
          </div>
        )}

        {regularColumns.length > 0 && (
          <div className="modal-section">
            <h3 className="modal-section-title">All Columns ({columns.length})</h3>
            {renderColumnsList(regularColumns, '')}
          </div>
        )}

        {relationships.length > 0 && (
          <div className="modal-section">
            <h3 className="modal-section-title">Relationships ({relationships.length})</h3>
            <div className="relationships-list">
              {relationships.map((rel, idx) => (
                <span key={`${rel}-${idx}`} className="relationship-badge">{rel}</span>
              ))}
            </div>
          </div>
        )}

        {/* Sample Data Section */}
        <div className="modal-section">
          <h3 className="modal-section-title">Sample Data ({sampleData.length} rows)</h3>
          {renderSampleData()}
        </div>
      </div>
    </>
  )

  return (
    <>
      <Handle type="target" position={Position.Top} />
      
      <div
        ref={nodeRef}
        className={`table-node ${selected ? 'selected' : ''}`}
        style={{ borderColor }}
        onMouseEnter={() => !showModal && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleNodeClick}
      >
        <div className="table-node-header" style={{ backgroundColor: borderColor }}>
          <span className="table-node-icon">{categoryInfo?.icon || '📦'}</span>
          <div className="table-node-title">
            <div className="table-node-name">{data.tableName}</div>
            <div className="table-node-category">{categoryInfo?.label || 'Unknown'}</div>
          </div>
        </div>

        <div className="table-node-body">
          <div className="table-node-description">{data.description}</div>
          <div className="table-node-stats">
            <span className="table-node-stat">
              <strong>{data.columnCount || columns.length}</strong> columns
            </span>
            {relationships.length > 0 && (
              <span className="table-node-stat">
                <strong>{relationships.length}</strong> relations
              </span>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />

      {/* Hover Tooltip */}
      {showTooltip && !showModal && tooltipPosition && createPortal(
        <div
          className="table-node-tooltip"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            transform: 'translateY(-50%)'
          }}
        >
          {renderTooltipContent()}
        </div>,
        document.body
      )}

      {/* Click Modal */}
      {showModal && createPortal(
        <div className="table-modal-overlay" onClick={closeModal}>
          <div className="table-modal" onClick={(e) => e.stopPropagation()}>
            {renderModalContent()}
          </div>
        </div>,
        document.body
      )}
    </>
  )
})

TableNode.displayName = 'TableNode'

export default TableNode