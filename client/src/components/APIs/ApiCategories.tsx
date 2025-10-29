import React from 'react'
import { ApisData, ApiCategory, ApiInfo } from '@/types'
import ApiCategorySection from './ApiCategorySection'

interface ApiCategoriesProps {
  apisData: ApisData
  onApiClick: (api: ApiInfo, category: string) => void
}

const ApiCategories: React.FC<ApiCategoriesProps> = ({ apisData, onApiClick }) => {
  return (
    <div className="api-categories">
      {Object.entries(apisData).map(([key, category]: [string, ApiCategory]) => (
        <ApiCategorySection
          key={key}
          category={category}
          onApiClick={(api) => onApiClick(api, category.title)}
        />
      ))}
    </div>
  )
}

export default ApiCategories
