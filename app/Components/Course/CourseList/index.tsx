'use client';

import { CourseResponse, CourseType } from '@/app/Models/Course';
import { FC, useState } from 'react';
import CourseItem from '../CourseItem';
import Modal from '../../Modal';
import EditCourse from '../../Form/EditCourse';

// Type
interface CourseListProps {
  courses: CourseResponse;
}

const CourseList: FC<CourseListProps> = ({ courses }) => {
  // Course Items
  const renderCourseItem = () => {
    return courses.map((course) => {
      return (
        <CourseItem
          key={course.id}
          course={course}
        />
      );
    });
  };
  return (
    <div className="flex flex-col space-y-3">
      {renderCourseItem()}
    </div>
  );
};

export default CourseList;
