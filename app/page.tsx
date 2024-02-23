import { asyncGetAllCourses } from './Helpers/Course';
import CourseList from './Components/Course/CourseList';
import AddCourse from './Components/Form/AddCourse';

// SSR
export const revalidate = 0;
export const dynamic = 'force-dynamic';
const Home = async () => {
  try {
    const courses = await asyncGetAllCourses();
    return (
      <div className="flex flex-col space-y-4 w-full mt-10 mx-auto container p-2">
        <AddCourse />
        {courses.length === 0 ? (
          <p className="text-2xl text-center font-bold dark:text-orange-400 text-orange-700">
            No snippets have been added
          </p>
        ) : (
          <CourseList courses={courses} />
        )}
      </div>
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default Home;
// "use client"
// import { VFC, useRef, useState, useEffect } from 'react';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
//
// export default function Home() {
//   const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
//   const monacoEl = useRef(null);
//
//   useEffect(() => {
//     if (monacoEl) {
//       setEditor((editor) => {
//         if (editor) return editor;
//
//         return monaco.editor.create(monacoEl.current!, {
//           value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
//           language: 'typescript'
//         });
//       });
//     }
//
//     return () => editor?.dispose();
//   }, [monacoEl.current]);
//
//   return <div style={{
//     width: '100vh',
//     height: '100vh'
//   }} ref={monacoEl}></div>;
// };