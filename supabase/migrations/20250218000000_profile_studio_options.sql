-- Studio-style profile options
alter table profiles add column if not exists hero_style text default 'cover';
alter table profiles add column if not exists works_layout text default 'grid';
alter table profiles add column if not exists availability text;
alter table profiles add column if not exists links jsonb default '[]';

-- Optional link per work
alter table works add column if not exists link text;
