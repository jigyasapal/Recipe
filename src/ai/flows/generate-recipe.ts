'use server';
/**
 * @fileOverview Recipe generation flow based on provided ingredients.
 *
 * - generateRecipe - A function that handles the recipe generation process.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients available.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe, each step on a new line.'),
  ingredientsList: z.string().describe('A list of ingredients required for the recipe, each ingredient on a new line.'),
  servingSuggestion: z.string().optional().describe('A suggestion for serving the recipe.')
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {
    schema: z.object({
      ingredients: z.string().describe('A comma-separated list of ingredients available.'),
    }),
  },
  output: {
    schema: z.object({
      recipeName: z.string().describe('The name of the generated recipe.'),
      instructions: z.string().describe('Step-by-step instructions for preparing the recipe, each step on a new line.'),
      ingredientsList: z.string().describe('A list of ingredients required for the recipe, each ingredient on a new line.'),
      servingSuggestion: z.string().optional().describe('A suggestion for serving the recipe.')
    }),
  },
  prompt: `You are a chef. Generate a simple and delicious recipe using the ingredients provided by the user. The recipe should be easy to follow and make use of all the ingredients if possible.
Format it with a clean title, clear ingredients list, step-by-step instructions, and a serving suggestion. Keep the tone warm and friendly, like a food blog. Each step should be on a new line. Each ingredient should be on a new line.

Ingredients: {{{ingredients}}}

Recipe format:
Recipe Name: [Recipe Name]
Ingredients:
[List of ingredients with quantities, each on a new line]
Instructions:
[Step-by-step instructions, each on a new line]
Serving Suggestion: [Suggestion for serving the recipe]`,
});

const generateRecipeFlow = ai.defineFlow<
  typeof GenerateRecipeInputSchema,
  typeof GenerateRecipeOutputSchema
>({
  name: 'generateRecipeFlow',
  inputSchema: GenerateRecipeInputSchema,
  outputSchema: GenerateRecipeOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
