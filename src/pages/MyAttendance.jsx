import { useState, useEffect } from 'react';
import { 
  Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, Box, CircularProgress, Alert 
} from '@mui/material';
import Layout from '../components/Layout';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance/my-attendance');
        setRecords(res.data.data);
      } catch (error) {
        console.error("Yoklama verisi çekilemedi", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'student') {
      fetchAttendance();
    }
  }, [user]);

  if (loading) return <Layout><Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box></Layout>;
  if (user?.role !== 'student') return <Layout><Alert severity="error">Yetkisiz erişim.</Alert></Layout>;

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
        Yoklama Geçmişim
      </Typography>

      {records.length === 0 ? (
        <Alert severity="info">Henüz katıldığınız bir yoklama bulunmuyor.</Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 0, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ders Kodu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ders Adı</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Giriş Saati</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => {
                  const session = record.session;
                  const section = session?.section;
                  const course = section?.course;

                  return (
                    <TableRow key={record.id} hover>
                      <TableCell>{course?.code}</TableCell>
                      <TableCell>{course?.name}</TableCell>
                      <TableCell>{new Date(session.date).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell>{new Date(record.check_in_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                      <TableCell>
                        <Chip 
                          label={record.is_flagged ? "Şüpheli" : "Var"} 
                          color={record.is_flagged ? "warning" : "success"} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Layout>
  );
};

export default MyAttendance;