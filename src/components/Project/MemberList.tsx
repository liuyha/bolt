import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Users, Edit, Trash2, Crown, User, CheckCircle, XCircle } from 'lucide-react';
import { Project, ProjectMember } from '../../types';
import { Button } from '../Common/Button';
import { MemberForm } from './MemberForm';

interface MemberListProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
}

export function MemberList({ projects, onUpdateProjects }: MemberListProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    return <div>项目不存在</div>;
  }

  const members = project.members || [];
  
  // 模拟当前用户角色
  const getCurrentUserRole = (): 'owner' | 'admin' | 'member' => {
    const currentUser = members.find(m => m.email === 'admin@example.com');
    return currentUser?.role || 'member';
  };
  
  const currentUserRole = getCurrentUserRole();

  const handleUpdateMembers = (updatedMembers: ProjectMember[]) => {
    const updatedProject = {
      ...project,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    };
    onUpdateProjects(projects.map(p => p.id === project.id ? updatedProject : p));
  };
  const handleCreateMember = (memberData: Omit<ProjectMember, 'id' | 'joinedAt'>) => {
    const newMember: ProjectMember = {
      ...memberData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString()
    };
    handleUpdateMembers([...members, newMember]);
    setShowCreateModal(false);
  };

  const handleEditMember = (memberData: Omit<ProjectMember, 'id' | 'joinedAt'>) => {
    if (!editingMember) return;
    
    const updatedMember: ProjectMember = {
      ...editingMember,
      ...memberData
    };
    
    handleUpdateMembers(members.map(m => m.id === editingMember.id ? updatedMember : m));
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    // 检查权限
    if (currentUserRole === 'member') {
      alert('您没有权限移除成员');
      return;
    }
    
    if (currentUserRole === 'admin' && (member.role === 'owner' || member.role === 'admin')) {
      alert('管理员不能移除拥有者或其他管理员');
      return;
    }
    
    if (confirm('确定要移除这个成员吗？')) {
      handleUpdateMembers(members.filter(m => m.id !== memberId));
    }
  };

  const handleToggleStatus = (member: ProjectMember) => {
    // 检查权限
    if (currentUserRole === 'member') {
      alert('您没有权限修改成员状态');
      return;
    }
    
    if (currentUserRole === 'admin' && (member.role === 'owner' || member.role === 'admin')) {
      alert('管理员不能修改拥有者或其他管理员的状态');
      return;
    }
    
    const updatedMember = {
      ...member,
      status: member.status === 'active' ? 'inactive' : 'active' as const
    };
    handleUpdateMembers(members.map(m => m.id === member.id ? updatedMember : m));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-red-500" />;
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-gray-500" />;
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? '活跃' : '禁用';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
                onClick={() => navigate('/')}
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 返回项目
            </button>
            <div className="w-px h-6 bg-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900">{project.name} - 成员管理</h2>
              <h2 className="text-xl font-semibold text-gray-900">{projectName} - 成员管理</h2>
              <p className="text-gray-600 mt-1">管理项目成员和权限</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加成员
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无成员</h3>
          <p className="text-gray-600 mb-4">添加团队成员来协作开发API</p>
          <Button 
            onClick={() => setShowCreateModal(true)}
            disabled={currentUserRole === 'member'}
          >
            <Plus className="w-4 h-4 mr-2" />
            添加成员
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    成员信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    加入时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {member.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.username}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {getRoleText(member.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(member.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {getStatusText(member.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinedAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(member)}
                         disabled={
                           currentUserRole === 'member' || 
                           (currentUserRole === 'admin' && (member.role === 'owner' || member.role === 'admin'))
                         }
                          className={`p-1 rounded hover:bg-gray-50 ${
                            member.status === 'active' 
                              ? 'text-gray-600 hover:text-gray-900' 
                              : 'text-green-600 hover:text-green-900'
                         } disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={member.status === 'active' ? '禁用成员' : '启用成员'}
                        >
                          {member.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingMember(member)}
                         disabled={
                           currentUserRole === 'member' || 
                           (currentUserRole === 'admin' && (member.role === 'owner' || member.role === 'admin'))
                         }
                         className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                         disabled={
                           currentUserRole === 'member' || 
                           (currentUserRole === 'admin' && (member.role === 'owner' || member.role === 'admin'))
                         }
                         className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">权限说明</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-red-500" />
            <span><strong>拥有者</strong>：拥有项目的完全控制权，可以管理所有设置、成员和权限</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span><strong>管理员</strong>：可以管理项目设置、普通成员权限、数据源配置和所有接口</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span><strong>成员</strong>：可以查看项目信息、设计和编辑接口，但不能修改项目设置和成员权限</span>
          </div>
        </div>
      </div>

      <MemberForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateMember}
        title="添加成员"
        projectId={project.id}
        currentUserRole={currentUserRole}
      />

      {editingMember && (
        <MemberForm
          isOpen={true}
          onClose={() => setEditingMember(null)}
          onSubmit={handleEditMember}
          title="编辑成员"
          projectId={project.id}
          currentUserRole={currentUserRole}
          initialData={editingMember}
        />
      )}
    </div>
  );
}