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
  People as PeopleIcon,
} from '@mui/icons-material';
import { usuarioService } from '../../api/api';
import UsuarioForm from './UsuarioForm';
import ResponsiveTable from '../Common/ResponsiveTable';

export default function UsuarioList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [usuarioDelete, setUsuarioDelete] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.getAll();
      setUsuarios(response.data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar usuários: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setUsuarioEdit(null);
    setOpenForm(true);
  };

  const handleEditar = (usuario) => {
    setUsuarioEdit(usuario);
    setOpenForm(true);
  };

  const handleDeletar = (usuario) => {
    setUsuarioDelete(usuario);
    setOpenDelete(true);
  };

  const confirmarDelete = async () => {
    try {
      await usuarioService.delete(usuarioDelete.id);
      setOpenDelete(false);
      setUsuarioDelete(null);
      carregarUsuarios();
    } catch (err) {
      setError('Erro ao deletar usuário: ' + err.message);
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setUsuarioEdit(null);
    carregarUsuarios();
  };

  const getPapelColor = (papel) => {
    const colors = {
      'ADMIN': 'error',
      'GERENTE': 'warning',
      'USUARIO': 'info',
    };
    return colors[papel] || 'default';
  };

  const tableColumns = [
    { id: 'id', label: 'ID', width: '8%' },
    { id: 'nome', label: 'Nome', width: '25%' },
    { id: 'email', label: 'E-mail', width: '25%' },
    { id: 'papel', label: 'Papel', width: '15%' },
    { id: 'ativo', label: 'Status', width: '12%' },
    { id: 'acoes', label: 'Ações', width: '15%', align: 'right' },
  ];

  const renderCell = (row, columnId) => {
    switch (columnId) {
      case 'id':
        return `#${row.id}`;
      case 'nome':
        return row.nome;
      case 'email':
        return row.email;
      case 'papel':
        return (
          <Chip
            label={row.papel || '-'}
            color={getPapelColor(row.papel)}
            size="small"
          />
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
            E-MAIL
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
            {row.email}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            PAPEL
          </Typography>
          <Chip
            label={row.papel || '-'}
            color={getPapelColor(row.papel)}
            size="small"
          />
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
          <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Usuários do Sistema
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNovo}
          fullWidth={isMobile}
        >
          Novo Usuário
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <ResponsiveTable
        columns={tableColumns}
        data={usuarios}
        renderCell={renderCell}
        renderCardContent={renderCardContent}
        title="Usuários"
        emptyMessage="Nenhum usuário cadastrado"
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
          {usuarioEdit ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <UsuarioForm usuario={usuarioEdit} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>

      {/* Dialog Delete */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário "{usuarioDelete?.nome}"?
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
