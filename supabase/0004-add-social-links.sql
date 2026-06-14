ALTER TABLE public.site_config
ADD COLUMN social_links jsonb DEFAULT '[{"label": "GitHub", "url": "https://github.com/Shivoham-Lab"}, {"label": "LinkedIn", "url": "https://linkedin.com/company/shivoham-lab"}, {"label": "Email", "url": "mailto:shivoham.s27@gmail.com"}]'::jsonb;
