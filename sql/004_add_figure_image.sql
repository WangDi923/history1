-- 004_add_figure_image.sql
-- Add image_url column to figure_chats table

alter table if exists public.figure_chats
add column if not exists figure_image_url text;

alter table if exists public.figure_chats
add column if not exists figure_description text;
