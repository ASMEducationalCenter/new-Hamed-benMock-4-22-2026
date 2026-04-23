export interface QuestionData {
  id: number;
  question: string;
  modelAnswer: string;
  realWorldExamples: string[];
}

export enum InterviewStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR'
}

export interface TranscriptionItem {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
