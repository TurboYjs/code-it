export interface CourseType {
  id: number;
  title: string;
  code: string;
  password: string;
}

export type CourseResponse = CourseType[];
