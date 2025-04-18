import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Hero from './pages/hero.jsx'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Search from './pages/search.jsx'
import ProductPage from './pages/productpage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>
      <Header />
        <main>
          <ProductPage />
          {/* <Search /> */}
          {/* <Hero /> */}
        </main>
      <Footer />
    </div>
  </StrictMode>,
)
