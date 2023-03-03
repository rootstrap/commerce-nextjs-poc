const commerce = require('./commerce.config.json')
const { withCommerceConfig, getProviderName } = require('./commerce-config')

const provider = commerce.provider || getProviderName()
const isBC = provider === '@vercel/commerce-bigcommerce'
const isShopify = provider === '@vercel/commerce-shopify'

module.exports = withCommerceConfig({
  commerce,
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      (isBC || isShopify) && {
        source: '/checkout',
        destination: '/api/commerce/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
    ].filter(Boolean)
  },

  // Avoid Module not found: ESM packages (supports-color) need to be imported. Use 'import' to reference the package instead. https://nextjs.org/docs/messages/import-esm-externals
  experimental: {
    esmExternals: 'loose',
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
