import React, { useEffect, useState, useCallback, useRef } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { getTables } from '@/utils/api'
import { TablesData, TableNodeData } from '@/types'
import TableNode from '@/components/TableNode'
import './SqlInfoPage.css'

const nodeTypes = {
  tableNode: TableNode,
}

const SqlInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showInstructions, setShowInstructions] = useState(false)
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const createNodesAndEdges = useCallback((data: TablesData, category: string) => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    
    // 카테고리 필터링
    const filteredTables = category === 'all' 
      ? Object.entries(data)
      : Object.entries(data).filter(([_, table]) => table.category === category)

    // 카테고리별 그룹화
    const categorizedTables = filteredTables.reduce((acc, [name, table]) => {
      if (!acc[table.category]) {
        acc[table.category] = []
      }
      acc[table.category].push({ name, ...table })
      return acc
    }, {} as Record<string, any[]>)

    // 레이아웃 설정
    const HORIZONTAL_SPACING = 320
    const VERTICAL_SPACING = 200
    const CATEGORY_VERTICAL_SPACING = 100
    const START_X = 100
    let currentY = 50

    // 카테고리별로 노드 배치
    Object.entries(categorizedTables).forEach(([cat, tables]) => {
      const tablesPerRow = 3
      const rows = Math.ceil(tables.length / tablesPerRow)
      
      tables.forEach((table, index) => {
        const row = Math.floor(index / tablesPerRow)
        const col = index % tablesPerRow
        
        const x = START_X + (col * HORIZONTAL_SPACING)
        const y = currentY + (row * VERTICAL_SPACING)

        const nodeId = table.name

        nodes.push({
          id: nodeId,
          type: 'tableNode',
          position: { x, y },
          data: {
            label: table.name,
            tableName: table.name,
            description: table.description,
            category: table.category,
            columns: table.columns,
            sampleData: table.sampleData,
            relationships: table.relationships,
          } as TableNodeData,
        })

        // 관계 엣지 생성
        table.relationships.forEach((relatedTable: string) => {
          if (filteredTables.some(([name]) => name === relatedTable)) {
            edges.push({
              id: `edge-${nodeId}-${relatedTable}`,
              source: nodeId,
              target: relatedTable,
              type: 'smoothstep',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#3b82f6',
              },
              style: {
                stroke: '#3b82f6',
                strokeWidth: 2,
              },
            })
          }
        })
      })

      currentY += (rows * VERTICAL_SPACING) + CATEGORY_VERTICAL_SPACING
    })

    return { nodes, edges }
  }, [])

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getTables()

        if (response.success && response.data) {
          const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
            response.data,
            selectedCategory
          )
          setNodes(newNodes)
          setEdges(newEdges)
        } else {
          setError(response.error || 'SQL 테이블 데이터를 불러오는데 실패했습니다.')
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [selectedCategory, createNodesAndEdges, setNodes, setEdges])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance
    setTimeout(() => {
      instance.fitView({ padding: 0.2, duration: 400 })
    }, 100)
  }, [])

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'core', label: '핵심' },
    { value: 'auth', label: '인증' },
    { value: 'event', label: '이벤트' },
    { value: 'content', label: '콘텐츠' },
    { value: 'analytics', label: '분석' },
    { value: 'security', label: '보안' },
    { value: 'admin', label: '관리자' },
  ]

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
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`category-button ${selectedCategory === cat.value ? 'active' : ''}`}
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
            <li>테이블 노드에 마우스를 올리면 컬럼 정보와 샘플 데이터를 확인할 수 있습니다</li>
            <li>화살표는 테이블 간의 관계(Foreign Key)를 나타냅니다</li>
            <li>카테고리 버튼으로 특정 그룹의 테이블만 필터링할 수 있습니다</li>
            <li>마우스 휠로 확대/축소, 드래그로 이동할 수 있습니다</li>
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
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
        >
          <Background color="#e5e7eb" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const data = node.data as TableNodeData
              const colors: Record<string, string> = {
                core: '#3b82f6',
                auth: '#10b981',
                event: '#f59e0b',
                content: '#8b5cf6',
                analytics: '#06b6d4',
                security: '#ef4444',
                admin: '#ec4899',
              }
              return colors[data.category] || '#3b82f6'
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </div>
  )
}

export default SqlInfoPage