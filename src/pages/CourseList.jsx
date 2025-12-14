import { useState, useEffect } from 'react';
import { 
  Typography, Grid, Card, CardContent, CardActions, Button, 
  Box, TextField, InputAdornment, Chip, CircularProgress 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../components/Layout';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (search = '') => {
    try {
      // Backend'deki arama parametresini kullanıyoruz
      const res = await api.get(`/courses?search=${search}`);
      setCourses(res.data.data);
    } catch (error) {
      console.error("Dersler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce (Arama yaparken her harfte istek atmamak için)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!loading) fetchCourses(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <Layout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Ders Kataloğu
        </Typography>
        
        <TextField
          variant="outlined"
          placeholder="Ders ara (Kod veya İsim)..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 300 }, bgcolor: 'white' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={3}>
          {courses.length === 0 ? (
            <Grid item xs={12}><Typography>Aradığınız kriterlere uygun ders bulunamadı.</Typography></Grid>
          ) : (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card 
                  sx={{ 
                    height: '100%', display: 'flex', flexDirection: 'column',
                    transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                    borderRadius: 0, border: '1px solid #e0e0e0', boxShadow: 'none' // Flat tasarım
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        {course.code}
                      </Typography>
                      <Chip label={`${course.credits} Kredi`} size="small" variant="outlined" />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
                      {course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {course.description}
                    </Typography>
                    {course.department && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {course.department.name}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      disableElevation 
                      fullWidth
                      onClick={() => navigate(`/courses/${course.id}`)}
                      sx={{ borderRadius: 0, textTransform: 'none' }}
                    >
                      Detaylar ve Kayıt
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default CourseList;