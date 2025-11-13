import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

export default function Topbar({ mobileOpen, onMenuToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C42 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          px: { xs: 1.5, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Seção Esquerda */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuToggle}
              sx={{
                mr: 1,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              aria-label={mobileOpen ? 'fechar menu' : 'abrir menu'}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
            component="a"
            href="/"
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                letterSpacing: '0.5px',
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              🍺 Cervejaria
            </Typography>
          </Box>
        </Box>

        {/* Seção Direita */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>
          {/* Status Online Indicator (Desktop) */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Online
              </Typography>
            </Box>
          )}

          {/* Menu de Usuário */}
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              p: 0,
              ml: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            aria-label="menu de usuário"
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
          >
            <Avatar
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  border: '2px solid rgba(255,255,255,0.5)',
                },
              }}
            >
              <AccountIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
            </Avatar>
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 4,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem sx={{ py: 1.5 }}>
              <AccountIcon sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={500}>
                Meu Perfil
              </Typography>
            </MenuItem>

            <MenuItem sx={{ py: 1.5 }}>
              <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={500}>
                Configurações
              </Typography>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
              <Typography variant="body2" fontWeight={500}>
                Sair
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
