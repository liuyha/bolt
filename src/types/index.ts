export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: string;
  status: 'active' | 'inactive';
}

export interface DataSource {
  id: string;
  projectId: string;
  name: string;
  type: 'mysql' | 'postgresql' | 'sqlite' | 'oracle';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  status: 'connected' | 'disconnected' | 'error';
  createdAt: string;
}

export interface Table {
  id: string;
  name: string;
  dataSourceId: string;
  comment?: string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  defaultValue?: string;
  comment?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

export interface ApiInterface {
  id: string;
  projectId: string;
  categoryId: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  requestParams: SelectedField[];
  responseParams: SelectedField[];
  createdAt: string;
  updatedAt: string;
}

export interface InterfaceCategory {
  id: string;
  projectId: string;
  name: string;
  description: string;
  parentId?: string;
  children?: InterfaceCategory[];
}

export interface SelectedField {
  id: string;
  fieldId: string;
  tableId: string;
  dataSourceId: string;
  alias?: string;
  required: boolean;
  validation?: string;
}

export type ViewMode = 'projects' | 'workspace';
export type WorkspaceTab = 'datasources' | 'interfaces';