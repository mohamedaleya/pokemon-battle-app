CREATE OR REPLACE FUNCTION insert_team()
RETURNS uuid AS $$
DECLARE
    new_team_id uuid;
    team_name text;
    team_exists boolean;
    selected_pokemon_ids uuid[];
BEGIN
    -- Loop to find a unique team name
    LOOP
        -- Generate a random team name from a list of 24 names
        team_name := 'Team ' || (ARRAY[
            'Blaze', 'Thunder', 'Mystic', 'Valor', 'Instinct', 'Shadow', 
            'Flame', 'Aqua', 'Starlight', 'Nova', 'Tempest', 'Aurora', 
            'Nebula', 'Echo', 'Phantom', 'Titan', 'Cyclone', 'Radiance', 
            'Frost', 'Zephyr', 'Inferno', 'Tornado', 'Dynamo', 'Comet'
        ])[floor(random() * 24) + 1];

        -- Check if the team name already exists
        SELECT EXISTS(SELECT 1 FROM team WHERE name = team_name) INTO team_exists;

        -- If the team name does not exist, exit the loop
        IF NOT team_exists THEN
            EXIT;
        END IF;
    END LOOP;

    -- Randomly select Pokémon without repeating teams
    selected_pokemon_ids := ARRAY(
        SELECT id
        FROM pokemon
        WHERE random() > 0.2  -- Add randomness by filtering with random values
        ORDER BY random()
        LIMIT 6
    );

    WHILE array_length(selected_pokemon_ids, 1) < 6 LOOP
        selected_pokemon_ids := array_append(selected_pokemon_ids, (SELECT id FROM pokemon ORDER BY random() LIMIT 1));
    END LOOP;

    -- Insert the new team with the unique name
    INSERT INTO team (name)
    VALUES (team_name)
    RETURNING id INTO new_team_id;

    -- Insert the selected Pokémon into team_pokemon (allow duplicates)
    INSERT INTO team_pokemon (team_id, pokemon_id)
    SELECT new_team_id, unnest(selected_pokemon_ids);

    RETURN new_team_id;
END;
$$ LANGUAGE plpgsql;

SELECT insert_team();
