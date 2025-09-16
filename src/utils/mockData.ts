import { Project, DataSource, ApiInterface, InterfaceCategory, Table, Field } from '../types';

export const mockProjects: Project[] = [
  {
    projectId: 1,
    name: '电商平台API',
    description: '电商平台的核心API接口设计',
    state: 'active',
    memberTotal: 5,
    belongRole: 'owner',
    administrators: '张三',
    createdTime: '2024-01-15T08:00:00.000Z'
  },
  {
    projectId: 2,
    name: '用户管理系统',
    description: '企业用户管理系统API',
    state: 'active',
    memberTotal: 3,
    belongRole: 'admin',
    administrators: '李四',
    createdTime: '2024-02-01T09:30:00.000Z'
  },
  {
    projectId: 3,
    name: '支付网关',
    description: '统一支付网关接口',
    state: 'inactive',
    memberTotal: 8,
    belongRole: 'member',
    administrators: '王五',
    createdTime: '2024-01-20T14:15:00.000Z'
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
    createdAt: '2024-01-15T08:30:00.000Z',
    typeMappings: [
      { id: '1', dbType: 'varchar', codeType: 'string', language: 'typescript' },
      { id: '2', dbType: 'int', codeType: 'number', language: 'typescript' },
      { id: '3', dbType: 'timestamp', codeType: 'Date', language: 'typescript' }
    ]
  },
  {
    id: '2',
    projectId: '2',
    name: '用户数据库',
    type: 'postgresql',
    host: '192.168.1.100',
    port: 5432,
    database: 'users',
    username: 'postgres',
    password: '******',
    status: 'connected',
    createdAt: '2024-02-01T10:00:00.000Z'
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
    role: 'owner',
    name: '商品管理',
    description: '商品相关的API接口'
  },
  {
    id: '4',
    projectId: '1',
    userId: 'user4',
    username: '赵六',
    email: 'zhaoliu@example.com',
    role: 'member',
    joinedAt: '2024-01-17T16:30:00Z',
    status: 'active'
  },
  {
    id: '3',
    projectId: '2',
    name: '权限管理',
    description: '权限相关的API接口'
  },
  {
    id: '4',
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
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z'
  },
  {
    id: '2',
    projectId: '1',
    categoryId: '1',
    name: '创建用户',
    path: '/api/users',
    method: 'POST',
    description: '创建新用户',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T09:15:00.000Z',
    updatedAt: '2024-01-15T09:15:00.000Z'
  },
  {
    id: '3',
    projectId: '1',
    categoryId: '2',
    name: '获取商品列表',
    path: '/api/products',
    method: 'GET',
    description: '分页获取商品列表',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '4',
    projectId: '1',
    categoryId: '1',
    name: '更新用户信息',
    path: '/api/users/{id}',
    method: 'PUT',
    description: '更新指定用户的信息',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: '5',
    projectId: '1',
    categoryId: '1',
    name: '删除用户',
    path: '/api/users/{id}',
    method: 'DELETE',
    description: '删除指定用户',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T11:00:00.000Z',
    updatedAt: '2024-01-15T11:00:00.000Z'
  },
  {
    id: '6',
    projectId: '1',
    categoryId: '2',
    name: '创建商品',
    path: '/api/products',
    method: 'POST',
    description: '创建新商品',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T11:30:00.000Z',
    updatedAt: '2024-01-15T11:30:00.000Z'
  },
  {
    id: '7',
    projectId: '1',
    categoryId: '2',
    name: '获取商品详情',
    path: '/api/products/{id}',
    method: 'GET',
    description: '根据商品ID获取商品详细信息',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z'
  },
  {
    id: '8',
    projectId: '1',
    categoryId: '3',
    name: '创建订单',
    path: '/api/orders',
    method: 'POST',
    description: '创建新订单',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T12:30:00.000Z',
    updatedAt: '2024-01-15T12:30:00.000Z'
  },
  {
    id: '9',
    projectId: '1',
    categoryId: '3',
    name: '获取订单列表',
    path: '/api/orders',
    method: 'GET',
    description: '获取用户订单列表',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T13:00:00.000Z',
    updatedAt: '2024-01-15T13:00:00.000Z'
  },
  {
    id: '10',
    projectId: '1',
    categoryId: '3',
    name: '取消订单',
    path: '/api/orders/{id}/cancel',
    method: 'PUT',
    description: '取消指定订单',
    requestParams: [],
    responseParams: [],
    createdAt: '2024-01-15T13:30:00.000Z',
    updatedAt: '2024-01-15T13:30:00.000Z'
  }
];

export const mockTables: Table[] = [
  {
    id: '1',
    name: 'users',
    comment: '用户表',
    fields: [
      {
        id: '1',
        name: 'id',
        type: 'bigint',
        length: 20,
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
        name: 'phone',
        type: 'varchar',
        length: 20,
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '手机号码'
      },
      {
        id: '5',
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '创建时间'
      },
      {
        id: '6',
        name: 'updated_at',
        type: 'timestamp',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '更新时间'
      }
    ]
  },
  {
    id: '2',
    name: 'products',
    comment: '商品表',
    fields: [
      {
        id: '7',
        name: 'id',
        type: 'bigint',
        length: 20,
        nullable: false,
        isPrimaryKey: true,
        isForeignKey: false,
        comment: '商品ID'
      },
      {
        id: '8',
        name: 'name',
        type: 'varchar',
        length: 200,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '商品名称'
      },
      {
        id: '9',
        name: 'description',
        type: 'text',
        nullable: true,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '商品描述'
      },
      {
        id: '10',
        name: 'price',
        type: 'decimal',
        length: 10,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '商品价格'
      },
      {
        id: '11',
        name: 'category_id',
        type: 'bigint',
        length: 20,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: true,
        comment: '分类ID'
      },
      {
        id: '12',
        name: 'stock',
        type: 'int',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '库存数量'
      },
      {
        id: '13',
        name: 'status',
        type: 'varchar',
        length: 20,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '商品状态'
      },
      {
        id: '14',
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '创建时间'
      }
    ]
  },
  {
    id: '3',
    name: 'orders',
    comment: '订单表',
    fields: [
      {
        id: '15',
        name: 'id',
        type: 'bigint',
        length: 20,
        nullable: false,
        isPrimaryKey: true,
        isForeignKey: false,
        comment: '订单ID'
      },
      {
        id: '16',
        name: 'user_id',
        type: 'bigint',
        length: 20,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: true,
        comment: '用户ID'
      },
      {
        id: '17',
        name: 'order_no',
        type: 'varchar',
        length: 50,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '订单号'
      },
      {
        id: '18',
        name: 'total_amount',
        type: 'decimal',
        length: 10,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '订单总金额'
      },
      {
        id: '19',
        name: 'status',
        type: 'varchar',
        length: 20,
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '订单状态'
      },
      {
        id: '20',
        name: 'created_at',
        type: 'timestamp',
        nullable: false,
        isPrimaryKey: false,
        isForeignKey: false,
        comment: '创建时间'
      }
    ]
  }
];