// ============================================
// 페이지 구조 타입
// ============================================
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

// ============================================
// API 정보 타입
// ============================================
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

// ============================================
// 통계 타입
// ============================================
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

// ============================================
// API 응답 타입
// ============================================
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

// ============================================
// SQL 데이터베이스 타입
// ============================================

// 테이블 카테고리
export type TableCategory = 
  | 'core'       // 핵심 사용자 및 인증
  | 'event'      // 이벤트 및 참여
  | 'content'    // 콘텐츠 관리
  | 'analytics'  // 분석 및 통계
  | 'security'   // 보안 및 제한
  | 'admin'      // 관리자 기능

// 컬럼 정보
export interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  comment?: string | null
  default?: string | null
}

// 카테고리 정보
export interface CategoryInfo {
  key: TableCategory
  label: string
  description: string
  color: string
  icon: string
}

// 테이블 관계 정보
export interface TableRelationship {
  from: string
  to: string
  type: 'foreign_key' | 'reference'
  columns: string[]
}

// 테이블 정보
export interface TableInfo {
  description: string
  category: TableCategory
  columns: ColumnInfo[]
  primaryKeys: string[]
  relationships: string[]
  columnCount: number
  sampleData?: Record<string, any>[]  // 샘플 데이터 추가
}

// 전체 테이블 데이터
export interface TablesData {
  [tableName: string]: TableInfo
}

// React Flow용 테이블 노드 데이터
export interface TableNodeData {
  tableName: string
  displayName: string
  description: string
  category: TableCategory
  columns: ColumnInfo[]
  primaryKeys: string[]
  foreignKeys: string[]
  relationships: string[]
  columnCount: number
  sampleData?: Record<string, any>[]  // 샘플 데이터 추가
}