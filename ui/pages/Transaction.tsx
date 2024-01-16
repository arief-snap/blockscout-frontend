import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import { useAppContext } from 'lib/contexts/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TX } from 'stubs/tx';
import TextAd from 'ui/shared/ad/TextAd';
import EntityTags from 'ui/shared/EntityTags';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';
import TxDetails from 'ui/tx/TxDetails';
import TxDetailsDegraded from 'ui/tx/TxDetailsDegraded';
import TxDetailsWrapped from 'ui/tx/TxDetailsWrapped';
import TxInternals from 'ui/tx/TxInternals';
import TxLogs from 'ui/tx/TxLogs';
import TxRawTrace from 'ui/tx/TxRawTrace';
import TxState from 'ui/tx/TxState';
import TxSubHeading from 'ui/tx/TxSubHeading';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';

const TransactionPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const hash = getQueryParamString(router.query.hash);
  const { data, isPlaceholderData, isError, error, errorUpdateCount } = useApiQuery('tx', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: TX,
      // TODO @tom2drum: do only one request when refetching (disable retries)
      refetchInterval: (query): number | false => {
        return query.state.status === 'error' && query.state.errorUpdateCount > 0 ? 15 * SECOND : false;
      },
    },
  });

  const showDegradedView = (isError || isPlaceholderData) && errorUpdateCount > 0;

  const tabs: Array<RoutedTab> = (() => {
    const detailsComponent = showDegradedView ? <TxDetailsDegraded hash={ hash } originalError={ error }/> : <TxDetails/>;

    return [
      {
        id: 'index',
        title: config.features.suave.isEnabled && data?.wrapped ? 'Confidential compute tx details' : 'Details',
        component: detailsComponent,
      },
      config.features.suave.isEnabled && data?.wrapped ?
        { id: 'wrapped', title: 'Regular tx details', component: <TxDetailsWrapped data={ data.wrapped }/> } :
        undefined,
      { id: 'token_transfers', title: 'Token transfers', component: <TxTokenTransfer/> },
      { id: 'internal', title: 'Internal txns', component: <TxInternals/> },
      { id: 'logs', title: 'Logs', component: <TxLogs/> },
      { id: 'state', title: 'State', component: <TxState/> },
      { id: 'raw_trace', title: 'Raw trace', component: <TxRawTrace/> },
    ].filter(Boolean);
  })();

  const tabIndex = useTabIndexFromQuery(tabs);

  const tags = (
    <EntityTags
      isLoading={ isPlaceholderData }
      tagsBefore={ [ data?.tx_tag ? { label: data.tx_tag, display_name: data.tx_tag } : undefined ] }
    />
  );

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/txs');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to transactions list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titleSecondRow = <TxSubHeading hash={ hash } hasTag={ Boolean(data?.tx_tag) }/>;

  const content = (() => {
    if (isPlaceholderData && !showDegradedView) {
      return (
        <>
          <TabsSkeleton tabs={ tabs } mt={ 6 }/>
          { tabs[tabIndex]?.component }
        </>
      );
    }

    return <RoutedTabs tabs={ tabs }/>;
  })();

  if (error?.status === 422) {
    throw Error('Invalid tx hash', { cause: error as unknown as Error });
  }

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Transaction details"
        backLink={ backLink }
        contentAfter={ tags }
        secondRow={ titleSecondRow }
      />
      { content }
    </>
  );
};

export default TransactionPageContent;
