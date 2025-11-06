-- Xorigo UI Collaboration & Share System Database Schema
-- PostgreSQL Database Schema for Production Setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- COLLABORATION SCHEMA
-- ============================================

-- Rooms table
CREATE TABLE collaboration_rooms (
    id VARCHAR(255) PRIMARY KEY,
    document_id VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('document', 'template', 'project', 'file')),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    max_users INTEGER DEFAULT 10,
    read_only BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE
);

-- Room participants
CREATE TABLE collaboration_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id VARCHAR(255) NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    color VARCHAR(7) NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Cursor positions
CREATE TABLE collaboration_cursors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id VARCHAR(255) NOT NULL REFERENCES collaboration_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    selection_start INTEGER,
    selection_end INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SHARE LINK SCHEMA
-- ============================================

-- Share links
CREATE TABLE share_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('document', 'template', 'project', 'file')),
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    max_access_count INTEGER,
    access_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'maxed')),
    checksum VARCHAR(255) NOT NULL,
    metadata JSONB,
    url TEXT NOT NULL
);

-- Access records
CREATE TABLE share_access_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL REFERENCES share_links(id) ON DELETE CASCADE,
    user_id UUID,
    user_agent TEXT,
    ip_address INET,
    accessed_at TIMESTAMPTZ DEFAULT NOW(),
    duration INTEGER, -- in seconds
    referrer TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- ============================================
-- TEAM SCHEMA
-- ============================================

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    settings JSONB DEFAULT '{}',
    permissions JSONB DEFAULT '{}'
);

-- Team members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    avatar_url TEXT,
    UNIQUE(team_id, user_id)
);

-- Templates
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('dashboard', 'landing-page', 'form', 'email', 'document', 'presentation', 'custom')),
    author_id UUID NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    ratings_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Template versions
CREATE TABLE template_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    changelog TEXT,
    content JSONB NOT NULL,
    preview TEXT,
    deprecated BOOLEAN DEFAULT FALSE,
    UNIQUE(template_id, version)
);

-- Template tags
CREATE TABLE template_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    tag_color VARCHAR(7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Template usage
CREATE TABLE template_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- ============================================
-- VERSION CONTROL SCHEMA
-- ============================================

-- Versions
CREATE TABLE versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(50) NOT NULL,
    commit_id VARCHAR(255) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    author_id UUID NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    content JSONB NOT NULL,
    previous_version VARCHAR(50),
    metadata JSONB DEFAULT '{}'
);

-- Branches
CREATE TABLE version_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL,
    latest_version_id UUID REFERENCES versions(id) ON DELETE SET NULL,
    parent_branch VARCHAR(100),
    is_merged BOOLEAN DEFAULT FALSE,
    merge_requests TEXT[]
);

-- Merge requests
CREATE TABLE merge_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_branch VARCHAR(100) NOT NULL,
    target_branch VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'merged', 'closed')),
    conflicts JSONB DEFAULT '[]',
    changes JSONB DEFAULT '[]',
    merged_at TIMESTAMPTZ,
    merged_by UUID
);

