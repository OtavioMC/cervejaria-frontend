import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import Home from './pages/Home';
import ProdutoList from './components/Produto/ProdutoList';
import GarcomList from './components/Garcom/GarcomList';
import PedidoList from './components/Pedido/PedidoList';
import CaixaList from './components/Caixa/CaixaList';
import UsuarioList from './components/Usuario/UsuarioList';
import Topbar from './components/Layout/Topbar';
import Sidebar from './components/Layout/Sidebar';

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <CssBaseline />

          {/* Topbar */}
          <Topbar mobileOpen={mobileOpen} onMenuToggle={handleDrawerToggle} />

          {/* Sidebar */}
          <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerClose} />

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              p: { xs: 1.5, sm: 2, md: 3 },
              width: '100%',
              overflow: 'auto',
              mt: { xs: 7, sm: 8, md: 8 },
            }}
          >
            <Container
              maxWidth="xl"
              sx={{
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 1, sm: 2 },
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<ProdutoList />} />
                <Route path="/garcons" element={<GarcomList />} />
                <Route path="/pedidos" element={<PedidoList />} />
                <Route path="/caixas" element={<CaixaList />} />
                <Route path="/usuarios" element={<UsuarioList />} />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
