import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
const Splash = React.lazy(() => import('./pages/Splash'));
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const SelectRole = React.lazy(() => import('./pages/SelectRole'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Patients = React.lazy(() => import('./pages/Patients'));
const AddPatient = React.lazy(() => import('./pages/AddPatient'));
const MedicalHistory = React.lazy(() => import('./pages/MedicalHistory'));
const Appointments = React.lazy(() => import('./pages/Appointments'));
const UploadImages = React.lazy(() => import('./pages/UploadImages'));
const XrayAnalysis = React.lazy(() => import('./pages/XrayAnalysis'));
const Prescription = React.lazy(() => import('./pages/Prescription'));
const DrugRecommendations = React.lazy(() => import('./pages/DrugRecommendations'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const TreatmentSelection = React.lazy(() => import('./pages/TreatmentSelection'));
const TreatmentPlan = React.lazy(() => import('./pages/TreatmentPlan'));
const More = React.lazy(() => import('./pages/More'));
const DoctorProfile = React.lazy(() => import('./pages/DoctorProfile'));
const RolePermissions = React.lazy(() => import('./pages/RolePermissions'));
const Settings = React.lazy(() => import('./pages/Settings'));
const AboutLegal = React.lazy(() => import('./pages/AboutLegal'));
const AuditLogs = React.lazy(() => import('./pages/AuditLogs'));
const ManageDoctors = React.lazy(() => import('./pages/ManageDoctors'));
const Integration = React.lazy(() => import('./pages/Integration'));
const Documentation = React.lazy(() => import('./pages/Documentation'));
const Explore = React.lazy(() => import('./pages/Explore'));
const Protocols = React.lazy(() => import('./pages/Protocols'));
const PatientDetail = React.lazy(() => import('./pages/PatientDetail'));

const ProtectedRoute = ({ children, allowedRoles, requiredPermission }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  const permsStr = localStorage.getItem('user_permissions');
  const perms = permsStr ? JSON.parse(permsStr) : {};
  const location = useLocation();
  
  if (!token) {
    if (!role) return <Navigate to="/select-role" state={{ from: location }} replace />;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Permission-based check (priority)
  if (requiredPermission && perms[requiredPermission] === false) {
    return <Navigate to="/dashboard" replace />;
  }

  // Legacy Role-based access check
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const DashboardGate = () => {
  const role = localStorage.getItem('user_role');
  return role === 'Admin' ? <AdminDashboard /> : <Dashboard />;
};

const App = () => {
  return (
    <Router>
      <Suspense fallback={
        <div className="h-screen w-screen bg-[#F4F8FB] flex flex-col items-center justify-center gap-4 text-black">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em]">Initializing Dental Engine...</p>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/protocols" element={<Protocols />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardGate />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={<ProtectedRoute requiredPermission="can_view_patients"><Patients /></ProtectedRoute>} />
          <Route path="/patient/:patientId" element={<ProtectedRoute requiredPermission="can_view_patients"><PatientDetail /></ProtectedRoute>} />
          <Route path="/add-patient" element={<ProtectedRoute requiredPermission="can_add_patient"><AddPatient /></ProtectedRoute>} />
          <Route path="/medical-history" element={<ProtectedRoute requiredPermission="can_edit_patient"><MedicalHistory /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          
          {/* Clinical Assistant/Practitioner Routes */}
          <Route path="/xray" element={<ProtectedRoute requiredPermission="can_use_ai"><UploadImages /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute requiredPermission="can_use_ai"><XrayAnalysis /></ProtectedRoute>} />
          <Route path="/treatment-selection" element={<ProtectedRoute requiredPermission="can_use_ai"><TreatmentSelection /></ProtectedRoute>} />
          <Route path="/treatment-plan" element={<ProtectedRoute requiredPermission="can_use_ai"><TreatmentPlan /></ProtectedRoute>} />
          <Route path="/prescription" element={<ProtectedRoute requiredPermission="can_prescribe_drugs"><Prescription /></ProtectedRoute>} />
          <Route path="/drug-recommendations" element={<ProtectedRoute requiredPermission="can_prescribe_drugs"><DrugRecommendations /></ProtectedRoute>} />
          
          <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
          <Route path="/doctor-profile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutLegal /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/role-permissions" element={<ProtectedRoute requiredPermission="can_manage_settings"><RolePermissions /></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute requiredPermission="can_view_audit_logs"><AuditLogs /></ProtectedRoute>} />
          <Route path="/manage-doctors" element={<ProtectedRoute requiredPermission="can_add_doctor"><ManageDoctors /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
