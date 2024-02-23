'use client';
import { ChangeEvent, FormEvent, useTransition, useState } from 'react';
import {LANGUAGES} from "@/app/context/UserContext";
const EditCourse = ({
  onAction,
    action='edit',
    lang
}: {
  onAction: Function,
  action?: 'delete' | 'edit',
  lang?: string
}) => {
  // State Select Course(Edit)
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState(lang || LANGUAGES[0].value);
  const [isPending, startTransition] = useTransition();
  // Edit Course Submit
  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAction({
      password,
      language
    })
  };
  return (
      <form
          className="mt-2 flex flex-col relative space-y-3"
          onSubmit={handleSubmitForm}
      >
        {
            action === 'edit' && <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:capitalize"
                placeholder="password..."
                autoComplete="off"
            >
              {
                LANGUAGES.map(l => (<option value={l.value} key={l.value}>{l.label}</option>))
              }
            </select>
        }
        <input
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                startTransition(() => setPassword(e.target.value))
            }
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 placeholder:capitalize"
            placeholder="password..."
            autoComplete="off"
        />
        <button
            type="submit"
            className="inline-flex capitalize justify-center rounded-md border border-transparent bg-green-100 px-5 py-2.5 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          accept
        </button>
      </form>
  );
};

export default EditCourse;
