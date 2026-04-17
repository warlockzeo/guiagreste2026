import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BrandDetail } from './pages/BrandDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Messages } from './pages/Messages';
import { Chat } from './pages/Chat';
import { MyFollows } from './pages/MyFollows';

export function AppRoutes() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/brand/:id" element={<BrandDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/my-follows" element={<MyFollows />} />
        </Routes>
      </main>
    </>
  );
}
