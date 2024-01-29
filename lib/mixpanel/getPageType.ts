import type { Route } from 'nextjs-routes';

export const PAGE_TYPE_DICT: Record<Route['pathname'], string> = {
  '/': 'Homepage',
  '/txs': 'Transactions',
  '/txs/kettle/[hash]': 'Kettle transactions',
  '/tx/[hash]': 'Transaction details',
  '/blocks': 'Blocks',
  '/block/[height_or_hash]': 'Block details',
  '/accounts': 'Top accounts',
  '/address/[hash]': 'Address details',
  '/verified-contracts': 'Verified contracts',
  '/contract-verification': 'Contract verification',
  '/address/[hash]/contract-verification': 'Contract verification for address',
  '/tokens': 'Tokens',
  '/token/[hash]': 'Token details',
  '/token/[hash]/instance/[id]': 'Token Instance',
  '/apps': 'Apps',
  '/apps/[id]': 'App',
  '/stats': 'Stats',
  '/api-docs': 'REST API',
  '/graphiql': 'GraphQL',
  '/search-results': 'Search results',
  '/auth/profile': 'Profile',
  '/account/watchlist': 'Watchlist',
  '/account/api-key': 'API keys',
  '/account/custom-abi': 'Custom ABI',
  '/account/public-tags-request': 'Public tags',
  '/account/tag-address': 'Private tags',
  '/account/verified-addresses': 'Verified addresses',
  '/withdrawals': 'Withdrawals',
  '/visualize/sol2uml': 'Solidity UML diagram',
  '/csv-export': 'Export data to CSV file',
  '/deposits': 'Deposits (L1 > L2)',
  '/outputs': 'Output roots',
  '/batches': 'Tx batches (L2 blocks)',
  '/batches/[number]': 'L2 tx batch details',
  '/404': '404',
  '/name-domains': 'Domains search and resolve',
  '/name-domains/[name]': 'Domain details',

  // service routes, added only to make typescript happy
  '/login': 'Login',
  '/api/media-type': 'Node API: Media type',
  '/api/proxy': 'Node API: Proxy',
  '/api/csrf': 'Node API: CSRF token',
  '/api/healthz': 'Node API: Health check',
  '/auth/auth0': 'Auth',
  '/auth/unverified-email': 'Unverified email',
};

export default function getPageType(pathname: Route['pathname']) {
  return PAGE_TYPE_DICT[pathname] || 'Unknown page';
}
