import React, { useEffect, useState } from 'react'
import { getApis } from '@/api/api'
import { ApisData, ApiInfo } from '@/types'
import ApiCategories from '@/components/APIs/ApiCategories'
import ApiDetailModal from '@/components/APIs/ApiDetailModal'
import './ApiInfoPage.css'

const ApiInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apisData, setApisData] = useState<ApisData | null>(null)
  const [selectedApi, setSelectedApi] = useState<ApiInfo | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchApis = async () => {
      try {
        setLoading(true)
        const response = await getApis()

        if (response.success && response.data) {
          setApisData(response.data)
        } else {
          setError(response.error || 'API 데이터를 불러오는데 실패했습니다.')
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchApis()
  }, [])

  const handleApiClick = (api: ApiInfo, category: string) => {
    setSelectedApi(api)
    setSelectedCategory(category)
  }

  const closeModal = () => {
    setSelectedApi(null)
    setSelectedCategory(null)
  }

  if (loading)
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>API 정보를 불러오는 중...</p>
      </div>
    )

  if (error)
    return (
      <div className="page-error">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          다시 시도
        </button>
      </div>
    )

  if (!apisData) return null

  return (
    <div className="api-info-page">
      <div className="page-header">
        <h1 className="page-title">API 정보</h1>
        <p className="page-description">
          모두하나대축제 웹서비스에 사용한 RESTful API 엔드포인트와 상세한 요청/응답 정보를 확인할 수 있습니다.
        </p>
      </div>

      <ApiCategories apisData={apisData} onApiClick={handleApiClick} />

      {selectedApi && (
        <ApiDetailModal
          api={selectedApi}
          category={selectedCategory || ''}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default ApiInfoPage
