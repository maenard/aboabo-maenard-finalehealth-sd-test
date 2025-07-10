export interface PaginationMeta {
  currentPage: number,
  totalPages: number,
  totalItems: number,
  perPage: number,
  nextPage: string | null,
  prevPage: string | null
}

export interface PaginationQuery {
  search: string | null,
  page: number,
  limit: number,
  sortBy: string,
  sortOrder: string,
}
