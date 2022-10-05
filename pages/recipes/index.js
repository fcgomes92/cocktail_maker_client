import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import Button from "@mui/material/Button";
import styles from "../../styles/app.module.css";
import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const [tagsResponse, ingredientsResponse, recipesResponse] =
    await Promise.all([
      fetch("http://localhost:8080/tags"),
      fetch("http://localhost:8080/ingredients"),
      fetch("http://localhost:8080/recipes"),
    ]);
  const [tags, ingredients, recipes] = await Promise.all([
    tagsResponse.json(),
    ingredientsResponse.json(),
    recipesResponse.json(),
  ]);

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      tags,
      ingredients,
      recipes,
    },
  };
}

export function RecipeCard({ recipe }) {
  return (
    <ListItem disablePadding>
      <ListItemButton component="a" href={`/recipes/${recipe.id}/details`}>
        <ListItemText primary={recipe.name} />
      </ListItemButton>
    </ListItem>
  );
  return <div className={styles.card}></div>;
}

export default function Home({ recipes }) {
  return (
    <>
      <List>
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </List>
    </>
  );
}
