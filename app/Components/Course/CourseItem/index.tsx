'use client';
import { CourseType } from '@/app/Models/Course';
import {FC, Fragment, useState} from 'react';
import {asyncAddCourse, asyncDeleteCourse} from '@/app/Helpers/Course';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction } from 'react';
import {useRouter} from "next/navigation";
import EditCourse from "@/app/Components/Form/EditCourse";
import Modal from "@/app/Components/Modal";
// Type
interface CourseItemProps {
  course: CourseType;
}

const CourseItem: FC<CourseItemProps> = ({
  course,
}) => {
  // Delete Action
  const handleDeleteCourse = async (password: string) => {
    try {
      await asyncDeleteCourse({
        id: course.id,
        password
      });
      toast.success('course deleted successfully');
    } catch (error) {
      toast.error('error deleting course');
    }
  };
  const router = useRouter()
  const handleOpenEditPage = () => {
    router.push('/courses/' + course.id)
  }
  // State Modal
  const [isOpen, setIsOpen] = useState(false);
  return (
      <Fragment>
        <div className="  bg-purple-400 dark:bg-purple-700 p-2 rounded-sm flex items-center flex-row justify-between">
      <span className="text-lg">
        {course.id}.{course.title}
      </span>
          <section className="flex flex-row space-x-2">
            <button
                type="submit"
                onClick={handleOpenEditPage}
                className="text-white relative bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800 capitalize"
            >
              edit
            </button>
            <button
                type="submit"
                onClick={() => setIsOpen(true)}
                className="text-white relative bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 capitalize"
            >
              delete
            </button>
          </section>
          <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            {/* Form */}
            <EditCourse onAction={handleDeleteCourse}/>
          </Modal>
        </div>
      </Fragment>
  );
};

export default CourseItem;
