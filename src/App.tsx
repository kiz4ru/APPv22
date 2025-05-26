import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Circles } from 'react-loader-spinner';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { AuthProvider, useAuth } from './context/AuthContext';
import './i18n';

function AppContent() {
  const { isAuthenticated, loading, login, register } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Circles height={60} width={60} color="#3163cc" ariaLabel="loading" />
      </div>
    );
  }

  // Si está autenticado, solo puede acceder a /dashboard
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  // Si NO está autenticado, solo puede acceder a /, /login y /register
   return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <LoginForm
            onSubmit={async (data) => {
              try {
                // data debe tener email y password
                await login(data.email, data.password);
                navigate('/dashboard');
              } catch (error) {
                console.error(error);
              }
            }}
            onForgotPassword={() => {}}
            onCreateAccount={() => navigate('/register')}
          />
        }
      />
      <Route
        path="/register"
        element={
          <RegisterForm
            onSubmit={async (data) => {
              try {
                await register(data);
                navigate('/dashboard');
              } catch (error) {
                console.error(error);
              }
            }}
            onBack={() => navigate(-1)}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
  );
}

export default App;