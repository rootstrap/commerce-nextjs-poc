import { useQuery } from '@tanstack/react-query'
import { client } from 'api/client'
import { gql } from 'graphql-request'
import { QueryKeys } from 'types/enums/queryKeys'

export const GET_PRODUCTS = gql`
  query getProducts {
    products(first: 25) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
            }
          }
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
        }
      }
    }
  }
`

const fetchProducts = async () => await client.request(GET_PRODUCTS)

const useProducts = () => useQuery([QueryKeys.products], fetchProducts)

export default useProducts
