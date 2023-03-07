import useProducts from 'api/hooks/products/useProducts'

export default function Test() {
  const { data, isLoading } = useProducts()

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  return <div className="bg-white"></div>
}
