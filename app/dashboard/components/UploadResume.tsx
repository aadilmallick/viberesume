"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X, Loader2 } from "lucide-react";

interface UploadResumeProps {}

export default function UploadResume({}: UploadResumeProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePortfolio = async () => {
    if (!file) return;

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/websites", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate portfolio");
      }

      const data = await response.json();

      if (data.success) {
        // Redirect to the generated portfolio or dashboard
        alert(`Portfolio generated successfully! Visit: ${data.website.url}`);
        window.location.reload();
      } else {
        throw new Error(data.error || "Failed to generate portfolio");
      }
    } catch (error) {
      console.error("Error generating portfolio:", error);
      alert("Failed to generate portfolio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      {!file ? (
        <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors">
          <div
            className="p-8 text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">
              Upload your resume
            </h3>
            <p className="text-slate-500 mb-4">
              Drag and drop your PDF file here, or click to browse
            </p>
            <Button variant="outline">Choose File</Button>
            <input
              ref={fileInputRef}
              multiple={false}
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) handleFileSelect(selectedFile);
              }}
              className="hidden"
            />
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-medium text-slate-700">{file.name}</h3>
                <p className="text-sm text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-4">
            <Button
              onClick={generatePortfolio}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Portfolio...
                </>
              ) : (
                "Generate Portfolio"
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
