import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Globe, Edit, Trash2, FolderPlus, Folder, ChevronRight } from 'lucide-react';
import { ApiInterface, InterfaceCategory } from '../../types';
import { Button } from '../Common/Button';
import { InterfaceForm } from './InterfaceForm';
import { CategoryForm } from './CategoryForm';

interface InterfaceListProps {
  interfaces: ApiInterface[];
  categories: InterfaceCategory[];
  onUpdateInterfaces: (interfaces: ApiInterface[]) => void;
  onUpdateCategories: (categories: InterfaceCategory[]) => void;
}

export function InterfaceList({ 
  interfaces, 
  categories, 
  onUpdateInterfaces, 
  onUpdateCategories 
}: InterfaceListProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingInterface, setEditingInterface] = useState<ApiInterface | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 过滤当前项目的接口和分类
  const projectInterfaces = interfaces.filter(iface => iface.projectId === projectId);
  const projectCategories = categories.filter(cat => cat.projectId === projectId);

  const filteredInterfaces = selectedCategory === 'all' 
    ? projectInterfaces 
    : projectInterfaces.filter(iface => iface.categoryId === selectedCategory);

  const handleCreateInterface = (interfaceData: Omit<ApiInterface, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInterface: ApiInterface = {
      ...interfaceData,
      projectId: projectId || '1',
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onUpdateInterfaces([...interfaces, newInterface]);
    setShowCreateModal(false);
  };

  const handleEditInterface = (interfaceData: Omit<ApiInterface, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingInterface) return;
    
    const updatedInterface: ApiInterface = {
      ...editingInterface,
      ...interfaceData,
      updatedAt: new Date().toISOString()
    };
    
    onUpdateInterfaces(interfaces.map(iface => iface.id === editingInterface.id ? updatedInterface : iface));
    setEditingInterface(null);
  };

  const handleDeleteInterface = (interfaceId: string) => {
    if (confirm('确定要删除这个接口吗？此操作不可恢复。')) {
      onUpdateInterfaces(interfaces.filter(iface => iface.id !== interfaceId));
    }
  };

  const handleCreateCategory = (categoryData: Omit<InterfaceCategory, 'id'>) => {
    const newCategory: InterfaceCategory = {
      ...categoryData,
      projectId: projectId || '1',
      id: Date.now().toString()
    };
    onUpdateCategories([...categories, newCategory]);
    setShowCategoryModal(false);
  };

  const getCategoryName = (categoryId: string) => {
    const category = projectCategories.find(cat => cat.id === categoryId);
    return category?.name || '未分类';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">接口管理</h2>
          <p className="text-gray-600 mt-1">设计和管理API接口</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowCategoryModal(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            新建分类
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新建接口
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">接口分类</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>全部接口</span>
                <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {projectInterfaces.length}
                </span>
              </button>
              
              {projectCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {projectInterfaces.filter(iface => iface.categoryId === category.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1">
          {filteredInterfaces.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无接口</h3>
              <p className="text-gray-600 mb-4">创建您的第一个API接口</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新建接口
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        接口信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        请求方式
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        路径
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        分类
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInterfaces.map((apiInterface) => (
                      <tr key={apiInterface.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Globe className="w-8 h-8 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{apiInterface.name}</div>
                              <div className="text-sm text-gray-500">{apiInterface.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(apiInterface.method)}`}>
                            {apiInterface.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{apiInterface.path}</code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getCategoryName(apiInterface.categoryId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/project/${projectId}/interface-designer/${apiInterface.id}`)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="设计接口"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingInterface(apiInterface)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteInterface(apiInterface.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <InterfaceForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateInterface}
        categories={projectCategories}
        title="新建接口"
      />

      {editingInterface && (
        <InterfaceForm
          isOpen={true}
          onClose={() => setEditingInterface(null)}
          onSubmit={handleEditInterface}
          categories={projectCategories}
          title="编辑接口"
          initialData={editingInterface}
        />
      )}

      <CategoryForm
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={handleCreateCategory}
        title="新建分类"
      />
    </div>
  );
}