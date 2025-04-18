import {z} from 'zod';

// Define the schema for a single question
export const QuestionSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  section: z.string().min(1, 'Section cannot be empty'),
  options: z.array(z.string().min(1, 'Option cannot be empty')).length(4, 'Must have exactly 4 options'),
  answer: z.number().int().min(0).max(3, 'Answer index must be between 0 and 3'),
});

// Define the schema for the entire questions array
export const QuestionsArraySchema = z.array(QuestionSchema);

// Type definitions that can be used in your application
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionsArray = z.infer<typeof QuestionsArraySchema>;

// Function to validate questions data
export function validateQuestions(data: unknown): QuestionsArray {
  return QuestionsArraySchema.parse(data);
}


/**
 * Loads and validates questions from the JSON file in a client-side context
 * @returns Promise that resolves to validated questions array
 * @throws Error if fetch fails or data is invalid
 */
export async function loadQuestions(): Promise<QuestionsArray> {
  try {
    // Fetch the JSON file
    const response = await fetch('/questions.json');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse JSON
    const questionsData = await response.json();

    // Validate with Zod schema
    return validateQuestions(questionsData);
  } catch (error) {
    if (error instanceof Error) {
      // Enhance the error message with context
      throw new Error(`Failed to load questions: ${error.message}`);
    }
    // Handle non-Error throws
    throw new Error(`Failed to load questions: ${String(error)}`);
  }
}