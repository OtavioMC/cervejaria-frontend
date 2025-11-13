import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

/**
 * ResponsiveTable - Componente que se adapta entre Table e Cards baseado no breakpoint
 * 
 * Em desktop (md+): Exibe como tabela normal
 * Em móvel (< md): Exibe como cards empilhados
 * 
 * @param {Object} props
 * @param {Array} props.columns - Array de colunas: [{ id: 'nome', label: 'Nome', width: '20%' }, ...]
 * @param {Array} props.data - Array de dados
 * @param {Function} props.renderCell - Função que renderiza cada célula: (row, columnId) => JSX
 * @param {Function} props.renderCardContent - Função que renderiza conteúdo do card em móvel (opcional)
 */
export default function ResponsiveTable({
  columns,
  data,
  renderCell,
  renderCardContent,
  title = 'Dados',
  emptyMessage = 'Nenhum registro encontrado',
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    // Renderização em Cards para Mobile
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.length > 0 ? (
          data.map((row, index) => (
            <Card
              key={row.id || index}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ pb: 1.5 }}>
                {renderCardContent ? (
                  renderCardContent(row)
                ) : (
                  // Renderização padrão dos campos em cards
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {columns.map((column) => (
                      <Box
                        key={column.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          pb: 1,
                          borderBottom: '1px solid #f0f0f0',
                          '&:last-child': {
                            borderBottom: 'none',
                            pb: 0,
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {column.label}
                        </Typography>
                        <Box sx={{ textAlign: 'right', fontWeight: 500 }}>
                          {renderCell(row, column.id)}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">{emptyMessage}</Typography>
          </Card>
        )}
      </Box>
    );
  }

  // Renderização em Tabela para Desktop
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#FF6B35' }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  width: column.width,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      fontSize: '0.9rem',
                      py: 1.5,
                    }}
                  >
                    {renderCell(row, column.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
