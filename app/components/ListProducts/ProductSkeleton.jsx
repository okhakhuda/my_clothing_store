'use client'

import s from './ProductSkeleton.module.scss'

const ProductSkeleton = () => {
  return (
    <div className={s.skeletonCard}>
      <div className={s.skeletonImage}></div>
      <div className={s.skeletonInfo}>
        <div className={s.skeletonName}></div>
        <div className={s.skeletonPrice}></div>
      </div>
    </div>
  )
}

export default ProductSkeleton
