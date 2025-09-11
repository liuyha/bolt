import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import { Header } from '../components/Layout/Header';
import { ProjectList } from '../components/Project/ProjectList';
import { MemberList } from '../components/Project/MemberList';
import { DataSourceList } from '../components/DataSource/DataSourceList';
import { InterfaceList } from '../components/Interface/InterfaceList';
import { InterfaceDesigner } from '../components/Interface/InterfaceDesigner';
import { Project, DataSource, ApiInterface, InterfaceCategory } from '../types';

const { Content } = Layout;

interface AppRoutesProps {
  projects: Project[];
  dataSources: DataSource[];
  interfaces: ApiInterface[];
  categories: InterfaceCategory[];
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateDataSources: (dataSources: DataSource[]) => void;
  onUpdateInterfaces: (interfaces: ApiInterface[]) => void;
  onUpdateCategories: (categories: InterfaceCategory[]) => void;
}

export function AppRoutes({
  projects,
  dataSources,
  interfaces,
  categories,
  onUpdateProjects,
  onUpdateDataSources,
  onUpdateInterfaces,
  onUpdateCategories
}: AppRoutesProps) {
  return (
    <Routes>
      <Route path="/" element={
        <>
          <Header />
          <Content>
            <ProjectList
              projects={projects}
              onUpdateProjects={onUpdateProjects}
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
              onUpdateProjects={onUpdateProjects}
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
              onUpdateDataSources={onUpdateDataSources}
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
              onUpdateInterfaces={onUpdateInterfaces}
              onUpdateCategories={onUpdateCategories}
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
              onUpdateInterfaces={onUpdateInterfaces}
            />
          </Content>
        </>
      } />
    </Routes>
  );
}