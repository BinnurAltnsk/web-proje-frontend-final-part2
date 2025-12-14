import { useState } from 'react';
import { 
  AppBar, Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem, 
  Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Container 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import GradeIcon from '@mui/icons-material/Grade';
import SickIcon from '@mui/icons-material/Sick'; // İkon ekle
import SettingsIcon from '@mui/icons-material/Settings';
import ClassIcon from '@mui/icons-material/Class';
import CampaignIcon from '@mui/icons-material/Campaign';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Profilim', icon: <PersonIcon />, path: '/profile' },
    { text: 'Ders Kataloğu', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Duyurular', icon: <CampaignIcon />, path: '/announcements' },
  ];

  // Öğrenciyse Derslerim ve Yoklama Ver
  if (user && user.role === 'student') {
    menuItems.splice(2, 0, { text: 'Derslerim', icon: <LibraryBooksIcon />, path: '/my-courses' });
    // Yeni eklenen:
    menuItems.splice(3, 0, { text: 'Yoklama Ver', icon: <QrCodeScannerIcon />, path: '/attendance/student' });
    menuItems.splice(4, 0, { text: 'Yoklama Geçmişi', icon: <HistoryIcon />, path: '/attendance/my-history' });
    menuItems.splice(5, 0, { text: 'Notlarım', icon: <GradeIcon />, path: '/grades/my-grades' });
    menuItems.splice(5, 0, { text: 'Mazeret Bildir', icon: <SickIcon />, path: '/attendance/excuse-request' });
  }

  // Öğretim Üyesiyse Yoklama Başlat
  if (user && user.role === 'faculty') {
    menuItems.splice(2, 0, { text: 'Yoklama Başlat', icon: <QrCodeIcon />, path: '/attendance/faculty' });
    menuItems.splice(3, 0, { text: 'Raporlar', icon: <AssessmentIcon />, path: '/attendance/reports' });
    menuItems.splice(4, 0, { text: 'Not Girişi', icon: <GradeIcon />, path: '/grades/gradebook' });
  menuItems.splice(4, 0, { text: 'Mazeret Onayı', icon: <SickIcon />, path: '/attendance/excuse-approval' });
  }

  // Admin ise
if (user && user.role === 'admin') {
    menuItems.push({ text: 'Ders Yönetimi', icon: <SettingsIcon />, path: '/admin/courses' });
    menuItems.push({ text: 'Şube & Program', icon: <ClassIcon />, path: '/admin/sections' });
}
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Üst Menü (AppBar) */}
     <AppBar 
  position="static" 
  elevation={0} // Gölgeyi kaldırıp daha flat bir görünüm verelim
  sx={{ 
    background: 'linear-gradient(to right, #1565c0, #42a5f5)', // Modern gradient
    borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
  }}
>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Akıllı Kampüs
          </Typography>
          
          {user && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {/* Profil resmi varsa göster yoksa ikon */}
                {user.profile_picture_url ? (
                  <Avatar src={user.profile_picture_url} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Profil</MenuItem>
                <MenuItem onClick={handleLogout}>Çıkış Yap</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Yan Menü (Drawer) */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Çıkış Yap" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Sayfa İçeriği */}
      <Container sx={{ mt: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;