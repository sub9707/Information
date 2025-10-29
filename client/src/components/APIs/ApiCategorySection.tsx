import React from 'react'
import { ApiCategory, ApiInfo } from '@/types'
import ApiCard from '@/components/APIs/ApiCard'

interface ApiCategorySectionProps {
  category: ApiCategory
  onApiClick: (api: ApiInfo) => void
}

const ApiCategorySection: React.FC<ApiCategorySectionProps> = ({ category, onApiClick }) => {
  return (
    <div className="api-category">
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
            onClick={() => onApiClick(api)}
          />
        ))}
      </div>
    </div>
  )
}

export default ApiCategorySection
