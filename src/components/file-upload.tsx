"use client";

import { UploadDropzone, UploadButton } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css"

interface FileUploadProps {
    endpoint: 'imageUploader' | 'messageFile';
    value: string;
    onChange: (url?: string) => void;
}


export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
                console.log("Files: ", res);
                alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
        />
    )
}

