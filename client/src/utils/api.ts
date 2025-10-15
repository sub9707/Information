import { ApiResponse, PagesData, ApisData, StatsData } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`)
      
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

  async getPages(): Promise<ApiResponse<PagesData>> {
    return this.request<PagesData>('/api/pages')
  }

  async getPagesByType(type: 'site' | 'dashboard'): Promise<ApiResponse<any>> {
    return this.request(`/api/pages/${type}`)
  }

  async getApis(): Promise<ApiResponse<ApisData>> {
    return this.request<ApisData>('/api/apis')
  }

  async getApisByCategory(category: string): Promise<ApiResponse<any>> {
    return this.request(`/api/apis/${category}`)
  }

  async getStats(): Promise<ApiResponse<StatsData>> {
    return this.request<StatsData>('/api/stats')
  }

  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient()

// 편의 함수들
export const getPages = () => apiClient.getPages()
export const getApis = () => apiClient.getApis()
export const getStats = () => apiClient.getStats()