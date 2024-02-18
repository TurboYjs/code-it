'use server';
import { AxiosResponse } from 'axios';
import { CourseResponse, CourseType } from '../Models/Course';
import { revalidatePath } from 'next/cache';
import baseApi from './BaseApi';
import db from "@/app/Helpers/prisma";
import {decryptPassword, encryptPassword} from "@/app/Helpers/password";
const asyncGetAllCourses = async (): Promise<CourseResponse> => {
  try {
    // const response: AxiosResponse<CourseResponse> =
    //   await baseApi.get<CourseResponse>('/courses');
    // const snippets = await db.snippet.findMany();
    // return response.data;
    return await db.snippet.findMany({
      orderBy: {
        id: 'desc'
      }
    })
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const asyncAddCourse = async (data: Omit<CourseType, "id">): Promise<void> => {
  try {
    // await baseApi.post(`/courses`, data);
    await db.snippet.create({
      data: {
        ...data,
        password: encryptPassword(data.password)
      }
    });
    revalidatePath('/');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const asyncDeleteCourse = async (data: Pick<CourseType, "id" | "password">): Promise<void> => {
  try {
    // await baseApi.delete(`/courses/${data.id}`);
    const snippet =  await db.snippet.findUnique({
      where: { id: data.id },
    });
    if(!snippet) {
      return Promise.reject('Id is not existed')
    }
    const dePassword = decryptPassword(snippet.password);
    if ( dePassword!== data.password) {
      return Promise.reject('Password does not match')
    }
    await db.snippet.delete({
      where: { id: data.id },
    });
    revalidatePath('/');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const asyncEditCourse = async (data: Pick<CourseType, "id"| "code" | "password">): Promise<void> => {
  try {
    // await baseApi.patch(`/courses/${data.id}`, {
    //   title: data.title,
    // });
    const snippet =  await db.snippet.findUnique({
      where: { id: data.id },
    });
    if(!snippet) {
      return Promise.reject('Id is not existed')
    }
    const dePassword = decryptPassword(snippet.password);
    if ( dePassword!== data.password) {
      return Promise.reject('Password does not match')
    }
    await db.snippet.update({
      where: { id: data.id },
      data: { code: data.code },
    });
    revalidatePath(`/`);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export {
  asyncGetAllCourses,
  asyncAddCourse,
  asyncDeleteCourse,
  asyncEditCourse,
};
