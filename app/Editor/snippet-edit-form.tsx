"use client";

import { useState } from "react";
import type { Snippet } from "@prisma/client";
import {LazyRealtimeEditor} from "@/app/Editor/LazyRealtimeEditor";
import {asyncEditCourse} from "@/app/Helpers/Course";
import {toast} from "react-toastify";
import Modal from "@/app/Components/Modal";
import EditCourse from "@/app/Components/Form/EditCourse";
import {CourseType} from "@/app/Models/Course";
import {useRouter} from "next/navigation";
interface SnippetEditFormProps {
  snippet: Snippet;
  // id: number
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code);
    // State Modal
    const [isOpen, setIsOpen] = useState(false);
    const [selectCourse, setSelectCourse] = useState<CourseType>(
        {} as CourseType
    );
  const handleEditorChange = (value: string = "") => {
    setCode(value);
  };

  const onAction = async ()=> {
      if (snippet.password !== '') {
          setIsOpen(true)
      } else {
          onSave('')
      }
  }
  const router = useRouter()
  const onHome = () => {
      router.push('/')
  }
  const onSave = async (title: string) => {
      try {
          // const data = {title, id: selectCourse.id};
          await asyncEditCourse({
              id: snippet.id,
              password: title,
              code: code
          });
          toast.success('edit course successfully');
          setIsOpen(false);
      } catch (error: any) {
          toast.error('failed edit course');
      }
  }
  return (
      <div className="h-[100vh] flex flex-col">
          <div className="flex-1 mt-8">
              <LazyRealtimeEditor
                  theme={'vs-dark'}
                  language={'plaintext'}
                  saveViewState={false}
                  path="input"
                  dataTestId="input-editor"
                  options={{
                      minimap: {enabled: false},
                      automaticLayout: false,
                      insertSpaces: false,
                      readOnly: false,
                  }}
                  onMount={e => {
                      // setInputEditor(e);
                      setTimeout(() => {
                          e.layout();
                      }, 0);
                  }}
                  defaultValue={snippet.code}
                  onChange={handleEditorChange}
                  yjsDocumentId={snippet.id.toString()}
              />
          </div>
          <form action={onAction}>
              <button
                  type="submit"
                  className="rounded p-2 mt-4 border-blue-500 bg-blue-500 text-white w-full"
              >
                  Save
              </button>
          </form>
          <form action={onHome}>
              <button
                  type="submit"
                  className="rounded p-2 mt-4 border-red-500 bg-red-500 text-white w-full"
              >
                  Home
              </button>
          </form>

          {/* Modal */}
          <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
              {/* Form */}
              <EditCourse onAction={onSave}  />
          </Modal>
      </div>
  );
}
