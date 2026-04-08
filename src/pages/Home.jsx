import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { IoCodeSlashOutline, IoCopySharp } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Editor from "@monaco-editor/react";
// import { GoogleGenAI } from "@google/genai";
import { CircleLoader } from "react-spinners";
import { toast } from "react-toastify";

const Home = () => {
  /* ================= OPTIONS ================= */
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-js", label: "HTML + Tailwind CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
    
  ];

  /* ================= STATES ================= */
  const [framework, setFramework] = useState(options[0]);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  /* ================= SELECT STYLES ================= */
  const darkSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#000",
      borderColor: "#333",
      boxShadow: "none",
      "&:hover": { borderColor: "#555" },
    }),
    menu: (base) => ({ ...base, backgroundColor: "#000" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#333" : state.isFocused ? "#222" : "#000",
      color: "#fff",
    }),
    singleValue: (base) => ({ ...base, color: "#fff" }),
    placeholder: (base) => ({ ...base, color: "#777" }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  /* ================= HELPERS ================= */
  const extractHtml = (text = "") => {
    const match = text.match(/```html([\s\S]*?)```/i);
    return match ? match[1].trim() : text.trim();
  };

  /* ================= AI CALL ================= */
 async function getResponse() {
  if (!prompt.trim()) {
    toast.error("Please describe your component");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        framework: framework.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Server error");
    }

    const cleanCode = extractHtml(data.text);
    setCode(cleanCode);
    setOutputScreen(true);

  } catch (err) {
    toast.error(err.message || "Failed to generate code");
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  /* ================= ACTIONS ================= */
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied!");
    } catch {
      toast.error("Copy failed");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = isNewTabOpen ? "hidden" : "auto";
  }, [isNewTabOpen]);

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="flex px-[100px] gap-[30px]">
        {/* LEFT */}
        <div className="w-[50%] bg-[#1E1E1E] p-5 rounded-xl mt-5">
          <h3 className="text-2xl font-semibold">AI Component Generator</h3>
          <p className="text-gray-400 text-sm mt-2">
            Describe a component and generate production-ready UI code.
          </p>

          <p className="mt-4 font-bold">Framework</p>
          <Select
            className="mt-3"
            options={options}
            value={framework}
            styles={darkSelectStyles}
            onChange={(e) => setFramework(e)}
          />

          <p className="mt-5 font-bold">Describe your component</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-[150px] bg-[#121212] p-3 mt-2 rounded border border-gray-800 resize-none"
            placeholder="Dark themed login form with animations"
          />

          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-400 text-sm">Click generate to get code</p>
            <button
              disabled={loading}
              onClick={getResponse}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading && <CircleLoader size={18} color="white" />}
              <BsStars /> Generate
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[50%] bg-[#1E1E1E] rounded-xl mt-5 h-[80vh] relative">
          {!outputScreen ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-3xl">
                <IoCodeSlashOutline />
              </div>
              <p className="text-gray-400 mt-4">
                Your generated code will appear here
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex bg-[#17171C]">
                <button
                  onClick={() => setTab(1)}
                  className={`w-1/2 p-3 ${tab === 1 ? "bg-[#333]" : ""}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`w-1/2 p-3 ${tab === 2 ? "bg-[#333]" : ""}`}
                >
                  Preview
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex justify-between items-center px-4 h-[60px] bg-[#17171C] border-b border-gray-800">
                <p className="font-bold">Editor</p>
                <div className="flex gap-2">
                  {tab === 1 ? (
                    <>
                      <button onClick={copyCode}><IoCopySharp /></button>
                      <button onClick={downloadFile}><PiExportBold /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsNewTabOpen(true)}><ImNewTab /></button>
                      <button><FiRefreshCcw /></button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="h-full p-2">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    height="100%"
                    theme="vs-dark"
                    language="html"
                  />
                ) : (
                  <iframe
                    srcDoc={code}
                    className="w-full h-full bg-white flex"
                    title="preview"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="h-[60px] flex justify-between items-center px-4 border-b">
            <p className="font-bold">Preview</p>
            <button onClick={() => setIsNewTabOpen(false)}>
              <IoMdClose />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-full" />
        </div>
      )}
    </>
  );
};

export default Home;
