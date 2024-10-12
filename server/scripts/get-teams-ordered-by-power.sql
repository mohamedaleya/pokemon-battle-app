CREATE OR REPLACE FUNCTION get_teams_ordered_by_power()
RETURNS TABLE (
    team_name text,
    total_power int
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.name AS team_name,
        SUM(p.power)::int AS total_power
    FROM
        team t
    JOIN
        team_pokemon tp ON t.id = tp.team_id
    JOIN
        pokemon p ON tp.pokemon_id = p.id
    GROUP BY
        t.name
    ORDER BY
        total_power DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_teams_ordered_by_power();