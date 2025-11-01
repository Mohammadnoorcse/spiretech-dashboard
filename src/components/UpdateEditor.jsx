import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";

const UpdateEditor = forwardRef(({ holderId = "editorjs", data = {} }, ref) => {
  const ejInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize EditorJS
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
        data: data, // ✅ Load initial data
        onReady: () => setIsReady(true),
      });
    }

    // Cleanup when unmounting
    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === "function") {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [holderId]);

  // ✅ Update editor when `data` changes
  useEffect(() => {
    if (isReady && ejInstance.current && data && data.blocks) {
      ejInstance.current.render(data);
    }
  }, [data, isReady]);

  // Expose save() method to parent via ref
  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!ejInstance.current) return null;
      try {
        const savedData = await ejInstance.current.save();
        return savedData;
      } catch (error) {
        console.error("Saving failed", error);
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

export default UpdateEditor;
