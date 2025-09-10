import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { ApiInterface, InterfaceCategory } from '../../types';

interface InterfaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ApiInterface, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: InterfaceCategory[];
  title: string;
  initialData?: ApiInterface;
}

export function InterfaceForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories, 
  title, 
  initialData 
}: InterfaceFormProps) {
  const [formData, setFormData] = useState({
    projectId: '1',
    categoryId: '',
    name: '',
    path: '',
    method: 'GET' as const,
    description: '',
    requestParams: [],
    responseParams: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectId: initialData.projectId,
        categoryId: initialData.categoryId,
        name: initialData.name,
        path: initialData.path,
        method: initialData.method,
        description: initialData.description,
        requestParams: initialData.requestParams,
        responseParams: initialData.responseParams
      });
    } else {
      setFormData({
        projectId: '1',
        categoryId: categories[0]?.id || '',
        name: '',
        path: '',
        method: 'GET',
        description: '',
        requestParams: [],
        responseParams: []
      });
    }
  }, [initialData, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              接口名称 *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入接口名称"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              接口分类 *
            </label>
            <select
              id="category"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">请选择分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
              请求方式 *
            </label>
            <select
              id="method"
              required
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value as ApiInterface['method'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="col-span-2">
            <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-2">
              接口路径 *
            </label>
            <input
              type="text"
              id="path"
              required
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="/api/users/{id}"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            接口描述
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="请输入接口描述"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit">
            {initialData ? '更新接口' : '创建接口'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}