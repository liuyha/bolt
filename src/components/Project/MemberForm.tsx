import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { ProjectMember } from '../../types';

interface MemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProjectMember, 'id' | 'joinedAt'>) => void;
  title: string;
  projectId: string;
  initialData?: ProjectMember;
}

export function MemberForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  projectId, 
  initialData 
}: MemberFormProps) {
  const [formData, setFormData] = useState({
    projectId,
    userId: '',
    username: '',
    email: '',
    role: 'member' as const,
    status: 'active' as const
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectId: initialData.projectId,
        userId: initialData.userId,
        username: initialData.username,
        email: initialData.email,
        role: initialData.role,
        status: initialData.status
      });
    } else {
      setFormData({
        projectId,
        userId: '',
        username: '',
        email: '',
        role: 'member',
        status: 'active'
      });
    }
  }, [initialData, isOpen, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            用户名 *
          </label>
          <input
            type="text"
            id="username"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value, userId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入用户名"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址 *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入邮箱地址"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            角色权限 *
          </label>
          <select
            id="role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="member">成员</option>
            <option value="admin">管理员</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            管理员可以管理项目设置和成员，成员只能查看和编辑接口
          </p>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            状态
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">活跃</option>
            <option value="inactive">禁用</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit">
            {initialData ? '更新成员' : '添加成员'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}