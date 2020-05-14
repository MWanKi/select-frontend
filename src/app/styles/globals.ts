import { css } from '@emotion/core';

import Media from './mediaQuery';

export const Scene = {
  Wrapper: css`
    min-height: 500px;
    @media ${Media.PC} {
      min-height: 900px;
    }
  `,
  WithLNB: css`
    .iosApp & {
      padding-top: 47px;
    }
    @media ${Media.MOBILE} {
      .iosApp & {
        padding-top: 47px;
      }
    }
  `,
  WithGNB: css`
    .iosApp & {
      margin-top: 57px;
      @media ${Media.PC} {
        margin-top: 58px;
      }
    }
  `,
};

const body = document.querySelector('body');
const disableScrollClass = 'disable-scroll';
export const toggleBodyScrollable = (isScrollable: boolean) => {
  if (body) {
    isScrollable
      ? body.classList.add(disableScrollClass)
      : body.classList.remove(disableScrollClass);
  }
};

export const GlobalStyles = css`
  body {
    &.${disableScrollClass} {
      overflow: hidden;
    }
  }
`;
