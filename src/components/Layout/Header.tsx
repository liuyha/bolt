import React from 'react';
import { Layout, Input, Badge, Avatar, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';

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
      <div></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Input
          placeholder="搜索项目、接口..."
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />
        
        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: 18, color: '#8c8c8c', cursor: 'pointer' }} />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 0 }}>
            <Avatar size="small" icon={<UserOutlined />} />
            <div style={{ textAlign: 'left', minWidth: 0, overflow: 'hidden', lineHeight: 1.2 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#262626', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>开发者</div>
      <div></div>
    </AntHeader>
  );
}
  )
}
  )
}