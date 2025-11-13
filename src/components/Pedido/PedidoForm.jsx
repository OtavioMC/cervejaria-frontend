import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { pedidoService, garcomService } from '../../api/api';

export default function PedidoForm({ pedido, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    numeroMesa: '',
    garcomId: '',
    status: 'ABERTO',
    observacoes: '',
  });
  const [garcons, setGarcons] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const statuses = ['ABERTO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE', 'PAGO', 'CANCELADO'];

  useEffect(() => {
    carregarGarcons();
    if (pedido) {
      setFormData({
        numeroMesa: pedido.numeroMesa || '',
        garcomId: pedido.garcom?.id || '',
        status: pedido.status || 'ABERTO',
        observacoes: pedido.observacoes || '',
      });
    }
  }, [pedido]);

  const carregarGarcons = async () => {
    try {
      const response = await garcomService.getAll();
      setGarcons(response.data);
    } catch (err) {
      console.error('Erro ao carregar garçons', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dados = {
        ...formData,
        garcomId: parseInt(formData.garcomId),
      };

      if (pedido?.id) {
        await pedidoService.update(pedido.id, dados);
      } else {
        await pedidoService.create(dados);
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar pedido: ' + (err.response?.data?.message || err.message));
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Número da Mesa"
            name="numeroMesa"
            value={formData.numeroMesa}
            onChange={handleChange}
            inputProps={{ min: '1' }}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            select
            label="Garçom Responsável"
            name="garcomId"
            value={formData.garcomId}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          >
            <MenuItem value="">Selecione um garçom...</MenuItem>
            {garcons.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.nome} - {g.matricula}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            select
            label="Status do Pedido"
            name="status"
            value={formData.status}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observações"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            placeholder="Observações sobre o pedido..."
            size={isMobile ? 'small' : 'medium'}
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
              {loading ? 'Salvando...' : pedido ? 'Atualizar' : 'Criar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
