import Head from './Head'
import Navigation from './Navigation'
import Footer from './Footer'

const Layout = ({ children, locale, locales }) => (
  <div className="bg-gray-300">
    <Head />
    <Navigation locale={locale} locales={locales} />
    {children}
    <Footer />
  </div>
)

export default Layout
