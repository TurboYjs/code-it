'use client';
import { asyncAddCourse } from '@/app/Helpers/Course';
import { ChangeEvent, FormEvent, useTransition, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from "@/app/Components/Modal";
import EditCourse from "@/app/Components/Form/EditCourse";
import {CourseType} from "@/app/Models/Course";
const AddCourse = () => {
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();
  // Form Submit
  const handleSubmitForm = async () => {
    setIsOpen(true)
  };
  // State Modal
  const [isOpen, setIsOpen] = useState(false);
  const onSave = async (password: string) => {
    try {
      const data = { title, code: '', password: password||'' };
      await asyncAddCourse(data);
      toast.success('add snippet successfully');
      setIsOpen(false)
    } catch (error: any) {
      toast.error('failed add snippet');
    }
  }
    return (
    <form action={handleSubmitForm}>
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative">
        <input
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            startTransition(() => setTitle(e.target.value))
          }
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:capitalize"
          placeholder="add snippet..."
          autoComplete="off"
          required
        />
        <button
          type="submit"
          className="text-white absolute right-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 capitalize"
        >
          add snippet
        </button>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {/* Form */}
        <EditCourse onAction={onSave}  />
      </Modal>
    </form>
  );
};

export default AddCourse;
