import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Image, 
  Input,
  Row,
  Col,
  message,
  List,
  Tag,
  Spin
} from 'antd';
import { 
  PictureOutlined, 
  CloudUploadOutlined,
  SendOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const API_BASE = 'https://advance-multimodel-rag-backend.onrender.com';

const ImageAnalyzer = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get('session_id');
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
      fetchChatHistory(sessionIdFromUrl);
    }
  }, []);

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      handleImageUpload(file);
      return false;
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          url: e.target.result,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      };
      reader.readAsDataURL(file);
      
      setSessionId(response.data.session_id);
      message.success('Image uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
    }
  };

  const fetchChatHistory = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE}/image/chat-history/${sessionId}`);
      if (response.data.status === 'success') {
        const formattedMessages = response.data.chat_history.map(msg => ({
          type: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
          time: new Date().toLocaleTimeString()
        }));
        setChatMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !sessionId) {
      message.warning('Please upload an image and enter a question!');
      return;
    }

    const userMessage = {
      type: 'user',
      content: question,
      time: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    const currentQuestion = question;
    setQuestion('');
    setProcessing(true);

    try {
      const response = await axios.post(`${API_BASE}/image/ask`, {
        session_id: sessionId,
        question: currentQuestion
      });

      const aiMessage = {
        type: 'assistant',
        content: response.data.answer,
        time: new Date().toLocaleTimeString(),
        analysisType: response.data.analysis_type
      };
      setChatMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Ask error:', error);
      message.error('Error getting response: ' + (error.response?.data?.detail || error.message));
      
      const errorMessage = {
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setProcessing(false);
    }
  };

  const clearChat = async () => {
    if (!sessionId) return;
    
    try {
      await axios.post(`${API_BASE}/image/clear-history`, {
        session_id: sessionId
      });
      setChatMessages([]);
      message.success('Chat history cleared!');
    } catch (error) {
      message.error('Failed to clear chat history');
    }
  };

  return (
    <div className="image-analyzer-page">
      <div className="page-header">
        <h1><PictureOutlined /> Image Analysis</h1>
        <p>Upload images and ask questions about visual content</p>
      </div>

      <Row gutter={16}>
        {/* Left Column - Upload & Image Preview */}
        <Col span={8}>
          <Card title="Upload Image" style={{ marginBottom: 16 }}>
            <Upload.Dragger {...uploadProps} disabled={uploading}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag image to upload
              </p>
              <p className="ant-upload-hint">
                Support for JPG, PNG, BMP, TIFF
              </p>
            </Upload.Dragger>

            {uploading && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Spin size="large" />
                <p>Uploading image...</p>
              </div>
            )}

            {uploadedImage && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Image
                  width="100%"
                  src={uploadedImage.url}
                  alt="Uploaded preview"
                  style={{ borderRadius: 8, maxHeight: '200px', objectFit: 'contain' }}
                />
                <p style={{ marginTop: 8, marginBottom: 4 }}>{uploadedImage.name}</p>
                <Tag color="blue">{uploadedImage.size}</Tag>
                <Tag color="green">Ready for Q&A</Tag>
                
                {sessionId && (
                  <div style={{ marginTop: 8 }}>
                    <Button type="link" onClick={clearChat} size="small">
                      Clear Chat
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column - Chat Interface */}
        <Col span={16}>
          <Card 
            title="Image Q&A" 
            extra={
              sessionId && (
                <Tag color="orange">
                  Session: {sessionId.substring(0, 8)}...
                </Tag>
              )
            }
            style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, maxHeight: '400px' }}>
              {chatMessages.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#999', 
                  padding: '40px 0' 
                }}>
                  <PictureOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
                  <p>Upload an image and ask questions about its content</p>
                  {!uploadedImage && (
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      Please upload an image first
                    </p>
                  )}
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      borderRadius: '8px',
                      backgroundColor: msg.type === 'user' ? '#e6f7ff' : '#f6ffed',
                      borderLeft: `4px solid ${msg.type === 'user' ? '#1890ff' : '#52c41a'}`
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {msg.type === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {msg.time}
                      {msg.analysisType && (
                        <Tag color="purple" style={{ marginLeft: 8 }}>
                          {msg.analysisType}
                        </Tag>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Box */}
            <div>
              <TextArea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  uploadedImage 
                    ? "Ask a question about the image content..." 
                    : "Please upload an image first..."
                }
                disabled={!uploadedImage || processing}
                onPressEnter={(e) => {
                  if (e.shiftKey) return;
                  e.preventDefault();
                  handleAskQuestion();
                }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                style={{ marginTop: 8, width: '100%' }}
                onClick={handleAskQuestion}
                disabled={!question.trim() || !uploadedImage || processing}
                loading={processing}
              >
                Ask Question
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ImageAnalyzer;
