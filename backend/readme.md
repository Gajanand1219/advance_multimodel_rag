# Advanced Multimodal RAG System

A sophisticated Retrieval-Augmented Generation (RAG) system that processes and analyzes PDF documents, images, and videos using Azure OpenAI services and advanced computer vision techniques.

## 🌟 Features

### 📄 PDF Processing
- **Advanced Text Extraction**: Multi-method text extraction with layout preservation
- **Intelligent Chunking**: Recursive text splitting with semantic preservation
- **Hybrid Retrieval**: Vector search with fallback keyword matching
- **Session Management**: Persistent chat history and document context

### 🖼️ Image Analysis
- **Multi-type OCR**: Standard, scanned, handwriting, and mathematical content recognition
- **Structured Data Extraction**: Charts, tables, and form data parsing
- **Image Enhancement**: Pre-processing for improved OCR accuracy
- **Contextual Q&A**: Intelligent question answering based on image content

### 🎥 Video Processing
- **Audio Extraction**: High-quality audio extraction from video files
- **Advanced Transcription**: Whisper-based transcription with timestamps
- **Temporal Awareness**: Time-aware content retrieval and analysis
- **Hybrid Retrieval**: Ensemble of BM25 and vector search with cross-encoder reranking

## 🏗️ Architecture

### Core Components

#### 1. **PDF Service** (`pdf_service.py`)
- Text extraction using PyMuPDF
- ChromaDB vector storage with Azure OpenAI embeddings
- LangChain integration for RAG pipeline
- Fallback keyword search system

#### 2. **Image Service** (`image_service.py`)
- Azure OpenAI Vision integration
- OpenCV-based image enhancement
- Specialized analysis types (charts, tables, forms, handwriting)
- Session-based image storage and chat history

#### 3. **Video Service** (`video_service.py`)
- MoviePy for audio extraction
- Azure Whisper transcription
- Persistent ChromaDB with temporal metadata
- Advanced reranking with cross-encoders

#### 4. **API Layer** (`main.py`)
- FastAPI RESTful endpoints
- CORS configuration for frontend integration
- Session management with UUID
- Error handling and health monitoring

## 🔧 Installation

### Prerequisites
- Python 3.8+
- Azure OpenAI services
- Azure Speech-to-Text (for video processing)

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd multimodal-rag-system
