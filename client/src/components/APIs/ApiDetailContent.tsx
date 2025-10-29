import React from 'react'
import { ApiInfo } from '@/types'

interface ApiDetailContentProps {
  api: ApiInfo
}

const ApiDetailContent: React.FC<ApiDetailContentProps> = ({ api }) => {
  return (
    <div className="api-detail">
      <div className="api-detail-header">
        <span className={`method-badge method-${api.method.toLowerCase()}`}>{api.method}</span>
        <code className="endpoint-code">{api.endpoint}</code>
      </div>

      <p className="api-description">{api.description}</p>

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

          {api.request.body && (
            <div className="section-content">
              <h4 className="subsection-title">Body Parameters</h4>
              <div className="parameters-table">
                {Object.entries(api.request.body).map(([key, param]) => (
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

          {api.request.query && (
            <div className="section-content">
              <h4 className="subsection-title">Query Parameters</h4>
              <div className="parameters-table">
                {Object.entries(api.request.query).map(([key, param]) => (
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

      {/* 응답 정보 */}
      {api.response && (
        <div className="api-section">
          <h3 className="section-title">응답</h3>
          {Object.entries(api.response).map(([status, response]) => (
            <div key={status} className="section-content">
              <h4 className="subsection-title">
                <span className={`status-code status-${status[0]}xx`}>{status}</span>
                {response.description}
              </h4>
              <pre className="response-example">
                <code>{JSON.stringify(response.example || response.body, null, 2)}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApiDetailContent
