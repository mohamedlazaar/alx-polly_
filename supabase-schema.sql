-- PollMaster Database Schema for Supabase
-- This schema creates the necessary tables for storing polls, options, and votes
-- 
-- IMPORTANT: Run this schema in your Supabase project's SQL Editor
-- Do not run this in a regular PostgreSQL database as it uses Supabase-specific features

-- Create custom types
CREATE TYPE poll_status AS ENUM ('active', 'inactive', 'expired');

-- Create polls table
CREATE TABLE polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    allow_multiple_votes BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    status poll_status DEFAULT 'active',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table
CREATE TABLE poll_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    voter_email VARCHAR(255), -- For anonymous voting
    voter_name VARCHAR(255), -- For anonymous voting
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, option_id, user_id), -- Prevent duplicate votes from same user
    UNIQUE(poll_id, option_id, voter_email) -- Prevent duplicate votes from same email
);

-- Create indexes for better performance
CREATE INDEX idx_polls_created_by ON polls(created_by);
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_poll_options_updated_at BEFORE UPDATE ON poll_options
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update poll status based on expiration
CREATE OR REPLACE FUNCTION update_poll_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status to 'expired' if expires_at is in the past
    UPDATE polls 
    SET status = 'expired', is_active = false
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW() 
    AND status = 'active';
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to check poll expiration
CREATE TRIGGER check_poll_expiration
    AFTER INSERT OR UPDATE ON polls
    FOR EACH ROW EXECUTE FUNCTION update_poll_status();

-- Create function to get vote counts for poll options
CREATE OR REPLACE FUNCTION get_poll_option_vote_count(option_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    vote_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO vote_count
    FROM votes
    WHERE option_id = option_uuid;
    
    RETURN vote_count;
END;
$$ language 'plpgsql';

-- Create function to get total votes for a poll
CREATE OR REPLACE FUNCTION get_poll_total_votes(poll_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_votes INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_votes
    FROM votes
    WHERE poll_id = poll_uuid;
    
    RETURN total_votes;
END;
$$ language 'plpgsql';

-- Create view for poll statistics
CREATE VIEW poll_stats AS
SELECT 
    p.id as poll_id,
    p.title,
    p.description,
    p.created_by,
    p.created_at,
    p.expires_at,
    p.is_active,
    p.allow_multiple_votes,
    p.is_public,
    p.status,
    COUNT(DISTINCT po.id) as total_options,
    COUNT(DISTINCT v.id) as total_votes,
    COUNT(DISTINCT v.user_id) + COUNT(DISTINCT v.voter_email) as unique_voters
FROM polls p
LEFT JOIN poll_options po ON p.id = po.poll_id
LEFT JOIN votes v ON p.id = v.poll_id
GROUP BY p.id, p.title, p.description, p.created_by, p.created_at, p.expires_at, p.is_active, p.allow_multiple_votes, p.is_public, p.status;

-- Enable Row Level Security (RLS)
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for polls table
CREATE POLICY "Users can view public polls" ON polls
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create polls" ON polls
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" ON polls
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" ON polls
    FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for poll_options table
CREATE POLICY "Users can view poll options for public polls" ON poll_options
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND (polls.is_public = true OR polls.created_by = auth.uid())
        )
    );

CREATE POLICY "Users can create options for their own polls" ON poll_options
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can update options for their own polls" ON poll_options
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

CREATE POLICY "Users can delete options for their own polls" ON poll_options
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = poll_options.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Create RLS policies for votes table
CREATE POLICY "Users can view votes for public polls" ON votes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND (polls.is_public = true OR polls.created_by = auth.uid())
        )
    );

CREATE POLICY "Users can vote on polls" ON votes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.is_active = true
            AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
        )
    );

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM polls 
            WHERE polls.id = votes.poll_id 
            AND polls.created_by = auth.uid()
        )
    );

-- Create function to prevent voting on expired polls
CREATE OR REPLACE FUNCTION check_poll_active()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if poll is active and not expired
    IF NOT EXISTS (
        SELECT 1 FROM polls 
        WHERE id = NEW.poll_id 
        AND is_active = true 
        AND (expires_at IS NULL OR expires_at > NOW())
    ) THEN
        RAISE EXCEPTION 'Cannot vote on inactive or expired poll';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to check poll status before voting
CREATE TRIGGER check_poll_active_before_vote
    BEFORE INSERT ON votes
    FOR EACH ROW EXECUTE FUNCTION check_poll_active();

-- Create function to prevent multiple votes on same option (unless allowed)
CREATE OR REPLACE FUNCTION check_multiple_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if multiple votes are allowed
    IF NOT EXISTS (
        SELECT 1 FROM polls 
        WHERE id = NEW.poll_id 
        AND allow_multiple_votes = true
    ) THEN
        -- Check if user already voted on this option
        IF EXISTS (
            SELECT 1 FROM votes 
            WHERE poll_id = NEW.poll_id 
            AND option_id = NEW.option_id 
            AND (
                (NEW.user_id IS NOT NULL AND user_id = NEW.user_id) OR
                (NEW.voter_email IS NOT NULL AND voter_email = NEW.voter_email)
            )
        ) THEN
            RAISE EXCEPTION 'Multiple votes not allowed on this option';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to check multiple votes
CREATE TRIGGER check_multiple_votes_before_insert
    BEFORE INSERT ON votes
    FOR EACH ROW EXECUTE FUNCTION check_multiple_votes();

-- Insert sample data for testing (optional)
-- INSERT INTO polls (title, description, created_by, allow_multiple_votes, is_public) 
-- VALUES ('Sample Poll', 'This is a sample poll for testing', '00000000-0000-0000-0000-000000000000', false, true);

-- INSERT INTO poll_options (poll_id, text) 
-- VALUES 
--     ((SELECT id FROM polls WHERE title = 'Sample Poll'), 'Option 1'),
--     ((SELECT id FROM polls WHERE title = 'Sample Poll'), 'Option 2'),
--     ((SELECT id FROM polls WHERE title = 'Sample Poll'), 'Option 3');

-- Schema setup complete!
-- 
-- To reset the database during development, use the reset script in DATABASE_SETUP.md
-- or run the DROP statements manually in the SQL Editor.
