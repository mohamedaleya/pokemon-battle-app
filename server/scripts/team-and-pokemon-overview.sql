SELECT
    t.name AS team_name,
    p.name AS pokemon_name,
    p.power AS pokemon_power
FROM
    team t
JOIN
    team_pokemon tp ON t.id = tp.team_id
JOIN
    pokemon p ON tp.pokemon_id = p.id
ORDER BY
    t.name, p.name;
