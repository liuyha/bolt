import React from 'react';
import { Layout, Input, Badge, Avatar, Dropdown } from 'antd';
import { UserOutlined, SearchOutlined, StarOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

export function Header() {
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人资料'
    },
    {
      key: 'settings',
      label: '设置'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: '退出登录'
    }
  ];

  return (
    <AntHeader style={{ 
      background: '#fff', 
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: 64
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Input
          placeholder="搜索项目、接口..."
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#595959',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#262626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#595959';
            }}
            title="查看收藏项目"
          >
            <StarOutlined style={{ fontSize: 16 }} />
          </button>
          
          <button
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#595959',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#262626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#595959';
            }}
            title="创建项目"
          >
            <PlusOutlined style={{ fontSize: 16 }} />
          </button>
          
          <button
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#595959',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.color = '#262626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#595959';
            }}
            title="帮助中心"
          >
            <QuestionCircleOutlined style={{ fontSize: 16 }} />
          </button>
        </div>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 0 }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <div style={{ textAlign: 'left', minWidth: 0, overflow: 'hidden', lineHeight: 1.2 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#262626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>开发者</div>
            </div>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
}