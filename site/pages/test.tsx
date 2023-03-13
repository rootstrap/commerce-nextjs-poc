import { QueryClient, dehydrate } from '@tanstack/react-query'
import { client } from '@shopify/client'
import { useGetAllProductsQuery } from '@shopify/generated/graphql'

export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient.fetchQuery(
    useGetAllProductsQuery.getKey(),
    useGetAllProductsQuery.fetcher(client)
  )
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default function Test() {
  const { data, isLoading } = useGetAllProductsQuery(client)

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  return (
    <div className="bg-white">
      {data?.products.edges.map((product) => (
        <h6 key={product.node.id}>{product.node.title}</h6>
      ))}
    </div>
  )
}
