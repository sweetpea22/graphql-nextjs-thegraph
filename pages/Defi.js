import BalancerList, {
  BALANCER_QUERY,
  balancerQueryVars,
} from "../components/Balancer";

import UniswapList, {
  UNISWAP_QUERY,
  uniswapQueryVars,
} from "../components/Uniswap";
import { initializeApollo } from "../lib/apolloClient";
import { useQuery } from "@apollo/client";

const doubleQuery = () => {
  const balancer = useQuery(UNISWAP_QUERY, {
    variables: {
      uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
    },
  });
  const uniswap = useQuery(BALANCER_QUERY, {
    context: { clientName: "balancer" },
  });
  return [balancer, uniswap];
};

const IndexPage = () => {
  let [balancer, uniswap] = doubleQuery();
  let { data, error, loading } = balancer;
  let {
    data: uniswapData,
    error: uniswaperror,
    loading: secondLoading,
  } = uniswap;

  if (error | uniswaperror) return <p> Error</p>;
  if (loading) return <div>Loading Balancer..</div>;

  const { poolTokens } = data;
  if (secondLoading) return <div>Loading Uniswap...</div>;

  const { tokens } = uniswapData;

  return (
    <div>
      <h1>Comparing Swap Volume across Token Platforms</h1>
      {/* balancer */}
      <section>
        <h4>Balancer Trade Volume</h4>
        <ul>
          {poolTokens.map((pool, index) => (
            <li key={index}>
              {index}: Token Count: {pool.tokensCount} Total Swap Volume:{" "}
              {pool.totalSwapVolume}
            </li>
          ))}
        </ul>
      </section>
      {/* uniswap */}
      <section>
        <h4>Top Traded Uniswap Tokens</h4>
        <ul>
          {tokens.map((token, index) => (
            <li key={index}>
              Token Name: {token.name} Total Trade Volume: {token.tradeVolume}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
