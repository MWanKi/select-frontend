import styled from '@emotion/styled';

import Media from 'app/styles/mediaQuery';
import {
  MINI_PHONE_MAX_WIDTH,
  PHONE_MAX_WIDTH,
  TABLET_MAX_WIDTH,
  PHABLET_MAX_WIDTH,
} from 'app/constants';

const GridBookListWrapper = styled.div`
  box-sizing: border-box;
  min-width: 320px;
  max-width: 800px;
  margin: 0 auto;

  @media ${Media.MINI_PHONE} {
    width: 320px;
    padding: 0 12px;
  }
  @media (min-width: ${MINI_PHONE_MAX_WIDTH + 1}px) and (max-width: ${PHONE_MAX_WIDTH - 1}px) {
    width: 360px;
    padding: 0 14px;
  }
  @media (min-width: ${PHONE_MAX_WIDTH}px) and (max-width: ${PHABLET_MAX_WIDTH - 1}px) {
    width: 414px;
    padding: 0 16px;
  }
  @media (min-width: ${PHABLET_MAX_WIDTH}px) and (max-width: 767px) {
    width: 512px;
  }
  @media (min-width: 768px) and (max-width: ${TABLET_MAX_WIDTH - 1}px) {
    width: 528px;
  }
  @media (min-width: ${TABLET_MAX_WIDTH}px) and (max-width: 1023px) {
    width: 800px;
  }
  @media (min-width: 1024px) {
    width: 800px;
  }
`;

export default GridBookListWrapper;
