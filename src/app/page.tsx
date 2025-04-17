'use client';

import { generateRecipe } from '@/ai/flows/generate-recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { RecipeDisplay } from './recipe-display';
import { useState, useRef, useEffect } from 'react';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { gsap } from 'gsap';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<{ recipeName: string; instructions: string; ingredientsList: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2 }
      );
    }
  }, []);

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    gsap.to(cardRef.current, { opacity: 0.5, duration: 0.3 }); // Fade effect during loading
    try {
      const generatedRecipe = await generateRecipe({ ingredients });
      setRecipe(generatedRecipe);
      toast({
        title: 'Recipe generated!',
        description: 'Check out your new recipe below.',
      });
    } catch (error: any) {
      console.error('Error generating recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Error generating recipe',
        description: error.message || 'Failed to generate recipe. Please try again.',
      });
    } finally {
      setIsLoading(false);
      gsap.to(cardRef.current, { opacity: 1, duration: 0.3 }); // Restore opacity after loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <Card ref={cardRef} className="w-full max-w-2xl bg-card shadow-md rounded-lg overflow-hidden">
        <CardHeader className="p-6 flex flex-col space-y-2 items-center">
            <Image
              src="https://picsum.photos/200/100" // Placeholder image
              alt="FridgeChef Logo"
              width={200}
              height={100}
              className="rounded-md shadow-md mb-4"
            />
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            FridgeChef 
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">
            Enter your ingredients and let AI create a recipe for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="ingredients" className="text-sm font-medium leading-none text-foreground">
                Ingredients
              </label>
              <Input
                id="ingredients"
                placeholder="e.g., chicken, rice, broccoli"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="text-sm rounded-md shadow-sm focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1"
              />
            </div>
            <Button onClick={handleGenerateRecipe} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-md font-medium transition-colors">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Recipe'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recipe && (
        <RecipeDisplay recipe={recipe} />
      )}
    </div>
  );
}