-- Commits
CREATE TABLE commits (
    id VARCHAR(255) PRIMARY KEY,
    message TEXT NOT NULL,
    author_id UUID NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    content JSONB NOT NULL,
    parent_commit VARCHAR(255),
    branch VARCHAR(100) NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Collaboration indexes
CREATE INDEX idx_collaboration_rooms_document ON collaboration_rooms(document_id);
CREATE INDEX idx_collaboration_participants_room ON collaboration_participants(room_id);
CREATE INDEX idx_collaboration_participants_user ON collaboration_participants(user_id);
CREATE INDEX idx_collaboration_cursors_room ON collaboration_cursors(room_id);

-- Share links indexes
CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_share_links_resource ON share_links(resource_id);
CREATE INDEX idx_share_links_status ON share_links(status);
CREATE INDEX idx_share_links_expires ON share_links(expires_at);
CREATE INDEX idx_share_access_records_link ON share_access_records(link_id);
CREATE INDEX idx_share_access_records_accessed ON share_access_records(accessed_at);

-- Team indexes
CREATE INDEX idx_templates_team ON templates(team_id);
CREATE INDEX idx_templates_author ON templates(author_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_public ON templates(is_public);
CREATE INDEX idx_template_versions_template ON template_versions(template_id);
CREATE INDEX idx_template_usage_template ON template_usage(template_id);
CREATE INDEX idx_template_usage_user ON template_usage(user_id);

-- Version control indexes
CREATE INDEX idx_versions_branch ON versions(branch);
CREATE INDEX idx_versions_timestamp ON versions(timestamp);
CREATE INDEX idx_versions_commit ON versions(commit_id);
CREATE INDEX idx_branches_name ON version_branches(name);
CREATE INDEX idx_merge_requests_status ON merge_requests(status);
CREATE INDEX idx_commits_branch ON commits(branch);
CREATE INDEX idx_commits_timestamp ON commits(timestamp);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaboration_rooms_updated_at BEFORE UPDATE ON collaboration_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check access count limits
CREATE OR REPLACE FUNCTION check_share_access_limit()
RETURNS TRIGGER AS $$
DECLARE
    link_max_count INTEGER;
    current_count INTEGER;
BEGIN
    -- Get max access count for the link
    SELECT max_access_count INTO link_max_count
    FROM share_links
    WHERE id = NEW.link_id;

    -- If there's a limit, check it
    IF link_max_count IS NOT NULL THEN
        SELECT access_count INTO current_count
        FROM share_links
        WHERE id = NEW.link_id;

        IF current_count >= link_max_count THEN
            UPDATE share_links
            SET status = 'maxed'
            WHERE id = NEW.link_id;

            RAISE EXCEPTION 'Maximum access count reached for link %', NEW.link_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce access limits
CREATE TRIGGER enforce_share_access_limit
    BEFORE INSERT ON share_access_records
    FOR EACH ROW EXECUTE FUNCTION check_share_access_limit();

-- Function to increment access count
CREATE OR REPLACE FUNCTION increment_share_access_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE share_links
    SET access_count = access_count + 1
    WHERE id = NEW.link_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update access count
CREATE TRIGGER update_share_access_count
    AFTER INSERT ON share_access_records
    FOR EACH ROW EXECUTE FUNCTION increment_share_access_count();

-- ============================================
-- VIEWS
-- ============================================

-- Active collaboration rooms view
CREATE VIEW active_rooms AS
SELECT
    r.*,
    COUNT(p.id) as participant_count,
    MAX(p.last_activity) as last_activity
FROM collaboration_rooms r
LEFT JOIN collaboration_participants p ON r.id = p.room_id AND p.is_active = true
WHERE r.active = true
GROUP BY r.id;

-- Popular templates view
CREATE VIEW popular_templates AS
SELECT
    t.*,
    COUNT(u.id) as recent_usage
FROM templates t
LEFT JOIN template_usage u ON t.id = u.template_id
    AND u.used_at > NOW() - INTERVAL '30 days'
WHERE t.is_public = true
GROUP BY t.id
ORDER BY t.rating DESC, recent_usage DESC;

-- Share link analytics view
CREATE VIEW share_analytics AS
SELECT
    sl.id,
    sl.token,
    sl.resource_id,
    sl.resource_type,
    sl.created_at,
    sl.expires_at,
    sl.access_count,
    sl.max_access_count,
    COUNT(ar.id) as total_access,
    COUNT(DISTINCT ar.user_id) as unique_users,
    AVG(ar.duration) as avg_duration,
    MAX(ar.accessed_at) as last_access
FROM share_links sl
LEFT JOIN share_access_records ar ON sl.id = ar.link_id
WHERE sl.status = 'active'
GROUP BY sl.id;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default team (System team)
INSERT INTO teams (id, name, description, settings, permissions) VALUES
(uuid_generate_v4(), 'System Team', 'System default team', '{}', '{}');

-- Insert default collaboration room configuration
INSERT INTO collaboration_rooms (id, document_id, document_type, created_by, max_users)
SELECT
    'default_room',
    'default_document',
    'document',
    uuid_generate_v4(),
    10
WHERE NOT EXISTS (SELECT 1 FROM collaboration_rooms WHERE id = 'default_room');
