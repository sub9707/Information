import React from 'react'
import './SqlInfoPage.css'

const SqlInfoPage: React.FC = () => {
  return (
    <div className="sql-info-page">
      <div className="page-header">
        <h1 className="page-title">SQL 테이블 정보</h1>
        <p className="page-description">
          데이터베이스 스키마와 테이블 구조 정보를 확인할 수 있습니다.
        </p>
      </div>

      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <h2 className="coming-soon-title">준비 중입니다</h2>
          <p className="coming-soon-description">
            SQL 테이블 정보 페이지는 현재 개발 중입니다.
            <br />
            곧 완성된 기능을 만나보실 수 있습니다.
          </p>

          <div className="info-box">
            <h3 className="info-box-title">데이터베이스 정보</h3>
            <ul className="info-list">
              <li>
                <strong>DBMS:</strong> MariaDB 10.11.14
              </li>
              <li>
                <strong>테이블 수:</strong> 20개
              </li>
              <li>
                <strong>주요 테이블:</strong> users, registrations, news_items, event_participations
              </li>
              <li>
                <strong>문자셋:</strong> utf8mb4
              </li>
            </ul>
          </div>

          <div className="planned-features">
            <h3 className="planned-features-title">예정된 기능</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📋</div>
                <h4>테이블 목록</h4>
                <p>모든 테이블 정보를 한눈에</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔍</div>
                <h4>상세 스키마</h4>
                <p>컬럼, 타입, 제약조건 확인</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔗</div>
                <h4>관계도</h4>
                <p>테이블 간 관계 시각화</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💾</div>
                <h4>스키마 다운로드</h4>
                <p>SQL 파일 내보내기</p>
              </div>
            </div>
          </div>

          <a>
            href="https://github.com/yourusername/project"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub에서 schema.sql 보기
          </a>
        </div>
      </div>
    </div>
  )
}

export default SqlInfoPage