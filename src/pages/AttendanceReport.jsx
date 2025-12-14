import { useState, useEffect } from 'react';
import { 
  Typography, Paper, Box, TextField, MenuItem, 
  CircularProgress, Alert, Accordion, AccordionSummary, AccordionDetails,
  Table, TableBody, TableCell, TableHead, TableRow, Chip, 
  Tooltip, IconButton // <--- YENİ
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // <--- YENİ
import DeleteIcon from '@mui/icons-material/Delete'; // <--- YENİ
import InfoIcon from '@mui/icons-material/Info'; // <--- YENİ
import Layout from '../components/Layout';
import api from '../services/api';
import { toast } from 'react-toastify'; // <--- Toast Eklendi
import { useAuth } from '../context/AuthContext';

const AttendanceReport = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ... (sections ve fetchReport useEffect'leri AYNI KALSIN) ...
  // 1. Şubeleri Getir
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get('/sections');
        const mySections = res.data.data.filter(
          sec => sec.instructorId === user?.facultyProfile?.id
        );
        setSections(mySections);
      } catch (error) {
        console.error("Şubeler alınamadı", error);
      }
    };
    if (user?.role === 'faculty') fetchSections();
  }, [user]);

  // 2. Raporu Getir fonksiyonunu dışarı alalım ki tekrar çağırabilelim
  const fetchReport = async () => {
    if (!selectedSection) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/attendance/report/${selectedSection}`);
      const sortedSessions = res.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setSessions(sortedSessions);
    } catch (error) {
      console.error("Rapor alınamadı", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedSection]);


  // YENİ: Onaylama Fonksiyonu
  const handleApprove = async (recordId) => {
    try {
      await api.put(`/attendance/records/${recordId}`, { action: 'approve' });
      toast.success("Yoklama onaylandı.");
      fetchReport(); // Listeyi yenile
    } catch (error) {
      toast.error("İşlem başarısız.");
    }
  };

  // YENİ: Reddetme (Silme) Fonksiyonu
  const handleReject = async (recordId) => {
    if (!window.confirm("Bu yoklama kaydını silmek (reddetmek) istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/attendance/records/${recordId}`);
      toast.success("Yoklama reddedildi (silindi).");
      fetchReport(); // Listeyi yenile
    } catch (error) {
      toast.error("İşlem başarısız.");
    }
  };

  return (
    <Layout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2c3e50' }}>
        Yoklama Raporları
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 0, borderTop: '4px solid #1976d2' }}>
        <TextField
          select
          label="Ders Şubesi Seçin"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          fullWidth
          helperText="Raporunu görüntülemek istediğiniz dersi seçin."
        >
          {sections.map((sec) => (
            <MenuItem key={sec.id} value={sec.id}>
              {sec.course?.code} - {sec.course?.name} (Section {sec.section_number})
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
      ) : selectedSection && sessions.length === 0 ? (
        <Alert severity="info">Bu ders için henüz hiç yoklama alınmamış.</Alert>
      ) : (
        sessions.map((session) => (
          <Accordion key={session.id} disableGutters sx={{ mb: 1, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {new Date(session.date).toLocaleDateString('tr-TR')}
                </Typography>
                <Box>
                  <Typography variant="caption" sx={{ mr: 2 }}>
                    Saat: {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                  </Typography>
                  <Chip 
                    label={`${session.records.length} Öğrenci`} 
                    color="primary" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Öğrenci No</TableCell>
                    <TableCell>Ad Soyad</TableCell>
                    <TableCell>Giriş Saati</TableCell>
                    <TableCell>Mesafe</TableCell>
                    <TableCell>Durum & İşlem</TableCell> {/* Başlık Değişti */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {session.records.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center">Katılım yok.</TableCell></TableRow>
                  ) : (
                    session.records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.student?.student_number}</TableCell>
                        <TableCell>{record.student?.user?.name}</TableCell>
                        <TableCell>
                          {new Date(record.check_in_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>{Math.round(record.distance_from_center)}m</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {record.is_flagged ? (
                              <>
                                {/* Tooltip ile Sebebi Göster */}
                                <Tooltip title={record.flag_reason || "Şüpheli İşlem"} arrow placement="top">
                                  <Chip 
                                    icon={<InfoIcon />} 
                                    label="Şüpheli" 
                                    color="warning" 
                                    size="small" 
                                    sx={{ cursor: 'help' }}
                                  />
                                </Tooltip>
                                
                                {/* Onayla Butonu */}
                                <Tooltip title="Onayla (Kabul Et)">
                                  <IconButton size="small" color="success" onClick={() => handleApprove(record.id)}>
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                {/* Reddet Butonu */}
                                <Tooltip title="Reddet (Kaydı Sil)">
                                  <IconButton size="small" color="error" onClick={() => handleReject(record.id)}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Chip label="Var" color="success" size="small" />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Layout>
  );
};

export default AttendanceReport;