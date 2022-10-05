import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import * as React from "react";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
  const [recipeResponse] = await Promise.all([
    fetch(`http://localhost:8080/recipes/${id}`),
  ]);
  const [recipe] = await Promise.all([recipeResponse.json()]);

  return {
    props: {
      recipe,
    },
  };
}

export default function RecipeDetails({ recipe }) {
  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardHeader
          action={
            <IconButton href={`/recipes/${recipe.id}/edit`}>
              <EditIcon />
            </IconButton>
          }
          title={recipe.name}
          subheader={`Rate: ${Number(recipe.rate).toFixed(0)}/10`}
        />
        <CardContent>
          <Typography variant="h5" component="div">
            Ingredients:
          </Typography>
          {recipe.ingredients.map((i) => (
            <Typography variant="body2" component="div" key={i.id}>
              {i.ingredient.name} - {i.amount} {i.unit}
            </Typography>
          ))}
          <hr />
          <ReactMarkdown>{recipe.description}</ReactMarkdown>
        </CardContent>
        <CardActions disableSpacing>
          <Grid container spacing={2} justifyContent="flex-end">
            {recipe.tags.map((i) => (
              <Grid item key={i.id}>
                <Chip label={i.name} />
              </Grid>
            ))}
          </Grid>
        </CardActions>
      </Card>
    </>
  );
}
