import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { caixaService } from '../../api/api';

export default function CaixaForm({ caixa, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    codigo: '',
    salario: '',
    ativo: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (caixa) {
      setFormData({
        nome: caixa.nome || '',
        cpf: caixa.cpf || '',
        dataNascimento: caixa.dataNascimento || '',
        codigo: caixa.codigo || '',
        salario: caixa.salario || '',
        ativo: caixa.ativo !== false,
      });
    }
  }, [caixa]);

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

      if (caixa?.id) {
        await caixaService.update(caixa.id, dados);
      } else {
        await caixaService.create(dados);
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar caixa: ' + (err.response?.data?.message || err.message));
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
            label="Código do Caixa"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            inputProps={{ maxLength: 20 }}
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

        <Grid item xs={12}>
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
              {loading ? 'Salvando...' : caixa ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
