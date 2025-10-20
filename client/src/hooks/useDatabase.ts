import { useState, useEffect, useCallback } from 'react'
import { Node, Edge, MarkerType } from 'reactflow'
import { getTables } from '@/utils/api'
import { TablesData, TableNodeData, TableCategory } from '@/types'
import { CATEGORY_INFO } from '@/constants/database'

interface UseDatabaseReturn {
  loading: boolean
  error: string | null
  nodes: Node[]
  edges: Edge[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  refetch: () => void
}

export function useDatabase(): UseDatabaseReturn {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tablesData, setTablesData] = useState<TablesData | null>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 테이블 데이터를 React Flow 노드와 엣지로 변환
  const createNodesAndEdges = useCallback((data: TablesData, category: string) => {
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // 카테고리 필터링
    const filteredTables = category === 'all'
      ? Object.entries(data)
      : Object.entries(data).filter(([_, table]) => table.category === category)

    // 카테고리별 그룹화
    const categorizedTables = filteredTables.reduce((acc, [name, table]) => {
      const cat = table.category
      if (!acc[cat]) {
        acc[cat] = []
      }
      acc[cat].push({ name, ...table })
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

        // 안전하게 배열 접근
        const columns = table.columns || []
        const primaryKeys = table.primaryKeys || []
        const relationships = Array.isArray(table.relationships) ? table.relationships : []

        // Foreign Key 찾기 (관계가 있고 _id로 끝나는 컬럼)
        const foreignKeys = columns
          .filter((col: any) => 
            col.name.endsWith('_id') && 
            col.name !== 'id' && 
            relationships.some((rel: string) => 
              col.name.includes(rel.replace(/s$/, '')) || 
              col.name.replace('_id', '') === rel.replace(/s$/, '')
            )
          )
          .map((col: any) => col.name)

        // TableNodeData 타입에 맞게 데이터 생성
        const nodeData: TableNodeData = {
          tableName: table.name,
          displayName: table.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: table.description || '',
          category: table.category as TableCategory,
          columns: columns,
          primaryKeys: primaryKeys.length > 0 ? primaryKeys : ['id'],
          foreignKeys: foreignKeys,
          relationships: relationships,
          columnCount: table.columnCount || columns.length
        }

        newNodes.push({
          id: table.name,
          type: 'tableNode',
          position: { x, y },
          data: nodeData
        })

        // 관계 엣지 생성
        relationships.forEach((relatedTable: string) => {
          if (filteredTables.some(([name]) => name === relatedTable)) {
            const categoryColor = CATEGORY_INFO[table.category as TableCategory]?.color || '#3b82f6'
            
            newEdges.push({
              id: `edge-${table.name}-${relatedTable}`,
              source: table.name,
              target: relatedTable,
              type: 'smoothstep',
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: categoryColor
              },
              style: {
                stroke: categoryColor,
                strokeWidth: 2,
                opacity: 0.6
              }
            })
          }
        })
      })

      currentY += (rows * VERTICAL_SPACING) + CATEGORY_VERTICAL_SPACING
    })

    return { nodes: newNodes, edges: newEdges }
  }, [])

  // 데이터 가져오기
  const fetchTables = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getTables()

      if (response.success && response.data) {
        setTablesData(response.data)
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
      console.error('Database fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, createNodesAndEdges])

  // 카테고리 변경 시 노드/엣지 재생성
  useEffect(() => {
    if (tablesData) {
      const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(
        tablesData,
        selectedCategory
      )
      setNodes(newNodes)
      setEdges(newEdges)
    }
  }, [selectedCategory, tablesData, createNodesAndEdges])

  // 초기 데이터 로드
  useEffect(() => {
    fetchTables()
  }, [fetchTables])

  return {
    loading,
    error,
    nodes,
    edges,
    selectedCategory,
    setSelectedCategory,
    refetch: fetchTables
  }
}