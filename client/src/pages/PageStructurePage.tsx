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
import { getPages } from '@/utils/api'
import { PagesData, PageNode } from '@/types'
import PageNodeComponent from '@/components/PageNode'
import './PageStructurePage.css'

const nodeTypes = {
  pageNode: PageNodeComponent,
}

const PageStructurePage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<'site' | 'dashboard'>('site')
  const [showInstructions, setShowInstructions] = useState(false)
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const createNodesAndEdges = useCallback((data: PageNode, type: 'site' | 'dashboard') => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const nodeToIdMap = new Map<PageNode, string>()
    let nodeIdCounter = 0

    // 레이아웃 설정
    const VERTICAL_SPACING = 180
    const HORIZONTAL_SPACING = 280
    const START_Y = 50

    // 각 노드의 서브트리 너비 계산
    const calculateSubtreeWidth = (node: PageNode): number => {
      if (!node.children || node.children.length === 0) {
        return 1
      }

      return node.children.reduce((sum, child) => {
        return sum + calculateSubtreeWidth(child)
      }, 0)
    }

    // DFS로 노드 배치 (부모 중심)
    const layoutNodes = (
      node: PageNode,
      parentNode: PageNode | null,
      level: number,
      leftBound: number
    ): number => {
      const id = `${type}-${nodeIdCounter++}`
      nodeToIdMap.set(node, id)

      const y = START_Y + (level * VERTICAL_SPACING)

      // 자식이 없으면 현재 위치에 배치
      if (!node.children || node.children.length === 0) {
        const x = leftBound * HORIZONTAL_SPACING

        nodes.push({
          id,
          type: 'pageNode',
          position: { x, y },
          data: {
            label: node.title,
            ...node,
          },
        })

        // 부모와 연결
        if (parentNode) {
          const parentId = nodeToIdMap.get(parentNode)
          if (parentId) {
            edges.push({
              id: `edge-${parentId}-${id}`,
              source: parentId,
              target: id,
              type: 'smoothstep',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#f97316',
              },
              style: {
                stroke: '#f97316',
                strokeWidth: 2,
              },
            })
          }
        }

        return leftBound + 1
      }

      // 자식들의 위치를 먼저 계산
      let currentLeft = leftBound
      const childPositions: number[] = []

      node.children.forEach(child => {
        const childWidth = calculateSubtreeWidth(child)
        const childCenter = currentLeft + (childWidth - 1) / 2
        childPositions.push(childCenter)
        currentLeft = layoutNodes(child, node, level + 1, currentLeft)
      })

      // 부모는 자식들의 중간에 배치
      const parentX = (childPositions[0] + childPositions[childPositions.length - 1]) / 2 * HORIZONTAL_SPACING

      nodes.push({
        id,
        type: 'pageNode',
        position: { x: parentX, y },
        data: {
          label: node.title,
          ...node,
        },
      })

      // 부모와 연결
      if (parentNode) {
        const parentId = nodeToIdMap.get(parentNode)
        if (parentId) {
          edges.push({
            id: `edge-${parentId}-${id}`,
            source: parentId,
            target: id,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#f97316',
            },
            style: {
              stroke: '#f97316',
              strokeWidth: 2,
            },
          })
        }
      }

      return currentLeft
    }

    // 레이아웃 시작
    const totalWidth = calculateSubtreeWidth(data)
    const startLeft = -totalWidth / 2
    layoutNodes(data, null, 0, startLeft)

    return { nodes, edges }
  }, [])

  // React Flow 인스턴스 초기화
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance
    setTimeout(() => {
      instance.fitView({
        padding: 0.2,
        minZoom: 0.5,
        maxZoom: 1.5,
        duration: 400
      })
    }, 50)
  }, [])

  // 데이터 페칭 (selectedType 변경 시에만)
  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await getPages()

        if (response.success && response.data) {
          const pageData = response.data[selectedType]
          const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(pageData, selectedType)
          setNodes(newNodes)
          setEdges(newEdges)
        } else {
          setError(response.error || '데이터를 불러오는데 실패했습니다.')
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [selectedType, createNodesAndEdges, setNodes, setEdges])

  // 노드가 업데이트된 후 fitView 적용
  useEffect(() => {
    if (nodes.length > 0 && reactFlowInstanceRef.current) {
      setTimeout(() => {
        reactFlowInstanceRef.current?.fitView({
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5,
          duration: 400
        })
      }, 50)
    }
  }, [nodes.length])

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>페이지 구조를 불러오는 중...</p>
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
    <div className="page-structure-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">화면 구조</h1>
          <p className="page-description">
            프로젝트의 페이지 구조를 트리 형태로 확인할 수 있습니다.
          </p>
        </div>

        <div className="type-selector">
          <button
            className={`type-button ${selectedType === 'site' ? 'type-button-active' : ''}`}
            onClick={() => setSelectedType('site')}
          >
            사용자 페이지
          </button>
          <button
            className={`type-button ${selectedType === 'dashboard' ? 'type-button-active' : ''}`}
            onClick={() => setSelectedType('dashboard')}
          >
            관리자 페이지
          </button>
        </div>
      </div>

      <div className="flow-container">
        <button
          className="info-button"
          onClick={() => setShowInstructions(!showInstructions)}
          aria-label="사용 방법"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </button>

        {showInstructions && (
          <div className="instructions-tooltip">
            <button
              className="instructions-close"
              onClick={() => setShowInstructions(false)}
              aria-label="닫기"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h3 className="instructions-title">사용 방법</h3>
            <ul className="instructions-list">
              <li>노드에 마우스를 올리면 상세 정보를 확인할 수 있습니다.</li>
              <li>노드를 클릭하면 실제 사이트로 이동합니다.</li>
              <li>마우스 휠로 확대/축소할 수 있습니다.</li>
              <li>드래그하여 화면을 이동할 수 있습니다.</li>
            </ul>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onInit={onInit}
          minZoom={0.2}
          maxZoom={2}
          fitView={false}
        >
          <Background color="#94a3b8" gap={16} />
          <Controls />
          <MiniMap
            nodeColor="#f97316"
            maskColor="rgba(0, 0, 0, 0.1)"
            style={{
              backgroundColor: '#fafaf9',
            }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}

export default PageStructurePage