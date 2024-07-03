import { getEnvValue } from './utils';

const DEFAULT_CURRENCY_DECIMALS = 18;

const chain = Object.freeze({
  id: getEnvValue('NEXT_PUBLIC_NETWORK_ID'),
  name: getEnvValue('NEXT_PUBLIC_NETWORK_NAME'),
  shortName: getEnvValue('NEXT_PUBLIC_NETWORK_SHORT_NAME'),
  currency: {
    name: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_NAME'),
    weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
    symbol: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL'),
    decimals: Number(getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS')) || DEFAULT_CURRENCY_DECIMALS,
  },
  secondaryCoin: {
    symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
  },
  hasMultipleGasCurrencies: getEnvValue('NEXT_PUBLIC_IS_TESTNET') === 'true',
  tokenStandard: getEnvValue('NEXT_PUBLIC_NETWORK_TOKEN_STANDARD_NAME') || 'ERC',
  rpcUrl: getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'),
  isTestnet: getEnvValue('NEXT_PUBLIC_IS_TESTNET') === 'true',
  verificationType: getEnvValue('NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE') || 'mining',
});

export default chain;
