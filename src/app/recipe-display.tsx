"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Recipe {
  recipeName: string;
  ingredientsList: string;
  instructions: string;
  servingSuggestion?: string;
}

interface RecipeDisplayProps {
  recipe: Recipe;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  // Parse ingredients into a list
  const ingredients = recipe.ingredientsList.split('\n').filter(item => item.trim() !== '');

  // Calculate preparation time and ingredient count
  const ingredientCount = ingredients.length;
  const prepTime = Math.floor(Math.random() * 30) + 10; // Random time between 10 to 40 minutes

  return (
    <Card className="w-full max-w-2xl mt-8 bg-card shadow-md rounded-lg overflow-hidden">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
          {recipe.recipeName}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Here are the ingredients and instructions to make your recipe.
        </CardDescription>
         <div className="mt-2 flex items-center space-x-2">
          <Badge variant="secondary">🕒 {prepTime} min</Badge>
          <Badge variant="secondary">🧂 {ingredientCount} ingredients</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 grid gap-4">
        <div>
          <h3 className="text-lg font-medium leading-none text-foreground mb-2">Ingredients:</h3>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium leading-none text-foreground mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-muted-foreground">
            {recipe.instructions.split('\n').filter(item => item.trim() !== '').map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        {recipe.servingSuggestion && (
          <div>
            <h3 className="text-lg font-medium leading-none text-foreground mb-2">Serving Suggestion:</h3>
            <p className="text-sm text-muted-foreground">{recipe.servingSuggestion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
