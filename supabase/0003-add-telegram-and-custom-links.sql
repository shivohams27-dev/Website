ALTER TABLE public.site_config
ADD COLUMN telegram_url text,
ADD COLUMN custom_links jsonb DEFAULT '[]'::jsonb;
