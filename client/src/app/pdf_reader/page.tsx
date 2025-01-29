"use client";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Upload } from "lucide-react";
import { useState } from "react";

function Paage() {
  const [file, setFile] = useState<File | null>(null);
  const [viewPdf, setViewPdf] = useState<string | null>(null);
  
  
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
    else{
      setFile(null);
      setViewPdf(null);
    }
  }

  const newplugin = defaultLayoutPlugin();
  return (
    <div className="h-screen w-screen flex">
      <div className="w-2/3 h-full p-5">
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
        </div>
      </div>
      <div className="w-1/3 h-full pr-5 py-5">
        <div
          className="w-full h-full border-2  border-input rounded-lg"
        ></div>
      </div>
    </div>
  );
}

export default Paage;
