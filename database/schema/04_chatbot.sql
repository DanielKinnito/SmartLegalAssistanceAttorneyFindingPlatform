-- Chatbot-related tables for Smart Legal Assistance Platform

-- Create conversation sessions
CREATE TABLE IF NOT EXISTS legal.chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    case_id UUID REFERENCES legal.cases(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create chat messages
CREATE TABLE IF NOT EXISTS legal.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES legal.chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT valid_sender CHECK (sender IN ('user', 'assistant', 'system'))
);

-- Create entity recognition
CREATE TABLE IF NOT EXISTS legal.recognized_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES legal.chat_messages(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_value TEXT NOT NULL,
    start_pos INTEGER,
    end_pos INTEGER,
    confidence DECIMAL(5, 4) CHECK (confidence >= 0.0 AND confidence <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_entity_type CHECK (entity_type IN (
        'person', 'organization', 'location', 'date', 'time', 'money', 
        'percent', 'law', 'court', 'citation', 'legal_term', 'custom'
    ))
);

-- Create legal topic classification
CREATE TABLE IF NOT EXISTS legal.chat_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES legal.chat_sessions(id) ON DELETE CASCADE,
    topic VARCHAR(100) NOT NULL,
    confidence DECIMAL(5, 4) CHECK (confidence >= 0.0 AND confidence <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create knowledge base articles
CREATE TABLE IF NOT EXISTS legal.knowledge_base_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags VARCHAR(255)[],
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    vector_embedding VECTOR(1536)
);

-- Create chat references to knowledge base articles
CREATE TABLE IF NOT EXISTS legal.chat_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES legal.chat_messages(id) ON DELETE CASCADE,
    article_id UUID NOT NULL REFERENCES legal.knowledge_base_articles(id) ON DELETE CASCADE,
    relevance_score DECIMAL(5, 4) CHECK (relevance_score >= 0.0 AND relevance_score <= 1.0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_message_article UNIQUE (message_id, article_id)
);

-- Create document analysis requests
CREATE TABLE IF NOT EXISTS legal.document_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES legal.client_documents(id) ON DELETE SET NULL,
    file_path VARCHAR(255),
    analysis_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    result_summary TEXT,
    result_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_analysis_type CHECK (analysis_type IN (
        'contract_review', 'legal_research', 'document_summarization',
        'clause_extraction', 'risk_assessment', 'custom'
    )),
    CONSTRAINT valid_status CHECK (status IN (
        'pending', 'processing', 'completed', 'failed', 'cancelled'
    ))
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON legal.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_case_id ON legal.chat_sessions(case_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON legal.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON legal.chat_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_recognized_entities_message_id ON legal.recognized_entities(message_id);
CREATE INDEX IF NOT EXISTS idx_recognized_entities_entity_type ON legal.recognized_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_chat_topics_session_id ON legal.chat_topics(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_topics_topic ON legal.chat_topics(topic);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_articles_category ON legal.knowledge_base_articles(category);
CREATE INDEX IF NOT EXISTS idx_chat_references_message_id ON legal.chat_references(message_id);
CREATE INDEX IF NOT EXISTS idx_document_analyses_user_id ON legal.document_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_document_analyses_status ON legal.document_analyses(status); 