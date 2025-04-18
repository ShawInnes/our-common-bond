import { describe, it, expect } from 'vitest';
import { QuestionSchema, QuestionsArraySchema, validateQuestions } from './questions';

describe('QuestionSchema', () => {
  it('should validate a valid question object', () => {
    const validQuestion = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: 2
    };

    const result = QuestionSchema.safeParse(validQuestion);
    expect(result.success).toBe(true);
  });

  it('should reject a question with empty question text', () => {
    const invalidQuestion = {
      question: "",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: 2
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should reject a question with empty section', () => {
    const invalidQuestion = {
      question: "What is the capital of Australia?",
      section: "",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: 2
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should reject a question with less than 4 options', () => {
    const invalidQuestion = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra"],
      answer: 2
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should reject a question with more than 4 options', () => {
    const invalidQuestion = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra", "Perth", "Brisbane"],
      answer: 2
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should reject a question with empty option', () => {
    const invalidQuestion = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "", "Canberra", "Perth"],
      answer: 2
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should reject a question with answer index out of bounds', () => {
    const invalidQuestion = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: 4
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should reject a question with negative answer index', () => {
    const invalidQuestion = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: -1
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });

  it('should reject a question with non-integer answer', () => {
    const invalidQuestion = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: 2.5
    };

    const result = QuestionSchema.safeParse(invalidQuestion);
    expect(result.success).toBe(false);
  });
});

describe('QuestionsArraySchema', () => {
  it('should validate an array of valid questions', () => {
    const validQuestions = [
      {
        question: "What is the capital of Australia?",
        section: "Geography",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        answer: 2
      },
      {
        question: "What is the largest planet in our solar system?",
        section: "Science",
        options: ["Earth", "Jupiter", "Saturn", "Mars"],
        answer: 1
      }
    ];

    const result = QuestionsArraySchema.safeParse(validQuestions);
    expect(result.success).toBe(true);
  });

  it('should validate an empty array', () => {
    const result = QuestionsArraySchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it('should reject an array with an invalid question', () => {
    const invalidQuestions = [
      {
        question: "What is the capital of Australia?",
        section: "Geography",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        answer: 2
      },
      {
        question: "What is the largest planet in our solar system?",
        section: "Science",
        options: ["Earth", "Jupiter", "Saturn"], // Only 3 options
        answer: 1
      }
    ];

    const result = QuestionsArraySchema.safeParse(invalidQuestions);
    expect(result.success).toBe(false);
  });
});

describe('validateQuestions', () => {
  it('should return validated questions when data is valid', () => {
    const validQuestions = [
      {
        question: "What is the capital of Australia?",
        section: "Geography",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        answer: 2
      }
    ];

    const result = validateQuestions(validQuestions);
    expect(result).toEqual(validQuestions);
  });

  it('should throw an error when data is invalid', () => {
    const invalidQuestions = [
      {
        question: "What is the capital of Australia?",
        section: "Geography",
        options: ["Sydney", "Melbourne", "Canberra"], // Only 3 options
        answer: 2
      }
    ];

    expect(() => validateQuestions(invalidQuestions)).toThrow();
  });

  it('should throw an error when data is not an array', () => {
    const invalidData = {
      question: "What is the capital of Australia?",
      section: "Geography",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      answer: 2
    };

    expect(() => validateQuestions(invalidData)).toThrow();
  });

  it('should throw an error when data is null', () => {
    expect(() => validateQuestions(null)).toThrow();
  });
});