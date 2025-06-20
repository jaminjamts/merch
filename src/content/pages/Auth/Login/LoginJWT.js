import * as Yup from 'yup';

import { Formik } from 'formik';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Checkbox,
  Typography,
  Link,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';

const LoginJWT = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isMountedRef = useRefMounted();
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        terms: true,
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().max(255).required('Хэрэглэгчийн нэрээ оруулна уу'),
        password: Yup.string().max(255).required(t('Нууц үгээ оруулна уу')),
        terms: Yup.boolean().oneOf(
          [true],
          'Та үйлчилгээний нөхцөлтэй танилцаад оруулна уу'
        )
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await login(values.email, values.password);
          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
            navigate('/account');
          }
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            error={Boolean(touched.email && errors.email)}
            fullWidth
            margin="normal"
            autoFocus
            helperText={touched.email && errors.email}
            label={'Нэвтрэх нэр'}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            margin="normal"
            helperText={touched.password && errors.password}
            label={'Нууц дугаар'}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <Box
            alignItems="center"
            display={{ xs: 'block', md: 'flex' }}
            justifyContent="space-between"
          >
            <Box display={{ xs: 'block', md: 'flex' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.terms}
                    name="terms"
                    color="primary"
                    onChange={handleChange}
                  />
                }
                label={
                  <>
                    <Typography variant="body2">
                      Би үйлчилгээний нөхцөлийг зөвшөөрч байна.
                      <Link component="a" href="#">
                        Үйлчилгээний нөхцөл унших
                      </Link>
                      .
                    </Typography>
                  </>
                }
              />
            </Box>
            <Link component={RouterLink} to="/account/recover-password">
              <b>Нууц үгээ мартсан</b>
            </Link>
          </Box>

          {Boolean(touched.terms && errors.terms) && (
            <FormHelperText error>{errors.terms}</FormHelperText>
          )}

          <Button
            sx={{
              mt: 3
            }}
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
            disabled={isSubmitting}
            type="submit"
            fullWidth
            size="large"
            variant="contained"
          >
            Нэвтрэх
          </Button>
        </form>
      )}
    </Formik>
  );
};

export default LoginJWT;
