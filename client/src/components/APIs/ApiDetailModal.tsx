import React from 'react'
import { ApiInfo } from '@/types'
import Modal from '@/components/Modal'
import ApiDetailContent from './ApiDetailContent'

interface ApiDetailModalProps {
  api: ApiInfo
  category: string
  onClose: () => void
}

const ApiDetailModal: React.FC<ApiDetailModalProps> = ({ api, category, onClose }) => {
  return (
    <Modal isOpen={!!api} onClose={onClose} title={api.name} category={category}>
      <ApiDetailContent api={api} />
    </Modal>
  )
}

export default ApiDetailModal
