-- Consultas para las capturas de antes y despues del envio de comandos.

select count(*) as total_comandos from public.command_logs;

select c.id, s.player_name, c.action_type, c.payload, c.executed_at
from public.command_logs c
join public.game_sessions s on s.id = c.game_session_id
order by c.id desc
limit 20;

-- Integridad: no debe haber comandos sin sesion valida.
select count(*) as comandos_sin_sesion
from public.command_logs c
left join public.game_sessions s on s.id = c.game_session_id
where s.id is null;
