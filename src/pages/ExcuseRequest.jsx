import { useState, useEffect } from 'react';
import { 
  Typography, Paper, Grid, TextField, MenuItem, Button, 
  Box, Alert, CircularProgress, Card, CardContent, Divider 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Layout from '../components/Layout';
import api from '../services/api';
import { toast } from 'react-toastify';

const ExcuseRequest = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Öğrencinin derslerini getir
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get('/enrollments/my-courses');
        setEnrollments(res.data.data);
      } catch (error) {
        console.error("Dersler yüklenemedi", error);
      }
    };
    fetchEnrollments();
  }, []);

  // 2. Seçilen dersin GEÇMİŞ oturumlarını getir
  useEffect(() => {
    const fetchSessions = async () => {
      if (!selectedEnrollment) return;
      
      try {
        // Enrollment objesinden sectionId'yi al
        const enrollment = enrollments.find(e => e.id === selectedEnrollment);
        if (!enrollment) return;

        const res = await api.get(`/attendance/report/${enrollment.sectionId}`); // Bu endpoint sessionları döner
        // Sadece geçmiş veya kapanmış oturumları filtrele
        const pastSessions = res.data.data.filter(s => s.status === 'closed' || new Date(s.date) < new Date());
        setSessions(pastSessions);
      } catch (error) {
        console.error("Oturumlar yüklenemedi", error);
      }
    };
    fetchSessions();
  }, [selectedEnrollment, enrollments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSession || !reason || !file) {
      toast.warning("Lütfen tüm alanları doldurun ve belge yükleyin.");
      return;
    }

    const formData = new FormData();
    formData.append('sessionId', selectedSession);
    formData.append('reason', reason);
    formData.append('document', file);

    setLoading(true);
    try {
      await api.post('/attendance/excuse-requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Mazeret talebiniz gönderildi.");
      // Formu sıfırla
      setReason('');
      setFile(null);
      setSelectedSession('');
    } catch (error) {
      toast.error(error.response?.data?.error || "Talep gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
        Mazeret Bildir
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              <Alert severity="info">
                Mazeret bildirmek için dersi ve kaçırdığınız oturumu seçiniz. Raporunuzu (resim formatında) yükleyiniz.
              </Alert>

              <TextField
                select
                label="Ders Seçin"
                value={selectedEnrollment}
                onChange={(e) => setSelectedEnrollment(e.target.value)}
                fullWidth
              >
                {enrollments.map((enr) => (
                  <MenuItem key={enr.id} value={enr.id}>
                    {enr.section?.course?.code} - {enr.section?.course?.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Kaçırılan Oturum (Tarih)"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                fullWidth
                disabled={!selectedEnrollment}
              >
                {sessions.map((ses) => (
                  <MenuItem key={ses.id} value={ses.id}>
                    {new Date(ses.date).toLocaleDateString('tr-TR')} ({ses.start_time}-{ses.end_time})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Mazeret Açıklaması"
                multiline
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
                required
              />

              <Box sx={{ border: '1px dashed #ccc', p: 2, textAlign: 'center', borderRadius: 1 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="raised-button-file">
                  <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                    Belge Yükle
                  </Button>
                </label>
                {file && <Typography variant="body2" sx={{ mt: 1 }}>{file.name}</Typography>}
              </Box>

              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={loading}
                disableElevation
              >
                {loading ? <CircularProgress size={24} /> : 'Talebi Gönder'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ExcuseRequest;