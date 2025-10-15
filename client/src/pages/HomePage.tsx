import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '@/utils/api'
import { StatsData } from '@/types'
import './HomePage.css'

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats()
        if (response.success && response.data) {
          setStats(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: '화면 구조',
      description: '프로젝트의 모든 페이지를 트리 구조로 시각화하여 확인할 수 있습니다.',
      path: '/pages',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      stats: stats ? `${stats.pages.total}개 페이지` : '로딩 중...'
    },
    {
      title: 'API 정보',
      description: 'RESTful API 엔드포인트와 상세한 요청/응답 정보를 확인할 수 있습니다.',
      path: '/apis',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 18l2-2-2-2M8 6L6 8l2 2M12 2v20" />
        </svg>
      ),
      stats: stats ? `${stats.apis.total}개 API` : '로딩 중...'
    },
    {
      title: 'SQL 테이블',
      description: '데이터베이스 스키마와 테이블 구조 정보를 확인할 수 있습니다.',
      path: '/sql',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      ),
      stats: stats ? `${stats.database.tables}개 테이블` : '로딩 중...'
    }
  ]

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">모두하나대축제</h1>
          <p className="hero-subtitle">프로젝트 포트폴리오</p>
          <p className="hero-description">
            NextJS 15 기반으로 개발된 대규모 축제 웹사이트의 구조와 API를 확인할 수 있습니다.
          </p>
          {!loading && stats && (
            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="hero-stat-value">{stats.pages.total}</span>
                <span className="hero-stat-label">Pages</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-value">{stats.apis.total}</span>
                <span className="hero-stat-label">APIs</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-value">{stats.database.tables}</span>
                <span className="hero-stat-label">Tables</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage