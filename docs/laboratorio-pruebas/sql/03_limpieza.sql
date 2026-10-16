-- Deja la base vacia para repetir el laboratorio desde cero.
-- Despues de correrlo, vuelve a ejecutar 02_carga_inicial.sql.

truncate table public.command_logs, public.game_sessions restart identity cascade;
