import styled from '@emotion/styled';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import { ThumbnailLinkType, ThumbnailSize } from 'app/components/BookThumbnail';
import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { ConnectedTrackImpression } from 'app/components/TrackImpression';
import { ResponsiveSection, BookWidth } from 'app/constants';
import { Book } from 'app/services/book';
import { StarRating } from 'app/services/review/components';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { resetLayout } from 'app/styles/customProperties';

import GridBookListWrapper from './Wrapper';

interface Props {
  books: Book[];
  serviceTitleForTracking?: string;
  pageTitleForTracking?: string;
  uiPartTitleForTracking?: string;
  miscTracking?: string;
  isChart?: boolean;
  page?: number;
  itemCountPerPage?: number;
  thumbnailLinkType?: ThumbnailLinkType;
  onLinkClick?: (event: React.SyntheticEvent<any>) => any;
}

const SC = {
  GridBookListWrapper,
  GridBookList: styled.ul`
    ${resetLayout}
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  `,
};

export const GridBookList: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch();

  const { books, isChart = false, miscTracking } = props;
  const getSection = () => {
    const { serviceTitleForTracking, pageTitleForTracking, uiPartTitleForTracking } = props;
    return !!serviceTitleForTracking && !!pageTitleForTracking
      ? getSectionStringForTracking(
          serviceTitleForTracking,
          pageTitleForTracking,
          uiPartTitleForTracking,
        )
      : undefined;
  };

  const getRank = (current: number) => {
    const { page = 1, itemCountPerPage = 24 } = props;
    return current + 1 + (page - 1) * itemCountPerPage;
  };

  const renderItem = (width: ThumbnailSize, book: Book, rank: number, index: number) => {
    const {
      thumbnailLinkType = 'Link',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onLinkClick = () => {},
    } = props;
    const trackClick = (trackingParams: DefaultTrackingParams) =>
      dispatch(Actions.trackClick({ trackingParams }));

    const section = getSection();

    return (
      <div style={{ width }}>
        {isChart && <span className="GridBookList_ItemRanking">{rank}</span>}
        <DTOBookThumbnail
          book={book}
          width={width}
          linkUrl={`/book/${book.id}`}
          linkType={thumbnailLinkType}
          onLinkClick={(e: React.MouseEvent<any>) => {
            onLinkClick(e);
            if (section) {
              trackClick({
                section,
                index,
                id: book.id,
              });
            }
          }}
          sizeWrapperClassName="GridBookList_ItemThumbnail"
        />
        <Link
          to={`/book/${book.id}`}
          className="GridBookList_ItemLink"
          onClick={(e: React.MouseEvent<any>) => {
            onLinkClick(e);
            if (section) {
              trackClick({
                section,
                index,
                id: book.id,
              });
            }
          }}
        >
          <h3 className="GridBookList_ItemTitle">{book.title.main}</h3>
          {isChart && book.reviewSummary && (
            <span className="HomeSection_ChartBookRating">
              <StarRating rating={book.reviewSummary.buyerRatingAverage} />
              <span className="HomeSection_ChartBookRatingCount">
                {thousandsSeperator(book.reviewSummary.buyerRatingCount)}
              </span>
            </span>
          )}
        </Link>
      </div>
    );
  };

  const isNormal = useMediaQuery({
    minWidth: ResponsiveSection.VW_360,
    maxWidth: ResponsiveSection.VW_414 - 1,
  });
  const isLarge = useMediaQuery({
    minWidth: ResponsiveSection.VW_414,
    maxWidth: ResponsiveSection.VW_768 - 1,
  });
  const isFull = useMediaQuery({ minWidth: ResponsiveSection.VW_768 });

  const getBookWidth = () => {
    if (isNormal) {
      return BookWidth.WIDTH_100;
    }
    if (isLarge) {
      return BookWidth.WIDTH_116;
    }
    if (isFull) {
      return BookWidth.WIDTH_120;
    }
    return BookWidth.WIDTH_90;
  };

  const [bookWidth, setBookWidth] = React.useState(getBookWidth());
  React.useEffect(() => {
    setBookWidth(getBookWidth());
  }, [isNormal, isLarge, isFull]);

  return (
    <SC.GridBookListWrapper>
      <SC.GridBookList>
        {books.map((book, index) => (
          <li className="GridBookList_Item" key={book.id}>
            <ConnectedTrackImpression
              section={getSection()}
              index={index}
              id={book.id}
              misc={miscTracking}
            >
              {renderItem(bookWidth, book, getRank(index), index)}
            </ConnectedTrackImpression>
          </li>
        ))}
      </SC.GridBookList>
    </SC.GridBookListWrapper>
  );
};
