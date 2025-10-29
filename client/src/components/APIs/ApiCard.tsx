import React from 'react'
import { ApiInfo } from '@/types'
import './ApiCard.css'

interface ApiCardProps {
  api: ApiInfo
  color: string
  onClick: () => void
}

const ApiCard: React.FC<ApiCardProps> = ({ api, color, onClick }) => {
  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: '#3b82f6',
      POST: '#10b981',
      PUT: '#f59e0b',
      DELETE: '#ef4444',
      PATCH: '#8b5cf6',
    }
    return colors[method] || '#6b7280'
  }

  return (
    <button
      className="api-card"
      onClick={onClick}
      style={{ borderTopColor: color }}
    >
      <div className="api-card-header">
        <span
          className="api-method"
          style={{ backgroundColor: `${getMethodColor(api.method)}20`, color: getMethodColor(api.method) }}
        >
          {api.method}
        </span>
        <h3 className="api-name">{api.name}</h3>
      </div>

      <code className="api-endpoint">{api.endpoint}</code>

      <p className="api-card-description">{api.description}</p>

      <div className="api-card-footer">
        {api.authentication && (
          <span className="api-tag api-tag-auth">인증</span>
        )}
        {api.adminOnly && (
          <span className="api-tag api-tag-admin">관리자</span>
        )}
        <span className="api-card-arrow">→</span>
      </div>
    </button>
  )
}

export default ApiCard