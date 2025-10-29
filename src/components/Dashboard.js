import React from 'react';
import { Card, Row, Col, Statistic, Button, Upload, message } from 'antd';
import { 
  FilePdfOutlined, 
  PictureOutlined, 
  VideoCameraOutlined, 
  CloudUploadOutlined,
  RocketOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const Dashboard = () => {
  const [fileStats, setFileStats] = React.useState({
    pdfProcessed: 0,
    imagesAnalyzed: 0,
    videosTranscribed: 0,
    totalQueries: 0
  });

  const handleFileUpload = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      let endpoint = '';
      switch (type) {
        case 'pdf':
          endpoint = '/pdf/upload';
          break;
        case 'image':
          endpoint = '/image/upload';
          break;
        case 'video':
          endpoint = '/video/upload';
          break;
        default:
          return;
      }

      const response = await axios.post(`${API_BASE}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          message.loading({ content: `Uploading... ${percent}%`, key: 'upload' });
        }
      });

      message.success({ content: 'File uploaded successfully!', key: 'upload' });
      
      // Navigate to respective analyzer page with file data
      switch (type) {
        case 'pdf':
          window.location.href = `/pdf?file_id=${response.data.file_id}`;
          break;
        case 'image':
          window.location.href = `/image?file_id=${response.data.file_id}`;
          break;
        case 'video':
          window.location.href = `/video?file_id=${response.data.file_id}`;
          break;
      }

    } catch (error) {
      message.error('Upload failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  const uploadProps = (type) => ({
    beforeUpload: (file) => {
      handleFileUpload(file, type);
      return false; // Prevent default upload
    },
    showUploadList: false
  });

  const quickActions = [
    {
      title: "PDF Analysis",
      icon: <FilePdfOutlined />,
      description: "Process documents with OCR",
      route: "/pdf",
      type: "pdf"
    },
    {
      title: "Image Analysis", 
      icon: <PictureOutlined />,
      description: "Extract text from images",
      route: "/image",
      type: "image"
    },
    {
      title: "Video Analysis",
      icon: <VideoCameraOutlined />,
      description: "Transcribe and analyze videos", 
      route: "/video",
      type: "video"
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="page-header">
        <h1>
          <RocketOutlined /> Advanced Multimodal RAG System
        </h1>
        <p>Process documents, images, and videos with AI-powered analysis</p>
      </div>

      {/* Quick Upload */}
      <Card 
        title="Quick Upload" 
        style={{ marginBottom: 24 }}
        extra={<CloudUploadOutlined />}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Upload.Dragger {...uploadProps('pdf')} style={{ padding: '20px' }}>
              <p className="ant-upload-drag-icon">
                <FilePdfOutlined />
              </p>
              <p className="ant-upload-text">Upload PDF</p>
              <p className="ant-upload-hint">.pdf files only</p>
            </Upload.Dragger>
          </Col>
          <Col span={8}>
            <Upload.Dragger {...uploadProps('image')} style={{ padding: '20px' }}>
              <p className="ant-upload-drag-icon">
                <PictureOutlined />
              </p>
              <p className="ant-upload-text">Upload Image</p>
              <p className="ant-upload-hint">JPG, PNG, BMP, TIFF</p>
            </Upload.Dragger>
          </Col>
          <Col span={8}>
            <Upload.Dragger {...uploadProps('video')} style={{ padding: '20px' }}>
              <p className="ant-upload-drag-icon">
                <VideoCameraOutlined />
              </p>
              <p className="ant-upload-text">Upload Video</p>
              <p className="ant-upload-hint">MP4, AVI, MOV, MKV</p>
            </Upload.Dragger>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="PDFs Processed"
              value={fileStats.pdfProcessed}
              prefix={<FilePdfOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Images Analyzed"
              value={fileStats.imagesAnalyzed}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Videos Transcribed"
              value={fileStats.videosTranscribed}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Queries"
              value={fileStats.totalQueries}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Row gutter={16}>
          {quickActions.map((action, index) => (
            <Col span={8} key={index}>
              <Card 
                hoverable
                style={{ textAlign: 'center', height: 150 }}
                onClick={() => window.location.href = action.route}
              >
                <div style={{ fontSize: '32px', marginBottom: 16 }}>
                  {action.icon}
                </div>
                <h3>{action.title}</h3>
                <p style={{ color: '#666' }}>{action.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;