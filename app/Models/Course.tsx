export interface CourseType {
  id: number;
  title: string;
  code: string;
  password: string;
  language: string;
}

export type CourseResponse = CourseType[];
