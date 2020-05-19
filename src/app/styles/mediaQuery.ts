import {
  MINI_PHONE_MAX_WIDTH,
  PHONE_MAX_WIDTH,
  PHABLET_MIN_WIDTH,
  PHABLET_MAX_WIDTH,
  TABLET_MIN_WIDTH,
  TABLET_MAX_WIDTH,
  MOBILE_MAX_WIDTH,
  PC_MIN_WIDTH,
} from 'app/constants/screenSize';

const Media = {
  MINI_PHONE: `(max-width: ${MINI_PHONE_MAX_WIDTH}px)`,
  PHONE: `(max-width: ${PHONE_MAX_WIDTH}px)`,
  PHABLET: `(min-width: ${PHABLET_MIN_WIDTH}px) and (max-width: ${PHABLET_MAX_WIDTH}px)`,
  PHONE_AND_PHABLET: `(max-width: ${PHABLET_MAX_WIDTH}px)`,
  TABLET: `(min-width: ${TABLET_MIN_WIDTH}px) and (max-width: ${TABLET_MAX_WIDTH}px)`,
  MOBILE: `(max-width: ${MOBILE_MAX_WIDTH}px)`,
  PC: `(min-width: ${PC_MIN_WIDTH}px)`,
};

export default Media;
