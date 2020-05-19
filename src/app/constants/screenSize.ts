/**
 * RIDI Selct Responsive Table (px)
 * | 320          359 |      414 | 415                       600 | 601                      834 | 835          900 |
 * | -- MINI_PHONE -- |          |                               |                              |                  |
 * | ---------- PHONE ---------- | ---------- PHABLET ---------- |                              |                  |
 * | -------------------- PHONE_AND_PHABLET ---------------------| ---------- TABLET ---------- | ------ PC ------ |
 * | ----------------------------------------- MOBILE ----------------------------------------- | ------ PC ------ |
 * | -------------------------------------------------- CONTENT -------------------------------------------------- |
 */

export const CONTENT_MIN_WIDTH = 320;
export const MINI_PHONE_MAX_WIDTH = 359;
export const PHONE_MAX_WIDTH = 414;
export const PHABLET_MIN_WIDTH = PHONE_MAX_WIDTH + 1;
export const PHABLET_MAX_WIDTH = 600;
export const TABLET_MIN_WIDTH = PHABLET_MAX_WIDTH + 1;
export const TABLET_MAX_WIDTH = 834;
export const MOBILE_MAX_WIDTH = TABLET_MAX_WIDTH;
export const PC_MIN_WIDTH = MOBILE_MAX_WIDTH + 1;
export const CONTENT_MAX_WIDTH = 900;
