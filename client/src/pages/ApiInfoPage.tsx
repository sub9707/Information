import React, { useEffect, useState } from 'react'
import { getApis } from '@/utils/api'
import { ApisData, ApiCategory, ApiInfo } from '@/types'
import ApiCard from '@/components/ApiCard'
import Modal from '@/components/Modal'
import './ApiInfoPage.css'

const ApiInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apisData, setApisData] = useState<ApisData | null>(null)
  const [selectedApi, setSelectedApi] = useState<ApiInfo | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchApis = async () => {
      setLoading(true)
      setError(null)

      try {
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

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>API 정보를 불러오는 중...</p>
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

  if (!apisData) {
    return null
  }

  return (
    <div className="api-info-page">
      <div className="page-header">
        <h1 className="page-title">API 정보</h1>
        <p className="page-description">
          RESTful API 엔드포인트와 상세한 요청/응답 정보를 확인할 수 있습니다.
        </p>
      </div>

      <div className="api-categories">
        {Object.entries(apisData).map(([key, category]: [string, ApiCategory]) => (
          <div key={key} className="api-category">
            <div className="category-header" style={{ borderLeftColor: category.color }}>
              <h2 className="category-title">{category.title}</h2>
              <p className="category-description">{category.description}</p>
              <span className="category-count">{category.apis.length}개 API</span>
            </div>

            <div className="api-cards-grid">
              {category.apis.map((api) => (
                <ApiCard
                  key={api.id}
                  api={api}
                  color={category.color}
                  onClick={() => handleApiClick(api, category.title)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedApi && (
        <Modal
          isOpen={!!selectedApi}
          onClose={closeModal}
          title={selectedApi.name}
          category={selectedCategory || ''}
        >
          <div className="api-detail">
            <div className="api-detail-header">
              <span className={`method-badge method-${selectedApi.method.toLowerCase()}`}>
                {selectedApi.method}
              </span>
              <code className="endpoint-code">{selectedApi.endpoint}</code>
            </div>

            <p className="api-description">{selectedApi.description}</p>

            {selectedApi.authentication && (
              <div className="api-badge-group">
                <span className="badge badge-auth">인증 필요</span>
                {selectedApi.adminOnly && (
                  <span className="badge badge-admin">관리자 전용</span>
                )}
              </div>
            )}

            {selectedApi.request && (
              <div className="api-section">
                <h3 className="section-title">요청</h3>

                {selectedApi.request.body && (
                  <div className="section-content">
                    <h4 className="subsection-title">Body Parameters</h4>
                    <div className="parameters-table">
                      {Object.entries(selectedApi.request.body).map(([key, param]) => (
                        <div key={key} className="parameter-row">
                          <div className="parameter-info">
                            <code className="parameter-name">{key}</code>
                            <span className="parameter-type">{param.type}</span>
                            {param.required && (
                              <span className="parameter-required">required</span>
                            )}
                          </div>
                          <p className="parameter-description">{param.description}</p>
                          {param.example && (
                            <code className="parameter-example">
                              예시: {JSON.stringify(param.example)}
                            </code>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApi.request.query && (
                  <div className="section-content">
                    <h4 className="subsection-title">Query Parameters</h4>
                    <div className="parameters-table">
                      {Object.entries(selectedApi.request.query).map(([key, param]) => (
                        <div key={key} className="parameter-row">
                          <div className="parameter-info">
                            <code className="parameter-name">{key}</code>
                            <span className="parameter-type">{param.type}</span>
                            {param.required && (
                              <span className="parameter-required">required</span>
                            )}
                          </div>
                          <p className="parameter-description">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedApi.response && (
              <div className="api-section">
                <h3 className="section-title">응답</h3>
                {Object.entries(selectedApi.response).map(([status, response]) => (
                  <div key={status} className="section-content">
                    <h4 className="subsection-title">
                      <span className={`status-code status-${status[0]}xx`}>{status}</span>
                      {response.description}
                    </h4>
                    <pre className="response-example">
                      <code>{JSON.stringify(response.example, null, 2)}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}

export default ApiInfoPage