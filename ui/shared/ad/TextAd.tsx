import { chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import CoinzillaTextAd from './CoinzillaTextAd';

const TextAd = ({ className }: {className?: string}) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!config.features.ads_text.isEnabled || hasAdblockCookie) {
    return null;
  }

  return <CoinzillaTextAd className={ className }/>;
};

export default chakra(TextAd);
