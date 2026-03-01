import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ProductList from './components/ProductList';
import MovementRegistry from './components/MovementRegistry';
import SupplyChain from './components/SupplyChain';
import AlertCenter from './components/AlertCenter';
import AnalyticsHub from './components/AnalyticsHub';
import TeamAccess from './components/TeamAccess';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <Layout>
                <ProductList />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/movements" 
          element={
            <ProtectedRoute>
              <Layout>
                <MovementRegistry />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/supply-chain" 
          element={
            <ProtectedRoute>
              <Layout>
                <SupplyChain />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/alerts" 
          element={
            <ProtectedRoute>
              <Layout>
                <AlertCenter />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <Layout>
                <AnalyticsHub />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/team" 
          element={
            <ProtectedRoute>
              <Layout>
                <TeamAccess />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
