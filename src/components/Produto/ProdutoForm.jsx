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
import { produtoService } from '../../api/api';

export default function ProdutoForm({ produto, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    disponivel: true,
    imagemUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const categorias = ['Bebida', 'Entrada', 'Prato Principal', 'Sobremesa'];

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        preco: produto.preco || '',
        categoria: produto.categoria || '',
        disponivel: produto.disponivel !== false,
        imagemUrl: produto.imagemUrl || '',
      });
    }
  }, [produto]);

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
        preco: parseFloat(formData.preco),
      };

      if (produto?.id) {
        await produtoService.update(produto.id, dados);
      } else {
        await produtoService.create(dados);
      }
      onClose();
    } catch (err) {
      setError('Erro ao salvar produto: ' + (err.response?.data?.message || err.message));
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
            label="Nome do Produto"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Preço"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            inputProps={{ step: '0.01', min: '0' }}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            select
            label="Categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          >
            <MenuItem value="">Selecione...</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL da Imagem"
            name="imagemUrl"
            value={formData.imagemUrl}
            onChange={handleChange}
            size={isMobile ? 'small' : 'medium'}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.disponivel}
                onChange={handleChange}
                name="disponivel"
              />
            }
            label="Disponível para venda"
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={1} justifyContent="flex-end" flexDirection={isMobile ? 'column-reverse' : 'row'}>
            <Button
              onClick={onClose}
              disabled={loading}
              fullWidth={isMobile}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth={isMobile}
            >
              {loading ? 'Salvando...' : produto ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
