import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalDrink as DrinkIcon,
} from '@mui/icons-material';
import { produtoService } from '../../api/api';
import ProdutoForm from './ProdutoForm';

export default function ProdutoList() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [produtoEdit, setProdutoEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [produtoDelete, setProdutoDelete] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const response = await produtoService.getAll();
      setProdutos(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar produtos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setProdutoEdit(null);
    setOpenForm(true);
  };

  const handleEditar = (produto) => {
    setProdutoEdit(produto);
    setOpenForm(true);
  };

  const handleDeletar = (produto) => {
    setProdutoDelete(produto);
    setOpenDelete(true);
  };

  const confirmarDelete = async () => {
    try {
      await produtoService.delete(produtoDelete.id);
      setOpenDelete(false);
      setProdutoDelete(null);
      carregarProdutos();
    } catch (err) {
      setError('Erro ao deletar produto: ' + err.message);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setProdutoEdit(null);
    carregarProdutos();
  };

  const getCategoriaColor = (categoria) => {
    const colors = {
      'Bebida': 'primary',
      'Entrada': 'secondary',
      'Prato Principal': 'success',
      'Sobremesa': 'warning',
    };
    return colors[categoria] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
      >
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" sx={{ fontWeight: 'bold' }}>
          <DrinkIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: isMobile ? 24 : 32 }} />
          Produtos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNovo}
          fullWidth={isMobile}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Novo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {produtos.map((produto) => (
          <Grid item xs={12} sm={6} md={4} key={produto.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom sx={{ fontWeight: 'bold' }}>
                  {produto.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: '40px' }}>
                  {produto.descricao || 'Sem descrição'}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                  <Typography variant={isMobile ? 'body1' : 'h6'} color="primary" sx={{ fontWeight: 'bold' }}>
                    R$ {produto.preco?.toFixed(2)}
                  </Typography>
                  <Chip
                    label={produto.categoria}
                    color={getCategoriaColor(produto.categoria)}
                    size={isMobile ? 'small' : 'medium'}
                  />
                </Box>
                {produto.disponivel && (
                  <Chip
                    label="Disponível"
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
              <CardActions sx={{ pt: 0, justifyContent: 'flex-end', gap: 0.5 }}>
                <IconButton
                  color="primary"
                  onClick={() => handleEditar(produto)}
                  size={isMobile ? 'small' : 'medium'}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDeletar(produto)}
                  size={isMobile ? 'small' : 'medium'}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {produtos.length === 0 && !loading && (
        <Box textAlign="center" py={5}>
          <Typography color="textSecondary">
            Nenhum produto cadastrado
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNovo}
            sx={{ mt: 2 }}
          >
            Cadastrar Primeiro Produto
          </Button>
        </Box>
      )}

      {/* Dialog Form */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {produtoEdit ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <ProdutoForm produto={produtoEdit} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir "{produtoDelete?.nome}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancelar</Button>
          <Button onClick={confirmarDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
