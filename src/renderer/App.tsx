import React, { useEffect} from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import MainScreen from '@/renderer/screens/MainScreen';
import Login from '@/renderer/screens/auth/Login';
import Signup from './screens/auth/SignUp';
import { store } from './store/index';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuthStatus, setAuthStatus } from './store/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticatedLayout from './components/AuthenticatedLayout';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(checkAuthStatus());
      const token = localStorage.getItem('authToken');
      if (token) {
        dispatch(setAuthStatus({ isAuthenticated: true, user: { email: 'user@gmail.com' } }));
      } else {
        dispatch(setAuthStatus({ isAuthenticated: false, user: null }));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <Routes>     
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />      
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          } 
        >
        <Route index element={<MainScreen />} />
        </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <Provider store={store}>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </Provider>
);

export default App;

