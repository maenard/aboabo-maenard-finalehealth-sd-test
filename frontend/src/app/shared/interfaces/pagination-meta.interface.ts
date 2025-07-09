export interface PaginationMeta {
  currentPage: number,
  totalPages: number,
  totalItems: number,
  perPage: number,
  nextPage: string | null,
  prevPage: string | null
}
