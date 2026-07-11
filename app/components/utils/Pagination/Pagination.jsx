import s from './Pagination.module.scss'

export const Pagination = ({ currentPage, totalPages, goToPage, goNext, goPrev, hasNext, hasPrev }) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const delta = 2
    const range = []

    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i)
    }

    if (range[0] > 1) {
      if (range[0] > 2) range.unshift('...')
      range.unshift(1)
    }

    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) range.push('...')
      range.push(totalPages)
    }

    return range
  }

  return (
    <nav className={s.pagination} aria-label="Пагінація">
      <button className={s.btn} onClick={goPrev} disabled={!hasPrev} aria-label="Попередня сторінка">
        ‹
      </button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className={s.dots}>
            …
          </span>
        ) : (
          <button
            key={page}
            className={`${s.btn} ${page === currentPage ? s.active : ''}`}
            onClick={() => goToPage(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button className={s.btn} onClick={goNext} disabled={!hasNext} aria-label="Наступна сторінка">
        ›
      </button>
    </nav>
  )
}
