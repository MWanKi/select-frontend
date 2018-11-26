import * as qs from 'qs';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Button } from '@ridi/rsg/components/dist/button';
import { Icon } from '@ridi/rsg/components/dist/icon';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { BookState } from 'app/services/book';
import { GNBSearchActiveType } from 'app/services/commonUI';
import { ActionUpdateGNBSearchActiveType, updateSearchActiveType } from 'app/services/commonUI/actions';
import { SearchResultBook, SearchResultState } from 'app/services/searchResult';
import { ActionQueryKeywordRequest, queryKeywordRequest } from 'app/services/searchResult/actions';
import { SearchResultBookList } from 'app/services/searchResult/components/SearchResultBookList';
import { RidiSelectState } from 'app/store';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { EnvironmentState } from 'app/services/environment';
import { Helmet } from 'react-helmet';

interface SearchResultStateProps {
  books: BookState;
  searchResult: SearchResultState;
  environment: EnvironmentState
}

interface SearchResultDispatchProps {
  dispatchRequestSearchResult: (keyword: string, page: number) => ActionQueryKeywordRequest;
  dispatchUpdateGNBSearchActiveType: (type: GNBSearchActiveType) => ActionUpdateGNBSearchActiveType;
}

type OwnProps = RouteComponentProps;
type Props = SearchResultStateProps & SearchResultDispatchProps & OwnProps;

interface QueryString {
  'q'?: string;
}

interface State {
  query: string;
}

export class SearchResult extends React.Component<Props, State> {
  private unlistenToHistory: () => void;

  public state: State = {
    query: '',
  };

  private isListExist(list: any[]) {
    return list && list.length > 0;
  }

  private renderEmpty() {
    const { query } = this.state;

    return (
      <div className="SearchResult_EmptyWrapper">
        <div className="EmptyIcon">
          <Icon
            name="search"
            className="SearchResult_EmptyIcon"
          />
        </div>
        <h3 className="SearchResult_EmptyTitle">
          {`'`}<strong>{query}</strong>{`'에 대한 검색결과가 없습니다.`}
        </h3>
      </div>
    );
  }

  public componentWillMount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.block);
    const queryString: QueryString = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    this.unlistenToHistory = this.props.history.listen((location) => {
      const newQueryString = qs.parse(location.search, { ignoreQueryPrefix: true });
      if (this.state.query !== newQueryString.q) {
        this.setState({ query: newQueryString.q });
      }
    });
    this.setState({ query: queryString.q || '' });
  }

  public componentWillUnmount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.cover);
    this.unlistenToHistory();
  }

  public render() {
    const { books, searchResult, dispatchRequestSearchResult, environment } = this.props;
    const { query } = this.state;

    return (
      <main className="SceneWrapper PageSearchResult">
        <Helmet>
          <title>{!!query ? `'${query}' 검색 결과 - 리디셀렉트` : '리디셀렉트'}</title>
        </Helmet>
        <h1 className="a11y">{`'`}<strong>{query}</strong>{`'에 대한 도서 검색 결과`}</h1>
        <ConnectedListWithPagination
          _key={query}
          isFetched={(page) => searchResult[query] &&
              searchResult[query].itemListByPage[page] &&
              searchResult[query].itemListByPage[page].isFetched
          }
          fetch={(page) => dispatchRequestSearchResult(query, page)}
          itemCount={searchResult[query] ? searchResult[query].itemCount : undefined}
          buildPaginationURL={(p: number) => `/search?q=${query}&page=${p}`}
          renderPlaceholder={() => (<LandscapeBookListSkeleton />)}
          renderItems={(page) => this.isListExist(searchResult[query].itemListByPage[page].itemList) ? (
            <>
              <p className="PageSearchResult_Title">
                {`'`}<strong>{query}</strong>{`'에 대한 도서 검색 결과`}
              </p>
              <SearchResultBookList
                keyword={query}
                books={searchResult[query].itemListByPage[page].itemList.map((item): SearchResultBook => {
                  return {
                    ...books[item.bookId].book!,
                    highlight: item.highlight,
                    publisher: item.publisher
                  };
                })}
              />
            </>
          ) : this.renderEmpty()}
        >
          {
            !environment.platform.isRidiApp &&
            <Button
              color="blue"
              outline={true}
              component="a"
              href={`${environment.constants.BASE_URL_STORE}/search?q=${encodeURIComponent(query)}`}
              className="PageSearchResult_RidibooksResult"
              size="large"
            >
              리디북스 검색 결과 보기
              <Icon
                name="arrow_5_right"
                className="PageSearchResult_RidibooksResultIcon"
              />
            </Button>
          }
        </ConnectedListWithPagination>
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): SearchResultStateProps => {
  return {
    books: rootState.booksById,
    searchResult: rootState.searchResult,
    environment: rootState.environment,
  };
};
const mapDispatchToProps = (dispatch: any): SearchResultDispatchProps => {
  return {
    dispatchRequestSearchResult: (keyword: string, page: number) =>
      dispatch(queryKeywordRequest(keyword, page)),
    dispatchUpdateGNBSearchActiveType: (type: GNBSearchActiveType) =>
      dispatch(updateSearchActiveType(type)),
  };
};
export const ConnectedSearchResult = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchResult),
);
