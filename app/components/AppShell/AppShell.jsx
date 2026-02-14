'use client'

import Footer from '../Footer/Footer'
import Header from '../Header/Header'

const AppShell = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default AppShell
