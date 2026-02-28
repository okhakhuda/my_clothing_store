import React from 'react'
import s from './Logo.module.scss'
import Link from 'next/link'
import logo from '../../../public/logo.jpg'
import Image from 'next/image'

const Logo = () => {
  return (
    <Link href={'/'} rel="preload">
      <div className={s.logo}>
        VAB <span>womans</span>
        {/* <Image src={logo} alt="VAB womans" width={50} height={50} /> */}
      </div>
    </Link>
  )
}

export default Logo
