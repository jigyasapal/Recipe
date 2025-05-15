
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons"; 
import { useEffect, useState } from "react";

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
  const [clientRendered, setClientRendered] = useState(false);
  useEffect(() => {
    setClientRendered(true);
  }, []);

  const ingredients = recipe.ingredientsList.split('\n').filter(item => item.trim() !== '');
  const instructionsList = recipe.instructions.split('\n').filter(item => item.trim() !== '');

  const [prepTime, setPrepTime] = useState(0);
  
  useEffect(() => {
    setPrepTime(Math.floor(Math.random() * 30) + 10); 
  }, [recipe]); 

  const ingredientCount = ingredients.length;

  if (!clientRendered) {
    return (
      <Card className="w-full max-w-2xl mt-8 bg-card shadow-xl rounded-lg overflow-hidden animate-pulse">
        <CardHeader className="p-6 border-b">
          <div className="h-8 bg-muted-foreground/20 rounded w-3/4"></div>
          <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mt-2"></div>
          <div className="mt-3 flex items-center space-x-2">
            <div className="h-6 w-20 bg-muted-foreground/20 rounded-full"></div>
            <div className="h-6 w-24 bg-muted-foreground/20 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid gap-6">
          <div>
            <div className="h-6 bg-muted-foreground/20 rounded w-1/3 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
            </div>
          </div>
          <div>
            <div className="h-6 bg-muted-foreground/20 rounded w-1/3 mb-3"></div>
             <div className="space-y-2">
              <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
            </div>
          </div>
           {recipe.servingSuggestion && (
            <div>
              <div className="h-6 bg-muted-foreground/20 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="w-full max-w-2xl mt-8 bg-card shadow-xl rounded-t-lg overflow-hidden">
      <CardHeader className="p-6 border-b">
        <CardTitle className="text-3xl font-semibold tracking-tight text-primary">
          {recipe.recipeName}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Your AI-generated culinary creation! Easy, quick, and delicious.
        </CardDescription>
         <div className="mt-3 flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm py-1 px-3 shadow-sm">
            <Icons.clock className="mr-1.5 h-4 w-4 text-primary" /> {prepTime} min
          </Badge>
          <Badge variant="secondary" className="text-sm py-1 px-3 shadow-sm">
            <Icons.listFilter className="mr-1.5 h-4 w-4 text-primary" /> {ingredientCount} ingredients
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 grid gap-6">
        <div>
          <h3 className="text-xl font-semibold leading-none text-foreground mb-3 flex items-center">
            <Icons.listFilter className="mr-2 h-5 w-5 text-primary" /> Ingredients:
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-2">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold leading-none text-foreground mb-3 flex items-center">
            <Icons.workflow className="mr-2 h-5 w-5 text-primary" /> Instructions:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground pl-2">
            {instructionsList.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        {recipe.servingSuggestion && (
          <div>
            <h3 className="text-xl font-semibold leading-none text-foreground mb-3 flex items-center">
              <Icons.utensils className="mr-2 h-5 w-5 text-primary" />
              Serving Suggestion:
            </h3>
            <p className="text-sm text-muted-foreground pl-2">{recipe.servingSuggestion}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
