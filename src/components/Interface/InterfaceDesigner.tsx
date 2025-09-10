import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, Code, Download, Check, ChevronRight } from 'lucide-react';
import { ApiInterface, Table, Field } from '../../types';
import { Button } from '../Common/Button';
import { mockTables } from '../../utils/mockData';

interface InterfaceDesignerProps {
  interfaces: ApiInterface[];
  onUpdateInterfaces: (interfaces: ApiInterface[]) => void;
}

export function InterfaceDesigner({ interfaces, onUpdateInterfaces }: InterfaceDesignerProps) {
  const { projectId, interfaceId } = useParams<{ projectId: string; interfaceId: string }>();
  const navigate = useNavigate();
  
  const apiInterface = interfaces.find(iface => iface.id === interfaceId);
  
  if (!apiInterface) {
    return <div>接口不存在</div>;
  }

  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [selectedRequestFields, setSelectedRequestFields] = useState<{[key: string]: boolean}>({});
  const [selectedResponseFields, setSelectedResponseFields] = useState<{[key: string]: boolean}>({});
  const [requestMainTable, setRequestMainTable] = useState<string>('');
  const [responseMainTable, setResponseMainTable] = useState<string>('');
  const [tables] = useState<Table[]>(mockTables);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [expandedTables, setExpandedTables] = useState<{[key: string]: boolean}>({});

  const handleFieldToggle = (fieldId: string, type: 'request' | 'response') => {
    const setter = type === 'request' ? setSelectedRequestFields : setSelectedResponseFields;
    setter(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const handleTableToggle = (tableId: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId]
    }));
  };

  const getSelectedFields = () => {
    return activeTab === 'request' ? selectedRequestFields : selectedResponseFields;
  };

  const getMainTable = () => {
    return activeTab === 'request' ? requestMainTable : responseMainTable;
  };

  const setMainTable = (tableId: string) => {
    if (activeTab === 'request') {
      setRequestMainTable(tableId);
    } else {
      setResponseMainTable(tableId);
    }
  };

  const getSelectedFieldsByTable = () => {
    const selectedFields = getSelectedFields();
    const fieldsByTable: {[tableId: string]: Field[]} = {};
    
    Object.keys(selectedFields).forEach(fieldId => {
      if (selectedFields[fieldId]) {
        const table = tables.find(t => t.fields.some(f => f.id === fieldId));
        const field = table?.fields.find(f => f.id === fieldId);
        if (table && field) {
          if (!fieldsByTable[table.id]) {
            fieldsByTable[table.id] = [];
          }
          fieldsByTable[table.id].push(field);
        }
      }
    });
    
    return fieldsByTable;
  };

  const generateCode = () => {
    const requestFieldsByTable = getSelectedFieldsByTable();
    const responseFieldsByTable = getSelectedFieldsByTable();
    
    const generateJavaClass = (className: string, fieldsByTable: {[tableId: string]: Field[]}, mainTableId: string) => {
      const mainTable = tables.find(t => t.id === mainTableId);
      const mainFields = fieldsByTable[mainTableId] || [];
      const subTables = Object.keys(fieldsByTable).filter(tableId => tableId !== mainTableId);
      
      let classCode = `public class ${className} {\n`;
      
      // 主表字段
      mainFields.forEach(field => {
        const javaType = getJavaType(field.type);
        classCode += `    private ${javaType} ${field.name}; // ${field.comment || ''}\n`;
      });
      
      // 子表对象
      subTables.forEach(tableId => {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          const className = toPascalCase(table.name);
          classCode += `    private ${className} ${table.name}; // ${table.comment || ''}\n`;
        }
      });
      
      classCode += '\n    // Getters and Setters\n';
      
      // 主表字段的getter/setter
      mainFields.forEach(field => {
        const javaType = getJavaType(field.type);
        const fieldName = field.name;
        const methodName = toPascalCase(fieldName);
        
        classCode += `    public ${javaType} get${methodName}() { return ${fieldName}; }\n`;
        classCode += `    public void set${methodName}(${javaType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n`;
      });
      
      // 子表对象的getter/setter
      subTables.forEach(tableId => {
        const table = tables.find(t => t.id === tableId);
        if (table) {
          const className = toPascalCase(table.name);
          const fieldName = table.name;
          const methodName = toPascalCase(fieldName);
          
          classCode += `    public ${className} get${methodName}() { return ${fieldName}; }\n`;
          classCode += `    public void set${methodName}(${className} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n`;
        }
      });
      
      classCode += '}\n';
      return classCode;
    };
    
    const generateSubClasses = (fieldsByTable: {[tableId: string]: Field[]}, mainTableId: string) => {
      const subTables = Object.keys(fieldsByTable).filter(tableId => tableId !== mainTableId);
      let subClassesCode = '';
      
      subTables.forEach(tableId => {
        const table = tables.find(t => t.id === tableId);
        const fields = fieldsByTable[tableId] || [];
        
        if (table && fields.length > 0) {
          const className = toPascalCase(table.name);
          subClassesCode += `\n// ${table.comment || table.name}\n`;
          subClassesCode += `public class ${className} {\n`;
          
          fields.forEach(field => {
            const javaType = getJavaType(field.type);
            subClassesCode += `    private ${javaType} ${field.name}; // ${field.comment || ''}\n`;
          });
          
          subClassesCode += '\n    // Getters and Setters\n';
          
          fields.forEach(field => {
            const javaType = getJavaType(field.type);
            const fieldName = field.name;
            const methodName = toPascalCase(fieldName);
            
            subClassesCode += `    public ${javaType} get${methodName}() { return ${fieldName}; }\n`;
            subClassesCode += `    public void set${methodName}(${javaType} ${fieldName}) { this.${fieldName} = ${fieldName}; }\n`;
          });
          
          subClassesCode += '}\n';
        }
      });
      
      return subClassesCode;
    };
    
    const getJavaType = (dbType: string): string => {
      switch (dbType.toLowerCase()) {
        case 'varchar':
        case 'text':
          return 'String';
        case 'int':
        case 'integer':
          return 'Integer';
        case 'bigint':
          return 'Long';
        case 'decimal':
          return 'BigDecimal';
        case 'timestamp':
        case 'datetime':
          return 'Date';
        case 'boolean':
          return 'Boolean';
        default:
          return 'Object';
      }
    };
    
    const toPascalCase = (str: string): string => {
      return str.replace(/(^|_)([a-z])/g, (_, __, letter) => letter.toUpperCase());
    };
    
    const code = `
/**
 * ${apiInterface.name} - ${apiInterface.description}
 * ${apiInterface.method} ${apiInterface.path}
 */

${Object.keys(requestFieldsByTable).length > 0 ? generateJavaClass(
  toPascalCase(apiInterface.name.replace(/\s+/g, '')) + 'Request',
  requestFieldsByTable,
  requestMainTable
) : '// 请选择请求参数字段'}

${generateSubClasses(requestFieldsByTable, requestMainTable)}

${Object.keys(responseFieldsByTable).length > 0 ? generateJavaClass(
  toPascalCase(apiInterface.name.replace(/\s+/g, '')) + 'Response', 
  responseFieldsByTable,
  responseMainTable
) : '// 请选择响应参数字段'}

${generateSubClasses(responseFieldsByTable, responseMainTable)}

// Spring Boot Controller
@RestController
@RequestMapping("/api")
public class ${toPascalCase(apiInterface.name.replace(/\s+/g, ''))}Controller {
    
    @${apiInterface.method === 'GET' ? 'GetMapping' : apiInterface.method === 'POST' ? 'PostMapping' : apiInterface.method === 'PUT' ? 'PutMapping' : 'DeleteMapping'}("${apiInterface.path}")
    public ResponseEntity<${toPascalCase(apiInterface.name.replace(/\s+/g, '')) + 'Response'}> ${apiInterface.name.replace(/\s+/g, '').toLowerCase()}(
        ${apiInterface.method !== 'GET' ? `@RequestBody ${toPascalCase(apiInterface.name.replace(/\s+/g, '')) + 'Request'} request` : '@PathVariable Long id'}
    ) {
        try {
            // 业务逻辑处理
            ${toPascalCase(apiInterface.name.replace(/\s+/g, '')) + 'Response'} response = processRequest(${apiInterface.method !== 'GET' ? 'request' : 'id'});
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(false, e.getMessage()));
        }
    }
}
    `.trim();

    return code;
  };

  const handleSave = () => {
    const updatedInterface = {
      ...apiInterface,
      updatedAt: new Date().toISOString()
    };
    onUpdateInterfaces(interfaces.map(iface => 
      iface.id === apiInterface.id ? updatedInterface : iface
    ));
    navigate(`/project/${projectId}/interfaces`);
  };
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/project/${projectId}/interfaces`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回接口列表</span>
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{apiInterface.name}</h2>
          <p className="text-gray-600">{apiInterface.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              数据表和字段
            </h3>
            
            {/* 主表选择 */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                选择主表 ({activeTab === 'request' ? '请求' : '响应'}参数)
              </label>
              <select
                value={getMainTable()}
                onChange={(e) => setMainTable(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择主表</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name} {table.comment && `(${table.comment})`}
                  </option>
                ))}
              </select>
              <p className="text-xs text-blue-700 mt-1">
                主表字段将作为基类属性，其他表将封装为对象属性
              </p>
            </div>
            
            <div className="space-y-4">
              {tables.map((table) => (
                <div key={table.id} className={`border rounded-lg overflow-hidden ${
                  getMainTable() === table.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => handleTableToggle(table.id)}
                    className={`w-full px-4 py-3 border-b text-left hover:bg-gray-100 transition-colors flex items-center justify-between ${
                      getMainTable() === table.id 
                        ? 'bg-blue-100 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{table.name}</h4>
                        {getMainTable() === table.id && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">主表</span>
                        )}
                      </div>
                      {table.comment && (
                        <p className="text-sm text-gray-600">{table.comment}</p>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${
                      expandedTables[table.id] ? 'rotate-90' : ''
                    }`} />
                  </button>
                  
                  {expandedTables[table.id] && (
                    <div className="p-4">
                      <div className="space-y-2">
                        {table.fields.map((field) => (
                          <label
                            key={field.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={getSelectedFields()[field.id] || false}
                              onChange={() => handleFieldToggle(field.id, activeTab)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">{field.name}</span>
                                {field.isPrimaryKey && (
                                  <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">PK</span>
                                )}
                                {field.isForeignKey && (
                                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded">FK</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {field.type}{field.length ? `(${field.length})` : ''} 
                                {!field.nullable && ' NOT NULL'}
                                {field.comment && ` - ${field.comment}`}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-8">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('request')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'request'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  请求参数设计
                  {Object.keys(selectedRequestFields).filter(fieldId => selectedRequestFields[fieldId]).length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {Object.keys(selectedRequestFields).filter(fieldId => selectedRequestFields[fieldId]).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('response')}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === 'response'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  响应参数设计
                  {Object.keys(selectedResponseFields).filter(fieldId => selectedResponseFields[fieldId]).length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {Object.keys(selectedResponseFields).filter(fieldId => selectedResponseFields[fieldId]).length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'request' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">请求参数配置</h4>
                    {requestMainTable && (
                      <div className="text-sm text-blue-600">
                        主表: {tables.find(t => t.id === requestMainTable)?.name}
                      </div>
                    )}
                  </div>
                  
                  {!requestMainTable && Object.keys(selectedRequestFields).some(fieldId => selectedRequestFields[fieldId]) && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ 请先选择主表，以便正确生成Java类结构
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {requestMainTable && (
                      <div>
                        {/* 主表字段 */}
                        {Object.keys(selectedRequestFields)
                          .filter(fieldId => selectedRequestFields[fieldId])
                          .filter(fieldId => {
                            const table = tables.find(t => t.fields.some(f => f.id === fieldId));
                            return table?.id === requestMainTable;
                          })
                          .map(fieldId => {
                            const field = tables.flatMap(t => t.fields).find(f => f.id === fieldId);
                            const table = tables.find(t => t.fields.some(f => f.id === fieldId));
                            
                            return (
                              <div key={fieldId} className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">主表</span>
                                    {table?.name}.{field?.name}
                                  </div>
                                  <div className="text-sm text-gray-600">{field?.comment}</div>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {field?.type}{field?.length ? `(${field?.length})` : ''}
                                </div>
                                <input
                                  type="text"
                                  placeholder="别名（可选）"
                                  className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                                <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  <span className="text-sm text-gray-700">必填</span>
                                </label>
                              </div>
                            );
                          })}
                        
                        {/* 子表字段 */}
                        {tables
                          .filter(table => table.id !== requestMainTable)
                          .filter(table => table.fields.some(field => selectedRequestFields[field.id]))
                          .map(table => (
                            <div key={table.id} className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">子表对象</span>
                                <span className="font-medium text-gray-900">{table.name}</span>
                                {table.comment && <span className="text-sm text-gray-600">({table.comment})</span>}
                              </div>
                              {table.fields
                                .filter(field => selectedRequestFields[field.id])
                                .map(field => (
                                  <div key={field.id} className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg ml-4 mb-2">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{field.name}</div>
                                      <div className="text-sm text-gray-600">{field.comment}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {field.type}{field.length ? `(${field.length})` : ''}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="别名（可选）"
                                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                    <label className="flex items-center gap-2">
                                      <input type="checkbox" className="rounded border-gray-300" />
                                      <span className="text-sm text-gray-700">必填</span>
                                    </label>
                                  </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    )}
                    
                    {Object.keys(selectedRequestFields).filter(fieldId => selectedRequestFields[fieldId]).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>请从左侧选择字段来配置请求参数</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">响应参数配置</h4>
                    {responseMainTable && (
                      <div className="text-sm text-blue-600">
                        主表: {tables.find(t => t.id === responseMainTable)?.name}
                      </div>
                    )}
                  </div>
                  
                  {!responseMainTable && Object.keys(selectedResponseFields).some(fieldId => selectedResponseFields[fieldId]) && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ 请先选择主表，以便正确生成Java类结构
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {responseMainTable && (
                      <div>
                        {/* 主表字段 */}
                        {Object.keys(selectedResponseFields)
                          .filter(fieldId => selectedResponseFields[fieldId])
                          .filter(fieldId => {
                            const table = tables.find(t => t.fields.some(f => f.id === fieldId));
                            return table?.id === responseMainTable;
                          })
                          .map(fieldId => {
                            const field = tables.flatMap(t => t.fields).find(f => f.id === fieldId);
                            const table = tables.find(t => t.fields.some(f => f.id === fieldId));
                            
                            return (
                              <div key={fieldId} className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 flex items-center gap-2">
                                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">主表</span>
                                    {table?.name}.{field?.name}
                                  </div>
                                  <div className="text-sm text-gray-600">{field?.comment}</div>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {field?.type}{field?.length ? `(${field?.length})` : ''}
                                </div>
                                <input
                                  type="text"
                                  placeholder="别名（可选）"
                                  className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                            );
                          })}
                        
                        {/* 子表字段 */}
                        {tables
                          .filter(table => table.id !== responseMainTable)
                          .filter(table => table.fields.some(field => selectedResponseFields[field.id]))
                          .map(table => (
                            <div key={table.id} className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">子表对象</span>
                                <span className="font-medium text-gray-900">{table.name}</span>
                                {table.comment && <span className="text-sm text-gray-600">({table.comment})</span>}
                              </div>
                              {table.fields
                                .filter(field => selectedResponseFields[field.id])
                                .map(field => (
                                  <div key={field.id} className="flex items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-lg ml-4 mb-2">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{field.name}</div>
                                      <div className="text-sm text-gray-600">{field.comment}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {field.type}{field.length ? `(${field.length})` : ''}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="别名（可选）"
                                      className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    )}
                    
                    {Object.keys(selectedResponseFields).filter(fieldId => selectedResponseFields[fieldId]).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>请从左侧选择字段来配置响应参数</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="secondary" onClick={() => setShowCodeModal(true)}>
              <Code className="w-4 h-4 mr-2" />
              预览代码
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>
                取消
              </Button>
              <Button onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                保存接口
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowCodeModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">生成的代码</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    下载
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowCodeModal(false)}>
                    关闭
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generateCode()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}