import NiceModal from '@ebay/nice-modal-react'
import queryClient from 'config/queyClient.config'
import AuthContextProvider from 'context/AuthContext'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom'
import Routes from 'routes'
import './index.css'
import reportWebVitals from './reportWebVitals'

import { Auth0Provider } from '@auth0/auth0-react'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <NiceModal.Provider>
          <Auth0Provider
            domain={process.env.REACT_APP_domain || ''}
            clientId={process.env.REACT_APP_clientId || ''}
            authorizationParams={{
              redirect_uri: 'https://eco-mern-frontend.vercel.app',
              audience: process.env.REACT_APP_audience,
            }}
          >
            <BrowserRouter>
              <Routes />
              <Toaster position='top-center' />
              <ReactQueryDevtools initialIsOpen={false} />
            </BrowserRouter>
          </Auth0Provider>
        </NiceModal.Provider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
