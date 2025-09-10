import { Project, DataSource, Table, Field, ApiInterface, InterfaceCategory } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: '电商平台API',
    description: '电商平台核心业务API接口设计',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: '用户管理系统',
    description: '企业级用户权限管理系统API',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: '内容管理平台',
    description: 'CMS内容发布和管理API',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    status: 'inactive'
  }
];

export const mockDataSources: DataSource[] = [
  {
    id: '1',
    projectId: '1',
    name: '主数据库',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: 'ecommerce',
    username: 'root',
    password: '******',
    status: 'connected',
    createdAt: '2024-01-15T10:35:00Z'
  },
  {
    id: '2',
    projectId: '1',
    name: '用户数据库',
    type: 'postgresql',
    host: 'pg.example.com',
    port: 5432,
    database: 'users',
    username: 'postgres',
    password: '******',
    status: 'connected',
    createdAt: '2024-01-16T14:20:00Z'
  }
];

export const mockTables: Table[] = [
  {
    id: '1',
    name: 'users',
    dataSourceId: '1',
    comment: '用户信息表',
    fields: [
      {
        id: '1',
        name: 'id',
        type: 'bigint',
        nullable: false,
        isPrimaryKey: true,
        isForeignKey: false,
        comment: '用户ID'
      },
      {
        id: '2',
        name: 'username',
        type: 'varchar',
        length: 50,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '用户名'
      },
      {
        id: '3',
        name: 'email',
        type: 'varchar',
        length: 100,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '邮箱地址'
      },
      {
        id: '4',
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '创建时间'
      }
    ]
  },
  {
    id: '2',
    name: 'products',
    dataSourceId: '1',
    comment: '商品信息表',
    fields: [
      {
        id: '5',
        name: 'id',
        type: 'bigint',
        nullable: false,
        isPrimaryKey: true,
        isForeignKey: false,
        comment: '商品ID'
      },
      {
        id: '6',
        name: 'name',
        type: 'varchar',
        length: 200,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '商品名称'
      },
      {
        id: '7',
        name: 'price',
        type: 'decimal',
        length: 10,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '商品价格'
      },
      {
        id: '8',
        name: 'user_id',
        type: 'bigint',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: true,
        comment: '创建用户ID'
      }
    ]
  },
  {
    id: '3',
    name: 'orders',
    dataSourceId: '1',
    comment: '订单信息表',
    fields: [
      {
        id: '9',
        name: 'id',
        type: 'bigint',
        nullable: false,
        isPrimaryKey: true,
        isForeignKey: false,
        comment: '订单ID'
      },
      {
        id: '10',
        name: 'order_no',
        type: 'varchar',
        length: 50,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '订单号'
      },
      {
        id: '11',
        name: 'total_amount',
        type: 'decimal',
        length: 10,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '订单总金额'
      },
      {
        id: '12',
        name: 'user_id',
        type: 'bigint',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: true,
        comment: '用户ID'
      },
      {
        id: '13',
        name: 'status',
        type: 'varchar',
        length: 20,
        nullable: false,
        defaultValue: 'pending',
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '订单状态'
      }
    ]
  }
];

export const mockCategories: InterfaceCategory[] = [
  {
    id: '1',
    projectId: '1',
    name: '用户管理',
    description: '用户相关的API接口'
  },
  {
    id: '2',
    projectId: '1',
    name: '商品管理',
    description: '商品相关的API接口'
  },
  {
    id: '3',
    projectId: '1',
    name: '订单管理',
    description: '订单相关的API接口'
  }
];

export const mockInterfaces: ApiInterface[] = [
  {
    id: '1',
    projectId: '1',
    categoryId: '1',
    name: '获取用户信息',
    path: '/api/users/{id}',
    method: 'GET',
    description: '根据用户ID获取用户详细信息',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    projectId: '1',
    categoryId: '1',
    name: '创建用户',
    path: '/api/users',
    method: 'POST',
    description: '创建新用户账户',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-18T13:45:00Z'
  }
];