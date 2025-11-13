import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { garcomService } from '../../api/api';

export default function GarcomForm({ garcom, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    matricula: '',
    salario: '',
    turno: '',
    ativo: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const turnos = ['Manhã', 'Tarde', 'Noite'];

  useEffect(() => {
    if (garcom) {
      setFormData({
        nome: garcom.nome || '',
        cpf: garcom.cpf || '',
        dataNascimento: garcom.dataNascimento || '',
        matricula: garcom.matricula || '',
        salario: garcom.salario || '',
        turno: garcom.turno || '',
        ativo: garcom.ativo !== false,
      });
    }
  }, [garcom]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dados = {
        ...formData,
        salario: formData.salario ? parseFloat(formData.salario) : null,
      };

      if (garcom?.id) {
        await garcomService.update(garcom.id, dados);
      } else {
        await garcomService.create(dados);
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar garçom: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: isMobile ? 1 : 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={{ xs: 1.5, sm: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Nome Completo"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            inputProps={{ maxLength: 11 }}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Data de Nascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Matrícula"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Salário (R$)"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Turno"
            name="turno"
            value={formData.turno}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          >
            <MenuItem value="">Selecione...</MenuItem>
            {turnos.map((turno) => (
              <MenuItem key={turno} value={turno}>
                {turno}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.ativo}
                onChange={handleChange}
                name="ativo"
              />
            }
            label="Funcionário Ativo"
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            display="flex"
            gap={2}
            justifyContent="flex-end"
            flexDirection={isMobile ? 'column-reverse' : 'row'}
          >
            <Button onClick={onClose} disabled={loading} fullWidth={isMobile}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth={isMobile}
            >
              {loading ? 'Salvando...' : garcom ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
