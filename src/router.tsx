import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PageLayout } from '@/components/layout/page-layout'
import { ArticlePage } from '@/pages/article-page'
import { MainPage } from '@/pages/main-page'
import { TestRunPage } from '@/pages/test-run-page'
import { TestsPage } from '@/pages/tests-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { index: true, element: <Navigate to="/main" replace /> },
      { path: 'main', element: <MainPage /> },
      { path: 'article/:slug', element: <ArticlePage /> },
      { path: 'tests', element: <TestsPage /> },
      { path: 'tests/:slug', element: <TestRunPage /> },
    ],
  },
])
