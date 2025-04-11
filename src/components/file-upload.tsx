"use client";

import Image from "next/image";
import { FileIcon, X } from "lucide-react";

import { UploadDropzone } from "@/lib/uploadthing";
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
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    }

    if (value && fileType === 'pdf') {
        return (<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 dark:bg-[#313338]">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
            <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline ml-2"
            >
                {value}
            </a>
            <button
                onClick={() => onChange()}
                className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-0 shadow-sm"
                type="button"
            >
                <X className="h-4 w-4" />
            </button>
        </div >)
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
                value = res?.[0].url;
            }}
            onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
            }}
        />
    )
}

