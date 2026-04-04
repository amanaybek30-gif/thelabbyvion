
CREATE TABLE public.participants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  team_name TEXT NOT NULL DEFAULT '',
  is_winner BOOLEAN NOT NULL DEFAULT false,
  award_title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  group_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.groups (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  member_ids TEXT[] NOT NULL DEFAULT '{}',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to participants" ON public.participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to groups" ON public.groups FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
