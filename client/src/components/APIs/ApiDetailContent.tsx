import React, { useState } from 'react'
import { ApiInfo, ApiParameter, ApiDocResponse, ApiResponseExample } from '@/types'

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
                {Object.entries(api.request.content || api.request.body || {}).map(
                  ([key, param]) => {
                    const paramValue = param as ApiParameter
                    const exampleKey = `param-${key}`
                    
                    return (
                      <div key={key} className="parameter-item">
                        <div className="parameter-header">
                          <span className="parameter-name">{key}</span>
                          <span className="parameter-type">{paramValue.type}</span>
                          {paramValue.required && (
                            <span className="parameter-required">required</span>
                          )}
                        </div>
                        
                        {paramValue.description && (
                          <p className="parameter-description">{paramValue.description}</p>
                        )}
                        
                        {paramValue.default !== undefined && (
                          <p className="parameter-default">
                            Default: <code>{JSON.stringify(paramValue.default)}</code>
                          </p>
                        )}
                        
                        {paramValue.values && (
                          <p className="parameter-values">
                            Values: {paramValue.values.join(', ')}
                          </p>
                        )}
                        
                        {paramValue.example !== undefined && (
                          <div className="parameter-example">
                            <button
                              onClick={() => toggleExample(exampleKey)}
                              className="example-toggle"
                            >
                              Example
                              <span className={`toggle-icon ${expandedExamples[exampleKey] ? 
                                'expanded' : ''}`}>
                                ▼
                              </span>
                            </button>
                            {expandedExamples[exampleKey] && (
                              <pre className="parameter-example-code">
                                <code>{JSON.stringify(paramValue.example, null, 2)}</code>
                              </pre>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {api.request.query && (
            <div className="section-content">
              <h4 className="subsection-title">Query Parameters</h4>
              <div className="parameters-grid">
                {Object.entries(api.request.query).map(([key, param]) => {
                  const paramValue = param as ApiParameter
                  const exampleKey = `query-${key}`
                  
                  return (
                    <div key={key} className="parameter-item">
                      <div className="parameter-header">
                        <span className="parameter-name">{key}</span>
                        <span className="parameter-type">{paramValue.type}</span>
                        {paramValue.required && (
                          <span className="parameter-required">required</span>
                        )}
                      </div>
                      
                      {paramValue.description && (
                        <p className="parameter-description">{paramValue.description}</p>
                      )}
                      
                      {paramValue.default !== undefined && (
                        <p className="parameter-default">
                          Default: <code>{JSON.stringify(paramValue.default)}</code>
                        </p>
                      )}
                      
                      {paramValue.values && (
                        <p className="parameter-values">
                          Values: {paramValue.values.join(', ')}
                        </p>
                      )}
                      
                      {paramValue.example !== undefined && (
                        <div className="parameter-example">
                          <button
                            onClick={() => toggleExample(exampleKey)}
                            className="example-toggle"
                          >
                            Example
                            <span className={`toggle-icon ${expandedExamples[exampleKey] ? 
                              'expanded' : ''}`}>
                              ▼
                            </span>
                          </button>
                          {expandedExamples[exampleKey] && (
                            <pre className="parameter-example-code">
                              <code>{JSON.stringify(paramValue.example, null, 2)}</code>
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
            const response = responseValue as ApiDocResponse
            return (
              <div key={status} className="section-content">
                <h4 className="subsection-title">
                  <span className={`status-code status-${status[0]}xx`}>{status}</span>
                  {response.description}
                </h4>
                
                {/* examples 배열이 있는 경우 */}
                {response.examples && response.examples.length > 0 ? (
                  <div className="response-examples">
                    {response.examples.map((example: ApiResponseExample, index: number) => (
                      <div key={index} className="response-example-item">
                        <p className="example-case">{example.case}</p>
                        <pre className="response-example">
                          <code>{JSON.stringify(example.body, null, 2)}</code>
                        </pre>
                      </div>
                    ))}
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
              {api.notes.map((note: string, index: number) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApiDetailContent