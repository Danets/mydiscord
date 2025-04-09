"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from 'axios';
import queryString from 'query-string';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";

type ChatInputProps = {
    apiUrl: string;
    name: string;
    query: Record<string, any> | string;
    type: "channel" | "conversation";
}

const formSchema = z.object({
    content: z.string().min(1),
});

type Schema = z.infer<typeof formSchema>;

export const ChatInput = ({
    apiUrl,
    name,
    query,
    type
}: ChatInputProps) => {

    const router = useRouter();
    const params = useParams();

    const form = useForm<Schema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (data: Schema) => {
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl,
                query: query,
            });

            await axios.post(url, data);
            form.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button
                                        type="button"
                                        onClick={() => { }}
                                        className="flex items-center justify-center p-1 absolute top-7 left-8 h-6 w-6
                                         transition-all rounded-full
                                         bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300">
                                        <Plus className="w-4 h-4 text-white dark:text-[#313338]" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0
                                        focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                        placeholder={`Send a message to ${type === "channel" ? `#${name}` : name}`}
                                        {...field}
                                    />
                                    <div className="absolute top-7 right-8">
                                        <Smile className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                                    </div>
                                </div>

                            </FormControl>
                        </FormItem>
                    )}
                />


            </form>
        </Form>
    )
}
