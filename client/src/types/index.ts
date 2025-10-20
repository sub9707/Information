// 페이지 구조 타입
export interface PageNode {
  id: string
  title: string
  route: string
  description: string
  screenshot: string
  features?: string[]
  children?: PageNode[]
}

export interface PagesData {
  site: PageNode
  dashboard: PageNode
}

// API 정보 타입
export interface ApiParameter {
  type: string
  required?: boolean
  default?: any
  description?: string
  example?: any
  values?: string[]
}

export interface ApiRequest {
  body?: Record<string, ApiParameter>
  query?: Record<string, ApiParameter>
}

export interface ApiResponseExample {
  description: string
  example: any
}

export interface ApiInfo {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  description: string
  authentication?: boolean
  adminOnly?: boolean
  request?: ApiRequest
  response?: Record<string, ApiResponseExample>
}

export interface ApiCategory {
  title: string
  description: string
  color: string
  apis: ApiInfo[]
}

export interface ApisData {
  [key: string]: ApiCategory
}

// 통계 타입
export interface StatsData {
  pages: {
    site: number
    dashboard: number
    total: number
  }
  apis: {
    categories: number
    total: number
  }
  database: {
    tables: number
    description: string
  }
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

// SQL 테이블 타입
export interface ColumnInfo {
  name: string
  type: string
  key: string
}

export interface TableInfo {
  description: string
  category: string
  columns: ColumnInfo[]
  sampleData: Record<string, any>[]
  relationships: string[]
}

export interface TablesData {
  [tableName: string]: TableInfo
}

export interface TableNodeData {
  label: string
  tableName: string
  description: string
  category: string
  columns: ColumnInfo[]
  sampleData: Record<string, any>[]
  relationships: string[]
}