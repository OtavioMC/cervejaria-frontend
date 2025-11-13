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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usuarioService } from '../../api/api';

export default function UsuarioForm({ usuario, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    email: '',
    senha: '',
    papel: '',
    ativo: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const papeis = ['ADMIN', 'GERENTE', 'USUARIO'];

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || '',
        cpf: usuario.cpf || '',
        dataNascimento: usuario.dataNascimento || '',
        email: usuario.email || '',
        senha: '',
        papel: usuario.papel || '',
        ativo: usuario.ativo !== false,
      });
    }
  }, [usuario]);

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
      const dados = { ...formData };
      // Não enviar senha vazia em edição
      if (usuario && !dados.senha) {
        delete dados.senha;
      }

      if (usuario?.id) {
        await usuarioService.update(usuario.id, dados);
      } else {
        await usuarioService.create(dados);
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar usuário: ' + (err.response?.data?.message || err.message));
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

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            type="email"
            label="E-mail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required={!usuario}
            type="password"
            label={usuario ? 'Senha (deixe em branco para manter)' : 'Senha'}
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Papel/Função"
            name="papel"
            value={formData.papel}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          >
            <MenuItem value="">Selecione...</MenuItem>
            {papeis.map((papel) => (
              <MenuItem key={papel} value={papel}>
                {papel}
              </MenuItem>
            ))}
          </TextField>
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
            label="Usuário Ativo"
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
              {loading ? 'Salvando...' : usuario ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
