import { Project, DataSource, ApiInterface, InterfaceCategory } from '../types';

export const mockProjects: Project[] = [
  {
    projectId: 1,
    name: '电商平台API',
    description: '电商平台的核心API接口设计',
    state: 'active',
    memberTotal: 8,
    belongRole: 'owner',
    administrators: 'admin1,admin2',
    createdTime: '2024-01-15T08:00:00.000Z'
  },
  {
    projectId: 2,
    name: '用户管理系统',
    description: '企业级用户管理系统API',
    state: 'active',
    memberTotal: 5,
    belongRole: 'admin',
    administrators: 'admin3',
    createdTime: '2024-02-01T10:30:00.000Z'
  },
  {
    projectId: 3,
    name: '支付网关',
    description: '统一支付网关接口设计',
    state: 'inactive',
    memberTotal: 12,
    belongRole: 'member',
    administrators: 'admin4,admin5',
    createdTime: '2024-01-20T14:15:00.000Z'
  }
];

export const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: '主数据库',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'ecommerce',
    username: 'root',
    description: '电商平台主数据库',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: '2',
    name: '缓存数据库',
    type: 'redis',
    host: 'localhost',
    port: 6379,
    database: '0',
    username: '',
    description: 'Redis缓存数据库',
    createdAt: '2024-01-16T09:00:00.000Z',
    updatedAt: '2024-01-16T09:00:00.000Z'
  }
];

export const mockCategories: InterfaceCategory[] = [
  {
    id: '1',
    name: '用户管理',
    description: '用户相关的API接口',
    projectId: '1',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: '2',
    name: '商品管理',
    description: '商品相关的API接口',
    projectId: '1',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: '3',
    name: '订单管理',
    description: '订单相关的API接口',
    projectId: '1',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  }
];

export const mockInterfaces: ApiInterface[] = [
  {
    id: '1',
    name: '用户登录',
    path: '/api/user/login',
    method: 'POST',
    description: '用户登录接口',
    categoryId: '1',
    projectId: '1',
    status: 'published',
    requestBody: {
      type: 'object',
      properties: {
        username: { type: 'string', description: '用户名' },
        password: { type: 'string', description: '密码' }
      },
      required: ['username', 'password']
    },
    responseBody: {
      type: 'object',
      properties: {
        code: { type: 'number', description: '状态码' },
        message: { type: 'string', description: '消息' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string', description: '访问令牌' },
            userInfo: {
              type: 'object',
              properties: {
                id: { type: 'number', description: '用户ID' },
                username: { type: 'string', description: '用户名' },
                email: { type: 'string', description: '邮箱' }
              }
            }
          }
        }
      }
    },
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  },
  {
    id: '2',
    name: '获取商品列表',
    path: '/api/products',
    method: 'GET',
    description: '获取商品列表接口',
    categoryId: '2',
    projectId: '1',
    status: 'published',
    queryParams: [
      { name: 'page', type: 'number', description: '页码', required: false },
      { name: 'size', type: 'number', description: '每页数量', required: false },
      { name: 'category', type: 'string', description: '商品分类', required: false }
    ],
    responseBody: {
      type: 'object',
      properties: {
        code: { type: 'number', description: '状态码' },
        message: { type: 'string', description: '消息' },
        data: {
          type: 'object',
          properties: {
            total: { type: 'number', description: '总数' },
            list: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', description: '商品ID' },
                  name: { type: 'string', description: '商品名称' },
                  price: { type: 'number', description: '价格' },
                  category: { type: 'string', description: '分类' }
                }
              }
            }
          }
        }
      }
    },
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z'
  }
];