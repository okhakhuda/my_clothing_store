import { useState, useMemo } from 'react'

export const usePagination = (items, perPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * perPage
    return items.slice(start, start + perPage)
  }, [items, safePage, perPage])

  const goToPage = page => setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  const goNext = () => goToPage(safePage + 1)
  const goPrev = () => goToPage(safePage - 1)
  const reset = () => setCurrentPage(1)

  return {
    paginatedItems,
    currentPage: safePage,
    totalPages,
    goToPage,
    goNext,
    goPrev,
    reset,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  }
}
