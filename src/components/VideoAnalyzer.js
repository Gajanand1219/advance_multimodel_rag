import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Progress, 
  Input,
  Row,
  Col,
  message,
  List,
  Tag,
  Spin
} from 'antd';
import { 
  VideoCameraOutlined, 
  CloudUploadOutlined,
  SendOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const API_BASE = 'https://advance-multimodel-rag-backend.onrender.com';

const VideoAnalyzer = () => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState('');

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
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('You can only upload video files!');
        return false;
      }
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        message.error('Video must be smaller than 100MB!');
        return false;
      }
      handleVideoUpload(file);
      return false;
    }
  };

  const handleVideoUpload = async (file) => {
    setUploading(true);
    setProcessing(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE}/video/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      // Create object URL for video preview
      const videoUrl = URL.createObjectURL(file);
      
      setUploadedVideo({
        url: videoUrl,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
      
      setSessionId(response.data.session_id);
      message.success('Video uploaded! Processing audio and transcript...');
      
      // Wait a bit for processing
      setTimeout(() => {
        setProcessing(false);
        message.success('Video processing completed! You can now ask questions.');
      }, 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed: ' + (error.response?.data?.detail || error.message));
      setUploading(false);
      setProcessing(false);
    }
  };

  const fetchChatHistory = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE}/video/chat-history/${sessionId}`);
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
      message.warning('Please upload a video and enter a question!');
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

    try {
      const response = await axios.post(`${API_BASE}/video/ask`, {
        session_id: sessionId,
        question: currentQuestion
      });

      const aiMessage = {
        type: 'assistant',
        content: response.data.answer,
        time: new Date().toLocaleTimeString(),
        retrievalAnalysis: response.data.retrieval_analysis
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
    }
  };

  const clearChat = async () => {
    if (!sessionId) return;
    
    try {
      await axios.post(`${API_BASE}/video/clear-history`, {
        session_id: sessionId
      });
      setChatMessages([]);
      message.success('Chat history cleared!');
    } catch (error) {
      message.error('Failed to clear chat history');
    }
  };

  return (
    <div className="video-analyzer-page">
      <div className="page-header">
        <h1><VideoCameraOutlined /> Video Analysis</h1>
        <p>Upload videos and ask questions about their content</p>
      </div>

      <Row gutter={16}>
        {/* Left Column - Upload & Video Info */}
        <Col span={8}>
          <Card title="Upload Video" style={{ marginBottom: 16 }}>
            <Upload.Dragger {...uploadProps} disabled={uploading || processing}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag video to upload
              </p>
              <p className="ant-upload-hint">
                Support for MP4, AVI, MOV, MKV (max 100MB)
              </p>
            </Upload.Dragger>

            {uploading && (
              <div style={{ marginTop: 16 }}>
                <Progress percent={progress} status="active" />
                <p>Uploading video... {progress}%</p>
              </div>
            )}

            {processing && !uploading && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Spin size="large" />
                <p>Processing video content...</p>
                <p style={{ fontSize: '12px', color: '#999' }}>
                  Extracting audio and generating transcript
                </p>
              </div>
            )}

            {uploadedVideo && (
              <div style={{ marginTop: 16 }}>
                <Card size="small" title="Uploaded Video" extra={
                  <Button type="link" onClick={clearChat} size="small">
                    Clear Chat
                  </Button>
                }>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <video 
                      controls 
                      style={{ 
                        width: '100%', 
                        maxHeight: '150px',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      <source src={uploadedVideo.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <p style={{ margin: '8px 0 4px 0', fontWeight: 'bold' }}>
                      {uploadedVideo.name}
                    </p>
                    <div>
                      <Tag color="blue">{uploadedVideo.size}</Tag>
                      <Tag color="green">Ready for Q&A</Tag>
                    </div>
                    {sessionId && (
                      <div style={{ marginTop: '8px' }}>
                        <Tag color="orange">
                          Session: {sessionId.substring(0, 8)}...
                        </Tag>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column - Chat Interface */}
        <Col span={16}>
          <Card 
            title="Video Q&A" 
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
                  <VideoCameraOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
                  <p>Upload a video and ask questions about its content</p>
                  {!uploadedVideo && (
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      Please upload a video first
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
                    </div>
                    
                    {/* Show retrieval analysis for assistant messages */}
                    {msg.type === 'assistant' && msg.retrievalAnalysis && msg.retrievalAnalysis.length > 0 && (
                      <div style={{ marginTop: '8px', fontSize: '12px' }}>
                        <Tag color="purple">Video Sections Used</Tag>
                        {msg.retrievalAnalysis.map((item, idx) => (
                          <div key={idx} style={{ marginTop: '4px' }}>
                            <small>
                              <strong>#{item.rank}</strong> ({item.temporal_position}) - 
                              {item.content_preview}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
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
                  uploadedVideo && !processing
                    ? "Ask a question about the video content..." 
                    : processing
                    ? "Processing video... please wait"
                    : "Please upload a video first..."
                }
                disabled={!uploadedVideo || processing}
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
                disabled={!question.trim() || !uploadedVideo || processing}
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

export default VideoAnalyzer;
