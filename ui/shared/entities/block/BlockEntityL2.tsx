import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import config from 'configs/app';
import txBatchIcon from 'icons/txBatch.svg';

import * as BlockEntity from './BlockEntity';

const feature = config.features.rollup;

const BlockEntityL2 = (props: BlockEntity.EntityProps) => {
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <BlockEntity.Link { ...props }>
      <BlockEntity.Icon { ...partsProps } asProp={ txBatchIcon }/>
      <BlockEntity.Content { ...partsProps }/>
    </BlockEntity.Link>
  );
};

export default chakra(BlockEntityL2);