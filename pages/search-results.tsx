import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import PageServer from 'nextjs/PageServer';

import type { NextPageWithLayout } from 'pages/_app';
import LayoutSearchResults from 'ui/shared/layout/LayoutSearchResults';

const SearchResults = dynamic(() => import('ui/pages/SearchResults'), { ssr: false });

const Page: NextPageWithLayout<Props> = (props: Props) => {
  return (
    <PageServer pathname="/search-results" query={ props }>
      <SearchResults/>
    </PageServer>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutSearchResults>
      { page }
    </LayoutSearchResults>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
