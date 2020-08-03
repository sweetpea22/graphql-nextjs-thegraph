import { gql, useQuery, NetworkStatus } from "@apollo/client";

export const BORROW_RATES_QUERY = gql`
  query {
    markets {
      borrowRate
      name
    }
  }
`;

export const borrowRatesQueryVars = {
  first: 10,
};

export default function BorrowRates() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    BORROW_RATES_QUERY,
    {
      variables: borrowRatesQueryVars,
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      notifyOnNetworkStatusChange: true,
    }
  );

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: markets.length,
      },
    });
  };

  if (error) return <p> Error</p>;
  if (loading && !loadingMorePosts) return <div>Loading</div>;

  const { markets } = data;

  return (
    <section>
      <ul>
        {markets.map((market, index) => (
          <li key={index}>
            Market Name: {market.name} Borrow Rate: {market.borrowRate}
          </li>
        ))}
      </ul>

      <style jsx>{`
        section {
          padding-bottom: 20px;
        }
        li {
          display: block;
          margin-bottom: 10px;
        }
        div {
          align-items: center;
          display: flex;
        }
        a {
          font-size: 14px;
          margin-right: 10px;
          text-decoration: none;
          padding-bottom: 0;
          border: 0;
        }
        span {
          font-size: 14px;
          margin-right: 5px;
        }
        ul {
          margin: 0;
          padding: 0;
        }
        button:before {
          align-self: center;
          border-style: solid;
          border-width: 6px 4px 0 4px;
          border-color: #ffffff transparent transparent transparent;
          content: "";
          height: 0;
          margin-right: 5px;
          width: 0;
        }
      `}</style>
    </section>
  );
}
