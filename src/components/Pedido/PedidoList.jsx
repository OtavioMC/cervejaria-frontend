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
  Chip,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { pedidoService } from '../../api/api';
import PedidoForm from './PedidoForm';
import ResponsiveTable from '../Common/ResponsiveTable';

export default function PedidoList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [pedidoEdit, setPedidoEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [pedidoDelete, setPedidoDelete] = useState(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const response = await pedidoService.getAll();
      setPedidos(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar pedidos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setPedidoEdit(null);
    setOpenForm(true);
  };

  const handleEditar = (pedido) => {
    setPedidoEdit(pedido);
    setOpenForm(true);
  };

  const handleDeletar = (pedido) => {
    setPedidoDelete(pedido);
    setOpenDelete(true);
  };

  const confirmarDelete = async () => {
    try {
      await pedidoService.delete(pedidoDelete.id);
      setOpenDelete(false);
      setPedidoDelete(null);
      carregarPedidos();
    } catch (err) {
      setError('Erro ao deletar pedido: ' + err.message);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setPedidoEdit(null);
    carregarPedidos();
  };

  const getStatusColor = (status) => {
    const colors = {
      'ABERTO': 'success',
      'EM_PREPARO': 'warning',
      'PRONTO': 'info',
      'ENTREGUE': 'secondary',
      'PAGO': 'success',
      'CANCELADO': 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => status?.replace('_', ' ') || '-';

  const tableColumns = [
    { id: 'id', label: 'ID', width: '8%' },
    { id: 'mesa', label: 'Mesa', width: '12%' },
    { id: 'garcom', label: 'Garçom', width: '18%' },
    { id: 'data', label: 'Data/Hora', width: '18%' },
    { id: 'valor', label: 'Valor', width: '12%' },
    { id: 'status', label: 'Status', width: '14%' },
    { id: 'acoes', label: 'Ações', width: '18%', align: 'right' },
  ];

  const renderCell = (row, columnId) => {
    switch (columnId) {
      case 'id':
        return `#${row.id}`;
      case 'mesa':
        return `Mesa ${row.numeroMesa}`;
      case 'garcom':
        return row.garcom?.nome || '-';
      case 'data':
        return row.dataPedido
          ? new Date(row.dataPedido).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-';
      case 'valor':
        return (
          <Typography sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
            R$ {row.valorTotal?.toFixed(2) || '0.00'}
          </Typography>
        );
      case 'status':
        return (
          <Chip
            label={getStatusLabel(row.status)}
            color={getStatusColor(row.status)}
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
      <Box sx={{ mb: 1.5, pb: 1.5, borderBottom: '2px solid #FF6B35' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Pedido #{row.id}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Mesa {row.numeroMesa}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            GARÇOM
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.garcom?.nome || '-'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            DATA/HORA
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.dataPedido
              ? new Date(row.dataPedido).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            VALOR
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
            R$ {row.valorTotal?.toFixed(2) || '0.00'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            STATUS
          </Typography>
          <Chip
            label={getStatusLabel(row.status)}
            color={getStatusColor(row.status)}
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
          <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Pedidos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNovo}
          fullWidth={isMobile}
        >
          Novo Pedido
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ResponsiveTable
        columns={tableColumns}
        data={pedidos}
        renderCell={renderCell}
        renderCardContent={renderCardContent}
        title="Pedidos"
        emptyMessage="Nenhum pedido cadastrado"
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
          {pedidoEdit ? 'Editar Pedido' : 'Novo Pedido'}
        </DialogTitle>
        <DialogContent>
          <PedidoForm pedido={pedidoEdit} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o pedido #{pedidoDelete?.id}?
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
