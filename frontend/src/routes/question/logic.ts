import { IGetQuestionsResponse } from '../../types/question-types';

export type Question = {
  number: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: Array<string>;
  attempted: boolean;
};

export async function fetchQuestions(): Promise<IGetQuestionsResponse> {
  const dummyData: Question[] = [
    {
      number: 1,
      attempted: true,
      name: 'Basic Arrays',
      difficulty: 'Easy',
      topic: ['Arrays', 'Basic'],
    },
    {
      number: 2,
      attempted: false,
      name: 'Sorting Algorithms',
      difficulty: 'Medium',
      topic: ['Algorithms', 'Sorting'],
    },
    {
      number: 3,
      attempted: true,
      name: 'Graph Traversal',
      difficulty: 'Hard',
      topic: ['Graphs', 'DFS', 'BFS'],
    },
    {
      number: 4,
      attempted: false,
      name: 'Dynamic Programming',
      difficulty: 'Hard',
      topic: ['Dynamic Programming'],
    },
    {
      number: 5,
      attempted: true,
      name: 'Binary Search Trees',
      difficulty: 'Medium',
      topic: ['Trees', 'Binary Search'],
    },
    {
      number: 6,
      attempted: false,
      name: 'Recursion Basics',
      difficulty: 'Easy',
      topic: ['Recursion'],
    },
    {
      number: 7,
      attempted: true,
      name: 'Hash Tables',
      difficulty: 'Easy',
      topic: ['Data Structures', 'Hashing'],
    },
    {
      number: 8,
      attempted: false,
      name: 'Graph Algorithms',
      difficulty: 'Medium',
      topic: ['Graphs', 'Shortest Path'],
    },
    {
      number: 9,
      attempted: true,
      name: 'Object-Oriented Programming',
      difficulty: 'Medium',
      topic: ['OOP', 'Classes', 'Inheritance'],
    },
    {
      number: 10,
      attempted: false,
      name: 'Concurrency Basics',
      difficulty: 'Hard',
      topic: ['Concurrency', 'Multithreading'],
    },
    {
      number: 11,
      attempted: true,
      name: 'Machine Learning Introduction',
      difficulty: 'Medium',
      topic: ['Machine Learning', 'Algorithms'],
    },
    {
      number: 12,
      attempted: false,
      name: 'Database Normalization',
      difficulty: 'Medium',
      topic: ['Databases', 'Normalization'],
    },
  ];

  return {
    questions: dummyData,
    totalQuestions: 20,
  };
}
