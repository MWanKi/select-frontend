import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, LinkProps, useHistory } from 'react-router-dom';

import { GridBookList, HelmetWithTitle, PCPageHeader } from 'app/components';
import { PageTitleText } from 'app/constants';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Actions as categoryActions } from 'app/services/category';
import { getIdFromLocationSearch, isValidNumber } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';
import { Pagination } from 'app/components/Pagination';
import { getPageQuery } from 'app/services/routing/selectors';
import SelectDialog from 'app/components/SelectDialog';

const ItemCountPerPage = 24;

const Category: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const isCategoryListFetched = useSelector((state: RidiSelectState) => state.categories.isFetched);
  const categoryList = useSelector((state: RidiSelectState) => state.categories.itemList) || [];
  const categoryId = useSelector((state: RidiSelectState) =>
    Number(getIdFromLocationSearch(state.router.location.search)),
  );
  const category = useSelector((state: RidiSelectState) => state.categoriesById[categoryId]);
  const books = useSelector((state: RidiSelectState) => state.booksById);
  const page = useSelector(getPageQuery);

  const isValidCategoryId = isValidNumber(categoryId);
  const itemCount = category?.itemCount;
  const isCategoryItemFetched = category?.itemListByPage[page]?.isFetched;

  useEffect(() => {
    dispatch(
      categoryActions.initializeCategoriesWhole({
        shouldFetchCategoryList: !isCategoryListFetched,
        shouldInitializeCategoryId: !isValidCategoryId,
      }),
    );
  }, []);

  useEffect(() => {
    if (isValidCategoryId) {
      dispatch(categoryActions.cacheCategoryId({ categoryId }));
      !isCategoryItemFetched &&
        dispatch(categoryActions.loadCategoryBooksRequest({ categoryId, page }));
    }
  }, [categoryId, page]);

  const FirstCategory = () => {
    if (categoryId && categoryList && categoryList.length > 0) {
      const selectedItem = categoryList.filter(item => categoryId === item.id)[0];
      const changeFirstCategory = (clickedCategoryId: number) => {
        history.push(`/categories?id=${clickedCategoryId}`);
      };
      return (
        <SelectDialog
          dialogTitle="카테고리"
          items={categoryList}
          selectedItem={selectedItem}
          onClickItem={changeFirstCategory}
        />
      );
    }
    return null;
  };

  return (
    <main className="SceneWrapper SceneWrapper_WithGNB SceneWrapper_WithLNB">
      <HelmetWithTitle titleName={PageTitleText.CATEGORY} />
      <FirstCategory />
      {!isCategoryListFetched || !isValidCategoryId || !isCategoryItemFetched ? (
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
          {itemCount && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(itemCount / ItemCountPerPage)}
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
};

export default Category;
