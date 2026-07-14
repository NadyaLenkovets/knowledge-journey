import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PageLayout } from '@/components/layout/page-layout'
import { CreatePage } from '@/pages/create-page'
import { GeneratingPage } from '@/pages/generating-page'
import { HomePage } from '@/pages/home-page'
import { JourneyRunPage } from '@/pages/journey-run-page'
import { ReportPage } from '@/pages/report-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'create', element: <CreatePage /> },
      { path: 'generating', element: <GeneratingPage /> },
      { path: 'journey/:id', element: <JourneyRunPage /> },
      { path: 'journey/:id/report', element: <ReportPage /> },
      { path: 'main', element: <Navigate to="/home" replace /> },
    ],
  },
])
