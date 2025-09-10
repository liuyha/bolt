import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { DataSource } from '../../types';

interface DataSourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DataSource, 'id' | 'createdAt'>) => void;
  title: string;
  initialData?: DataSource;
}

export function DataSourceForm({ isOpen, onClose, onSubmit, title, initialData }: DataSourceFormProps) {
  const [formData, setFormData] = useState({
    projectId: '1', // 当前项目ID
    name: '',
    type: 'mysql' as const,
    host: '',
    port: 3306,
    database: '',
    username: '',
    password: '',
    status: 'disconnected' as const
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectId: initialData.projectId,
        name: initialData.name,
        type: initialData.type,
        host: initialData.host,
        port: initialData.port,
        database: initialData.database,
        username: initialData.username,
        password: initialData.password,
        status: initialData.status
      });
    } else {
      setFormData({
        projectId: '1',
        name: '',
        type: 'mysql',
        host: '',
        port: 3306,
        database: '',
        username: '',
        password: '',
        status: 'disconnected'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTypeChange = (type: DataSource['type']) => {
    const defaultPorts = {
      mysql: 3306,
      postgresql: 5432,
      sqlite: 0,
      oracle: 1521
    };
    
    setFormData({
      ...formData,
      type,
      port: defaultPorts[type]
    });
  };

  const handleTestConnection = () => {
    // 模拟连接测试
    setFormData({ ...formData, status: 'connected' });
    alert('连接测试成功！');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              数据源名称 *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入数据源名称"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              数据库类型 *
            </label>
            <select
              id="type"
              required
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value as DataSource['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
              <option value="oracle">Oracle</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-2">
              主机地址 *
            </label>
            <input
              type="text"
              id="host"
              required
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="localhost 或 IP地址"
            />
          </div>

          <div>
            <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-2">
              端口号 *
            </label>
            <input
              type="number"
              id="port"
              required
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="database" className="block text-sm font-medium text-gray-700 mb-2">
            数据库名称 *
          </label>
          <input
            type="text"
            id="database"
            required
            value={formData.database}
            onChange={(e) => setFormData({ ...formData, database: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入数据库名称"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              用户名 *
            </label>
            <input
              type="text"
              id="username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="数据库用户名"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密码 *
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="数据库密码"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button 
            variant="secondary" 
            onClick={handleTestConnection}
            disabled={!formData.host || !formData.database || !formData.username}
          >
            测试连接
          </Button>
          
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              取消
            </Button>
            <Button type="submit">
              {initialData ? '更新数据源' : '添加数据源'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}