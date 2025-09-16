import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { ProjectList } from './components/Project/ProjectList';
import { DataSourceList } from './components/DataSource/DataSourceList';
import { InterfaceList } from './components/Interface/InterfaceList';
import { ViewMode, WorkspaceTab, Project, DataSource, ApiInterface, InterfaceCategory } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GlobalTypeMappingForm } from './components/DataSource/GlobalTypeMappingForm';
import { mockProjects, mockDataSources, mockInterfaces, mockCategories } from './utils/mockData';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('projects');
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('datasources');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showGlobalTypeMapping, setShowGlobalTypeMapping] = useState(false);
  
  const [projects, setProjects] = useLocalStorage<Project[]>('api-designer-projects', mockProjects);
  const [dataSources, setDataSources] = useLocalStorage<DataSource[]>('api-designer-datasources', mockDataSources);
  const [interfaces, setInterfaces] = useLocalStorage<ApiInterface[]>('api-designer-interfaces', mockInterfaces);
  const [categories, setCategories] = useLocalStorage<InterfaceCategory[]>('api-designer-categories', mockCategories);

  const handleNavigate = (mode: ViewMode, tab?: WorkspaceTab) => {
    setViewMode(mode);
    if (tab) {
      setWorkspaceTab(tab);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setViewMode('workspace');
    setWorkspaceTab('datasources');
  };

  const getHeaderInfo = () => {
    if (viewMode === 'projects') {
      return {
        title: '项目管理',
        subtitle: '管理您的API设计项目'
      };
    }
    
    if (viewMode === 'workspace' && currentProject) {
      const tabNames = {
        datasources: '数据源管理',
        interfaces: '接口管理'
      };
      
      return {
        title: `${currentProject.name} - ${tabNames[workspaceTab]}`,
        subtitle: currentProject.description
      };
    }

    return {
      title: 'API设计器',
      subtitle: '企业级接口设计平台'
    };
  };

  const renderMainContent = () => {
    if (viewMode === 'projects') {
      return (
        <ProjectList
          projects={projects}
          onSelectProject={handleSelectProject}
          onUpdateProjects={setProjects}
        />
      );
    }

    if (viewMode === 'workspace') {
      switch (workspaceTab) {
        case 'datasources':
          return (
            <DataSourceList
              dataSources={dataSources.filter(ds => ds.projectId === currentProject?.id)}
              onUpdateDataSources={(updatedDataSources) => {
                const otherDataSources = dataSources.filter(ds => ds.projectId !== currentProject?.id);
                setDataSources([...otherDataSources, ...updatedDataSources]);
              }}
            />
          );
        case 'interfaces':
          return (
            <InterfaceList
              interfaces={interfaces.filter(iface => iface.projectId === currentProject?.id)}
              categories={categories.filter(cat => cat.projectId === currentProject?.id)}
              onUpdateInterfaces={(updatedInterfaces) => {
                const otherInterfaces = interfaces.filter(iface => iface.projectId !== currentProject?.id);
                setInterfaces([...otherInterfaces, ...updatedInterfaces]);
              }}
              onUpdateCategories={(updatedCategories) => {
                const otherCategories = categories.filter(cat => cat.projectId !== currentProject?.id);
                setCategories([...otherCategories, ...updatedCategories]);
              }}
            />
          );
        default:
          return null;
      }
    }

    return null;
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        viewMode={viewMode}
        workspaceTab={workspaceTab}
        currentProject={currentProject}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={headerInfo.title} 
          subtitle={headerInfo.subtitle}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
      
      <GlobalTypeMappingForm
        isOpen={showGlobalTypeMapping}
        onClose={() => setShowGlobalTypeMapping(false)}
        dataSources={dataSources.filter(ds => ds.projectId === currentProject?.id)}
        onUpdateDataSources={(updatedDataSources) => {
          const otherDataSources = dataSources.filter(ds => ds.projectId !== currentProject?.id);
          setDataSources([...otherDataSources, ...updatedDataSources]);
        }}
      />
    </div>
  );
}

export default App;