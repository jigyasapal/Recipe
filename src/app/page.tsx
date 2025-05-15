
'use client';

import { generateRecipe } from '@/ai/flows/generate-recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { RecipeDisplay } from './recipe-display';
import { useState, useRef, useEffect } from 'react';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { gsap } from 'gsap';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<{ recipeName: string; instructions: string; ingredientsList: string, servingSuggestion?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);
  const recipeCardRef = useRef(null);
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

  useEffect(() => {
    if (recipe && recipeCardRef.current) {
      gsap.fromTo(
        recipeCardRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [recipe]);

  const handleGenerateRecipe = async () => {
    if (tags.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Ingredients 😟',
        description: 'Please add some ingredients first!',
      });
      return;
    }
    setIsLoading(true);
    gsap.to(cardRef.current, { opacity: 0.7, duration: 0.3 });
    try {
      const generatedRecipe = await generateRecipe({ ingredients: tags.join(',') });
      setRecipe(generatedRecipe);
      toast({
        title: 'Recipe generated! 🍳',
        description: 'Your delicious recipe is ready below.',
      });
    } catch (error: any) {
      console.error('Error generating recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Oops! AI Error 🤖',
        description: error.message || 'Failed to generate recipe. Please try again.',
      });
      setRecipe(null); // Clear previous recipe on error
    } finally {
      setIsLoading(false);
      gsap.to(cardRef.current, { opacity: 1, duration: 0.3 });
    }
  };

  const handleShuffleRecipe = () => {
    toast({
      title: 'Shuffling Recipe... ♻️',
      description: 'Getting a fresh idea for you!',
    });
    handleGenerateRecipe();
  };

  const handleSaveRecipe = () => {
    if (recipe) {
      toast({
        title: 'Recipe Saved! 💾 (Coming Soon)',
        description: `"${recipe.recipeName}" has been notionally saved. This feature is under development.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'No Recipe to Save',
        description: 'Please generate a recipe first.',
      });
    }
  };

  const suggestedIngredients = ['Tomato', 'Cheese', 'Egg', 'Onion', 'Garlic', 'Salt', 'Milk', 'Chicken', 'Rice', 'Broccoli'];
  const pantryStaples = ['Olive Oil', 'Black Pepper', 'Flour', 'Sugar', 'Soy Sauce'];


  const addTag = (tag: string) => {
    if (tag.trim() === '') return;
    const newTag = tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1).toLowerCase();
    if (!tags.includes(newTag) && tags.length < 15) {
      setTags([...tags, newTag]);
    } else if (tags.length >= 15) {
      toast({
        variant: 'destructive',
        title: 'Too many ingredients!',
        description: 'Please keep it to a maximum of 15 ingredients.',
      });
    }
     if (inputRef.current) {
      inputRef.current.value = ''; // Clear input after adding
      inputRef.current.focus();
    }
    setPrompt(''); // Clear the prompt state as well
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const addIngredientFromInput = () => {
    if (prompt.trim() !== '') {
      addTag(prompt);
    }
  };
  
  const parseIngredientsFromPromptAndAdd = () => {
    if (prompt.trim() === '') return;
    const newIngredients = prompt
      .split(/[,、，\s]+and\s+|\s*[,、，]+\s*|\s+/) // Split by commas, "and", and spaces
      .map(item => item.trim())
      .filter(item => item !== '');

    newIngredients.forEach(ing => addTag(ing));
    setPrompt(''); // Clear the prompt after processing
  };


  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestCommonIngredients = () => {
    const common = ['Onion', 'Garlic', 'Salt', 'Pepper', 'Olive Oil'];
    common.forEach(ingredient => {
      if (!tags.includes(ingredient) && tags.length < 15) {
        setTags(prevTags => [...prevTags, ingredient]);
      }
    });
  };

  const handleVoiceInput = () => {
    toast({
      title: 'Voice Input 🎤 (Coming Soon!)',
      description: 'This feature is under development. Please type your ingredients for now.',
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary py-8 px-4 sm:px-6 lg:px-8">
      <Card ref={cardRef} className="w-full max-w-2xl bg-card shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="p-6 flex flex-col space-y-2 items-center border-b">
            <Image
              src="https://placehold.co/180x90.png"
              alt="Delicious Food Illustration"
              data-ai-hint="food illustration"
              width={180}
              height={90}
              className="rounded-md shadow-md mb-3"
              priority
            />
          <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
            🥬 FridgeChef AI
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground text-center">
            What’s in your fridge today? 🧊 Let AI be your sous-chef!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="ingredients-prompt" className="text-sm font-medium leading-none text-foreground flex items-center">
                <Icons.search className="mr-2 h-4 w-4 text-primary" />
                Add ingredients (e.g., "eggs, tomato and cheese" or "chicken")
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  ref={inputRef}
                  id="ingredients-prompt"
                  placeholder="Type here or use suggestions..."
                  value={prompt}
                  onChange={handlePromptChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      parseIngredientsFromPromptAndAdd();
                    }
                  }}
                  onBlur={parseIngredientsFromPromptAndAdd} // Also parse on blur
                  className="text-sm rounded-md shadow-sm flex-grow"
                />
                <Button variant="outline" size="icon" onClick={handleVoiceInput} aria-label="Use voice input">
                  <Icons.mic className="h-4 w-4" />
                </Button>
                 <Button onClick={addIngredientFromInput} size="sm" className="bg-primary hover:bg-primary/90">Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-2 border rounded-md bg-background">
                  {tags.map((tag) => (
                    <Button
                      key={tag}
                      variant="secondary"
                      size="sm"
                      className="rounded-full text-xs h-7 shadow-sm group"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <Icons.close className="ml-1.5 h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-medium leading-none text-foreground mb-1.5">💡 Quick Add:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedIngredients.map((ingredient) => (
                  <Button
                    key={ingredient}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(ingredient)}
                    className="rounded-full text-xs h-7 shadow-sm hover:bg-accent/20"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>
             <div>
              <p className="text-xs font-medium leading-none text-foreground mb-1.5">📦 Pantry Staples:</p>
              <div className="flex flex-wrap gap-2">
                {pantryStaples.map((ingredient) => (
                  <Button
                    key={ingredient}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(ingredient)}
                    className="rounded-full text-xs h-7 shadow-sm hover:bg-accent/20"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
                variant="ghost"
                size="sm"
                onClick={handleSuggestCommonIngredients}
                className="text-xs text-primary hover:text-primary/80 justify-start p-0 h-auto"
              >
                <Icons.plusCircle className="mr-1.5 h-3.5 w-3.5" />
                Suggest common ingredients?
            </Button>

            <Button onClick={handleGenerateRecipe} disabled={isLoading || tags.length === 0} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md font-medium text-base py-3 transition-all duration-150 ease-in-out transform active:scale-95 shadow-md">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                  Generating Recipe...
                </>
              ) : (
                <>
                 <Icons.workflow className="mr-2 h-5 w-5" /> Generate AI Recipe 🪄
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recipe && (
        <div ref={recipeCardRef} className="w-full max-w-2xl">
          <RecipeDisplay recipe={recipe} />
          <CardFooter className="flex justify-end gap-2 p-6 border-t bg-card rounded-b-lg">
            <Button variant="outline" onClick={handleSaveRecipe} disabled={isLoading}>
              <Icons.bookmark className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="default" onClick={handleShuffleRecipe} disabled={isLoading} className="bg-primary hover:bg-primary/90">
              <Icons.shuffle className="mr-2 h-4 w-4" /> Shuffle
            </Button>
          </CardFooter>
        </div>
      )}
      <div className="mt-8 text-sm text-muted-foreground text-center">
         "Creativity is intelligence having fun.” – Albert Einstein
      </div>
    </div>
  );
}
