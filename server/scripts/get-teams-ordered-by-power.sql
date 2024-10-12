CREATE
OR REPLACE FUNCTION get_teams_ordered_by_power () RETURNS TABLE (id UUID, team_name TEXT, total_power INT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id AS id,
        t.name AS team_name,
        SUM(p.power)::int AS total_power
    FROM
        team t
    JOIN
        team_pokemon tp ON t.id = tp.team_id
    JOIN
        pokemon p ON tp.pokemon_id = p.id
    GROUP BY
        t.id, t.name
    ORDER BY
        total_power DESC;
END;
$$ LANGUAGE plpgsql;

SELECT
  *
FROM
  get_teams_ordered_by_power ();