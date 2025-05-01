import { createBrowserRouter } from 'react-router-dom'
import { DefaultLayout } from '../common/DefaultLayout'
import { RegisterPage } from '../pages/RegisterPage'
import { LoginPages } from '../pages/LoginPages'
import { CreatePost } from '../pages/CreatePost'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        index: true,
        element: <div>메인 페이지</div>,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPages />,
      },
      {
        path: '/create',
        element: <CreatePost />,
      },
    ],
  },
])
