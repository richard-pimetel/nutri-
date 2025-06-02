import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DietFormPage from '@/pages/DietFormPage';
import DietPlanPage from '@/pages/DietPlanPage';
import DashboardPage from '@/pages/DashboardPage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedRoute = ({ element, routeKey }) => (
  <motion.div
    key={routeKey}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {element}
  </motion.div>
);

// Componente para redirecionar usuários autenticados de /login e /register
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div></div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};


function AppContent() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-slate-50 to-background dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<AnimatedRoute element={<HomePage />} routeKey="home" />} />
            <Route path="/login" element={<PublicRoute><AnimatedRoute element={<LoginPage />} routeKey="login" /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><AnimatedRoute element={<RegisterPage />} routeKey="register" /></PublicRoute>} />
            
            <Route path="/create-diet" element={<ProtectedRoute><AnimatedRoute element={<DietFormPage />} routeKey="create-diet" /></ProtectedRoute>} />
            <Route path="/diet-plan" element={<ProtectedRoute><AnimatedRoute element={<DietPlanPage />} routeKey="diet-plan" /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><AnimatedRoute element={<DashboardPage />} routeKey="dashboard" /></ProtectedRoute>} />
            
            {/* Adicionar uma rota para Sobre e Planos se necessário, ou remover do Header */}
            <Route path="/sobre" element={<AnimatedRoute element={<div><h1>Sobre Nós</h1><p>Página em construção.</p></div>} routeKey="sobre" />} />
            <Route path="/planos" element={<AnimatedRoute element={<div><h1>Planos</h1><p>Página em construção.</p></div>} routeKey="planos" />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;