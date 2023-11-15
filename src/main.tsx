import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { GetFetchDataContextFragment } from './provider/GetFetchDataContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GetFetchDataContextFragment>
      <App />
    </GetFetchDataContextFragment>
);