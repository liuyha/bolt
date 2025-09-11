import React from 'react';
import { Layout } from 'antd';
import { Sidebar } from './components/Layout/Sidebar';
import { AppRoutes } from './routes';
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
        <AppRoutes
          projects={projects}
          dataSources={dataSources}
          interfaces={interfaces}
          categories={categories}
          onUpdateProjects={setProjects}
          onUpdateDataSources={setDataSources}
          onUpdateInterfaces={setInterfaces}
          onUpdateCategories={setCategories}
        />
      </Layout>
    </Layout>
  );
}

export default App;