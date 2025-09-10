import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { DataSource, TypeMapping } from '../../types';
import { Plus, Trash2, Database } from 'lucide-react';

interface GlobalTypeMappingFormProps {
  isOpen: boolean;
  onClose: () => void;
  dataSources: DataSource[];
  onUpdateDataSources: (dataSources: DataSource[]) => void;
}

export function GlobalTypeMappingForm({ 
  isOpen, 
  onClose, 
  dataSources, 
  onUpdateDataSources 
}: GlobalTypeMappingFormProps) {
  const [allTypeMappings, setAllTypeMappings] = useState<{[dataSourceId: string]: TypeMapping[]}>({});

  // 默认类型映射配置
  const getDefaultMappings = (dbType: DataSource['type']): TypeMapping[] => {
    switch (dbType) {
      case 'mysql':
        return [
          { id: '1', dbType: 'varchar', codeType: 'string', language: 'typescript' },
          { id: '2', dbType: 'int', codeType: 'number', language: 'typescript' },
          { id: '3', dbType: 'bigint', codeType: 'number', language: 'typescript' },
          { id: '4', dbType: 'decimal', codeType: 'number', language: 'typescript' },
          { id: '5', dbType: 'text', codeType: 'string', language: 'typescript' },
          { id: '6', dbType: 'timestamp', codeType: 'Date', language: 'typescript' },
          { id: '7', dbType: 'datetime', codeType: 'Date', language: 'typescript' },
          { id: '8', dbType: 'boolean', codeType: 'boolean', language: 'typescript' },
        ];
      case 'postgresql':
        return [
          { id: '1', dbType: 'varchar', codeType: 'string', language: 'typescript' },
          { id: '2', dbType: 'integer', codeType: 'number', language: 'typescript' },
          { id: '3', dbType: 'bigint', codeType: 'number', language: 'typescript' },
          { id: '4', dbType: 'numeric', codeType: 'number', language: 'typescript' },
          { id: '5', dbType: 'text', codeType: 'string', language: 'typescript' },
          { id: '6', dbType: 'timestamp', codeType: 'Date', language: 'typescript' },
          { id: '7', dbType: 'timestamptz', codeType: 'Date', language: 'typescript' },
          { id: '8', dbType: 'boolean', codeType: 'boolean', language: 'typescript' },
          { id: '9', dbType: 'uuid', codeType: 'string', language: 'typescript' },
        ];
      case 'sqlite':
        return [
          { id: '1', dbType: 'TEXT', codeType: 'string', language: 'typescript' },
          { id: '2', dbType: 'INTEGER', codeType: 'number', language: 'typescript' },
          { id: '3', dbType: 'REAL', codeType: 'number', language: 'typescript' },
          { id: '4', dbType: 'BLOB', codeType: 'Uint8Array', language: 'typescript' },
        ];
      case 'oracle':
        return [
          { id: '1', dbType: 'VARCHAR2', codeType: 'string', language: 'typescript' },
          { id: '2', dbType: 'NUMBER', codeType: 'number', language: 'typescript' },
          { id: '3', dbType: 'DATE', codeType: 'Date', language: 'typescript' },
          { id: '4', dbType: 'TIMESTAMP', codeType: 'Date', language: 'typescript' },
          { id: '5', dbType: 'CLOB', codeType: 'string', language: 'typescript' },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (isOpen) {
      const mappings: {[dataSourceId: string]: TypeMapping[]} = {};
      dataSources.forEach(ds => {
        mappings[ds.id] = ds.typeMappings || getDefaultMappings(ds.type);
      });
      setAllTypeMappings(mappings);
      // 默认选择第一个数据源
      if (dataSources.length > 0) {
        setSelectedDataSource(dataSources[0].id);
      }
    }
  }, [isOpen, dataSources]);

  const handleAddMapping = (dataSourceId: string) => {
    const newMapping: TypeMapping = {
      id: Date.now().toString(),
      dbType: '',
      codeType: '',
      language: 'typescript'
    };
    setAllTypeMappings(prev => ({
      ...prev,
      [dataSourceId]: [...(prev[dataSourceId] || []), newMapping]
    }));
  };

  const handleUpdateMapping = (dataSourceId: string, mappingId: string, field: keyof TypeMapping, value: string) => {
    setAllTypeMappings(prev => ({
      ...prev,
      [dataSourceId]: prev[dataSourceId].map(mapping => 
        mapping.id === mappingId ? { ...mapping, [field]: value } : mapping
      )
    }));
  };

  const handleDeleteMapping = (dataSourceId: string, mappingId: string) => {
    setAllTypeMappings(prev => ({
      ...prev,
      [dataSourceId]: prev[dataSourceId].filter(mapping => mapping.id !== mappingId)
    }));
  };

  const handleResetToDefaults = (dataSourceId: string, dbType: DataSource['type']) => {
    if (confirm('确定要重置为默认类型映射吗？这将覆盖当前的所有配置。')) {
      setAllTypeMappings(prev => ({
        ...prev,
        [dataSourceId]: getDefaultMappings(dbType)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedDataSources = dataSources.map(ds => ({
      ...ds,
      typeMappings: allTypeMappings[ds.id] || []
    }));
    
    onUpdateDataSources(updatedDataSources);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="全局类型配置" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-sm text-gray-600 mb-4">
          配置所有数据源的数据库字段类型到代码类型的映射关系
        </div>

        <div className="space-y-6">
          {dataSources.map((dataSource) => (
            <div key={dataSource.id} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">{dataSource.name}</h4>
                    <p className="text-sm text-gray-600">{dataSource.type.toUpperCase()} - {dataSource.host}:{dataSource.port}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleResetToDefaults(dataSource.id, dataSource.type)}
                  >
                    重置默认
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleAddMapping(dataSource.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加映射
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-12 gap-4 mb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">数据库类型</div>
                  <div className="col-span-3">代码类型</div>
                  <div className="col-span-3">编程语言</div>
                  <div className="col-span-2">示例</div>
                  <div className="col-span-1">操作</div>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {(allTypeMappings[dataSource.id] || []).map((mapping, index) => (
                    <div key={mapping.id} className={`grid grid-cols-12 gap-4 items-center p-2 rounded ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={mapping.dbType}
                          onChange={(e) => handleUpdateMapping(dataSource.id, mapping.id, 'dbType', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="varchar, int, text..."
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={mapping.codeType}
                          onChange={(e) => handleUpdateMapping(dataSource.id, mapping.id, 'codeType', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          placeholder="string, number, boolean..."
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={mapping.language}
                          onChange={(e) => handleUpdateMapping(dataSource.id, mapping.id, 'language', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="typescript">TypeScript</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                          <option value="csharp">C#</option>
                          <option value="python">Python</option>
                          <option value="go">Go</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {mapping.dbType} → {mapping.codeType}
                        </code>
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => handleDeleteMapping(dataSource.id, mapping.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {(allTypeMappings[dataSource.id] || []).length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>暂无类型映射配置</p>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => handleAddMapping(dataSource.id)} 
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加第一个映射
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {dataSources.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>暂无数据源</p>
            <p className="text-sm">请先添加数据源后再配置类型映射</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">使用说明</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 数据库类型：输入数据库中的字段类型，如 varchar、int、timestamp 等</li>
            <li>• 代码类型：对应的编程语言类型，如 string、number、Date 等</li>
            <li>• 编程语言：选择目标编程语言，影响代码生成的类型定义</li>
            <li>• 系统会根据这些映射关系自动生成相应的接口代码</li>
          </ul>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit">
            保存所有配置
          </Button>
        </div>
      </form>
    </Modal>
  );
}