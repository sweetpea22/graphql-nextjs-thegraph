import { gql, useQuery, NetworkStatus } from "@apollo/client";

export const UNISWAP_QUERY = gql`
  query {
    tokens(orderBy: txCount, orderDirection: desc) {
      name
      tradeVolume
    }
  }
`;

export const uniswapQueryVars = {
  first: 10,
};

export default function UniswapList() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    UNISWAP_QUERY,
    {
      variables: uniswapQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
      context: { clientName: "uniswap" },
    }
  );

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: tokens.length,
      },
    });
  };

  if (error) return <p> Error</p>;
  if (loading && !loadingMorePosts) return <div>Loading</div>;

  const { tokens } = data;

  return (
    <section>
      <h1>Top Traded Uniswap Tokens</h1>
      <ul>
        {tokens.map((token, index) => (
          <li key={index}>
            Token Name: <strong>{token.name}</strong> Total Trade Volume:{" "}
            {token.tradeVolume}
          </li>
        ))}
      </ul>
    </section>
  );
}
