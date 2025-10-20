import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  NodeMouseHandler
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useDatabase } from '@/hooks/useDatabase'
import { CATEGORY_FILTERS } from '@/constants/database'
import TableNode from '@/components/TableNode'
import './SqlInfoPage.css'

const nodeTypes = {
  tableNode: TableNode
}

const SqlInfoPage = () => {
  const {
    loading,
    error,
    nodes: initialNodes,
    edges: initialEdges,
    selectedCategory,
    setSelectedCategory
  } = useDatabase()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [showInstructions, setShowInstructions] = useState(false)
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null)

  // 초기 노드/엣지가 로드되면 상태 업데이트
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance
    setTimeout(() => {
      instance.fitView({ padding: 0.2, duration: 400 })
    }, 100)
  }, [])

  // initialNodes가 변경될 때마다 nodes 업데이트
  if (initialNodes.length > 0 && (nodes.length === 0 || nodes !== initialNodes)) {
    setNodes(initialNodes)
  }

  // initialEdges가 변경될 때마다 edges 업데이트
  if (initialEdges.length > 0 && (edges.length === 0 || edges !== initialEdges)) {
    setEdges(initialEdges)
  }

  // 노드 클릭 시 포커스
  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    if (reactFlowInstanceRef.current) {
      reactFlowInstanceRef.current.fitView({
        padding: 0.3,
        duration: 400,
        nodes: [node]
      })
    }
  }, [])

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>SQL 테이블 정보를 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-error">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="sql-info-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">SQL 테이블 구조</h1>
            <p className="page-description">
              MariaDB 데이터베이스의 테이블 구조와 관계를 확인할 수 있습니다.
            </p>
          </div>
          <div className="header-controls">
            <div className="category-selector">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`category-button ${selectedCategory === cat.value ? 'active' : ''}`}
                  style={
                    selectedCategory === cat.value
                      ? { backgroundColor: cat.color, borderColor: cat.color }
                      : {}
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="info-button"
              title="사용 안내"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="instructions-tooltip">
          <button onClick={() => setShowInstructions(false)} className="instructions-close">
            ×
          </button>
          <h3 className="instructions-title">사용 안내</h3>
          <ul className="instructions-list">
            <li>테이블 노드에 마우스를 올리면 상세 컬럼 정보를 확인할 수 있습니다</li>
            <li>화살표는 테이블 간의 외래키 관계를 나타냅니다</li>
            <li>카테고리 버튼으로 특정 그룹의 테이블만 필터링할 수 있습니다</li>
            <li>마우스 휠로 확대/축소, 드래그로 이동할 수 있습니다</li>
            <li>테이블을 클릭하면 해당 테이블로 포커스됩니다</li>
          </ul>
        </div>
      )}

      <div className="diagram-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={onInit}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultEdgeOptions={{
            animated: true
          }}
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as any
              return CATEGORY_FILTERS.find(cat => cat.value === data.category)?.color || '#6b7280'
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{
              backgroundColor: 'var(--color-bg-secondary)'
            }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}

export default SqlInfoPage