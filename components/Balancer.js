import { gql, useQuery, NetworkStatus } from "@apollo/client";

export const BALANCER_QUERY = gql`
  query {
    pools(orderBy: tokensCount, orderDirection: desc) {
      tokensCount
      totalSwapVolume
    }
  }
`;

export const balancerQueryVars = {
  first: 10,
};

export default function BalancerList() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    BALANCER_QUERY,
    {
      variables: balancerQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
      context: { dataSrc: "balancer" },
    }
  );

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: pools.length,
      },
    });
  };

  if (error) return <p> Error</p>;
  if (loading && !loadingMorePosts) return <div>Loading</div>;

  const { pools } = data;

  return (
    <section>
      <h1>Top Balancer Pools</h1>

      <ul>
        {pools.map((pool, index) => (
          <li key={index}>
            {index}: Token Count: {pool.tokensCount} Total Swap Volume:{" "}
            {pool.totalSwapVolume}
          </li>
        ))}
      </ul>
    </section>
  );
}
