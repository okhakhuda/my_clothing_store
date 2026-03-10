'use client'

import React from 'react'
import { useModalStatus } from '../../../StoreProviderModalStatus'
import { MdClose, MdErrorOutline, MdCheckCircle } from 'react-icons/md'
import s from './ModalStatus.module.scss'

export const ModalStatus = () => {
  const { isOpen, handleClose, message, error } = useModalStatus()

  if (!isOpen) return null

  const isError = !!error
  const icon = isError ? MdErrorOutline : MdCheckCircle

  return (
    <div className={s.modalOverlay} onClick={handleClose}>
      <div className={s.modalContent} onClick={e => e.stopPropagation()}>
        {/* ✅ Анімована іконка */}
        <div className={`${s.iconWrapper} ${isError ? s.errorIconWrapper : s.successIconWrapper}`}>
          <icon className={s.statusIcon} />
        </div>

        {/* ✅ Заголовок */}
        <h2 className={`${s.modalTitle} ${isError ? s.errorTitle : s.successTitle}`}>
          {isError ? 'Помилка!' : 'Успішно!'}
        </h2>

        {/* ✅ Повідомлення */}
        <p className={s.modalMessage}>{isError ? error : message}</p>

        {/* ✅ Кнопка закриття */}
        <button
          className={`${s.closeButton} ${isError ? s.errorCloseButton : s.successCloseButton}`}
          onClick={handleClose}
          aria-label="Закрити"
        >
          <MdClose />
        </button>

        {/* ✅ Анімація */}
        <div className={`${s.rippleEffect} ${isError ? s.errorRipple : s.successRipple}`} />
      </div>
    </div>
  )
}
