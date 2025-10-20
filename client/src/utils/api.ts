import { ApiResponse, PagesData, ApisData, StatsData, TablesData } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Generic fetch wrapper
async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<T> = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// API 함수들
export const getPages = () => fetchApi<PagesData>('/api/pages')

export const getPagesByType = (type: 'site' | 'dashboard') =>
  fetchApi(`/api/pages/${type}`)

export const getApis = () => fetchApi<ApisData>('/api/apis')

export const getApisByCategory = (category: string) =>
  fetchApi(`/api/apis/${category}`)

export const getStats = () => fetchApi<StatsData>('/api/stats')

export const getTables = () => fetchApi<TablesData>('/api/tables')

export const getTableByName = (tableName: string) =>
  fetchApi(`/api/tables/${tableName}`)

export const getTablesByCategory = (category: string) =>
  fetchApi(`/api/tables/category/${category}`)

export const healthCheck = () => fetchApi('/api/health')