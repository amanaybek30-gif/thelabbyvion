
-- Create storage bucket for group photos
INSERT INTO storage.buckets (id, name, public) VALUES ('group-photos', 'group-photos', true);

-- Allow anyone to upload to group-photos bucket
CREATE POLICY "Allow public upload to group-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'group-photos');

-- Allow anyone to read from group-photos bucket
CREATE POLICY "Allow public read from group-photos" ON storage.objects FOR SELECT USING (bucket_id = 'group-photos');

-- Allow anyone to delete from group-photos bucket
CREATE POLICY "Allow public delete from group-photos" ON storage.objects FOR DELETE USING (bucket_id = 'group-photos');
