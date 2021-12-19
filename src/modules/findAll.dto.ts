enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FindAllDto {
  keyword: string;
  sort: SortOrder;
  page: number;
  take: number;
}
