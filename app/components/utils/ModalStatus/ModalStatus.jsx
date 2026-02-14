'use client'

import React from 'react'
import { useModalStatus } from '../../../StoreProviderModalStatus'
import s from './ModalStatus.module.scss'

export const ModalStatus = () => {
  const { isOpen, handleClose, message, error } = useModalStatus()

  if (!isOpen) return null

  return (
    <div className={s.modalContent} onClick={e => e.stopPropagation()}>
      <h2>{error ? 'Помилка (((' : 'Успішно!'}</h2>
      <p>{error ? error : message}</p>
      <button className={s.btnClose} onClick={handleClose}>
        x
      </button>
    </div>
  )
}
