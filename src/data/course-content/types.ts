export type ExerciseType =
  | 'javascript'
  | 'python'
  | 'php'
  | 'c'
  | 'csharp'
  | 'perl'
  | 'ruby'
  | 'lua'
  | 'java'
  | 'cpp'
  | 'html'
  | 'css'
  | 'nextjs'
  | 'angular'
  | 'vue'
  | 'svelte'
  | 'astro'
  | 'sql'
  | 'go'
  | 'bash';

export type Difficulty = 'Facile' | 'Intermedio' | 'Avanzato';

export interface TestCase {
  input?: string;
  expectedOutput: string;
}

export interface SeedExercise {
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: Difficulty;
  points: number;
  why: string;
  how: string;
  instructions: string;
  commonErrors?: string[];
  checkpoint?: string;
  isCheckpoint?: boolean;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints?: string[];
}

export interface SeedSection {
  title: string;
  description: string;
  content: string;
  objective: string;
  duration?: number;
  checkpointTitle: string;
  checkpointDescription: string;
  docsLinks?: string[];
  troubleshooting?: string[];
  exercises: SeedExercise[];
}

export interface SeedCourseContent {
  slug: string;
  sections: SeedSection[];
}
