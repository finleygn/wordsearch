import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import IndexRoute from './routes/index';
import AboutRoute from './routes/about';
import Layout from './components/Layout';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexRoute />} />
            <Route path="about" element={<AboutRoute />} />
            <Route path="*" element={<h1>404</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
