# Advanced Multimodal RAG System

A comprehensive web application for processing and analyzing PDF documents, images, and videos using AI-powered Retrieval-Augmented Generation (RAG) technology.

## 🌟 Overview

This system provides an intuitive web interface for uploading and analyzing various file types with advanced AI capabilities:

- **📄 PDF Document Analysis**: Extract text, process content, and answer questions
- **🖼️ Image Content Analysis**: OCR, structured data extraction, and visual Q&A
- **🎥 Video Content Analysis**: Audio transcription, temporal analysis, and video Q&A

## 🚀 Features

### Core Functionality
- **Multi-format Support**: PDF, JPG/PNG images, MP4/AVI/MOV videos
- **Real-time Processing**: Live progress tracking and status updates
- **Session Management**: Persistent chat history and file sessions
- **Responsive Design**: Mobile-friendly Ant Design interface

### PDF Analysis
- Advanced text extraction with layout preservation
- Intelligent chunking and semantic search
- Hybrid retrieval (vector + keyword search)
- Document statistics and processing insights

### Image Analysis
- Multi-type OCR (standard, scanned, handwriting, mathematical)
- Structured data extraction (charts, tables, forms)
- Image enhancement for better OCR accuracy
- Context-aware question answering

### Video Analysis
- High-quality audio extraction
- Whisper-based transcription with timestamps
- Temporal content retrieval
- Ensemble retrieval with cross-encoder reranking

## 🏗️ Architecture

### Frontend Components

#### **Dashboard** (`Dashboard.js`)
- Central hub with file type selection
- System statistics overview
- Quick access to analyzers
- Real-time metrics display

#### **PDF Analyzer** (`PdfAnalyzer.js`)
- Drag-and-drop PDF upload
- Progress tracking with visual indicators
- Interactive chat interface
- Retrieval analysis visualization
- Session-based document management

#### **Image Analyzer** (`ImageAnalyzer.js`)
- Image preview with metadata
- Specialized analysis types
- Real-time chat with analysis type tagging
- Image enhancement controls
- Clear chat history functionality

#### **Video Analyzer** (`VideoAnalyzer.js`)
- Video player with upload preview
- Processing status with detailed messages
- Temporal retrieval analysis
- Video metadata display
- Session persistence

#### **Main Application** (`App.js`)
- Responsive layout with collapsible sidebar
- Navigation between different analyzers
- Theme configuration
- Consistent UI/UX across all components

### Backend Integration
- **RESTful API** communication with FastAPI backend
- **Real-time Updates** with progress tracking
- **Error Handling** with user-friendly messages
- **Session Persistence** across browser sessions

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+
- React 18+
- Ant Design 5+
- Axios for API communication

### Frontend Setup

1. **Install Dependencies**
```bash
npm install antd @ant-design/icons axios react-router-dom
