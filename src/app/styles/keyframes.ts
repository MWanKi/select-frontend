import { keyframes } from '@emotion/core';

export const spinnerRotation = keyframes`
  0% { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
  5% { transform: translate3d(-50%, -50%, 0) rotate(30deg); }
  14% { transform: translate3d(-50%, -50%, 0) rotate(60deg); }
  23% { transform: translate3d(-50%, -50%, 0) rotate(90deg); }
  32% { transform: translate3d(-50%, -50%, 0) rotate(120deg); }
  41% { transform: translate3d(-50%, -50%, 0) rotate(150deg); }
  50% { transform: translate3d(-50%, -50%, 0) rotate(180deg); }
  59% { transform: translate3d(-50%, -50%, 0) rotate(210deg); }
  68% { transform: translate3d(-50%, -50%, 0) rotate(240deg); }
  77% { transform: translate3d(-50%, -50%, 0) rotate(270deg); }
  86% { transform: translate3d(-50%, -50%, 0) rotate(300deg); }
  95% { transform: translate3d(-50%, -50%, 0) rotate(330deg); }
  100% { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const fadeInSlidedown = keyframes`
  0% {
    transform: translateY(-40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const fadeOutSlideup = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-40px);
    opacity: 0;
  }
`;

export const fadeInSlideup = keyframes`
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const fadeOutSlidedown = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(40px);
    opacity: 0;
  }
`;

export const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;
