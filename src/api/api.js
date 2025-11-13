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
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'; // para testes offline

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // garantir que headers existe antes de atribuir
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Redirecionar para login se não autenticado
      try {
        localStorage.removeItem('token');
      } catch (e) {
      }
      // apenas redireciona no browser (não em SSR)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper que tenta chamar a API real, e cai para mock se falhar
const withMockFallback = (mockService) => ({
  getAll: async () => {
    try {
      return await api.get('');
    } catch (e) {
      console.warn('API indisponível, usando mocks');
      return mockService.getAll();
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/${id}`);
    } catch (e) {
      return mockService.getById(id);
    }
  },
  create: async (item) => {
    try {
      return await api.post('', item);
    } catch (e) {
      console.warn('API indisponível, usando mocks');
      return mockService.create(item);
    }
  },
  update: async (id, item) => {
    try {
      return await api.put(`/${id}`, item);
    } catch (e) {
      console.warn('API indisponível, usando mocks');
      return mockService.update(id, item);
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/${id}`);
    } catch (e) {
      console.warn('API indisponível, usando mocks');
      return mockService.delete(id);
    }
  },
});

// Mocks locais
const mockProdutoService = createMockService('Produto', mockProdutos);
const mockGarcomService = createMockService('Garcom', mockGarcons);
const mockPedidoService = createMockService('Pedido', mockPedidos);
const mockCaixaService = createMockService('Caixa', mockCaixas);
const mockUsuarioService = createMockService('Usuario', mockUsuarios);


export const produtoService = USE_MOCKS
  ? mockProdutoService
  : {
      getAll: () => api.get('/produtos'),
      getById: (id) => api.get(`/produtos/${id}`),
      create: (produto) => api.post('/produtos', produto),
      update: (id, produto) => api.put(`/produtos/${id}`, produto),
      delete: (id) => api.delete(`/produtos/${id}`),
      getDisponiveis: () => api.get('/produtos/disponiveis'),
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
    };

export default api;
