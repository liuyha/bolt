import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Menu } from 'antd';
import { 
  DatabaseOutlined, 
  GlobalOutlined, 
  FolderOpenOutlined, 
  SettingOutlined, 
  HomeOutlined,
  TeamOutlined
} from '@ant-design/icons';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  const projectId = params.projectId;
  const isProjectRoute = location.pathname.includes('/project/');

  const getSelectedKey = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.includes('/members')) return 'members';
    if (location.pathname.includes('/datasources')) return 'datasources';
    if (location.pathname.includes('/interfaces')) return 'interfaces';
    return 'home';
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '项目管理',
      onClick: () => navigate('/')
    }
  ];

  if (isProjectRoute && projectId) {
    menuItems.push(
      {
        key: 'project-workspace',
        label: '项目工作区',
        type: 'group',
        children: [
          {
            key: 'datasources',
            icon: <DatabaseOutlined />,
            label: '数据源管理',
            onClick: () => navigate(`/project/${projectId}/datasources`)
          },
          {
            key: 'interfaces',
            icon: <SettingOutlined />,
            label: '接口管理',
            onClick: () => navigate(`/project/${projectId}/interfaces`)
          }
        ]
      }
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 16px', borderBottom: '1px solid #303030' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: '#1890ff', 
            borderRadius: 8, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <GlobalOutlined style={{ color: 'white', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>API Designer</div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>接口设计器</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 0' }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid #303030' }}>
        <div style={{ color: '#8c8c8c', fontSize: 12 }}>
          <p>© 2025 API Designer</p>
          <p>企业级接口设计平台</p>
        </div>
      </div>
    </div>
  );
}