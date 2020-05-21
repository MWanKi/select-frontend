import { camelize } from '@ridi/object-case-converter';
import qs from 'qs';
import { AxiosResponse } from 'axios';

import env from 'app/config/env';
import request from 'app/config/axios';
import { COUNT_PER_PAGE } from 'app/constants';
import { Categories } from 'app/services/category';
import { BookId, DateDTO, Omit, TextWithLF } from 'app/types';
import {
  Book,
  BookAuthors,
  BookOwnershipStatus,
  BookReviewSummary,
  BookThumbnailUrlMap,
  BookTitle,
} from 'app/services/book';

export interface RedirectionRequiredResponse {
  location: string;
  status: number;
}

export interface Publisher {
  name: string;
}

export interface BookFile {
  format: 'epub' | 'pdf' | 'bom';
  size: number;
  pageCount?: number;
  characterCount?: number;
}

export interface BookDetailPublishingDate {
  ridibooksRegisterDate?: string;
  ridibooksPublishingDate?: string;
  paperBookPublishDate?: string;
  ebookPublishDate?: string;
}

export interface NoticeResponse {
  id: number;
  bId: number;
  type: 'oper';
  content: TextWithLF;
  isVisible: boolean;
  beginDatetime: DateDTO;
  endDatetime: DateDTO;
  regDate: DateDTO;
  lastModified: DateDTO;
}

export interface BookDetailResponseV2 {
  id: BookId;
  title: BookTitle;
  thumbnail: BookThumbnailUrlMap;
  authors: BookAuthors;
  reviewSummary: BookReviewSummary;
  seriesBooks: Book[];
  publisherReview: TextWithLF;
  authorIntroduction: TextWithLF;
  introduction: TextWithLF; // former `description`
  introVideoUrl: string;
  introImageUrl: string;
  tableOfContents: TextWithLF;
  notices: NoticeResponse[];
  categories: Categories[][];
  publisher: Publisher;
  publishingDate: BookDetailPublishingDate;
  file: BookFile;
  previewAvailable: boolean;
  hasPreview: boolean;
  previewBId: BookId;
  beginDatetime: DateDTO;
  endDatetime: DateDTO;
}

export interface BookDetailResponseV1 extends Omit<BookDetailResponseV2, 'introduction'> {
  description: TextWithLF;
}

export type BookDetailResponse = BookDetailResponseV2 & RedirectionRequiredResponse;

export const requestBooks = (bookIds: number[]): Promise<BookDetailResponse> =>
  request({
    url: `/api/books?b_ids=${bookIds.join(',')}`,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<BookDetailResponse>>(response, { recursive: true }).data,
  );

export const requestBookDetail = (bookId: number): Promise<BookDetailResponse> =>
  request({
    url: `/api/books/${bookId}`,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<BookDetailResponse>>(response, { recursive: true }).data,
  );

export const requestBookOwnership = (bookId: number): Promise<BookOwnershipStatus> =>
  request({
    url: `${env.STORE_API}/api/select/users/me/books/${bookId}`,
    method: 'GET',
  }).then(
    response => camelize<AxiosResponse<BookOwnershipStatus>>(response, { recursive: true }).data,
  );

export const requestBookToBookRecommendation = (bookId: number, size?: number): Promise<Book[]> => {
  const parameters = qs.stringify({ size: size || COUNT_PER_PAGE });

  return request({
    url: `${env.RECOMMEND_API}/select/books/${bookId}/similar?${parameters}`,
    method: 'GET',
    withCredentials: true,
  }).then(response => camelize<Book[]>(response.data, { recursive: true }));
};
