import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'nextjs/PageServer';

import Login from 'ui/pages/Login';

const Page: NextPage = () => {
  return (
    <PageServer pathname="/login">
      <Login/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
