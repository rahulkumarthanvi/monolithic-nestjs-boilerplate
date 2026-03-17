import { PaginationDto, PaginationMeta } from '../dto/pagination.dto';

export function buildPaginationMeta(
  pagination: PaginationDto,
  total: number,
): PaginationMeta {
  const page = pagination.page ?? 1;
  const limit = pagination.limit ?? 10;
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    totalPages,
  };
}

