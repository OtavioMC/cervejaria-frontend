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
  Person as PersonIcon,
} from '@mui/icons-material';
import { garcomService } from '../../api/api';
import GarcomForm from './GarcomForm';
import ResponsiveTable from '../Common/ResponsiveTable';

export default function GarcomList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [garcons, setGarcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [garcomEdit, setGarcomEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [garcomDelete, setGarcomDelete] = useState(null);

  useEffect(() => {
    carregarGarcons();
  }, []);

  const carregarGarcons = async () => {
    try {
      setLoading(true);
      const response = await garcomService.getAll();
      setGarcons(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar garçons: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setGarcomEdit(null);
    setOpenForm(true);
  };

  const handleEditar = (garcom) => {
    setGarcomEdit(garcom);
    setOpenForm(true);
  };

  const handleDeletar = (garcom) => {
    setGarcomDelete(garcom);
    setOpenDelete(true);
  };

  const confirmarDelete = async () => {
    try {
      await garcomService.delete(garcomDelete.id);
      setOpenDelete(false);
      setGarcomDelete(null);
      carregarGarcons();
    } catch (err) {
      setError('Erro ao deletar garçom: ' + err.message);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setGarcomEdit(null);
    carregarGarcons();
  };

  const tableColumns = [
    { id: 'id', label: 'ID', width: '10%' },
    { id: 'nome', label: 'Nome', width: '25%' },
    { id: 'matricula', label: 'Matrícula', width: '15%' },
    { id: 'turno', label: 'Turno', width: '15%' },
    { id: 'salario', label: 'Salário', width: '15%' },
    { id: 'ativo', label: 'Status', width: '12%' },
    { id: 'acoes', label: 'Ações', width: '8%', align: 'right' },
  ];

  const renderCell = (row, columnId) => {
    switch (columnId) {
      case 'id':
        return `#${row.id}`;
      case 'nome':
        return row.nome;
      case 'matricula':
        return row.matricula;
      case 'turno':
        return row.turno || '-';
      case 'salario':
        return row.salario ? `R$ ${row.salario.toFixed(2)}` : '-';
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
      <Box sx={{ mb: 1.5, pb: 1.5, borderBottom: '2px solid #FF6B35' }}>
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
            MATRÍCULA
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.matricula}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            TURNO
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.turno || '-'}
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
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Garçons
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNovo}
          fullWidth={isMobile}
        >
          Novo Garçom
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ResponsiveTable
        columns={tableColumns}
        data={garcons}
        renderCell={renderCell}
        renderCardContent={renderCardContent}
        title="Garçons"
        emptyMessage="Nenhum garçom cadastrado"
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
          {garcomEdit ? 'Editar Garçom' : 'Novo Garçom'}
        </DialogTitle>
        <DialogContent>
          <GarcomForm garcom={garcomEdit} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o garçom "{garcomDelete?.nome}"?
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
