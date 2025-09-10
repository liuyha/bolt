import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { Button } from '../Common/Button';
import { DataSource, TypeMapping } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface TypeMappingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (typeMappings: TypeMapping[]) => void;
  dataSource: DataSource;
}

export function TypeMappingForm({ isOpen, onClose, onSubmit, dataSource }: TypeMappingFormProps) {
  const [typeMappings, setTypeMappings] = useState<TypeMapping[]>([]);

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
      const existingMappings = dataSource.typeMappings || [];
      if (existingMappings.length === 0) {
        setTypeMappings(getDefaultMappings(dataSource.type));
      } else {
        setTypeMappings(existingMappings);
      }
    }
  }, [isOpen, dataSource]);

  const handleAddMapping = () => {
    const newMapping: TypeMapping = {
      id: Date.now().toString(),
      dbType: '',
      codeType: '',
      language: 'typescript'
    };
    setTypeMappings([...typeMappings, newMapping]);
  };

  const handleUpdateMapping = (id: string, field: keyof TypeMapping, value: string) => {
    setTypeMappings(typeMappings.map(mapping => 
      mapping.id === id ? { ...mapping, [field]: value } : mapping
    ));
  };

  const handleDeleteMapping = (id: string) => {
    setTypeMappings(typeMappings.filter(mapping => mapping.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(typeMappings);
  };

  const handleResetToDefaults = () => {
    if (confirm('确定要重置为默认类型映射吗？这将覆盖当前的所有配置。')) {
      setTypeMappings(getDefaultMappings(dataSource.type));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${dataSource.name} - 类型映射配置`} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              配置 {dataSource.type.toUpperCase()} 数据库字段类型到代码类型的映射关系
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleResetToDefaults}>
              重置为默认
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddMapping}>
              <Plus className="w-4 h-4 mr-1" />
              添加映射
            </Button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">数据库类型</div>
              <div className="col-span-3">代码类型</div>
              <div className="col-span-3">编程语言</div>
              <div className="col-span-2">示例</div>
              <div className="col-span-1">操作</div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {typeMappings.map((mapping, index) => (
              <div key={mapping.id} className={`px-4 py-3 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={mapping.dbType}
                      onChange={(e) => handleUpdateMapping(mapping.id, 'dbType', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="varchar, int, text..."
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={mapping.codeType}
                      onChange={(e) => handleUpdateMapping(mapping.id, 'codeType', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      placeholder="string, number, boolean..."
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={mapping.language}
                      onChange={(e) => handleUpdateMapping(mapping.id, 'language', e.target.value)}
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
                      onClick={() => handleDeleteMapping(mapping.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {typeMappings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>暂无类型映射配置</p>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddMapping} className="mt-2">
              <Plus className="w-4 h-4 mr-1" />
              添加第一个映射
            </Button>
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
            保存配置
          </Button>
        </div>
      </form>
    </Modal>
  );
}