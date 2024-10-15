import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import "./styles/index.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//  import 'antd/dist/antd.css';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
  <Provider store={store}> 
  <App />
</Provider>
</QueryClientProvider>
// </React.StrictMode>
);


