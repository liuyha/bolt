import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Tag, Space, Row, Col, Avatar, Tooltip, Empty } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  TeamOutlined,
  CrownOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Project } from '../../types';
import { ProjectForm } from './ProjectForm';

const { Search } = Input;
const { Meta } = Card;

interface ProjectListProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export function ProjectList({ projects, onUpdateProjects }: ProjectListProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      projectId: Date.now(),
      createdTime: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onUpdateProjects([...projects, newProject]);
    setShowCreateModal(false);
  };

  const handleEditProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProject) return;
    
    const updatedProject: Project = {
      ...editingProject,
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    onUpdateProjects(projects.map(p => p.projectId === editingProject.projectId ? updatedProject : p));
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    onUpdateProjects(projects.filter(p => p.projectId.toString() !== projectId));
  };

  const handleToggleStatus = (project: Project) => {
    const updatedProject = {
      ...project,
      state: project.state === 'active' ? 'inactive' : 'active',
      updatedAt: new Date().toISOString()
    };
    onUpdateProjects(projects.map(p => p.projectId === project.projectId ? updatedProject : p));
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'owner':
        return <CrownOutlined style={{ color: '#f5222d' }} />;
      case 'admin':
        return <CrownOutlined style={{ color: '#faad14' }} />;
      default:
        return <UserOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const renderProjectActions = (project: Project) => [
    <Tooltip title="成员管理" key="members">
      <Button 
        type="text" 
        icon={<TeamOutlined />} 
        onClick={() => navigate(`/project/${project.projectId}/members`)}
      />
    </Tooltip>,
    <Tooltip title={project.state === 'active' ? '暂停项目' : '启动项目'} key="toggle">
      <Button 
        type="text" 
        icon={project.state === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        onClick={() => handleToggleStatus(project)}
      />
    </Tooltip>,
    <Tooltip title="编辑项目" key="edit">
      <Button 
        type="text" 
        icon={<EditOutlined />} 
        onClick={() => setEditingProject(project)}
      />
    </Tooltip>,
    <Tooltip title="删除项目" key="delete">
      <Button 
        type="text" 
        danger 
        icon={<DeleteOutlined />} 
        onClick={() => handleDeleteProject(project.projectId)}
      />
    </Tooltip>
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>项目管理</h2>
          <p style={{ margin: '4px 0 0 0', color: '#8c8c8c' }}>管理您的API设计项目</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
          新建项目
        </Button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Search
          placeholder="搜索项目..."
          allowClear
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <Empty
          description="暂无项目"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
            新建项目
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProjects.map((project) => (
            <Col xs={24} sm={12} lg={8} key={project.projectId}>
              <Card
                hoverable
                actions={renderProjectActions(project)}
                style={{ height: '100%' }}
              >
                <Meta
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{project.name}</span>
                      <Tag color={project.state === 'active' ? 'success' : 'default'}>
                        {project.state === 'active' ? '活跃' : '暂停'}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <p style={{ margin: '8px 0', color: '#8c8c8c', minHeight: 40 }}>
                        {project.description}
                      </p>
                      
                      <div style={{ marginBottom: 12 }}>
                        <Space size="small">
                          <Tooltip title={`当前角色: ${project.belongRole}`}>
                            <Space size={4}>
                              {getRoleIcon(project.belongRole)}
                              <span style={{ fontSize: 12 }}>{project.belongRole}</span>
                            </Space>
                          </Tooltip>
                          {project.administrators && (
                            <Tooltip title={`管理员: ${project.administrators}`}>
                              <Space size={4}>
                                {getRoleIcon('admin')}
                                <span style={{ fontSize: 12 }}>管理员</span>
                              </Space>
                            </Tooltip>
                          )}
                        </Space>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                          创建于 {new Date(project.createdTime).toLocaleDateString('zh-CN')}
                        </span>
                        <Space size={4}>
                          <TeamOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
                          <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                            {project.memberTotal} 名成员
                          </span>
                        </Space>
                      </div>
                      
                      <div style={{ marginTop: 12 }}>
                        <Button 
                          type="primary" 
                          size="small" 
                          block
                          onClick={() => navigate(`/project/${project.projectId}/datasources`)}
                        >
                          进入项目
                        </Button>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <ProjectForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        title="新建项目"
      />

      {editingProject && (
        <ProjectForm
          isOpen={true}
          onClose={() => setEditingProject(null)}
          onSubmit={handleEditProject}
          title="编辑项目"
          initialData={editingProject}
        />
      )}
    </div>
  );
}