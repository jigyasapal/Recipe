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
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
  ingredientsList: z.string().describe('A list of ingredients required for the recipe.'),
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
      instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
      ingredientsList: z.string().describe('A list of ingredients required for the recipe.'),
    }),
  },
  prompt: `You are a chef. Generate a recipe based on the ingredients provided by the user. The recipe should be easy to follow and make use of all the ingredients if possible.

Ingredients: {{{ingredients}}}

Recipe format:
Recipe Name: [Recipe Name]
Ingredients: [List of ingredients with quantities]
Instructions: [Step-by-step instructions]`,
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
