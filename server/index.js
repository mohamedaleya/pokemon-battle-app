import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing. Please check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/api/pokemon", async (req, res) => {
  try {
    const { data: pokemonData, error: pokemonError } = await supabase
      .from("pokemon")
      .select("*")
      .order("name");

    if (pokemonError) throw pokemonError;

    const { data: typeData, error: typeError } = await supabase
      .from("pokemon_type")
      .select("*");

    if (typeError) throw typeError;

    const pokemonList = pokemonData.map((pokemon) => {
      const pokemonType = typeData.find((type) => type.id === pokemon.type);
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        power: pokemon.power,
        life: pokemon.life,
        typeName: pokemonType ? pokemonType.name : null,
      };
    });

    res.json(pokemonList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/pokemon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data: pokemon, error: pokemonError } = await supabase
      .from("pokemon")
      .select("*")
      .eq("id", id)
      .single();

    if (pokemonError) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    const { data: pokemonType, error: typeError } = await supabase
      .from("pokemon_type")
      .select("name")
      .eq("id", pokemon.type)
      .single();

    if (typeError) throw typeError;

    const pokemonWithType = {
      ...pokemon,
      typeName: pokemonType ? pokemonType.name : null,
    };

    res.json(pokemonWithType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/pokemon/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, power, life, typeName, image } = req.body;

    if (!name || !power || !life || !typeName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert power and life to numbers
    const numPower = Number(power);
    const numLife = Number(life);

    if (isNaN(numPower) || isNaN(numLife)) {
      return res.status(400).json({ error: "Invalid power or life value" });
    }

    // Fetch the type ID
    const { data: typeData, error: typeError } = await supabase
      .from("pokemon_type")
      .select("id")
      .ilike("name", typeName)
      .single();

    if (typeError || !typeData) {
      return res.status(400).json({ message: "Invalid pokemon type" });
    }

    // Prepare the update data
    const updateData = {
      id,
      name,
      type: typeData.id,
      power: numPower,
      life: numLife,
      image: image || null,
    };

    // Update the Pokemon
    const { data: updatedPokemon, error: updateError } = await supabase
      .from("pokemon")
      .update(updateData)
      .eq("id", id)
      .select();

    if (updateError) {
      console.error("Error updating Pokemon:", updateError);
      return res
        .status(500)
        .json({ message: "Pokemon not updated", error: updateError.message });
    }

    if (!updatedPokemon || updatedPokemon.length === 0) {
      return res.status(500).json({ message: "Pokemon not updated" });
    }

    const pokemonWithType = {
      ...updatedPokemon[0],
      typeName,
    };

    res.json(pokemonWithType);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    // Call the PostgreSQL function using Supabase
    const { data: teams, error } = await supabase.rpc(
      "get_teams_ordered_by_power"
    );

    // Handle error if any
    if (error) {
      console.error("Error fetching teams:", error);
      return res.status(500).json({ message: "Error fetching teams" });
    }

    // Send the list of teams with their total power
    res.json(teams);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
