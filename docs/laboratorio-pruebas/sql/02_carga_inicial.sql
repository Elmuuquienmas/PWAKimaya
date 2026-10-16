-- Estado inicial del laboratorio: una sesion de prueba (id 1) y un comando de ejemplo.
-- La PWA manda sus comandos con sessionId = 1.

insert into public.game_sessions (id, player_name, device_info, connected_at)
overriding system value
values (1, 'Falin', 'PWA de prueba', now())
on conflict (id) do nothing;

insert into public.command_logs (game_session_id, action_type, payload, executed_at)
values (1, 'A', '{"b":"A","s":1}', now());

select setval(pg_get_serial_sequence('public.game_sessions', 'id'),
              (select max(id) from public.game_sessions));
