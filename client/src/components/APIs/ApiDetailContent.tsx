import React, { useState } from 'react'
import { ApiInfo, ApiParameter, ApiResponse, ApiResponseExample } from '@/types'

interface ApiDetailContentProps {
  api: ApiInfo
}

const ApiDetailContent: React.FC<ApiDetailContentProps> = ({ api }) => {
  const [expandedExamples, setExpandedExamples] = useState<Record<string, boolean>>({})

  const toggleExample = (key: string) => {
    setExpandedExamples(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="api-detail">
      <div className="api-detail-header">
        <span className={`method-badge method-${api.method.toLowerCase()}`}>{api.method}</span>
        <code className="endpoint-code">{api.endpoint}</code>
      </div>

      <p className="api-description">{api.description}</p>

      {api.note && (
        <div className="api-note">
          <strong>Note:</strong> {api.note}
        </div>
      )}

      {api.authentication && (
        <div className="api-badge-group">
          <span className="badge badge-auth">인증 필요</span>
          {api.adminOnly && <span className="badge badge-admin">관리자 전용</span>}
        </div>
      )}

      {/* 요청 정보 */}
      {api.request && (
        <div className="api-section">
          <h3 className="section-title">요청</h3>

          {/* Body/Content Parameters */}
          {(api.request.content || api.request.body) && (
            <div className="section-content">
              <h4 className="subsection-title">Body Parameters</h4>
              <div className="parameters-grid">
                {Object.entries(api.request.content || api.request.body || {}).map(([key, paramValue]) => {
                  const param = paramValue as ApiParameter
                  const exampleKey = `request-body-${key}`
                  return (
                    <div key={key} className="parameter-card">
                      <div className="parameter-card-header">
                        <div className="parameter-name-group">
                          <code className="parameter-name-code">{key}</code>
                          <span className="parameter-type-badge">{param.type}</span>
                          {param.format && (
                            <span className="parameter-format-badge">{param.format}</span>
                          )}
                        </div>
                        {param.required && (
                          <span className="parameter-required-badge">required</span>
                        )}
                      </div>
                      
                      <p className="parameter-description-text">{param.description}</p>
                      
                      {/* 제약사항 */}
                      {(param.length || param.minLength || param.maxLength || param.pattern) && (
                        <div className="parameter-constraints-box">
                          {param.length && (
                            <div className="constraint-item">
                              <span className="constraint-label">길이:</span>
                              <span className="constraint-value">{param.length}</span>
                            </div>
                          )}
                          {param.minLength && (
                            <div className="constraint-item">
                              <span className="constraint-label">최소:</span>
                              <span className="constraint-value">{param.minLength}자</span>
                            </div>
                          )}
                          {param.maxLength && (
                            <div className="constraint-item">
                              <span className="constraint-label">최대:</span>
                              <span className="constraint-value">{param.maxLength}자</span>
                            </div>
                          )}
                          {param.pattern && (
                            <div className="constraint-item pattern">
                              <span className="constraint-label">패턴:</span>
                              <code className="constraint-pattern">{param.pattern}</code>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 예시 접기/펼치기 */}
                      {param.example && (
                        <div className="parameter-example-container">
                          <button 
                            className="example-toggle-button"
                            onClick={() => toggleExample(exampleKey)}
                          >
                            <span className="example-toggle-text">예시 보기</span>
                            <span className={`example-toggle-icon ${expandedExamples[exampleKey] ? 'expanded' : ''}`}>
                              ▼
                            </span>
                          </button>
                          {expandedExamples[exampleKey] && (
                            <pre className="parameter-example-code">
                              <code>{JSON.stringify(param.example, null, 2)}</code>
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {api.request.query && (
            <div className="section-content">
              <h4 className="subsection-title">Query Parameters</h4>
              <div className="parameters-grid">
                {Object.entries(api.request.query).map(([key, paramValue]) => {
                  const param = paramValue as ApiParameter
                  const exampleKey = `request-query-${key}`
                  return (
                    <div key={key} className="parameter-card">
                      <div className="parameter-card-header">
                        <div className="parameter-name-group">
                          <code className="parameter-name-code">{key}</code>
                          <span className="parameter-type-badge">{param.type}</span>
                        </div>
                        {param.required && (
                          <span className="parameter-required-badge">required</span>
                        )}
                      </div>
                      <p className="parameter-description-text">{param.description}</p>
                      
                      {param.example && (
                        <div className="parameter-example-container">
                          <button 
                            className="example-toggle-button"
                            onClick={() => toggleExample(exampleKey)}
                          >
                            <span className="example-toggle-text">예시 보기</span>
                            <span className={`example-toggle-icon ${expandedExamples[exampleKey] ? 'expanded' : ''}`}>
                              ▼
                            </span>
                          </button>
                          {expandedExamples[exampleKey] && (
                            <pre className="parameter-example-code">
                              <code>{JSON.stringify(param.example, null, 2)}</code>
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 응답 정보 */}
      {api.response && (
        <div className="api-section">
          <h3 className="section-title">응답</h3>
          {Object.entries(api.response).map(([status, responseValue]) => {
            const response = responseValue as ApiResponse
            return (
              <div key={status} className="section-content">
                <h4 className="subsection-title">
                  <span className={`status-code status-${status[0]}xx`}>{status}</span>
                  {response.description}
                </h4>
                
                {/* examples 배열이 있는 경우 */}
                {response.examples && response.examples.length > 0 ? (
                  <div className="response-examples">
                    {response.examples.map((exampleValue: ApiResponseExample, index: number) => {
                      const example = exampleValue as ApiResponseExample
                      return (
                        <div key={index} className="response-example-item">
                          <p className="example-case">{example.case}</p>
                          <pre className="response-example">
                            <code>{JSON.stringify(example.body, null, 2)}</code>
                          </pre>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* body가 있는 경우 */
                  response.body && (
                    <pre className="response-example">
                      <code>{JSON.stringify(response.body, null, 2)}</code>
                    </pre>
                  )
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Notes */}
      {api.notes && api.notes.length > 0 && (
        <div className="api-section">
          <h3 className="section-title">참고사항</h3>
          <div className="section-content">
            <ul className="notes-list">
              {api.notes.map((noteValue: string, index: number) => {
                const note = noteValue as string
                return <li key={index}>{note}</li>
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiDetailContent