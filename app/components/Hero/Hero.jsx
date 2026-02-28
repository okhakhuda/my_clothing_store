import React from 'react'
import Image from 'next/image'
import HeroImageDesk from '../../../public/hero.webp'
import HeroImageMob from '../../../public/hero_mobile.webp'
import HeroImageTab from '../../../public/hero_tablet.webp'
import s from './Hero.module.scss'

const Hero = () => {
  return (
    <section className={s.hero}>
      <Image
        className={s.hero_mob}
        src={HeroImageMob}
        alt="hero"
        priority={true}
        width="768"
        height="auto"
        sizes="100vw"
      />
      <Image
        className={s.hero_tablet}
        src={HeroImageTab}
        alt="hero"
        priority={true}
        width="1200"
        height="auto"
        sizes="100vw"
      />
      <Image
        className={s.hero_desktop}
        src={HeroImageDesk}
        alt="hero"
        priority={true}
        width="100vw"
        height="auto"
        sizes="100vw"
      />
    </section>
  )
}

export default Hero
