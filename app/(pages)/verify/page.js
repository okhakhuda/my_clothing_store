'use client'

import { useRouter } from 'next/navigation'
import s from './verify.module.scss'

const Verify = ({ searchParams }) => {
  const router = useRouter()

  if (searchParams.status !== 'success') {
    return <div>Щось пішло не так</div>
  } else {
    return (
      <>
        <div>Ви успішно верифікувалися</div>
        <button className={s.btnBack} type="button" onClick={() => router.push('/')}>
          Повернутися до магазину
        </button>
      </>
    )
  }
}

export default Verify
