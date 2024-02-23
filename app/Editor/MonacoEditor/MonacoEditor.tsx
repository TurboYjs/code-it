import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// import 'monaco-editor/esm/vs/editor/editor.all.js';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/java/java.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/python/python.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution.js';
// import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution.js';
import { buildWorkerDefinition } from 'monaco-editor-workers';
// @ts-ignore
import { initVimMode } from 'monaco-vim';
import { MonacoServices } from 'monaco-languageclient';
import { getOrCreateModel, usePrevious, useUpdate } from './utils';
import { EditorProps } from './monaco-editor-types';
import createLSPConnection from './lsp';
import { MonacoBinding } from 'y-monaco';

// buildWorkerDefinition(
//     'monaco-workers',
//     new URL('', window.location.href).href,
//     false
// );
// buildWorkerDefinition('./node_modules/monaco-editor-workers/dist/workers', import.meta.url, false);
//
// monaco.languages.register({
//   id: 'cpp',
//   extensions: ['.cpp'],
//   aliases: ['cpp'],
// });
//
// MonacoServices.install(); // todo disposable here...
//@ts-ignore
self.MonacoEnvironment = {
    getWorker: function (moduleId: any, label: string) {
        if (label === 'json') {
            return new Worker(
                new URL(
                    'monaco-editor/esm/vs/language/json/json.worker.js',
                    import.meta.url
                )
            );
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new Worker(
                new URL(
                    'monaco-editor/esm/vs/language/css/css.worker.js',
                    import.meta.url
                )
            );
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new Worker(
                new URL(
                    'monaco-editor/esm/vs/language/html/html.worker.js',
                    import.meta.url
                )
            );
        }
        if (label === 'typescript' || label === 'javascript') {
            return new Worker(
                new URL(
                    '/node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
                    import.meta.url
                ),
                { type: 'module' }
            );
        }
        return new Worker(
            new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
            { type: 'module' }
        );
    },
};

const viewStates = new Map();

// @ts-ignore todo find a better way to do this
window.monaco = monaco;

export default function MonacoEditor({
                                       path,
                                       theme,
                                       options,
                                       saveViewState = true,
                                       onMount,
                                       language,
                                       className,
                                       value = '',
                                       onBeforeDispose,
                                       vim = false,
                                       lspEnabled = false,
                                       yjsInfo,
                                        onChange
                                     }: EditorProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editor, setEditor] =
      useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    useEffect(() => {
        if (editorRef.current !== null) {
            const model = editorRef.current.getModel();
            if (model !== null) {
                model.onDidChangeContent(() => {
                    onChange(model.getValue());
                });
            }
        }
    }, [onChange, editorRef]);
  useEffect(() => {
    const modelPath = `file:///home/thecodingwizard/${path ?? 'default'}`;
    console.log(language)
    editorRef.current = monaco.editor.create(
        ref.current!,
        {
          model: getOrCreateModel(monaco, value, language, modelPath),
          automaticLayout: true,
          theme: theme,
          lightbulb: {
            enabled: true,
          },
          language: language,
          inlayHints: {
            enabled: false,
          },
          ...options,
        },
        {}
    );
    setEditor(editorRef.current);

    if (saveViewState) {
      editorRef.current.restoreViewState(viewStates.get(modelPath));
    }

    if (onMount) {
      onMount(editorRef.current, monaco);
    }

    return () => {
      if (editorRef.current) {
        if (onBeforeDispose) onBeforeDispose();

        editorRef.current.getModel()?.dispose();
        // this throws some model is already disposed error? so ig just don't?
        editorRef.current.dispose();
        editorRef.current = null;
      } else {
        console.error("Shouldn't happen??");
      }
      setEditor(null);
    };
  }, []);

  useEffect(() => {
    if (!yjsInfo || !editor) return;
    const monacoBinding = new MonacoBinding(
        yjsInfo.yjsText,
        editor.getModel()!,
        new Set([editor]),
        yjsInfo.yjsAwareness
    );
    return () => {
      // if editorRef.current is null, then the editor was probably already destroyed
      if (editorRef.current) monacoBinding.destroy();
    };
  }, [editor, yjsInfo]);

  // useEffect(() => {
  //   // TODO fix LSP connection
  //   if (lspEnabled) {
  //     return createLSPConnection();
  //   }
  // }, [lspEnabled]);

  useEffect(() => {
    if (vim) {
      let editorMode: any;

      const statusNode = document.querySelector('.status-node');
      editorMode = initVimMode(editorRef.current, statusNode);

      return () => editorMode.dispose();
    }
  }, [vim]);

  /* Note: path update handler needs to run first. Otherwise, changing both path and language
     at the same time will result in the wrong language being used */
  const previousPath = usePrevious(path);
  useUpdate(() => {
    const model = getOrCreateModel(monaco, value, language, path ?? 'default');

    if (model !== editorRef.current!.getModel()) {
      saveViewState &&
      viewStates.set(previousPath, editorRef.current!.saveViewState());
      editorRef.current!.setModel(model);

      saveViewState &&
      editorRef.current!.restoreViewState(viewStates.get(path));
    }
  }, [path]);

  useUpdate(() => {
    if (editorRef.current!.getOption(monaco.editor.EditorOption.readOnly)) {
      editorRef.current!.setValue(value);
    } else {
      if (value !== editorRef.current!.getValue()) {
        editorRef.current!.executeEdits('', [
          {
            range: editorRef.current!.getModel()!.getFullModelRange(),
            text: value,
            forceMoveMarkers: true,
          },
        ]);

        editorRef.current!.pushUndoStop();
      }
    }
  }, [value]);

  useUpdate(() => {
    // theme is global
    monaco.editor.setTheme(theme ?? 'vs-dark');
  }, [theme]);

  useUpdate(() => {
    monaco.editor.setModelLanguage(
        editorRef.current!.getModel()!,
        language ?? 'plaintext'
    );
  }, [language]);

  useUpdate(() => {
    // console.log('updating options'); // todo this runs way too often
    editorRef.current!.updateOptions(options ?? {});
  }, [options]);

  return (
      <div className="flex relative h-full">
        <div className={className} ref={ref} style={{ width: '100%' }}></div>
      </div>
  );
}
