import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ChatWidget } from './components/ChatWidget'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { SiteNav } from './components/SiteNav'
import { Status } from './components/Status'
import { useSite } from './hooks/useSite'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { LocationPage } from './pages/LocationPage'
import { MenuPage } from './pages/MenuPage'

export default function App() {
  const state = useSite()

  if (state.status === 'loading') return <Status />
  if (state.status === 'error') return <Status message={state.message} error />

  const { site } = state

  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteNav site={site} />
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/nosotros" element={<AboutPage site={site} />} />
        <Route path="/ubicacion" element={<LocationPage site={site} />} />
        <Route path="/contacto" element={<ContactPage site={site} />} />
        <Route path="*" element={<MenuPage />} />
      </Routes>
      <Footer site={site} />
      <ChatWidget />
    </BrowserRouter>
  )
}
