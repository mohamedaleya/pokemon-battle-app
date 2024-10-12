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

app.use(cors());
app.use(express.json());

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
    const { power, life, typeName } = req.body;

    if (!power || !life || !typeName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: existingPokemon, error: existingError } = await supabase
      .from("pokemon")
      .select("*")
      .eq("id", id)
      .single();

    if (existingError || !existingPokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }

    const { data: typeData, error: typeError } = await supabase
      .from("pokemon_type")
      .select("id")
      .ilike("name", typeName)
      .single();

    if (typeError || !typeData) {
      return res.status(400).json({ message: "Invalid pokemon type" });
    }

    const updateData = {
      id,
      type: typeData.id,
      power,
      life,
    };

    const { data: updatedPokemon, error: updateError } = await supabase
      .from("pokemon")
      .upsert(updateData)
      .select();

    if (updateError || !updatedPokemon || updatedPokemon.length === 0) {
      return res.status(500).json({ message: "Pokemon not updated" });
    }

    const { data: fetchedPokemon, error: fetchError } = await supabase
      .from("pokemon")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const pokemonWithType = {
      ...fetchedPokemon,
      typeName,
    };

    res.json(pokemonWithType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
