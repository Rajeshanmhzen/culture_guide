import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Provider} from "react-redux"
import router from './route/index.jsx'
import { RouterProvider } from "react-router-dom"
import { createTheme,  MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { Notifications } from '@mantine/notifications'
import store, { persistor } from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react'

const theme = createTheme({
  colors:{
    'purple-heart': [
    '#f6f4fe','#eeebfc','#dfdafa','#c6bdf5','#ab97ee', '#8e6ce6','#7d4dda','#6a38c2','#5b31a6','#4c2a88','#2f195c',
    ],
    'mine-shaft': [
     '#f6f6f6','#e7e7e7','#d1d1d1','#b0b0b0','#888888','#6d6d6d','#5d5d5d','#4f4f4f','#454545','#3d3d3d','#2d2d2d', 
    ],

  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
<PersistGate loading={<div>Loading...</div>} persistor={persistor}>
    <MantineProvider theme={theme}>
      <Notifications position='top-right'/>
     <RouterProvider router={router}/>
      </MantineProvider>
      </PersistGate>
      </Provider>
  </StrictMode>,
)
