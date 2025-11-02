import { TableCategory, CategoryInfo } from '@/types'

// 테이블 카테고리 정보
export const CATEGORY_INFO: Record<TableCategory, CategoryInfo> = {
  core: {
    key: 'core',
    label: '인증',
    description: '사용자 및 인증 관련 테이블',
    color: '#3b82f6',
    icon: '👤'
  },
  event: {
    key: 'event',
    label: '이벤트',
    description: '이벤트 참여 및 경품 관련 테이블',
    color: '#f59e0b',
    icon: '🎁'
  },
  content: {
    key: 'content',
    label: '콘텐츠',
    description: '뉴스 및 콘텐츠 관리 테이블',
    color: '#8b5cf6',
    icon: '📰'
  },
  analytics: {
    key: 'analytics',
    label: '분석',
    description: '페이지 분석 및 통계 테이블',
    color: '#06b6d4',
    icon: '📊'
  },
  security: {
    key: 'security',
    label: '보안',
    description: '인증 및 보안 관련 테이블',
    color: '#ef4444',
    icon: '🔒'
  },
  admin: {
    key: 'admin',
    label: '관리자',
    description: '관리자 기능 및 설정 테이블',
    color: '#ec4899',
    icon: '⚙️'
  }
}

// 카테고리 필터 옵션
export const CATEGORY_FILTERS = [
  { value: 'all', label: '전체', color: '#6b7280' },
  ...Object.values(CATEGORY_INFO).map(cat => ({
    value: cat.key,
    label: cat.label,
    color: cat.color
  }))
]