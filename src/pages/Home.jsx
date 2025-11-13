import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  LocalDrink as ProdutoIcon,
  Person as GarcomIcon,
  Receipt as PedidoIcon,
  AttachMoney as CaixaIcon,
  People as UsuarioIcon,
} from '@mui/icons-material';
import {
  produtoService,
  garcomService,
  pedidoService,
  caixaService,
  usuarioService,
} from '../api/api';

function StatCard({ icon: Icon, title, count, color }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Icon
            sx={{
              fontSize: isMobile ? 32 : 40,
              color,
            }}
          />
        </Box>
        <Typography
          color="textSecondary"
          gutterBottom
          variant={isMobile ? 'body2' : 'body1'}
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold' }}>
          {count || 0}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [stats, setStats] = useState({
    produtos: 0,
    garcons: 0,
    pedidos: 0,
    caixas: 0,
    usuarios: 0,
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    carregarStats();
  }, []);

  const carregarStats = async () => {
    try {
      setLoading(true);
      const [prodResp, garcResp, pedResp, cxResp, usrResp] = await Promise.all([
        produtoService.getAll().catch(() => ({ data: [] })),
        garcomService.getAll().catch(() => ({ data: [] })),
        pedidoService.getAll().catch(() => ({ data: [] })),
        caixaService.getAll().catch(() => ({ data: [] })),
        usuarioService.getAll().catch(() => ({ data: [] })),
      ]);

      setStats({
        produtos: prodResp.data?.length || 0,
        garcons: garcResp.data?.length || 0,
        pedidos: pedResp.data?.length || 0,
        caixas: cxResp.data?.length || 0,
        usuarios: usrResp.data?.length || 0,
      });
    } catch (err) {
      console.error('Erro ao carregar stats:', err);
    } finally {
      setLoading(false);
    }
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
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        component="h1"
        sx={{ mb: 3, fontWeight: 'bold' }}
      >
        🍺 Sistema de Gerenciamento
      </Typography>

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={ProdutoIcon}
            title="Produtos"
            count={stats.produtos}
            color="#FF6B35"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={GarcomIcon}
            title="Garçons"
            count={stats.garcons}
            color="#FF6B35"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={PedidoIcon}
            title="Pedidos"
            count={stats.pedidos}
            color="#ff5722"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={CaixaIcon}
            title="Caixas"
            count={stats.caixas}
            color="#4CAF50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={UsuarioIcon}
            title="Usuários"
            count={stats.usuarios}
            color="#2196F3"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f5f5f5' }}>
            <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ mb: 2, fontWeight: 'bold' }}>
              📋 Informações do Sistema
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 1.5, md: 2 },
              }}
            >
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                  API Base URL:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                  Versão:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  v1.0.0
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ mt: 2, display: 'block', lineHeight: 1.6 }}
            >
              Use o menu para navegar. Clique nos botões "Novo" para adicionar itens.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
