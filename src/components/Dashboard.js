import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  FilePdfOutlined, 
  PictureOutlined, 
  VideoCameraOutlined, 
  CloudUploadOutlined,
  RocketOutlined 
} from '@ant-design/icons';

import PdfAnalyzer from './PdfAnalyzer';
import ImageAnalyzer from './ImageAnalyzer';
import VideoAnalyzer from './VideoAnalyzer';

const Dashboard = () => {
  const [fileStats] = React.useState({
    pdfProcessed: 0,
    imagesAnalyzed: 0,
    videosTranscribed: 0,
    totalQueries: 0
  });

  const [activeAnalyzer, setActiveAnalyzer] = React.useState(null);

  // ✅ Show analyzer page when clicked
  if (activeAnalyzer === 'pdf') return <PdfAnalyzer />;
  if (activeAnalyzer === 'image') return <ImageAnalyzer />;
  if (activeAnalyzer === 'video') return <VideoAnalyzer />;

  return (
    <div
      className="dashboard-page"
      style={{
        background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)',
        minHeight: '100vh',
        padding: '40px'
      }}
    >
      {/* Header */}
      <div
        className="page-header"
        style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1890ff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <RocketOutlined /> Advanced Multimodal RAG System
        </h1>
        <p style={{ fontSize: '18px', color: '#555' }}>
          Process documents, images, and videos with AI-powered analysis
        </p>
      </div>

      {/* Quick Upload */}
      <Card
        title={
          <span style={{ fontSize: '20px', fontWeight: '600' }}>
            <CloudUploadOutlined style={{ marginRight: 10 }} /> Quick Upload
          </span>
        }
        style={{
          marginBottom: 40,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card
              hoverable
              onClick={() => setActiveAnalyzer('pdf')}
              style={{
                textAlign: 'center',
                borderRadius: '12px',
                height: 180,
                background: 'linear-gradient(135deg, #fff1f0, #ffccc7)',
                transition: 'transform 0.3s ease',
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ fontSize: '40px', color: '#cf1322', marginBottom: 12 }}>
                <FilePdfOutlined />
              </div>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>PDF Analysis</h3>
              <p style={{ color: '#595959' }}>Click to open PDF Analyzer</p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              onClick={() => setActiveAnalyzer('image')}
              style={{
                textAlign: 'center',
                borderRadius: '12px',
                height: 180,
                background: 'linear-gradient(135deg, #f6ffed, #d9f7be)',
                transition: 'transform 0.3s ease',
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ fontSize: '40px', color: '#389e0d', marginBottom: 12 }}>
                <PictureOutlined />
              </div>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>Image Analysis</h3>
              <p style={{ color: '#595959' }}>Click to open Image Analyzer</p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              onClick={() => setActiveAnalyzer('video')}
              style={{
                textAlign: 'center',
                borderRadius: '12px',
                height: 180,
                background: 'linear-gradient(135deg, #e6f7ff, #bae7ff)',
                transition: 'transform 0.3s ease',
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ fontSize: '40px', color: '#096dd9', marginBottom: 12 }}>
                <VideoCameraOutlined />
              </div>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>Video Analysis</h3>
              <p style={{ color: '#595959' }}>Click to open Video Analyzer</p>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Card
        title="System Statistics"
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Statistic title="PDFs Processed" value={fileStats.pdfProcessed} prefix={<FilePdfOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Statistic title="Images Analyzed" value={fileStats.imagesAnalyzed} prefix={<PictureOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Statistic title="Videos Transcribed" value={fileStats.videosTranscribed} prefix={<VideoCameraOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <Statistic title="Total Queries" value={fileStats.totalQueries} prefix={<RocketOutlined />} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;
