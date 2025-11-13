import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  LocalDrink as ProductIcon,
  Person as GarcomIcon,
  Receipt as PedidoIcon,
  People as UsersIcon,
  AttachMoney as CaixaIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: 'Início', icon: <HomeIcon />, path: '/' },
  { text: 'Produtos', icon: <ProductIcon />, path: '/produtos' },
  { text: 'Garçons', icon: <GarcomIcon />, path: '/garcons' },
  { text: 'Pedidos', icon: <PedidoIcon />, path: '/pedidos' },
  { text: 'Caixas', icon: <CaixaIcon />, path: '/caixas' },
  { text: 'Usuários', icon: <UsersIcon />, path: '/usuarios' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const drawerContent = useMemo(
    () => (
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Logo Section */}
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            px: 2,
            py: 2,
            gap: 1,
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1rem' }}>
            🍺 Cervejaria
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.9,
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            GERENCIAMENTO
          </Typography>
        </Toolbar>

        {/* Menu Items */}
        <List sx={{ flex: 1, px: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    if (isMobile) onClose();
                  }}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1,
                    transition: 'all 0.3s ease',
                    backgroundColor: isActive ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                    borderLeft: isActive ? '4px solid #FF6B35' : '4px solid transparent',
                    pl: isActive ? 1.5 : 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.08)',
                      transform: 'translateX(4px)',
                    },
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'primary.main' : 'text.secondary',
                      minWidth: 40,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={isActive ? 600 : 500}
                        sx={{
                          color: isActive ? 'primary.main' : 'text.primary',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />

                  {isActive && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        ml: 'auto',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Footer Info */}
        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Box
            sx={{
              p: 1.5,
              backgroundColor: 'rgba(255, 107, 53, 0.05)',
              borderRadius: 1,
              border: '1px solid rgba(255, 107, 53, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <InfoIcon sx={{ fontSize: 16, color: 'primary.main', mt: 0.25 }} />
              <Box>
                <Typography variant="caption" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                  Dica
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    color: 'text.secondary',
                    lineHeight: 1.4,
                  }}
                >
                  Clique em qualquer item para navegar entre seções.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    ),
    [location.pathname, isMobile, onClose]
  );

  return (
    <>
      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Temporary Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: '#fafafa',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
