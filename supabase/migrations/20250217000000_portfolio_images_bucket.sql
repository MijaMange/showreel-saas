-- Create public bucket for portfolio images
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- Policy: users can upload only to their own folder (auth.uid()/...)
create policy "Users upload to own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: users can update/delete their own files
create policy "Users manage own files"
on storage.objects for all
to authenticated
using (
  bucket_id = 'portfolio-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'portfolio-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: public read (bucket is public, files are readable by anyone)
create policy "Public read"
on storage.objects for select
to public
using (bucket_id = 'portfolio-images');
