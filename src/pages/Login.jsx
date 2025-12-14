import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Container, Box, Typography, Button, Avatar, Grid, 
  Link as MuiLink, InputAdornment, IconButton, Alert 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';

const validationSchema = Yup.object({
  email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta alanı zorunludur'),
  password: Yup.string().required('Şifre alanı zorunludur'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        await login(values.email, values.password);
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
        navigate('/dashboard');
      } catch (err) {
        const message = err.response?.data?.error || 'Giriş yapılamadı.';
        setError(message);
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          // FLAT TASARIM AYARLARI
          borderRadius: 0,           // Köşeli
          boxShadow: 'none',         // Gölge yok
          border: '1px solid #e0e0e0', // İnce gri çerçeve
          bgcolor: 'background.paper'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#1976d2', variant: 'square', borderRadius: 1 }}> {/* Hafif köşeli ikon */}
          <LockOutlinedIcon />
        </Avatar>
        
        <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mt: 1 }}>
          Giriş Yap
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: 0 }}>{error}</Alert>}

        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <FormInput formik={formik} name="email" label="E-posta Adresi" autoFocus />
          
          <FormInput 
            formik={formik} 
            name="password" 
            label="Şifre" 
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation // Buton gölgesini kaldır
            sx={{ 
              mt: 3, mb: 2, py: 1.5, 
              borderRadius: 0, // Köşeli buton
              fontWeight: 'bold',
              textTransform: 'none',
              bgcolor: '#1976d2',
              '&:hover': { bgcolor: '#1565c0' }
            }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
          
          <Grid container>
            <Grid item xs>
              <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ textDecoration: 'none' }}>
                Şifremi Unuttum?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={Link} to="/register" variant="body2" sx={{ textDecoration: 'none' }}>
                Hesabın yok mu? Kayıt Ol
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;