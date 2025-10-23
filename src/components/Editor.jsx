import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Embed from '@editorjs/embed';

const Editor = forwardRef(({ holderId = 'editorjs' }, ref) => {
  const ejInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!ejInstance.current) {
      ejInstance.current = new EditorJS({
        holder: holderId,
        autofocus: true,
        tools: {
          header: Header,
          list: List,
          quote: Quote,
          embed: Embed,
        },
        onReady: () => {
          setIsReady(true);
        },
      });
    }

    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === 'function') {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [holderId]);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!ejInstance.current) return null;
      try {
        const savedData = await ejInstance.current.save();
        return savedData;
      } catch (error) {
        console.error('Saving failed', error);
        return null;
      }
    },
    isReady,
  }));

  return (
    <div
      id={holderId}
      className="prose prose-sm min-h-[200px] overflow-auto border border-gray-300 rounded p-2"
    ></div>
  );
});

export default Editor;
