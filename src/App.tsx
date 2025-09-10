import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
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

const { Sider, Content } = Layout;

function App() {
  const [projects, setProjects] = useLocalStorage<Project[]>('api-designer-projects', mockProjects);
  const [dataSources, setDataSources] = useLocalStorage<DataSource[]>('api-designer-datasources', mockDataSources);
  const [interfaces, setInterfaces] = useLocalStorage<ApiInterface[]>('api-designer-interfaces', mockInterfaces);
  const [categories, setCategories] = useLocalStorage<InterfaceCategory[]>('api-designer-categories', mockCategories);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={256} theme="dark">
        <Sidebar />
      </Sider>
      
      <Layout>
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Content>
                <ProjectList
                  projects={projects}
                  onUpdateProjects={setProjects}
                />
              </Content>
            </>
          } />
          
          <Route path="/project/:projectId/members" element={
            <>
              <Header />
              <Content>
                <MemberList
                  projects={projects}
                  onUpdateProjects={setProjects}
                />
              </Content>
            </>
          } />
          
          <Route path="/project/:projectId/datasources" element={
            <>
              <Header />
              <Content>
                <DataSourceList
                  dataSources={dataSources}
                  onUpdateDataSources={setDataSources}
                />
              </Content>
            </>
          } />
          
          <Route path="/project/:projectId/interfaces" element={
            <>
              <Header />
              <Content>
                <InterfaceList
                  interfaces={interfaces}
                  categories={categories}
                  onUpdateInterfaces={setInterfaces}
                  onUpdateCategories={setCategories}
                />
              </Content>
            </>
          } />
          
          <Route path="/project/:projectId/interface-designer/:interfaceId" element={
            <>
              <Header />
              <Content>
                <InterfaceDesigner
                  interfaces={interfaces}
                  onUpdateInterfaces={setInterfaces}
                />
              </Content>
            </>
          } />
        </Routes>
      </Layout>
    </Layout>
  );
}

export default App;