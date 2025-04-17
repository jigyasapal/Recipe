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
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<{ recipeName: string; instructions: string; ingredientsList: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [tags, setTags] = useState<string[]>([]); // Ingredient Tags

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
      const generatedRecipe = await generateRecipe({ ingredients: tags.join(',') });
      setRecipe(generatedRecipe);
      toast({
        title: 'Recipe generated! 🍳',
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

  // Autocomplete suggestions (basic implementation)
  const suggestedIngredients = ['Tomato', 'Cheese', 'Egg', 'Onion', 'Garlic', 'Salt', 'Milk'];

  // Recent ingredients (example)
  const recentIngredients = ['Chicken', 'Rice', 'Broccoli'];

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

    // Handle ingredient detection from sentences
    const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrompt(e.target.value);
    };

  // Function to add ingredients as tags
  const addIngredient = (ingredient: string) => {
    if (!tags.includes(ingredient)) {
      setTags([...tags, ingredient]);
    }
    if (inputRef.current) {
      inputRef.current.focus(); // Refocus on the input after adding
    }
  };

  // Function to remove ingredients as tags
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

    const handleSuggestCommonIngredients = () => {
      suggestedIngredients.forEach(ingredient => {
          if (!tags.includes(ingredient)) {
              setTags(prevTags => [...prevTags, ingredient]);
          }
      });
  };

    //voice input
    const handleVoiceInput = () => {
      alert('Voice input is not implemented yet.');
    };

      // Function to parse ingredients from the prompt and add them as tags
      const parseIngredientsFromPrompt = () => {
        const newIngredients = prompt
          .split(/[,、，、and\s]+/) // Split by commas, "and", and spaces
          .map(item => item.trim()) // Trim each ingredient
          .filter(item => item !== '' && !tags.includes(item)); // Remove empty strings and existing tags
    
        if (newIngredients.length > 0) {
          setTags(prevTags => [...prevTags, ...newIngredients]);
        }
        setPrompt(''); // Clear the prompt after processing
      };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <Card ref={cardRef} className="w-full max-w-2xl bg-card shadow-md rounded-lg overflow-hidden">
        <CardHeader className="p-6 flex flex-col space-y-2 items-center">
            <Image
              src="https://picsum.photos/200/100" // Placeholder image
              alt="FridgeChef Logo"
              width={200}
              height={100}
              className="rounded-md shadow-md mb-4"
              priority
            />
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            FridgeChef 🥬
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">
            What’s in your fridge today? 🧊
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="ingredients" className="text-sm font-medium leading-none text-foreground">
                Add ingredients... 🔍
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  ref={inputRef}
                  id="ingredients"
                  placeholder="e.g., chicken, rice, broccoli"
                   value={prompt} // Use prompt state for the input value
                  onChange={handlePromptChange} // Use handlePromptChange for onChange
                  className="text-sm rounded-md shadow-sm focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1"
                  onBlur={parseIngredientsFromPrompt}
                />
                <Button variant="outline" size="icon" onClick={handleVoiceInput}>
                  <Icons.mail className="h-4 w-4" />
                </Button>
              </div>
              {/* Ingredient Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Button
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} <Icons.close className="ml-1 h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Suggested Ingredients */}
            <div>
              <p className="text-xs font-medium leading-none text-foreground">Suggested:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {suggestedIngredients.map((ingredient) => (
                  <Button
                    key={ingredient}
                    variant="outline"
                    size="sm"
                    onClick={() => addIngredient(ingredient)}
                    className="rounded-full text-xs"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>

             {/* Recent Ingredients */}
             <div>
              <p className="text-xs font-medium leading-none text-foreground">Pantry Items:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {recentIngredients.map((ingredient) => (
                  <Button
                    key={ingredient}
                    variant="outline"
                    size="sm"
                    onClick={() => addIngredient(ingredient)}
                    className="rounded-full text-xs"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>

             {/* Suggest Common Ingredients */}
             <Button
                variant="ghost"
                size="sm"
                onClick={handleSuggestCommonIngredients}
                className="rounded-full text-xs"
              >
                Suggest common ingredients?
              </Button>

            <Button onClick={handleGenerateRecipe} disabled={isLoading} className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-md font-medium transition-colors">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                🧠 AI Recipes Generated
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recipe && (
        <RecipeDisplay recipe={recipe} />
      )}
      <div className="mt-4 text-sm text-muted-foreground">
         "Creativity is intelligence having fun.” – Einstein
      </div>
    </div>
  );
}
