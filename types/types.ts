// types.ts
import { Document, Types } from "mongoose";

// Base Mongoose Document Interfaces
export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResponse extends Document {
  surveyId: string;
  answers: string[];
  createdAt: Date;
}

export type PopulatedSurvey = Omit<ISurvey, "responses"> & {
  responses: IResponse[];
};
export interface ISurvey extends Document {
  title: string;
  questions: string[];
  responses: Types.ObjectId[] | IResponse[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
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

export interface AnalysisResponse {
  insights: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// Utility Types
export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface ResponseData {
  answers: string[];
  createdAt: Date;
}
