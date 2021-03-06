import { css } from '@emotion/core';

import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';
import { resetLayout } from 'app/styles/customProperties';

export const relatedArticleSectionHeader = css`
  display: block;
  margin: 0;
  padding: 30px 20px 15px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: black;
  border-top: 4px solid ${Colors.slategray_10};

  @media ${Media.PC} {
    padding: 30px 0 15px;
    border-top: 1px solid ${Colors.slategray_10};
  }
`;

export const relatedArticleList = css`
  margin: 0;
  padding: 0 20px 60px 20px;

  @media ${Media.PC} {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 0 100px 0;
  }
`;

export const relatedArticleList_Meta = css`
  flex: 1;
  flex-direction: column;
  margin-left: 15px;
  text-decoration: none;
`;

export const relatedArticleList_Item = css`
  padding: 15px 0;
  list-style: none;
  border-bottom: 1px solid ${Colors.slategray_10};

  & > .relatedArticleList_Link {
    flex-direction: row;
  }
`;

export const relatedArticleList_Thumbnail = css`
  padding: 0;
  margin: 0;
  width: 100px;
  height: 100px;
  align-items: center;
  overflow: hidden;
`;

export const relatedArticleList_Link = css`
  display: flex;
  color: inherit;
  text-decoration: inherit;
  align-items: center;
  justify-content: center;
`;

export const relatedArticleList_Title = css`
  ${resetLayout}

  display: block;
  margin: 0;
  color: black;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  word-wrap: break-word;
`;
