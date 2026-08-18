import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { LibraryProvider } from './context/LibraryContext'
import { WalletProvider } from './context/WalletContext'
import { EngagementProvider } from './context/EngagementContext'
import ProtectedRoute from './components/ProtectedRoute'

import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ReaderLayout from './layouts/ReaderLayout'

import HomePage from './features/home/HomePage'
import CategoriesPage from './features/categories/CategoriesPage'
import SearchPage from './features/search/SearchPage'
import WebtoonDetailPage from './features/webtoon/WebtoonDetailPage'
import ReaderPage from './features/reader/ReaderPage'

import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'
import ResetPasswordPage from './features/auth/ResetPasswordPage'

import ProfilePage from './features/profile/ProfilePage'
import LibraryPage from './features/library/LibraryPage'
import NotificationsPage from './features/notifications/NotificationsPage'
import CoinsPage from './features/coins/CoinsPage'

import {
  PrivacyPage,
  TermsPage,
  CookiesPage,
  AboutPage,
  CreatorsPage,
  PressPage,
  HelpPage,
  ContactPage,
  FAQPage,
  NotFoundPage,
} from './features/info'

function App() {
  return (
    <DataProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AuthProvider>
          <LibraryProvider>
            <WalletProvider>
              <EngagementProvider>
                <Routes>
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/categories/:slug" element={<CategoriesPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/webtoon/:id" element={<WebtoonDetailPage />} />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/library"
                      element={
                        <ProtectedRoute>
                          <LibraryPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/coins"
                      element={
                        <ProtectedRoute>
                          <CoinsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/creators" element={<CreatorsPage />} />
                    <Route path="/press" element={<PressPage />} />

                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FAQPage />} />

                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/cookies" element={<CookiesPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  <Route element={<ReaderLayout />}>
                    <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
                  </Route>

                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token?" element={<ResetPasswordPage />} />
                  </Route>
                </Routes>
              </EngagementProvider>
            </WalletProvider>
          </LibraryProvider>
        </AuthProvider>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
