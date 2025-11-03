import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import Home from './pages/Home.tsx'
import MovieDetails from './pages/MovieDetails.tsx'
import Favorites from './pages/Favorites.tsx'
import Search from './pages/Search.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import AppLayout from './components/AppLayout'
import { SearchProvider } from './contexts/SearchContext'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movie/:id', element: <MovieDetails /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'search', element: <Search /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  </StrictMode>,
)
