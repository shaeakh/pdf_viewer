"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { ENDPOINTS } from '@/utils/urls';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import axios from 'axios';
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Paage() {
  const [file, setFile] = useState<File | null>(null);
  const [viewPdf, setViewPdf] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [explain_response, setexplain_response] = useState<string | null>(null);
  const [showresponse, setshowresponse] = useState(false);
  const [loading, setLoading] = useState(true);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files !== null) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setFile(files[0]);
        setViewPdf(reader.result as string);
      };
    }
    else {
      setFile(null);
      setViewPdf(null);
    }
  }
  const handleRightClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const text = selection?.toString() || "";

    if (text.trim().length > 0) {
      e.preventDefault(); // Prevent default context menu
      setSelectedText(text);
      setContextMenu({ x: e.clientX, y: e.clientY });
    } else {
      setContextMenu(null);
    }
  };
  const handleOptionClick = (type: "example" | "graph") => {

    setshowresponse(false);
    setLoading(true);
    console.log("Sending to backend:", { selectedText, type });
    console.log("ENDPOINTS", ENDPOINTS.help)
    axios.post(ENDPOINTS.help, {
      text: selectedText,
      explainType: type,
    })
      .then((res) => {
        console.log("eikhane asche", res.data.msg);
        setLoading(false);
        setexplain_response(res.data.explanation);
        setshowresponse(true)

      })
      .catch((err) => {
        console.error("Backend error:", err);
      }).finally(() => {
        setLoading(false);
      })
      ;


    setContextMenu(null); // hide menu
  };

  const newplugin = defaultLayoutPlugin();
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null);
    };
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <div className="h-screen w-screen flex" onContextMenu={handleRightClick}>

      <div className="w-2/3 h-full p-5" ref={pdfWrapperRef}>
        <div className="w-full h-full flex justify-center items-center  border-2 border-input rounded-lg">
          {file !== null ? (
            <div className="w-full h-full">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                {
                  viewPdf &&
                  <>
                    <Viewer fileUrl={viewPdf} plugins={[newplugin]} />
                  </>
                }

              </Worker>
            </div>
          ) : (
            <>
              <label className="cursor-pointer flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-400 p-10 rounded-lg hover:bg-gray-50 transition">
                <Upload className="w-10 h-10 text-gray-600" />
                <span className="text-gray-600 text-sm">
                  Click to upload PDF
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
            </>
          )}
          {contextMenu && (
            <div
              style={{ top: contextMenu.y, left: contextMenu.x }}
              className="absolute bg-white shadow-md rounded border z-50"
            >
              <button
                className="px-4 py-2 hover:bg-gray-100 w-full text-left"
                onClick={() => handleOptionClick("example")}
              >
                Explain with examples
              </button>
              <button
                className="px-4 py-2 hover:bg-gray-100 w-full text-left"
                onClick={() => handleOptionClick("graph")}
              >
                Explain with graph
              </button>
            </div>
          )}
        </div>
      </div>

      {showresponse && <div className="w-1/3 max-h-56 h-full pr-5 py-5">
        <div
          className="w-full min-h-56 border-2   border-input rounded-lg p-4"
        >

          {
            loading ? (
              <div className="w-full h-full flex justify-start items-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <TextGenerateEffect className="text-sm font-normal" words={explain_response || ""} />
            )
          }

        </div>
      </div>}
    </div>
  );
}

export default Paage;
