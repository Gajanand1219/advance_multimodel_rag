import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  FilePdfOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  SettingOutlined
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import PdfAnalyzer from './components/PdfAnalyzer';
import ImageAnalyzer from './components/ImageAnalyzer';
import VideoAnalyzer from './components/VideoAnalyzer';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: 'PDF Analyzer',
    },
    {
      key: 'image',
      icon: <PictureOutlined />,
      label: 'Image Analyzer',
    },
    {
      key: 'video',
      icon: <VideoCameraOutlined />,
      label: 'Video Analyzer',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pdf':
        return <PdfAnalyzer />;
      case 'image':
        return <ImageAnalyzer />;
      case 'video':
        return <VideoAnalyzer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="demo-logo-vertical" style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#1890ff'
        }}>
          {collapsed ? 'MR' : 'Multimodal RAG'}
        </div>
        
        <Menu
          theme="light"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setCurrentPage(key)}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          borderBottom: '1px solid #f0f0f0'
        }} />
        
        <Content style={{ 
          margin: '16px',
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}>
          {renderPage()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;