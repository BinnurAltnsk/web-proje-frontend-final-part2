import { useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, CircularProgress, 
  Card, CardContent, Avatar, List, ListItem, ListItemText, 
  Divider, Chip 
} from '@mui/material';
// İkonlar
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data.data);
      } catch (error) {
        console.error("Dashboard verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Layout><Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box></Layout>;

  // Widget Bileşeni (Kart)
  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2, boxShadow: 2 }}>
      <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
      </Box>
    </Card>
  );

  return (
    <Layout>
      {/* Karşılama Alanı */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Hoş Geldin, {user?.name?.split(' ')[0]}! 👋
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          İşte bugünkü durum özetin.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        
        {/* --- ÖĞRENCİ WIDGETLARI --- */}
        {user?.role === 'student' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Genel Ortalama (GPA)" 
                value={stats?.gpa || "0.00"} 
                icon={<GradeIcon />} 
                color="#fbc02d" // Sarı
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Aktif Ders Sayısı" 
                value={stats?.activeCourses || 0} 
                icon={<ClassIcon />} 
                color="#1976d2" // Mavi
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Katıldığın Yoklamalar" 
                value={stats?.totalAttendance || 0} 
                icon={<EventAvailableIcon />} 
                color="#2e7d32" // Yeşil
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Öğrenci No" 
                value={stats?.studentNumber || "-"} 
                icon={<SchoolIcon />} 
                color="#9c27b0" // Mor
              />
            </Grid>
          </>
        )}

        {/* --- HOCA WIDGETLARI --- */}
        {user?.role === 'faculty' && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard 
                title="Verilen Dersler" 
                value={stats?.activeSections || 0} 
                icon={<ClassIcon />} 
                color="#1976d2" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard 
                title="Akademik Unvan" 
                value={user?.facultyProfile?.title || "Öğr. Üyesi"} 
                icon={<PersonIcon />} 
                color="#0288d1" 
              />
            </Grid>
          </>
        )}

        {/* --- ADMIN WIDGETLARI --- */}
        {user?.role === 'admin' && (
          <>
            <Grid item xs={12} sm={4}>
              <StatCard title="Toplam Kullanıcı" value={stats?.totalUsers} icon={<PersonIcon />} color="#d32f2f" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Toplam Ders" value={stats?.totalCourses} icon={<ClassIcon />} color="#ed6c02" />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard title="Toplam Öğrenci" value={stats?.totalStudents} icon={<SchoolIcon />} color="#2e7d32" />
            </Grid>
          </>
        )}

        {/* --- SON DUYURULAR (HERKES İÇİN) --- */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, overflow: 'hidden', boxShadow: 2, borderRadius: 2 }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <CampaignIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Son Duyurular</Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {stats?.announcements?.length > 0 ? (
                stats.announcements.map((ann, index) => (
                  <div key={ann.id}>
                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                             <Typography variant="subtitle1" component="span" fontWeight="bold">
                                {ann.title}
                             </Typography>
                             {ann.priority === 'high' && <Chip label="Önemli" color="error" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {new Date(ann.created_at).toLocaleDateString('tr-TR')}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < stats.announcements.length - 1 && <Divider component="li" />}
                  </div>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">Henüz duyuru yok.</Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* --- SAĞ TARAF BOŞLUK (İleride Takvim Gelebilir) --- */}
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: 200 }}>
                <Typography variant="h6" color="primary" gutterBottom>Akademik Takvim</Typography>
                <Typography variant="body2">Yakında buraya haftalık ders programınız gelecek.</Typography>
            </Paper>
        </Grid>

      </Grid>
    </Layout>
  );
};

export default Dashboard;