"use client";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { QuestionShema } from "@/lib/validatoins";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
import { toast } from "../ui/use-toast";

type QuestionProps = {
  type?: string;
  userId?: string;
  mongoUserId?: string;
  questionDetails?: string | undefined;
};

const Question = ({
  userId,
  type,
  mongoUserId,
  questionDetails,
}: QuestionProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const editorRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const { mode } = useTheme();

  const parsedQuestionDetail =
    questionDetails && JSON.parse(questionDetails || "");
  const groupedTags = parsedQuestionDetail?.tags.map(
    (tag: { _id: string; name: string }) => tag.name
  );

  const form = useForm<z.infer<typeof QuestionShema>>({
    resolver: zodResolver(QuestionShema),
    defaultValues: {
      title: parsedQuestionDetail?.title || "",
      explanation: parsedQuestionDetail?.content || "",
      tags: groupedTags || [],
    },
  });

  const handleSubmit = async (values: z.infer<typeof QuestionShema>) => {
    setIsSubmitting(true);
    try {
      if (type === "Edit") {
        await editQuestion({
          questionId: parsedQuestionDetail._id,
          title: values.title,
          content: values.explanation,
          path: pathname,
        });
        toast({
          title: "Your question has been edited successfully",
        });
        router.push(`/question/${parsedQuestionDetail._id}`);
      } else {
        // make an async all to your API
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: userId!,
          path: pathname,
        });
        toast({
          title: "Your question has been created successfully",
        });
        router.push("/");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length >= 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must be less than 15 charaters",
          });
        }

        if (field.value.includes(tagValue)) {
          return form.setError("tags", {
            type: "required",
            message:
              "You have already added this tag, please register a new tag",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      }
    }
  };

  const handleRemoveTag = (tag: string, field: any) => {
    const newTags = field.value.filter((item: string) => item !== tag);
    form.setValue("tags", newTags);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-10 font-inter"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  placeholder="Title"
                  className="paragraph-regular background-light900_dark300 light-border text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem?*{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  initialValue={parsedQuestionDetail?.content || ""}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "print",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "paste",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "codesample | bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Inter; font-size:16px; }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    placeholder="Add tags..."
                    disabled={type === "Edit"}
                    className="paragraph-regular background-light900_dark300 light-border text-dark300_light700 min-h-[56px] border"
                    onKeyDown={
                      type === "Edit"
                        ? () => {}
                        : (e) => handleInputKeyDown(e, field)
                    }
                  />
                  {field?.value?.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium text-light400_light500 background-light800_dark300 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                        >
                          {tag}
                          {type !== "Edit" && (
                            <Image
                              src={"/assets/icons/close.svg"}
                              alt="Close icon"
                              width={12}
                              height={12}
                              onClick={() => handleRemoveTag(tag, field)}
                              className="cursor-pointer object-contain invert-0 dark:invert"
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          className="primary-gradient w-full !text-light-900 disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <>{type === "Edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "Edit" ? "Edit Question" : "Ask a questino"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
