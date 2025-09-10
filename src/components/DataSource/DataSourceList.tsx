import React, { useState } from 'react';
import { Plus, Database, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Settings, Code } from 'lucide-react';
import { DataSource } from '../../types';
import { Button } from '../Common/Button';
import { DataSourceForm } from './DataSourceForm';
import { TypeMappingForm } from './TypeMappingForm';
import { GlobalTypeMappingForm } from './GlobalTypeMappingForm';

interface DataSourceListProps {
  dataSources: DataSource[];
  onUpdateDataSources: (dataSources: DataSource[]) => void;
}

export function DataSourceList({ dataSources, onUpdateDataSources }: DataSourceListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(null);
  const [configuringTypeMapping, setConfiguringTypeMapping] = useState<DataSource | null>(null);
  const [showGlobalTypeMapping, setShowGlobalTypeMapping] = useState(false);

  const handleCreateDataSource = (dataSourceData: Omit<DataSource, 'id' | 'createdAt'>) => {
    const newDataSource: DataSource = {
      ...dataSourceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    onUpdateDataSources([...dataSources, newDataSource]);
    setShowCreateModal(false);
  };

  const handleEditDataSource = (dataSourceData: Omit<DataSource, 'id' | 'createdAt'>) => {
    if (!editingDataSource) return;
    
    const updatedDataSource: DataSource = {
      ...editingDataSource,
      ...dataSourceData
    };
    
    onUpdateDataSources(dataSources.map(ds => ds.id === editingDataSource.id ? updatedDataSource : ds));
    setEditingDataSource(null);
  };

  const handleDeleteDataSource = (dataSourceId: string) => {
    if (confirm('确定要删除这个数据源吗？相关的接口配置可能会受到影响。')) {
      onUpdateDataSources(dataSources.filter(ds => ds.id !== dataSourceId));
    }
  };

  const handleUpdateTypeMapping = (dataSourceId: string, typeMappings: any) => {
    const updatedDataSource = dataSources.find(ds => ds.id === dataSourceId);
    if (updatedDataSource) {
      const newDataSource = {
        ...updatedDataSource,
        typeMappings
      };
      onUpdateDataSources(dataSources.map(ds => ds.id === dataSourceId ? newDataSource : ds));
    }
    setConfiguringTypeMapping(null);
  };

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return '已连接';
      case 'disconnected':
        return '未连接';
      case 'error':
        return '连接错误';
    }
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">数据源管理</h2>
          <p className="text-gray-600 mt-1">管理项目的数据库连接和DDL信息</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowGlobalTypeMapping(true)}>
            <Code className="w-4 h-4 mr-2" />
            类型配置
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            添加数据源
          </Button>
        </div>
      </div>

      {dataSources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据源</h3>
          <p className="text-gray-600 mb-4">添加数据库连接以开始设计API接口</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            添加数据源
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数据源信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    连接信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataSources.map((dataSource) => (
                  <tr key={dataSource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Database className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{dataSource.name}</div>
                          <div className="text-sm text-gray-500">{dataSource.type.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dataSource.host}:{dataSource.port}</div>
                      <div className="text-sm text-gray-500">{dataSource.database}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(dataSource.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dataSource.status)}`}>
                          {getStatusText(dataSource.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(dataSource.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfiguringTypeMapping(dataSource)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                          title="类型配置"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingDataSource(dataSource)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDataSource(dataSource.id)}
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

      <DataSourceForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDataSource}
        title="添加数据源"
      />

      <GlobalTypeMappingForm
        isOpen={showGlobalTypeMapping}
        onClose={() => setShowGlobalTypeMapping(false)}
        dataSources={dataSources}
        onUpdateDataSources={onUpdateDataSources}
      />

      {editingDataSource && (
        <DataSourceForm
          isOpen={true}
          onClose={() => setEditingDataSource(null)}
          onSubmit={handleEditDataSource}
          title="编辑数据源"
          initialData={editingDataSource}
        />
      )}

      {configuringTypeMapping && (
        <TypeMappingForm
          isOpen={true}
          onClose={() => setConfiguringTypeMapping(null)}
          onSubmit={(typeMappings) => handleUpdateTypeMapping(configuringTypeMapping.id, typeMappings)}
          dataSource={configuringTypeMapping}
        />
      )}
    </div>
  );
}