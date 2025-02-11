"use client";

import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import { X } from "lucide-react";

import "@uploadthing/react/styles.css"
import Image from "next/image";

interface FileUploadProps {
    endpoint: 'imageUploader' | 'messageFile';
    value: string;
    onChange: (url?: string) => void;
}


export const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
    const fileType = value.split('.').pop();
    if (value && fileType !== 'pdf') {
        return <div className="relative w-20 h-20">
            <Image
                fill
                src={value}
                alt="Upload"
                className="rounded-full"
            />
            <button
                onClick={() => onChange()}
                className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                type="button"
            ><X className="h-4 w-4" />
            </button>
        </div>
    }
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
                value = res?.[0].url;
                alert(`Upload Completed`);
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
        />
    )
}

