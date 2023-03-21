import cn from 'clsx'
import Link from 'next/link'
import { FC } from 'react'
import s from './CartSidebarView.module.css'
import { Button, Text } from '@components/ui'
import { useUI } from '@components/ui/context'
import { Bag, Cross, Check } from '@components/icons'
import usePrice from '@framework/product/use-price'
import { client } from '@shopify/client'
import CartItem from '@components/cart/CartItem'

import { useGetCartQuery } from 'shopify/generated/graphql'
import SidebarLayout from '@components/common/SidebarLayout'
import { normalizeLineItem } from '@framework/utils/normalize'
import { ProductVariant } from '@vercel/commerce-shopify/schema'
import { CheckoutLineItem } from '@vercel/commerce-shopify/schema'

const CartSidebarView: FC = () => {
  const { closeSidebar, setSidebarView } = useUI()
  const { data, isLoading } = useGetCartQuery(client)

  const items =
    data?.cart &&
    data.cart.lines.edges.map(({ node }) =>
      normalizeLineItem({
        node: {
          id: node.merchandise.id,
          title: node.merchandise.title,
          variant: node.merchandise as ProductVariant,
          quantity: node.quantity,
        },
      } as CheckoutLineItem)
    )

  const isEmpty = !data

  const { price: subTotal } = usePrice(
    data && {
      amount: Number(data.cart?.cost.subtotalAmount.amount),
      currencyCode: data.cart?.cost.subtotalAmount.currencyCode,
    }
  )
  const { price: total } = usePrice(
    data && {
      amount: Number(data.cart?.cost.totalAmount.amount),
      currencyCode: data.cart?.cost.totalAmount.currencyCode,
    }
  )

  const { price: taxTotal } = usePrice(
    data && {
      amount: Number(data.cart?.cost?.totalTaxAmount?.amount || 0),
      currencyCode: data.cart?.cost?.totalTaxAmount?.currencyCode,
    }
  )

  const { price: dutyTotal } = usePrice(
    data && {
      amount: Number(data.cart?.cost?.totalDutyAmount?.amount || 0),
      currencyCode: data.cart?.cost?.totalDutyAmount?.currencyCode,
    }
  )

  const handleClose = () => closeSidebar()
  const goToCheckout = () => setSidebarView('CHECKOUT_VIEW')

  const error = null
  const success = null

  return (
    <SidebarLayout
      className={cn({
        [s.empty]: error || success || isLoading || isEmpty,
      })}
      handleClose={handleClose}
    >
      {isLoading || isEmpty ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-dashed border-primary rounded-full flex items-center justify-center w-16 h-16 p-12 bg-secondary text-secondary">
            <Bag className="absolute" />
          </span>
          <h2 className="pt-6 text-2xl font-bold tracking-wide text-center">
            Your cart is empty
          </h2>
          <p className="text-accent-3 px-10 text-center pt-2">
            Biscuit oat cake wafer icing ice cream tiramisu pudding cupcake.
          </p>
        </div>
      ) : error ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Cross width={24} height={24} />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            We couldn’t process the purchase. Please check your card information
            and try again.
          </h2>
        </div>
      ) : success ? (
        <div className="flex-1 px-4 flex flex-col justify-center items-center">
          <span className="border border-white rounded-full flex items-center justify-center w-16 h-16">
            <Check />
          </span>
          <h2 className="pt-6 text-xl font-light text-center">
            Thank you for your order.
          </h2>
        </div>
      ) : (
        <>
          <div className="px-4 sm:px-6 flex-1">
            <Link href="/cart">
              <Text variant="sectionHeading" onClick={handleClose}>
                My Cart
              </Text>
            </Link>
            {data && (
              <ul className={s.lineItemsList}>
                {items?.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    currencyCode={data.cart?.cost.subtotalAmount.currencyCode}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="flex-shrink-0 px-6 py-6 sm:px-6 sticky z-20 bottom-0 w-full right-0 left-0 bg-accent-0 border-t text-sm">
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
                <span className="font-bold tracking-wide">{dutyTotal}</span>
              </li>
            </ul>
            <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
              <span>Total</span>
              <span>{total}</span>
            </div>
            <div>
              {process.env.COMMERCE_CUSTOMCHECKOUT_ENABLED ? (
                <Button Component="a" width="100%" onClick={goToCheckout}>
                  Proceed to Checkout ({total})
                </Button>
              ) : (
                <Button href="/checkout" Component="a" width="100%">
                  Proceed to Checkout
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </SidebarLayout>
  )
}

export default CartSidebarView
