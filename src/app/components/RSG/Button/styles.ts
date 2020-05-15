import { css } from '@emotion/core';

import Colors from 'app/styles/colors';
import {
  brownSpinner,
  blueSpinner,
  graySpinner,
  resetAppearance,
  resetFontUnlimited,
} from 'app/styles/customProperties';
import { spinnerRotation } from 'app/styles/keyframes';

const colorGray10 = Colors.slategray_10;
const colorGray20 = Colors.slategray_20;
const colorGray50 = Colors.slategray_50;
const colorGray60 = Colors.slategray_60;

/* blue color set */
const colorBlue10 = Colors.dodgerblue_10;
const colorBlue50 = Colors.dodgerblue_50;
const colorBlue60 = Colors.dodgerblue_60;

/* brown color set */
const colorBrown10 = Colors.brown_10;
const colorBrown50 = Colors.brown_50;
const colorBrown60 = Colors.brown_60;

export const common = css`
  ${resetAppearance}
  ${resetFontUnlimited}

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 1px solid ${colorGray50};
  border-radius: 4px;
  background: ${colorGray50};
  color: white;
  font-size: 13px;
  font-weight: 700;
  line-height: 2.38em;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  vertical-align: baseline;
  text-decoration: none;

  .RSGButton_SVGIcon {
    display: inline-block;
    height: 1em;
    margin: 0;
    vertical-align: 0;
    fill: white;
  }

  &.gray {
    border-color: ${colorGray60};
    background: ${colorGray50};
  }
  &.blue {
    border-color: ${colorBlue60};
    background: ${colorBlue50};
  }
  &.brown {
    border-color: ${colorBrown60};
    background: ${colorBrown50};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &:not(:disabled):active {
    background: ${colorGray60};
    transition: background 0.2s, color 0.2s;

    .RSGButton_SVGIcon {
      transition: fill 0.3s;
    }

    &.gray {
      background: ${colorGray60};
    }

    &.blue {
      background: ${colorBlue60};
    }

    &.brown {
      background: ${colorBrown60};
    }
  }
  @media (hover: hover) {
    &:not(:disabled):hover {
      background: ${colorGray60};
      transition: background 0.2s, color 0.2s;

      .RSGButton_SVGIcon {
        transition: fill 0.3s;
      }

      &.gray {
        background: ${colorGray60};
      }

      &.blue {
        background: ${colorBlue60};
      }

      &.brown {
        background: ${colorBrown60};
      }
    }
  }
`;

export const noneBorder = css`
  border-width: 0;
`;

export const thickBorder = css`
  border-width: 2px;
`;

export const small = css`
  line-height: 1.91em;
`;

export const medium = css`
  line-height: 2.38em;
`;

export const large = css`
  line-height: 3.12em;
`;

export const spinner = css`
  position: relative;
  &::after {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.2em;
    height: 1.2em;
    transform: translate3d(-50%, -50%, 0);
    transform-origin: center;
    background-position: left top;
    background-repeat: no-repeat;
    background-size: cover;
    animation: ${spinnerRotation} 1s step-start forwards infinite;
    content: '';
  }
  &::after {
    background-image: url(${graySpinner});
  }

  &.gray {
    color: transparent;
    &::after {
      background-image: url(${graySpinner});
    }
  }
  &.blue {
    color: transparent;
    &::after {
      background-image: url(${blueSpinner});
    }
  }
  &.brown {
    color: transparent;
    &::after {
      background-image: url(${brownSpinner});
    }
  }

  &:not(:disabled):active,
  &:not(:disabled):hover {
    &.gray,
    &.blue,
    &.brown {
      color: transparent;
    }
  }
`;

export const outline = css`
  border-color: ${colorGray20};
  background: white;
  color: ${colorGray50};

  .RSGButton_SVGIcon {
    fill: ${colorGray50};
  }

  &.gray {
    border-color: ${colorGray20};
    background: white;
    color: ${colorGray50};
    & .RSGButton_SVGIcon {
      fill: ${colorGray50};
    }
  }

  &.blue {
    border-color: ${colorBlue50};
    background: white;
    color: ${colorBlue50};
    & .RSGButton_SVGIcon {
      fill: ${colorBlue50};
    }
  }

  &.brown {
    border-color: ${colorBrown50};
    background: white;
    color: ${colorBrown50};
    & .RSGButton_SVGIcon {
      fill: ${colorBrown50};
    }
  }

  &:not(:disabled):active {
    background: ${colorGray10};

    &.gray {
      background: ${colorGray10};
    }

    &.blue {
      background: ${colorBlue10};
    }

    &.brown {
      background: ${colorBrown10};
    }
  }

  @media (hover: hover) {
    &:not(:disabled):hover {
      background: ${colorGray10};

      &.gray {
        background: ${colorGray10};
      }

      &.blue {
        background: ${colorBlue10};
      }

      &.brown {
        background: ${colorBrown10};
      }
    }
  }
`;
