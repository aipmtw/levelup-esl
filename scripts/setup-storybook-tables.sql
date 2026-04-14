-- Storybook PWA Database Setup
-- Run these via /admin/ SQL Runner or Supabase dashboard

-- 1. Books catalog
CREATE TABLE IF NOT EXISTS books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title_zh text NOT NULL,
  title_en text NOT NULL,
  age_tier text DEFAULT '3-6',
  languages text[] DEFAULT '{zh,en}',
  page_count int DEFAULT 0,
  cover_url text DEFAULT '',
  price_ntd int DEFAULT 0,
  is_demo boolean DEFAULT false,
  partner_slug text DEFAULT '',
  status text DEFAULT 'draft',
  meta jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 2. Book pages (per-page content)
CREATE TABLE IF NOT EXISTS book_pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  page_num int NOT NULL,
  text_zh text DEFAULT '',
  text_en text DEFAULT '',
  image_url text DEFAULT '',
  audio_zh_url text DEFAULT '',
  audio_en_url text DEFAULT '',
  UNIQUE(book_id, page_num)
);

-- 3. User book ownership
CREATE TABLE IF NOT EXISTS user_books (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  line_user_id text NOT NULL,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  source text DEFAULT 'purchase',
  UNIQUE(line_user_id, book_id)
);

-- 4. Partner / teacher applications
CREATE TABLE IF NOT EXISTS partners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE,
  name text NOT NULL,
  school text DEFAULT '',
  target_age text DEFAULT '',
  line_id text DEFAULT '',
  teaching_approach text DEFAULT '',
  email text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- 5. LINE bot webhook messages
CREATE TABLE IF NOT EXISTS line_bot_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  line_user_id text NOT NULL,
  display_name text DEFAULT '',
  message_text text DEFAULT '',
  reply_token text DEFAULT '',
  raw_event jsonb DEFAULT '{}',
  status text DEFAULT 'received',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_bot_messages ENABLE ROW LEVEL SECURITY;

-- Public read for books and book_pages (catalog is public)
CREATE POLICY "books_public_read" ON books FOR SELECT USING (true);
CREATE POLICY "book_pages_public_read" ON book_pages FOR SELECT USING (true);

-- Service role can do anything (API endpoints use service key)
CREATE POLICY "books_service_all" ON books FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "book_pages_service_all" ON book_pages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "user_books_service_all" ON user_books FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "partners_service_all" ON partners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "line_bot_messages_service_all" ON line_bot_messages FOR ALL USING (auth.role() = 'service_role');

-- Anon insert for partners (public application form)
CREATE POLICY "partners_anon_insert" ON partners FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_book_pages_book ON book_pages(book_id, page_num);
CREATE INDEX IF NOT EXISTS idx_user_books_user ON user_books(line_user_id);
CREATE INDEX IF NOT EXISTS idx_line_bot_messages_user ON line_bot_messages(line_user_id);

-- ============================================
-- SEED DATA: 3 demo books
-- ============================================

INSERT INTO books (slug, title_zh, title_en, age_tier, page_count, cover_url, price_ntd, is_demo, status) VALUES
  ('mei', '小美的冒險', 'Mei''s Adventure', '3-6', 5, '/app/covers/mei.jpg', 0, true, 'published'),
  ('amy', '艾米和彩虹', 'Amy and the Rainbow', '3-6', 5, '/app/covers/amy.jpg', 0, true, 'published'),
  ('max', '阿麥的大日子', 'Max''s Big Day', '4-7', 5, '/app/covers/max.jpg', 0, true, 'published')
ON CONFLICT (slug) DO NOTHING;

-- Seed pages for "mei"
INSERT INTO book_pages (book_id, page_num, text_zh, text_en, image_url) VALUES
  ((SELECT id FROM books WHERE slug='mei'), 1, '小美住在一個小村莊裡。', 'Mei lived in a small village.', '/app/pages/mei-1.jpg'),
  ((SELECT id FROM books WHERE slug='mei'), 2, '有一天，她發現了一條神秘的小路。', 'One day, she found a mysterious path.', '/app/pages/mei-2.jpg'),
  ((SELECT id FROM books WHERE slug='mei'), 3, '小路通往一片美麗的森林。', 'The path led to a beautiful forest.', '/app/pages/mei-3.jpg'),
  ((SELECT id FROM books WHERE slug='mei'), 4, '森林裡住著友善的動物們。', 'Friendly animals lived in the forest.', '/app/pages/mei-4.jpg'),
  ((SELECT id FROM books WHERE slug='mei'), 5, '小美交了許多新朋友。', 'Mei made many new friends.', '/app/pages/mei-5.jpg')
ON CONFLICT (book_id, page_num) DO NOTHING;

-- Seed pages for "amy"
INSERT INTO book_pages (book_id, page_num, text_zh, text_en, image_url) VALUES
  ((SELECT id FROM books WHERE slug='amy'), 1, '艾米最喜歡下雨天。', 'Amy loved rainy days the most.', '/app/pages/amy-1.jpg'),
  ((SELECT id FROM books WHERE slug='amy'), 2, '雨停了，天空出現一道彩虹。', 'When the rain stopped, a rainbow appeared.', '/app/pages/amy-2.jpg'),
  ((SELECT id FROM books WHERE slug='amy'), 3, '艾米決定去尋找彩虹的盡頭。', 'Amy decided to find the end of the rainbow.', '/app/pages/amy-3.jpg'),
  ((SELECT id FROM books WHERE slug='amy'), 4, '她翻過山丘，跨過小溪。', 'She climbed hills and crossed streams.', '/app/pages/amy-4.jpg'),
  ((SELECT id FROM books WHERE slug='amy'), 5, '在彩虹的盡頭，她找到了快樂。', 'At the rainbow''s end, she found happiness.', '/app/pages/amy-5.jpg')
ON CONFLICT (book_id, page_num) DO NOTHING;

-- Seed pages for "max"
INSERT INTO book_pages (book_id, page_num, text_zh, text_en, image_url) VALUES
  ((SELECT id FROM books WHERE slug='max'), 1, '今天是阿麥的生日。', 'Today was Max''s birthday.', '/app/pages/max-1.jpg'),
  ((SELECT id FROM books WHERE slug='max'), 2, '他邀請了所有的朋友來參加派對。', 'He invited all his friends to the party.', '/app/pages/max-2.jpg'),
  ((SELECT id FROM books WHERE slug='max'), 3, '大家一起玩遊戲，吃蛋糕。', 'Everyone played games and ate cake.', '/app/pages/max-3.jpg'),
  ((SELECT id FROM books WHERE slug='max'), 4, '阿麥許了一個願望。', 'Max made a wish.', '/app/pages/max-4.jpg'),
  ((SELECT id FROM books WHERE slug='max'), 5, '這是阿麥最開心的一天！', 'It was Max''s happiest day ever!', '/app/pages/max-5.jpg')
ON CONFLICT (book_id, page_num) DO NOTHING;
