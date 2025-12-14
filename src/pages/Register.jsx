import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Container, Box, Typography, Button, Avatar, Grid, Link as MuiLink, 
  MenuItem, FormControl, InputLabel, Select, FormHelperText, FormControlLabel, Checkbox, Alert
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';

const DEPARTMENTS = [
  { id: 1, name: 'Bilgisayar Mühendisliği' },
  { id: 2, name: 'Elektrik-Elektronik Müh.' },
  { id: 3, name: 'Mimarlık' },
  { id: 4, name: 'İşletme' }
];

const validationSchema = Yup.object({
  name: Yup.string().required('Ad Soyad zorunludur'),
  email: Yup.string().email('Geçerli bir e-posta giriniz').required('E-posta zorunludur'),
  password: Yup.string().min(8, 'En az 8 karakter').required('Şifre zorunludur'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor').required('Şifre tekrarı zorunludur'),
  role: Yup.string().required('Rol seçimi zorunludur'),
  department_id: Yup.number().required('Bölüm seçimi zorunludur'),
  terms: Yup.boolean().oneOf([true], 'Kullanım koşullarını kabul etmelisiniz'),
  student_number: Yup.string().when('role', {
    is: 'student', then: (schema) => schema.required('Öğrenci numarası zorunludur'), otherwise: (schema) => schema.optional(),
  }),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '', role: 'student', department_id: '', student_number: '', terms: false },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError('');
      try {
        const requestData = {
          name: values.name, email: values.email, password: values.password, role: values.role,
          department_id: values.department_id, ...(values.role === 'student' && { student_number: values.student_number }),
        };
        await register(requestData);
        toast.success('Kayıt başarılı! Lütfen e-postanızı doğrulayın.');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Kayıt başarısız.');
        toast.error('Hata oluştu.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4, marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',
          p: 4,
          borderRadius: 0,           // FLAT
          boxShadow: 'none',         // FLAT
          border: '1px solid #e0e0e0', // FLAT
          bgcolor: 'background.paper'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#9c27b0', borderRadius: 1 }}>
          <PersonAddOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>Kayıt Ol</Typography>

        {error && <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: 0 }}>{error}</Alert>}

        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><FormInput formik={formik} name="name" label="Ad Soyad" autoFocus margin="none" /></Grid>
            <Grid item xs={12}><FormInput formik={formik} name="email" label="E-posta" margin="none" /></Grid>
            <Grid item xs={12} sm={6}><FormInput formik={formik} name="password" label="Şifre" type="password" margin="none" /></Grid>
            <Grid item xs={12} sm={6}><FormInput formik={formik} name="confirmPassword" label="Şifre Tekrar" type="password" margin="none" /></Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
                <InputLabel>Kullanıcı Tipi</InputLabel>
                <Select name="role" value={formik.values.role} label="Kullanıcı Tipi" onChange={formik.handleChange}>
                  <MenuItem value="student">Öğrenci</MenuItem>
                  <MenuItem value="faculty">Öğretim Üyesi</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.department_id && Boolean(formik.errors.department_id)}>
                <InputLabel>Bölüm</InputLabel>
                <Select name="department_id" value={formik.values.department_id} label="Bölüm" onChange={formik.handleChange}>
                  {DEPARTMENTS.map((dept) => <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            {formik.values.role === 'student' && (
              <Grid item xs={12}><FormInput formik={formik} name="student_number" label="Öğrenci No" margin="none" /></Grid>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox name="terms" color="primary" checked={formik.values.terms} onChange={formik.handleChange} />}
                label="Kullanım koşullarını kabul ediyorum."
              />
              {formik.touched.terms && formik.errors.terms && <Typography variant="caption" color="error">{formik.errors.terms}</Typography>}
            </Grid>
          </Grid>

          <Button
            type="submit" fullWidth variant="contained" disableElevation
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 0, fontWeight: 'bold', textTransform: 'none' }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'İşleniyor...' : 'Kayıt Ol'}
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item><MuiLink component={Link} to="/login" variant="body2" sx={{ textDecoration: 'none' }}>Zaten hesabın var mı? Giriş Yap</MuiLink></Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;