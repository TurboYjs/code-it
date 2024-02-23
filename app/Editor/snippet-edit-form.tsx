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
import defaultCode from "@/app/scripts/defaultCode";
import {LANGUAGES_MONACO, useUserContext} from "@/app/context/UserContext";
import { useCopyToClipboard } from 'usehooks-ts'
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
      setIsOpen(true)
  }
  const router = useRouter()
  const onHome = () => {
      router.push('/')
  }
  const onSave = async ({password, language}: Pick<CourseType, 'password'| 'language'>) => {
      try {
          // const data = {title, id: selectCourse.id};
          await asyncEditCourse({
              id: snippet.id,
              password: password,
              language: language,
              code: code
          });
          toast.success('edit course successfully');
          setIsOpen(false);
      } catch (error: any) {
          toast.error('failed edit course');
      }
  }
  const {userData} = useUserContext()
  const {lightMode, tabSize} = userData
  const lang = snippet.language
    const [copiedText, copy] = useCopyToClipboard()
    const onShare = () => {
        copy(window.location.href).then(()=> {
            toast.success('share copied successfully');
        })
  }
  return (
      <div className="h-[100vh] flex flex-col">
          <div className="flex-1 mt-8">
              <LazyRealtimeEditor
                  theme={lightMode ? 'light' : 'vs-dark'}
                  language={LANGUAGES_MONACO[lang]}
                  path={`myfile.${lang}`}
                  options={
                      {
                          minimap: {enabled: false},
                          automaticLayout: true,
                          tabSize: tabSize,
                          insertSpaces: false,
                          readOnly: false,
                          'bracketPairColorization.enabled': true, // monaco doesn't expect an IBracketPairColorizationOptions

                          // this next option is to prevent annoying autocompletes
                          // ex. type return space and it adds two spaces + semicolon
                          // ex. type vecto< and it autocompletes weirdly
                          acceptSuggestionOnCommitCharacter: false,
                          // suggestOnTriggerCharacters: false,
                      } as any
                  }
                  onMount={e => {
                      setTimeout(() => {
                          e.layout();
                          e.focus();
                      }, 0);
                  }}
                  defaultValue={code}
                  value={code}
                  yjsDocumentId={`${userData.id}.${lang}`}
                  useEditorWithVim={true}
                  lspEnabled={lang === 'cpp'}
                  dataTestId="code-editor"
                  onChange={(val: string) => {
                      setCode(val)
                  }}
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
          <form action={onShare}>
              <button
                  type="submit"
                  className="rounded p-2 mt-4 border-yellow-500 bg-yellow-500 text-white w-full"
              >
                  Share
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
              <EditCourse onAction={onSave} lang={snippet.language}/>
          </Modal>
      </div>
  );
}
