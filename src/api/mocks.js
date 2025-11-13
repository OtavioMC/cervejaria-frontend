// Mock data para desenvolvimento offline

export const mockProdutos = [
  {
    id: 1,
    nome: 'Chopp Premium',
    descricao: 'Chopp gelado artesanal premium',
    preco: 15.90,
    categoria: 'Bebida',
    disponivel: true,
    imagemUrl: 'https://via.placeholder.com/150?text=Chopp',
  },
  {
    id: 2,
    nome: 'Batata Frita',
    descricao: 'Batata frita crocante com sal grosso',
    preco: 22.50,
    categoria: 'Entrada',
    disponivel: true,
    imagemUrl: 'https://via.placeholder.com/150?text=Batata',
  },
  {
    id: 3,
    nome: 'Churrasco na Chapa',
    descricao: 'Carne bovina grelhada com acompanhamentos',
    preco: 65.00,
    categoria: 'Prato Principal',
    disponivel: true,
    imagemUrl: 'https://via.placeholder.com/150?text=Churrasco',
  },
  {
    id: 4,
    nome: 'Pudim de Leite Condensado',
    descricao: 'Pudim caseiro com calda de caramelo',
    preco: 12.00,
    categoria: 'Sobremesa',
    disponivel: true,
    imagemUrl: 'https://via.placeholder.com/150?text=Pudim',
  },
];

export const mockGarcons = [
  {
    id: 1,
    nome: 'João Silva',
    cpf: '12345678901',
    dataNascimento: '1990-05-15',
    matricula: 'GAR001',
    salario: 2500.00,
    turno: 'Manhã',
    ativo: true,
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cpf: '98765432101',
    dataNascimento: '1985-03-20',
    matricula: 'GAR002',
    salario: 2600.00,
    turno: 'Tarde',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Pedro Costa',
    cpf: '55555555555',
    dataNascimento: '1992-07-10',
    matricula: 'GAR003',
    salario: 2450.00,
    turno: 'Noite',
    ativo: false,
  },
];

export const mockPedidos = [
  {
    id: 1,
    numeroMesa: 5,
    garcom: mockGarcons[0],
    dataPedido: new Date('2025-11-13T19:30:00'),
    valorTotal: 125.40,
    status: 'ENTREGUE',
    observacoes: 'Sem cebola',
  },
  {
    id: 2,
    numeroMesa: 3,
    garcom: mockGarcons[1],
    dataPedido: new Date('2025-11-13T20:00:00'),
    valorTotal: 98.90,
    status: 'PAGO',
    observacoes: 'Cliente VIP',
  },
  {
    id: 3,
    numeroMesa: 8,
    garcom: mockGarcons[0],
    dataPedido: new Date('2025-11-13T20:15:00'),
    valorTotal: 156.70,
    status: 'EM_PREPARO',
    observacoes: '',
  },
];

export const mockCaixas = [
  {
    id: 1,
    nome: 'Carlos Operador',
    cpf: '11111111111',
    dataNascimento: '1988-09-12',
    codigo: 'CX001',
    salario: 2800.00,
    totalVendido: 5420.50,
    ativo: true,
  },
  {
    id: 2,
    nome: 'Ana Gerente',
    cpf: '22222222222',
    dataNascimento: '1986-02-28',
    codigo: 'CX002',
    salario: 3200.00,
    totalVendido: 8930.75,
    ativo: true,
  },
];

export const mockUsuarios = [
  {
    id: 1,
    nome: 'Admin User',
    cpf: '33333333333',
    dataNascimento: '1980-01-01',
    email: 'admin@cervejaria.com',
    papel: 'ADMIN',
    ativo: true,
  },
  {
    id: 2,
    nome: 'Gerente Shop',
    cpf: '44444444444',
    dataNascimento: '1985-06-15',
    email: 'gerente@cervejaria.com',
    papel: 'GERENTE',
    ativo: true,
  },
  {
    id: 3,
    nome: 'Usuário Normal',
    cpf: '55555555555',
    dataNascimento: '1992-12-20',
    email: 'usuario@cervejaria.com',
    papel: 'USUARIO',
    ativo: true,
  },
];

const delay = (ms = 5) => new Promise(resolve => setTimeout(resolve, ms));

export const createMockService = (name, mockData) => {
  let data = JSON.parse(JSON.stringify(mockData));
  let nextId = Math.max(...data.map(item => item.id || 0)) + 1;

  return {
    getAll: async () => {
      await delay();
      return { data };
    },
    getById: async (id) => {
      await delay();
      const item = data.find(d => d.id === parseInt(id));
      if (!item) throw new Error(`${name} com ID ${id} não encontrado`);
      return { data: item };
    },
    create: async (item) => {
      await delay();
      const newItem = { ...item, id: nextId++ };
      data.push(newItem);
      return { data: newItem };
    },
    update: async (id, item) => {
      await delay();
      const index = data.findIndex(d => d.id === parseInt(id));
      if (index === -1) throw new Error(`${name} com ID ${id} não encontrado`);
      data[index] = { ...item, id: parseInt(id) };
      return { data: data[index] };
    },
    delete: async (id) => {
      await delay();
      const index = data.findIndex(d => d.id === parseInt(id));
      if (index === -1) throw new Error(`${name} com ID ${id} não encontrado`);
      data.splice(index, 1);
      return { data: { success: true } };
    },
  };
};
