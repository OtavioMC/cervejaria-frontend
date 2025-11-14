import axios from 'axios';
import {
  createMockService,
  mockProdutos,
  mockGarcons,
  mockPedidos,
  mockCaixas,
  mockUsuarios,
} from './mocks';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

console.log('API Config:', { baseURL, USE_MOCKS });

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (e) {
        console.error('Error removing token:', e);
      }
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Mocks locais
const mockProdutoService = createMockService('Produto', mockProdutos);
const mockGarcomService = createMockService('Garcom', mockGarcons);
const mockPedidoService = createMockService('Pedido', mockPedidos);
const mockCaixaService = createMockService('Caixa', mockCaixas);
const mockUsuarioService = createMockService('Usuario', mockUsuarios);

// Serviços
export const produtoService = USE_MOCKS
  ? mockProdutoService
  : {
      getAll: () => api.get('/produtos'),
      getById: (id) => api.get(`/produtos/${id}`),
      create: (produto) => api.post('/produtos', produto),
      update: (id, produto) => api.put(`/produtos/${id}`, produto),
      delete: (id) => api.delete(`/produtos/${id}`),
      getDisponiveis: () => api.get('/produtos/ativos'),
    };

export const garcomService = USE_MOCKS
  ? mockGarcomService
  : {
      getAll: () => api.get('/garcons'),
      getById: (id) => api.get(`/garcons/${id}`),
      create: (garcom) => api.post('/garcons', garcom),
      update: (id, garcom) => api.put(`/garcons/${id}`, garcom),
      delete: (id) => api.delete(`/garcons/${id}`),
    };

export const pedidoService = USE_MOCKS
  ? mockPedidoService
  : {
      getAll: () => api.get('/pedidos'),
      getById: (id) => api.get(`/pedidos/${id}`),
      create: (pedido) => api.post('/pedidos', pedido),
      update: (id, pedido) => api.put(`/pedidos/${id}`, pedido),
      delete: (id) => api.delete(`/pedidos/${id}`),
    };

export const caixaService = USE_MOCKS
  ? mockCaixaService
  : {
      getAll: () => api.get('/caixas'),
      getById: (id) => api.get(`/caixas/${id}`),
      create: (caixa) => api.post('/caixas', caixa),
      update: (id, caixa) => api.put(`/caixas/${id}`, caixa),
      delete: (id) => api.delete(`/caixas/${id}`),
    };

export const usuarioService = USE_MOCKS
  ? mockUsuarioService
  : {
      getAll: () => api.get('/usuarios'),
      getById: (id) => api.get(`/usuarios/${id}`),
      create: (usuario) => api.post('/usuarios', usuario),
      update: (id, usuario) => api.put(`/usuarios/${id}`, usuario),
      delete: (id) => api.delete(`/usuarios/${id}`),
      login: (email, senha) => api.post('/usuarios/login', { email, senha }),
    };

export default api;