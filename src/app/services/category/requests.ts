import { camelize } from '@ridi/object-case-converter';
import { AxiosResponse } from 'axios';

import request from 'app/config/axios';
import { Book } from 'app/services/book';
import { Categories } from 'app/services/category';

import { SortOptionValue } from './constants';

export interface CategoryBooksResponse {
  totalCount: number;
  category: Categories;
  books: Book[];
}

export const requestCategoryBooks = (
  categoryId: number,
  page: number,
  sort: SortOptionValue,
): Promise<CategoryBooksResponse> =>
  request({
    url: `/api/books?category=${categoryId}`,
    method: 'GET',
    params: { sort, page },
  }).then(
    response => camelize<AxiosResponse<CategoryBooksResponse>>(response, { recursive: true }).data,
  );

export const requestCategoryList = (): Promise<Categories[]> =>
  request({
    url: '/api/categories',
    method: 'GET',
  }).then(response => response.data);
