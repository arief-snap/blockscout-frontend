import { keyframes } from '@chakra-ui/system';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { getColor, mode } from '@chakra-ui/theme-tools';

const fade = (startColor: string, endColor: string) =>
  keyframes({
    from: { borderColor: startColor, background: startColor },
    to: { borderColor: endColor, background: endColor },
  });

const baseStyle: SystemStyleFunction = (props) => {
  const defaultStartColor = mode('blackAlpha.50', 'whiteAlpha.200')(props);
  const defaultEndColor = mode('blackAlpha.200', 'whiteAlpha.300')(props);

  const {
    startColor = defaultStartColor,
    endColor = defaultEndColor,
    speed,
    theme,
  } = props;

  const start = getColor(theme, startColor);
  const end = getColor(theme, endColor);

  return {
    opacity: 0.7,
    borderRadius: '2px',
    borderColor: start,
    background: end,
    animation: `${ speed }s linear infinite alternate ${ fade(start, end) }`,
  };
};

const Skeleton = {
  baseStyle,
};

export default Skeleton;
