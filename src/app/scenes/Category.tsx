import React from 'react';
import { connect } from 'react-redux';
import { Link, LinkProps } from 'react-router-dom';

import { GridBookList, HelmetWithTitle, PCPageHeader } from 'app/components';
import history from 'app/config/history';
import { PageTitleText } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import {
  Category as CategoryState,
  CategoryCollectionState,
  Actions as categoryActions,
} from 'app/services/category';
import { getIdFromLocationSearch, isValidNumber } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';
import { Pagination } from 'app/components/Pagination';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { getPageQuery } from 'app/services/routing/selectors';
import { getIsMobile } from 'app/services/commonUI/selectors';

interface CategoryStateProps {
  isIosInApp: boolean;
  isCategoryListFetched: boolean;
  categoryList: CategoryState[];
  categoryId: number;
  category: CategoryCollectionState;
  books: BookState;
  page: number;
  isMobile: boolean;
}

type Props = CategoryStateProps & ReturnType<typeof mapDispatchToProps>;

interface State {
  isInitialized: boolean;
}

class Category extends React.Component<Props, State> {
  private initialDispatchTimeout?: number | null;

  public state: State = {
    isInitialized: false,
  };

  private isFetched = (page: number) => {
    const { category } = this.props;
    return category && category.itemListByPage[page] && category.itemListByPage[page].isFetched;
  };

  private renderSelectBox() {
    const { categoryId, categoryList = [] } = this.props;
    return (
      <div className="RUISelectBox RUISelectBox-outline Category_SelectBox">
        <select
          title="카테고리 선택"
          className="RUISelectBox_Select"
          value={categoryId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            history.push(`/categories?id=${e.currentTarget.value}`);
          }}
        >
          {categoryList.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 48 28" className="RUISelectBox_OpenIcon">
          <path d="M48 .6H0l24 26.8z" />
        </svg>
      </div>
    );
  }

  public componentDidMount() {
    const {
      categoryId,
      page,
      isCategoryListFetched,
      dispatchCacheCategoryId,
      dispatchInitializeCategoriesWhole,
      dispatchLoadCategoryBooks,
    } = this.props;

    this.initialDispatchTimeout = window.setTimeout(() => {
      if (isValidNumber(categoryId)) {
        dispatchCacheCategoryId(categoryId);
      }
      dispatchInitializeCategoriesWhole(!isCategoryListFetched, !isValidNumber(categoryId));

      if (!this.isFetched(page) && isValidNumber(categoryId)) {
        dispatchLoadCategoryBooks(categoryId, page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { categoryId, dispatchCacheCategoryId } = nextProps;
    const { isInitialized } = nextState;

    if (isInitialized && isValidNumber(categoryId) && this.props.categoryId !== categoryId) {
      dispatchCacheCategoryId(categoryId);
    }

    if (!isValidNumber(categoryId)) {
      return true;
    }

    if (nextProps.page !== this.props.page || nextProps.categoryId !== this.props.categoryId) {
      const { dispatchLoadCategoryBooks, page, category } = nextProps;

      if (!(category && category.itemListByPage[page] && category.itemListByPage[page].isFetched)) {
        dispatchLoadCategoryBooks(categoryId, page);
      }
    }
    return true;
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    const { books, category, categoryId, isCategoryListFetched, page, isMobile } = this.props;
    const itemCount: any = category ? category.itemCount : 0;
    const itemCountPerPage = 24;

    const selectBoxTemplate = isValidNumber(categoryId) && this.renderSelectBox();
    return (
      <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB">
        <HelmetWithTitle titleName={PageTitleText.CATEGORY} />
        <PCPageHeader pageTitle={PageTitleText.CATEGORY}>
          {isValidNumber(categoryId) && this.renderSelectBox()}
        </PCPageHeader>
        {isMobile && <div className="Category_Header GridBookList">{selectBoxTemplate}</div>}
        {!isCategoryListFetched || !isValidNumber(categoryId) || !this.isFetched(page) ? (
          <GridBookListSkeleton />
        ) : (
          <>
            <GridBookList
              serviceTitleForTracking="select-book"
              pageTitleForTracking="category"
              uiPartTitleForTracking="book-list"
              miscTracking={JSON.stringify({ sect_cat_id: categoryId, sect_page: page })}
              books={category.itemListByPage[page].itemList.map(id => books[id].book!)}
            />
            {!isNaN(itemCount) && itemCount > 0 && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(itemCount / itemCountPerPage)}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: `/categories?id=${categoryId}&page=${p}`,
                  }),
                }}
              />
            )}
          </>
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CategoryStateProps => ({
  isIosInApp: getIsIosInApp(rootState),
  isCategoryListFetched: rootState.categories.isFetched,
  categoryList: rootState.categories.itemList,
  categoryId: Number(getIdFromLocationSearch(rootState.router.location.search)),
  category:
    rootState.categoriesById[Number(getIdFromLocationSearch(rootState.router.location.search))],
  books: rootState.booksById,
  page: getPageQuery(rootState),
  isMobile: getIsMobile(rootState),
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchInitializeCategoriesWhole: (
    shouldFetchCategoryList: boolean,
    shouldInitializeCategoryId: boolean,
  ) =>
    dispatch(
      categoryActions.initializeCategoriesWhole({
        shouldFetchCategoryList,
        shouldInitializeCategoryId,
      }),
    ),
  dispatchLoadCategoryList: () => dispatch(categoryActions.loadCategoryListRequest()),
  dispatchInitializeCategoryId: () => dispatch(categoryActions.initializeCategoryId()),
  dispatchCacheCategoryId: (categoryId: number) =>
    dispatch(categoryActions.cacheCategoryId({ categoryId })),
  dispatchLoadCategoryBooks: (categoryId: number, page: number) =>
    dispatch(categoryActions.loadCategoryBooksRequest({ categoryId, page })),
});

const ConnectedCategory = connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false,
})(Category);

export default ConnectedCategory;
