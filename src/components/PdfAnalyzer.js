import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Progress, 
  Input,
  message,
  Row,
  Col,
  List,
  Tag,
  Spin
} from 'antd';
import { 
  FilePdfOutlined, 
  CloudUploadOutlined,
  SearchOutlined,
  SendOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const API_BASE = 'https://advance-multimodel-rag-backend.onrender.com';

const PdfAnalyzer = () => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // Get session ID from URL parameters
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
      const isPdf = file.type === 'application/pdf';
      if (!isPdf) {
        message.error('You can only upload PDF files!');
        return false;
      }
      handlePdfUpload(file);
      return false;
    }
  };

  const handlePdfUpload = async (file) => {
    setUploading(true);
    setProcessing(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('enable_enhanced_ocr', 'true');
    formData.append('enable_chart_analysis', 'true');
    formData.append('enable_handwriting', 'true');
    formData.append('enable_table_extraction', 'true');

    try {
      const response = await axios.post(`${API_BASE}/pdf/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      console.log('Upload response:', response.data); // Debug log

      if (response.data.status === 'success') {
        const sessionId = response.data.session_id;
        setSessionId(sessionId);
        setUploadedFile({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          sessionId: sessionId,
          statistics: response.data.statistics
        });
        
        message.success('PDF uploaded and processed successfully!');
        
        // Fetch initial chat history
        fetchChatHistory(sessionId);
      } else {
        message.error('Upload failed: ' + response.data.detail);
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  };

  const fetchChatHistory = async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE}/pdf/chat-history/${sessionId}`);
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
      message.warning('Please upload a PDF and enter a question!');
      return;
    }

    // Add user message to chat immediately
    const userMessage = {
      type: 'user',
      content: question,
      time: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    const currentQuestion = question;
    setQuestion('');

    try {
      // Send question to backend
      const response = await axios.post(`${API_BASE}/pdf/ask`, {
        session_id: sessionId,
        question: currentQuestion
      });

      console.log('Ask response:', response.data); // Debug log

      if (response.data.status === 'success') {
        // Add AI response to chat
        const aiMessage = {
          type: 'assistant',
          content: response.data.answer,
          time: new Date().toLocaleTimeString(),
          retrievalAnalysis: response.data.retrieval_analysis
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.data.detail);
      }

    } catch (error) {
      console.error('Ask error:', error);
      message.error('Error getting response: ' + (error.response?.data?.detail || error.message));
      
      // Add error message to chat
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
      await axios.post(`${API_BASE}/pdf/clear-history`, {
        session_id: sessionId
      });
      setChatMessages([]);
      message.success('Chat history cleared!');
    } catch (error) {
      message.error('Failed to clear chat history');
    }
  };

  return (
    <div className="pdf-analyzer-page">
      <div className="page-header">
        <h1><FilePdfOutlined /> PDF Document Analyzer</h1>
        <p>Upload PDF files and ask questions about their content</p>
      </div>

      <Row gutter={16}>
        {/* Left Column - Upload & File Info */}
        <Col span={8}>
          <Card title="Upload PDF" style={{ marginBottom: 16 }}>
            <Upload.Dragger {...uploadProps} disabled={uploading}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag PDF to upload
              </p>
              <p className="ant-upload-hint">
                Support for single PDF file
              </p>
            </Upload.Dragger>

            {uploading && (
              <div style={{ marginTop: 16 }}>
                <Progress percent={progress} status="active" />
                <p>Uploading PDF... {progress}%</p>
              </div>
            )}

            {processing && !uploading && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Spin size="large" />
                <p>Processing PDF content...</p>
              </div>
            )}

            {uploadedFile && (
              <div style={{ marginTop: 16 }}>
                <Card size="small" title="Uploaded File" extra={
                  <Button type="link" onClick={clearChat} size="small">
                    Clear Chat
                  </Button>
                }>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<FilePdfOutlined />}
                      title={uploadedFile.name}
                      description={
                        <div>
                          <Tag color="blue">{uploadedFile.size}</Tag>
                          <Tag color="green">Ready for Q&A</Tag>
                          {uploadedFile.statistics && (
                            <div style={{ marginTop: 8 }}>
                              <small>
                                📖 {uploadedFile.statistics.text_chunks} text chunks<br/>
                                🖼️ {uploadedFile.statistics.visual_chunks} visual elements<br/>
                                📋 {uploadedFile.statistics.table_chunks} table structures
                              </small>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                </Card>
              </div>
            )}
          </Card>
        </Col>

        {/* Right Column - Chat Interface */}
        <Col span={16}>
          <Card 
            title="PDF Q&A" 
            extra={
              <div>
                <SearchOutlined /> 
                {sessionId && (
                  <Tag color="orange" style={{ marginLeft: 8 }}>
                    Session: {sessionId.substring(0, 8)}...
                  </Tag>
                )}
              </div>
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
                  <FilePdfOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
                  <p>Upload a PDF and ask questions about its content</p>
                  {!uploadedFile && (
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                      Please upload a PDF file first
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
                    {msg.type === 'assistant' && msg.retrievalAnalysis && (
                      <div style={{ marginTop: '8px', fontSize: '12px' }}>
                        <Tag color="purple">Retrieval Analysis</Tag>
                        {msg.retrievalAnalysis.map((item, idx) => (
                          <div key={idx} style={{ marginTop: '4px' }}>
                            
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
                  uploadedFile 
                    ? "Ask a question about the PDF content..." 
                    : "Please upload a PDF file first..."
                }
                disabled={!uploadedFile || processing}
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
                disabled={!question.trim() || !uploadedFile || processing}
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

export default PdfAnalyzer;
