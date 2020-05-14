import { SerializedStyles, css } from '@emotion/core';

/**
 * 터치기반 기기와 마우스 기반 기기에서의 hover 스타일 분기처리 helper
 * 부모요소 hover시 자식요소의 스타일이 변경되어야 하는 경우에 대응하여 parentTagName을 받음
 * */
const hoverStyles = (styles: SerializedStyles, parentTagName?: string) => css`
  ${parentTagName ? `${parentTagName}:not(:disabled):active &` : '&:not(:disabled):active'} {
    ${styles}
  }

  @media (hover: hover) {
    ${parentTagName ? `${parentTagName}:not(:disabled):hover &` : '&:not(:disabled):hover'} {
      ${styles}
    }
  }
`;

export default hoverStyles;
