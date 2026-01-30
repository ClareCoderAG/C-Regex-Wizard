export interface RegexResult {
  pattern: string;
  csharpCode: string;
  explanation: string;
  jsPattern: string | null; // For client-side testing if compatible
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface TestCase {
  id: string;
  input: string;
  match: string | null;
  isMatch: boolean;
}