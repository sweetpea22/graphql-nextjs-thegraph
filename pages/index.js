// import Me, { ME_QUERY, MeQueryVars } from "../components/Me";
import BorrowRates, {
  BORROW_RATES_QUERY,
  borrowRatesQueryVars,
} from "../components/BorrowRates";
import { initializeApollo } from "../lib/apolloClient";

const IndexPage = () => (
  <div>
    <h1>Heyyyy</h1>
    <BorrowRates />
  </div>
);

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  // await apolloClient.query({
  //   query: ME_QUERY,
  //   variables: MeQueryVars,
  // });

  await apolloClient.query({
    query: BORROW_RATES_QUERY,
    variables: borrowRatesQueryVars,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
}

export default IndexPage;
