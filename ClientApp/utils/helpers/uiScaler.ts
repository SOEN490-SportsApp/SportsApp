import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

// Default guideline sizes are based on a standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

export const horizontalScale = (size: number): number => (shortDimension / guidelineBaseWidth) * size;
export const verticalScale = (size: number): number => (longDimension / guidelineBaseHeight) * size;
export const moderateHorizontalScale = (size: number, factor: number = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;
export const moderateVerticalScale = (size: number, factor: number = 0.5): number =>
  size + (verticalScale(size) - size) * factor;

export const hs = horizontalScale;
export const vs = verticalScale;
export const mhs = moderateHorizontalScale;
export const mvs = moderateVerticalScale;
