"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Recipe {
  recipeName: string;
  ingredientsList: string;
  instructions: string;
}

interface RecipeDisplayProps {
  recipe: Recipe;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <Card className="w-full max-w-2xl mt-8 bg-card shadow-md rounded-lg overflow-hidden">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
          {recipe.recipeName}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Here are the ingredients and instructions to make your recipe.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid gap-4">
        <div>
          <h3 className="text-lg font-medium leading-none text-foreground">Ingredients:</h3>
          <p className="text-sm text-muted-foreground">{recipe.ingredientsList}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium leading-none text-foreground">Instructions:</h3>
          <p className="text-sm text-muted-foreground">{recipe.instructions}</p>
        </div>
      </CardContent>
    </Card>
  );
};
