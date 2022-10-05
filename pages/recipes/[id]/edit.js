import Description from "@mui/icons-material/Description";
import { List, ListItem, ListItemText } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";

export async function getStaticPaths(ctx) {
  const recipesR = await fetch(`http://localhost:8080/recipes`);
  const recipes = await recipesR.json();
  const paths = recipes.map((r) => ({ params: { id: String(r.id) } }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { id } }) {
  // Call an external API endpoint to get posts
  const [recipeResponse, ingredientsResponse, tagsResponse] = await Promise.all(
    [
      fetch(`http://localhost:8080/recipes/${id}`),
      fetch(`http://localhost:8080/ingredients`),
      fetch(`http://localhost:8080/tags`),
    ]
  );
  const [recipe, ingredients, tags] = await Promise.all([
    recipeResponse.json(),
    ingredientsResponse.json(),
    tagsResponse.json(),
  ]);

  return {
    props: {
      recipe,
      tags,
      ingredients,
    },
  };
}

export function IngredientSelector({ recipe, ingredients, onChange }) {
  const siInitialState = {
    ingredient: {},
    unit: "",
    amount: 0,
  };
  const [selectedIngredient, setSelectedIngredient] = useState(siInitialState);
  const availableIngredients = useMemo(
    () =>
      ingredients.filter(
        (i) => !recipe.ingredients.find((ii) => ii.ingredient.id === i.id)
      ),
    [ingredients, recipe]
  );
  const handleAddIngredient = async (event) => {
    event.preventDefault();
    if (onChange) onChange([...recipe.ingredients, selectedIngredient]);
    setSelectedIngredient(siInitialState);
  };
  const handleRemoveIngredient = (id) => (event) => {
    if (onChange)
      onChange(recipe.ingredients.filter((i) => i.ingredient.id !== id));
  };
  const handleSelectIngredient = (key) => (event) => {
    setSelectedIngredient({
      ...selectedIngredient,
      [key]: event.target.value,
    });
  };
  return (
    <>
      {availableIngredients.length ? (
        <Grid
          container
          spacing={2}
          component="form"
          noValidate
          onSubmit={handleAddIngredient}
        >
          <Grid item>
            <Select
              fullWidth
              id="selectedIngredient"
              name="selectedIngredient"
              value={selectedIngredient.ingredient.id}
              onChange={handleSelectIngredient("ingredient")}
            >
              {availableIngredients.map((ingredient) => (
                <MenuItem key={ingredient.id} value={ingredient}>
                  {ingredient.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item>
            <TextField
              label="Amount"
              value={selectedIngredient.amount}
              onChange={handleSelectIngredient("amount")}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Unit"
              value={selectedIngredient.unit}
              onChange={handleSelectIngredient("unit")}
            />
          </Grid>
          <Grid item>
            <Button onClick={handleAddIngredient} fullWidth variant="contained">
              +
            </Button>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      <Grid container spacing={2}>
        <List>
          {recipe.ingredients.map(({ ingredient, unit, amount }) => {
            return (
              <ListItem key={ingredient.id}>
                <ListItemText
                  onClick={handleRemoveIngredient(ingredient.id)}
                  value={ingredient.id}
                >
                  {ingredient.name} - {amount} {unit}
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Grid>
    </>
  );
}

export default function RecipeUpdate({ recipe: r, ingredients, tags }) {
  const [recipe, updateRecipe] = useState(r);
  const handleIngredientChange = (ingredients) => {
    updateRecipe({ ...recipe, ingredients });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { id, created_at, updated_at, ...r } = recipe;
    const payload = {
      ...r,
      tags: recipe.tags.map((t) => t.id),
      ingredients: recipe.ingredients.map((i) => ({
        ingredient_id: i.ingredient.id,
        unit: i.unit,
        amount: i.amount,
      })),
    };
    const response = await fetch(`http://localhost:8080/recipes/${recipe.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };
  const handleChange = (key) => (event) => {
    updateRecipe({ ...recipe, [key]: event.target.value });
  };
  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <Description />
      </Avatar>
      <Typography component="h1" variant="h5">
        Update Recipe
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              required
              fullWidth
              id="name"
              label="Name"
              autoFocus
              value={recipe.name}
              onChange={handleChange("name")}
            />
          </Grid>
          <Grid item xs={12}>
            <IngredientSelector
              recipe={recipe}
              ingredients={ingredients}
              onChange={handleIngredientChange}
            />
            {/* <FormControl fullWidth>
              <InputLabel id="ingredients-label">Ingredients</InputLabel>
              <Select
                multiple
                fullWidth
                id="ingredients"
                label="Ingredients"
                name="ingredients"
                value={recipe.ingredients.map((i) => i.ingredient.id)}
              >
                {ingredients.map((ingredient) => (
                  <MenuItem key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="ingredients-label">Tags</InputLabel>
              <Select
                multiple
                fullWidth
                id="tags"
                label="Tags"
                name="tags"
                value={recipe.tags.map((t) => t.id)}
                onChange={(e) => {
                  updateRecipe({
                    ...recipe,
                    tags: tags.filter((t) => e.target.value.includes(t.id)),
                  });
                }}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              required
              fullWidth
              id="description"
              label="Description"
              multiline
              value={recipe.description}
              onChange={handleChange("description")}
            />
          </Grid>
          <Grid item xs={12}>
            <ReactMarkdown>{recipe.description}</ReactMarkdown>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
}
