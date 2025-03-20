export interface GenerateQuestionsRequest {
  title: string;
}

export interface GenerateQuestionsResponse {
  questions: string[];
  surveyId: string;
}

export interface SubmitSurveyRequest {
  surveyId: string;
  answers: string[];
}

export interface SubmitSurveyResponse {
  success: boolean;
  responseId: string;
}
