import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as CaixaIcon,
} from '@mui/icons-material';
import { caixaService } from '../../api/api';
import CaixaForm from './CaixaForm';
import ResponsiveTable from '../Common/ResponsiveTable';

export default function CaixaList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [caixas, setCaixas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [caixaEdit, setCaixaEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [caixaDelete, setCaixaDelete] = useState(null);

  useEffect(() => {
    carregarCaixas();
  }, []);

  const carregarCaixas = async () => {
    try {
      setLoading(true);
      const response = await caixaService.getAll();
      setCaixas(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar caixas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setCaixaEdit(null);
    setOpenForm(true);
  };

  const handleEditar = (caixa) => {
    setCaixaEdit(caixa);
    setOpenForm(true);
  };

  const handleDeletar = (caixa) => {
    setCaixaDelete(caixa);
    setOpenDelete(true);
  };

  const confirmarDelete = async () => {
    try {
      await caixaService.delete(caixaDelete.id);
      setOpenDelete(false);
      setCaixaDelete(null);
      carregarCaixas();
    } catch (err) {
      setError('Erro ao deletar caixa: ' + err.message);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCaixaEdit(null);
    carregarCaixas();
  };

  const tableColumns = [
    { id: 'id', label: 'ID', width: '10%' },
    { id: 'nome', label: 'Nome', width: '25%' },
    { id: 'codigo', label: 'Código', width: '15%' },
    { id: 'salario', label: 'Salário', width: '15%' },
    { id: 'vendido', label: 'Total Vendido', width: '15%' },
    { id: 'ativo', label: 'Status', width: '12%' },
    { id: 'acoes', label: 'Ações', width: '8%', align: 'right' },
  ];

  const renderCell = (row, columnId) => {
    switch (columnId) {
      case 'id':
        return `#${row.id}`;
      case 'nome':
        return row.nome;
      case 'codigo':
        return row.codigo;
      case 'salario':
        return row.salario ? `R$ ${row.salario.toFixed(2)}` : '-';
      case 'vendido':
        return (
          <Typography sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            R$ {(row.totalVendido || 0).toFixed(2)}
          </Typography>
        );
      case 'ativo':
        return (
          <Chip
            label={row.ativo ? 'Ativo' : 'Inativo'}
            color={row.ativo ? 'success' : 'error'}
            size="small"
          />
        );
      case 'acoes':
        return (
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEditar(row)}
              title="Editar"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDeletar(row)}
              title="Deletar"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      default:
        return '-';
    }
  };

  const renderCardContent = (row) => (
    <Box>
      <Box sx={{ mb: 1.5, pb: 1.5, borderBottom: '2px solid #4CAF50' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {row.nome}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          ID: #{row.id}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            CÓDIGO
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.codigo}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            SALÁRIO
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.salario ? `R$ ${row.salario.toFixed(2)}` : '-'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            TOTAL VENDIDO
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
            R$ {(row.totalVendido || 0).toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            STATUS
          </Typography>
          <Chip
            label={row.ativo ? 'Ativo' : 'Inativo'}
            color={row.ativo ? 'success' : 'error'}
            size="small"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          fullWidth
          startIcon={<EditIcon />}
          onClick={() => handleEditar(row)}
        >
          Editar
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          fullWidth
          startIcon={<DeleteIcon />}
          onClick={() => handleDeletar(row)}
        >
          Deletar
        </Button>
      </Box>
    </Box>
  );

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
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        mb={3}
        gap={2}
      >
        <Typography variant={{ xs: 'h5', sm: 'h4' }} component="h1">
          <CaixaIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Operadores de Caixa
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNovo}
          fullWidth={isMobile}
        >
          Novo Caixa
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ResponsiveTable
        columns={tableColumns}
        data={caixas}
        renderCell={renderCell}
        renderCardContent={renderCardContent}
        title="Caixas"
        emptyMessage="Nenhum caixa cadastrado"
      />

      {/* Dialog Form */}
      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {caixaEdit ? 'Editar Caixa' : 'Novo Caixa'}
        </DialogTitle>
        <DialogContent>
          <CaixaForm caixa={caixaEdit} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o caixa "{caixaDelete?.nome}"?
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
