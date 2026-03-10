'use client'

import { MdCheckCircle, MdLocalShipping } from 'react-icons/md'
import { useEffect } from 'react'
import s from './Order.module.scss'

export default function Order({ number }) {
  useEffect(() => {
    // ✅ Google Analytics / Facebook Pixel
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'purchase', {
        transaction_id: number,
        value: 0, // можна передати з пропсів
        currency: 'UAH',
        items: [],
      })
    }
  }, [number])

  return (
    <main className={s.orderPage}>
      <section className={s.successContainer}>
        {/* ✅ Animated Success Icon */}
        <div className={s.successIconWrapper}>
          <MdCheckCircle className={s.successIcon} />
        </div>

        <header className={s.orderHeader}>
          <h1 className={s.orderTitle}>Замовлення успішно!</h1>
          <p className={s.orderNumber}>
            Номер замовлення: <strong>#{number}</strong>
          </p>
        </header>

        <div className={s.statusTimeline}>
          <div className={s.statusItem}>
            <div className={s.statusIcon}>
              <MdCheckCircle className={s.statusIconCheck} />
            </div>
            <div className={s.statusContent}>
              <h3 className={s.statusTitle}>Отримано</h3>
              <p className={s.statusText}>Замовлення прийнято в обробку</p>
            </div>
          </div>

          <div className={s.statusLine}></div>

          <div className={s.statusItem}>
            <div className={s.statusIcon}>
              <MdLocalShipping className={s.statusIconShip} />
            </div>
            <div className={s.statusContent}>
              <h3 className={s.statusTitle}>В дорозі</h3>
              <p className={s.statusText}>Очікується відправка</p>
            </div>
          </div>
        </div>

        <div className={s.orderDetails}>
          <div className={s.detailItem}>
            <span className={s.detailLabel}>Статус:</span>
            <span className={s.detailValue}>Нові</span>
          </div>
          <div className={s.detailItem}>
            <span className={s.detailLabel}>Дата:</span>
            <span className={s.detailValue}>{new Date().toLocaleDateString('uk-UA')}</span>
          </div>
          <div className={s.detailItem}>
            <span className={s.detailLabel}>Оплата:</span>
            {/* <span className={s.detailValue}>Післяплата</span> */}
          </div>
        </div>

        <div className={s.actionButtons}>
          {/* <button className={s.primaryButton}>Відстежити замовлення</button> */}
          <button className={s.secondaryButton} onClick={() => (window.location.href = '/')}>
            Продовжити покупки
          </button>
        </div>

        <div className={s.helpSection}>
          <h3 className={s.helpTitle}>Потрібна допомога?</h3>
          <div className={s.contactInfo}>
            <div className={s.contactItem}>
              <span className={s.contactIcon}>📞</span>
              <a href="tel:+380501234567" className={s.contactLink}>
                +380 50 123 45 67
              </a>
            </div>
            <div className={s.contactItem}>
              <span className={s.contactIcon}>✉️</span>
              <a href="mailto:support@example.com" className={s.contactLink}>
                support@example.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Соціальні кнопки */}
      {/* <div className={s.socialShare}>
        <p className={s.shareText}>Поділитися замовленням:</p>
        <div className={s.socialButtons}>
          <button className={s.socialButton} aria-label="Поділитися в Telegram">
            <span>📱 Telegram</span>
          </button>
          <button className={s.socialButton} aria-label="Поділитися в Viber">
            <span>💬 Viber</span>
          </button>
        </div>
      </div> */}
    </main>
  )
}
