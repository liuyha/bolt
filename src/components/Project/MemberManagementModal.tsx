import React, { useState } from 'react';
import { Modal, Table, Button, Tag, Space, Avatar, Tooltip, message } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  StopOutlined,
  CrownOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Project, ProjectMember } from '../../types';
import { MemberForm } from './MemberForm';

interface MemberManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function MemberManagementModal({ 
  isOpen, 
  onClose, 
  project, 
  onUpdateProject 
}: MemberManagementModalProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);

  const members = project.members || [];
  
  // 模拟当前用户角色
  const getCurrentUserRole = (): 'owner' | 'admin' | 'member' => {
    const currentUser = members.find(m => m.email === 'admin@example.com');
    return currentUser?.role || 'owner';
  };
  
  const currentUserRole = getCurrentUserRole();

  const handleUpdateMembers = (updatedMembers: ProjectMember[]) => {
    const updatedProject = {
      ...project,
      members: updatedMembers,
      memberTotal: updatedMembers.length,
      updatedAt: new Date().toISOString()
    };
    onUpdateProject(updatedProject);
  };

  const handleCreateMember = (memberData: Omit<ProjectMember, 'id' | 'joinedAt'>) => {
    const newMember: ProjectMember = {
      ...memberData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString()
    };
    handleUpdateMembers([...members, newMember]);
    setShowCreateModal(false);
    message.success('成员添加成功');
  };

  const handleEditMember = (memberData: Omit<ProjectMember, 'id' | 'joinedAt'>) => {
    if (!editingMember) return;
    
    const updatedMember: ProjectMember = {
      ...editingMember,
      ...memberData
    };
    
    handleUpdateMembers(members.map(m => m.id === editingMember.id ? updatedMember : m));
    setEditingMember(null);
    message.success('成员信息更新成功');
  };

  const handleDeleteMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    // 检查权限
    if (currentUserRole === 'member') {
      message.error('您没有权限移除成员');
      return;
    }
    
    if (currentUserRole === 'admin' && (member.role === 'owner' || member.role === 'admin')) {
      message.error('管理员不能移除拥有者或其他管理员');
      return;
    }
    
    Modal.confirm({
      title: '确认移除成员',
      content: `确定要移除成员 ${member.username} 吗？`,
      onOk: () => {
        handleUpdateMembers(members.filter(m => m.id !== memberId));
        message.success('成员移除成功');
      }
    });
  };

  const handleToggleStatus = (member: ProjectMember) => {
    // 检查权限
    if (currentUserRole === 'member') {
      message.error('您没有权限修改成员状态');
      return;
    }
    
    if (currentUserRole === 'admin' && (member.role === 'owner' || member.role === 'admin')) {
      message.error('管理员不能修改拥有者或其他管理员的状态');
      return;
    }
    
    const updatedMember = {
      ...member,
      status: member.status === 'active' ? 'inactive' : 'active' as const
    };
    handleUpdateMembers(members.map(m => m.id === member.id ? updatedMember : m));
    message.success(`成员状态已${updatedMember.status === 'active' ? '启用' : '禁用'}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <CrownOutlined style={{ color: '#f5222d' }} />;
      case 'admin':
        return <CrownOutlined style={{ color: '#faad14' }} />;
      default:
        return <UserOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner':
        return '拥有者';
      case 'admin':
        return '管理员';
      default:
        return '成员';
    }
  };

  const columns = [
    {
      title: '成员信息',
      key: 'member',
      render: (record: ProjectMember) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
            {record.username.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.username}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: '角色',
      key: 'role',
      render: (record: ProjectMember) => (
        <Space size={4}>
          {getRoleIcon(record.role)}
          <Tag color={record.role === 'owner' ? 'red' : record.role === 'admin' ? 'orange' : 'blue'}>
            {getRoleText(record.role)}
          </Tag>
        </Space>
      )
    },
    {
      title: '状态',
      key: 'status',
      render: (record: ProjectMember) => (
        <Tag color={record.status === 'active' ? 'success' : 'default'}>
          {record.status === 'active' ? '活跃' : '禁用'}
        </Tag>
      )
    },
    {
      title: '加入时间',
      key: 'joinedAt',
      render: (record: ProjectMember) => (
        <span style={{ fontSize: 12, color: '#8c8c8c' }}>
          {new Date(record.joinedAt).toLocaleDateString('zh-CN')}
        </span>
      )
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: ProjectMember) => (
        <Space size={8}>
          <Tooltip title={record.status === 'active' ? '禁用成员' : '启用成员'}>
            <Button
              type="text"
              size="small"
              icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record)}
              disabled={
                currentUserRole === 'member' || 
                (currentUserRole === 'admin' && (record.role === 'owner' || record.role === 'admin'))
              }
            />
          </Tooltip>
          <Tooltip title="编辑成员">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setEditingMember(record)}
              disabled={
                currentUserRole === 'member' || 
                (currentUserRole === 'admin' && (record.role === 'owner' || record.role === 'admin'))
              }
            />
          </Tooltip>
          <Tooltip title="移除成员">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteMember(record.id)}
              disabled={
                currentUserRole === 'member' || 
                (currentUserRole === 'admin' && (record.role === 'owner' || record.role === 'admin'))
              }
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{project.name} - 成员管理</span>
            <Tag color="blue">{members.length} 名成员</Tag>
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        width={800}
        footer={[
          <Button key="close" onClick={onClose}>
            关闭
          </Button>,
          <Button 
            key="add" 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setShowCreateModal(true)}
            disabled={currentUserRole === 'member'}
          >
            添加成员
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: 6, 
            padding: 12,
            fontSize: 12
          }}>
            <div style={{ fontWeight: 500, color: '#0369a1', marginBottom: 8 }}>权限说明：</div>
            <div style={{ color: '#0284c7', lineHeight: 1.5 }}>
              <div>• <strong>拥有者</strong>：拥有项目的完全控制权，可以管理所有设置、成员和权限</div>
              <div>• <strong>管理员</strong>：可以管理项目设置、普通成员权限、数据源配置和所有接口</div>
              <div>• <strong>成员</strong>：可以查看项目信息、设计和编辑接口，但不能修改项目设置和成员权限</div>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={members}
          rowKey="id"
          size="small"
          pagination={false}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#8c8c8c' }}>
                <UserOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <div>暂无成员</div>
                <div style={{ fontSize: 12 }}>添加团队成员来协作开发API</div>
              </div>
            )
          }}
        />
      </Modal>

      <MemberForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateMember}
        title="添加成员"
        projectId={project.projectId.toString()}
        currentUserRole={currentUserRole}
      />

      {editingMember && (
        <MemberForm
          isOpen={true}
          onClose={() => setEditingMember(null)}
          onSubmit={handleEditMember}
          title="编辑成员"
          projectId={project.projectId.toString()}
          currentUserRole={currentUserRole}
          initialData={editingMember}
        />
      )}
    </>
  );
}