import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { ProjectList } from './components/Project/ProjectList';
import { MemberList } from './components/Project/MemberList';
import { DataSourceList } from './components/DataSource/DataSourceList';
import { InterfaceList } from './components/Interface/InterfaceList';
import { InterfaceDesigner } from './components/Interface/InterfaceDesigner';
import { Project, DataSource, ApiInterface, InterfaceCategory } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockProjects, mockDataSources, mockInterfaces, mockCategories } from './utils/mockData';

function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>('api-designer-projects', mockProjects);
  const [dataSources, setDataSources] = useLocalStorage<DataSource[]>('api-designer-datasources', mockDataSources);
  const [interfaces, setInterfaces] = useLocalStorage<ApiInterface[]>('api-designer-interfaces', mockInterfaces);
  const [categories, setCategories] = useLocalStorage<InterfaceCategory[]>('api-designer-categories', mockCategories);

  const getHeaderInfo = (pathname: string, projectId?: string) => {
    if (pathname === '/') {
      return {
        title: '项目管理',
        subtitle: '管理您的API设计项目'
      };
    }
    
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        if (pathname.includes('/members')) {
          return {
            title: `${project.name} - 成员管理`,
            subtitle: '管理项目成员和权限'
          };
        }
        if (pathname.includes('/datasources')) {
          return {
            title: `${project.name} - 数据源管理`,
            subtitle: project.description
          };
        }
        if (pathname.includes('/interfaces')) {
          return {
            title: `${project.name} - 接口管理`,
            subtitle: project.description
          };
        }
        if (pathname.includes('/interface-designer')) {
          return {
            title: `${project.name} - 接口设计`,
            subtitle: project.description
          };
        }
      }
    }

    return {
      title: 'API设计器',
      subtitle: '企业级接口设计平台'
    };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={
            <>
              <Header 
                title="项目管理" 
                subtitle="管理您的API设计项目"
              />
              <main className="flex-1 overflow-y-auto">
                <ProjectList
                  projects={projects}
                  onUpdateProjects={setProjects}
                />
              </main>
            </>
          } />
          
          <Route path="/project/:projectId/members" element={
            <Routes>
              <Route path="/" element={
                <>
                  <Header 
                    title="成员管理" 
                    subtitle="管理项目成员和权限"
                  />
                  <main className="flex-1 overflow-y-auto">
                    <MemberList
                      projects={projects}
                      onUpdateProjects={setProjects}
                    />
                  </main>
                </>
              } />
            </Routes>
          } />
          
          <Route path="/project/:projectId/datasources" element={
            <Routes>
              <Route path="/" element={
                <>
                  <Header 
                    title="数据源管理" 
                    subtitle="管理项目的数据库连接和DDL信息"
                  />
                  <main className="flex-1 overflow-y-auto">
                    <DataSourceList
                      dataSources={dataSources}
                      onUpdateDataSources={setDataSources}
                    />
                  </main>
                </>
              } />
            </Routes>
          } />
          
          <Route path="/project/:projectId/interfaces" element={
            <Routes>
              <Route path="/" element={
                <>
                  <Header 
                    title="接口管理" 
                    subtitle="设计和管理API接口"
                  />
                  <main className="flex-1 overflow-y-auto">
                    <InterfaceList
                      interfaces={interfaces}
                      categories={categories}
                      onUpdateInterfaces={setInterfaces}
                      onUpdateCategories={setCategories}
                    />
                  </main>
                </>
              } />
            </Routes>
          } />
          
          <Route path="/project/:projectId/interface-designer/:interfaceId" element={
            <Routes>
              <Route path="/" element={
                <>
                  <Header 
                    title="接口设计" 
                    subtitle="可视化设计API接口"
                  />
                  <main className="flex-1 overflow-y-auto">
                    <InterfaceDesigner
                      interfaces={interfaces}
                      onUpdateInterfaces={setInterfaces}
                    />
                  </main>
                </>
              } />
            </Routes>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;