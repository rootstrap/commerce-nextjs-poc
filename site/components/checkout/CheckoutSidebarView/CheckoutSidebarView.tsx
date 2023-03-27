import Link from 'next/link'
import { FC } from 'react'
import CartItem from '@components/cart/CartItem'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import SidebarLayout from '@components/common/SidebarLayout'
import usePrice from '@framework/product/use-price'
import { client } from '@shopify/client'
import { useGetCheckoutQuery } from 'shopify/generated/graphql'
import ShippingWidget from '../ShippingWidget'
import s from './CheckoutSidebarView.module.css'
import { normalizeCart } from '@framework/utils/normalize'
import { Checkout } from '@vercel/commerce-shopify/schema'

const CheckoutSidebarView: FC = () => {
  const { setSidebarView } = useUI()
  const { data } = useGetCheckoutQuery(client)

  const cartData = data && normalizeCart(data.node as Checkout)

  async function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault()
    setSidebarView('PAYMENT_VIEW')
  }

  const { price: subTotal } = usePrice(
    cartData && {
      amount: Number(cartData.subtotalPrice),
      currencyCode: cartData.currency.code,
    }
  )
  const { price: total } = usePrice(
    cartData && {
      amount: Number(cartData.totalPrice),
      currencyCode: cartData.currency.code,
    }
  )

  const { price: taxTotal } = usePrice(
    data && {
      amount: Number(data.node?.totalTaxV2?.amount || 0),
      currencyCode: data.node?.totalTaxV2?.currencyCode || '',
    }
  )

  const { price: dutiesTotal } = usePrice(
    data && {
      amount: Number(data.node?.totalDuties?.amount || 0),
      currencyCode: data.node?.totalDuties?.currencyCode || '',
    }
  )

  return (
    <SidebarLayout
      className={s.root}
      handleBack={() => setSidebarView('CART_VIEW')}
    >
      <div className="px-4 sm:px-6 flex-1">
        <Link href="/cart">
          <Text variant="sectionHeading">Checkout</Text>
        </Link>

        <ShippingWidget
          isValid={data?.node?.shippingAddress}
          onClick={() => setSidebarView('SHIPPING_VIEW')}
        />

        {cartData && (
          <ul className={s.lineItemsList}>
            {cartData.lineItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                currencyCode={cartData.currency.code}
                variant="display"
              />
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm"
      >
        <ul className="pb-2">
          <li className="flex justify-between py-1">
            <span>Subtotal</span>
            <span>{subTotal}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Taxes</span>
            <span>{taxTotal}</span>
          </li>
          <li className="flex justify-between py-1">
            <span>Shipping</span>
            <span className="font-bold tracking-wide">
              {dutiesTotal || 'FREE'}
            </span>
          </li>
        </ul>
        <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
          <span>Total</span>
          <span>{total}</span>
        </div>
        <div>
          {/* Once data is correctly filled */}
          <Button
            type="submit"
            width="100%"
            disabled={!data?.node?.shippingAddress}
          >
            Confirm Purchase
          </Button>
        </div>
      </form>
    </SidebarLayout>
  )
}

export default CheckoutSidebarView
