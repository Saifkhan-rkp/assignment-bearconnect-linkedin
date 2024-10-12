import { Suspense } from 'react'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { BrowserRouter, Route, Routes, } from 'react-router-dom'
import Loader from './components/loaders/Loader';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/routes/ProtectedRoute';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Login = lazy(() => import("./components/Login"))
const Siginup = lazy(() => import("./components/Siginup"))
const Unibox = lazy(() => import("./components/Unibox"))
const LinkedinAccounts = lazy(() => import("./components/LinkedinAccounts"))

function App() {


  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route
            path='/app'
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index={true}
              element={<><div >Dashbosrd</div></>}
            />
            <Route
              path='linkedin-accounts'
              element={<LinkedinAccounts />}
            />
            <Route
              path='inbox'
              element={<Unibox />}
            />
          </Route>
        </Routes>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path='/'
              element={
                <AuthLayout>

                </AuthLayout>
              }
            >
              <Route
                index={true}
                element={<Navigate to={"login"}></Navigate>}
              />
              <Route
                path='login'
                element={<Login />}
              />
              <Route
                path='signup'
                element={<Siginup />}
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
