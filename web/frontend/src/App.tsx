import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexRoute from './routes/index';
import AboutRoute from './routes/about';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
    <h1>test</h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexRoute />} />
          <Route path="about" element={<AboutRoute />} />
          <Route path="*" element={<h1>404</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
