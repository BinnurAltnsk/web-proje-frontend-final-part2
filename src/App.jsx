import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Sayfalar
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EmailVerification from './pages/EmailVerification';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses'; // <--- YENİ IMPORT
import FacultyAttendance from './pages/FacultyAttendance';
import StudentAttendance from './pages/StudentAttendance';
import MyAttendance from './pages/MyAttendance'; // <--- Ekle
import AttendanceReport from './pages/AttendanceReport'; // <--- Ekle
import Gradebook from './pages/Gradebook';
import MyGrades from './pages/MyGrades';
import ExcuseRequest from './pages/ExcuseRequest';
import ExcuseApproval from './pages/ExcuseApproval';
import AdminCourses from './pages/AdminCourses';
import AdminSections from './pages/AdminSections';
import Announcements from './pages/Announcements';

// Basit Tema
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
       <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Akademik Rotalar */}
          <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} /> {/* <--- YENİ ROTA */}
          <Route path="/attendance/faculty" element={<ProtectedRoute><FacultyAttendance /></ProtectedRoute>} />
          <Route path="/attendance/student" element={<ProtectedRoute><StudentAttendance /></ProtectedRoute>} />
          <Route path="/attendance/my-history" element={<ProtectedRoute><MyAttendance /></ProtectedRoute>} />
          <Route path="/attendance/reports" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
          <Route path="/grades/gradebook" element={<ProtectedRoute><Gradebook /></ProtectedRoute>} />
          <Route path="/grades/my-grades" element={<ProtectedRoute><MyGrades /></ProtectedRoute>} />

          <Route path="/attendance/excuse-request" element={<ProtectedRoute><ExcuseRequest /></ProtectedRoute>} />
          <Route path="/attendance/excuse-approval" element={<ProtectedRoute><ExcuseApproval /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><AdminCourses /></ProtectedRoute>} />
          <Route path="/admin/sections" element={<ProtectedRoute><AdminSections /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><AdminCourses /></ProtectedRoute>} />
          
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;