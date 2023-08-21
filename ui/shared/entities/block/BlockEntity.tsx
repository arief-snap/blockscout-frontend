import type { As } from '@chakra-ui/react';
import { Box, chakra, Skeleton } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import blockIcon from 'icons/block.svg';
import IconBase from 'ui/shared/chakra/Icon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';

import type { Size } from '../utils';
import { getPropsForSize } from '../utils';

// TODO @tom2drum icon color: grey for search result page

interface LinkProps extends Pick<EntityProps, 'className' | 'hash' | 'number' | 'onClick' | 'isLoading' | 'isExternal' | 'href'> {
  children: React.ReactNode;
}

const Link = chakra(({ number, hash, className, isLoading, children, isExternal, onClick, href }: LinkProps) => {
  const Component = isExternal ? LinkExternal : LinkInternal;

  return (
    <Component
      className={ className }
      href={ href ?? route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: hash ?? String(number) } }) }
      display="flex"
      alignItems="center"
      minWidth={ 0 } // for content truncation - https://css-tricks.com/flexbox-truncated-text/
      isLoading={ isLoading }
      onClick={ onClick }
    >
      { children }
    </Component>
  );
});

interface IconProps extends Pick<EntityProps, 'isLoading' | 'size' | 'noIcon'> {
  asProp?: As;
}

const Icon = ({ isLoading, size, noIcon, asProp }: IconProps) => {
  if (noIcon) {
    return null;
  }

  const styles = getPropsForSize(size).icon;
  return (
    <Box marginRight={ styles.marginRight }>
      <IconBase
        as={ asProp ?? blockIcon }
        boxSize={ styles.boxSize }
        isLoading={ isLoading }
        borderRadius="base"
      />
    </Box>
  );
};

interface ContentProps extends Pick<EntityProps, 'className' | 'isLoading' | 'tailLength' | 'number'> {
  asProp?: As;
}

const Content = chakra(({ className, isLoading, number, tailLength, asProp }: ContentProps) => {
  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      overflow="hidden"
      whiteSpace="nowrap"
    >
      <HashStringShortenDynamic
        hash={ String(number) }
        tailLength={ tailLength ?? 2 }
        as={ asProp }
      />
    </Skeleton>
  );
});

export interface EntityProps {
  className?: string;
  isLoading?: boolean;
  number: number;
  hash?: string;
  size?: Size;
  tailLength?: number;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  isExternal?: boolean;
  href?: string;
  noIcon?: boolean;
}

const BlockEntity = (props: EntityProps) => {
  const partsProps = _omit(props, [ 'className', 'onClick' ]);

  return (
    <Link { ...props }>
      <Icon { ...partsProps }/>
      <Content { ...partsProps }/>
    </Link>
  );
};

export default React.memo(chakra(BlockEntity));

export {
  Link,
  Icon,
  Content,
};