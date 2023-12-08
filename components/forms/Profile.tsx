"use client";
import { formSchema } from "@/lib/validatoins";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";

type ProfileProps = {
  clerkId: string;
  user: string;
};

const Profile = ({ clerkId, user }: ProfileProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedUser = JSON.parse(user);
  const router = useRouter();
  const pathName = usePathname();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          bio: values.bio,
          location: values.location,
          portfolioWebsite: values.portfolioWebsite,
        },
        path: pathName
      });
      router.back();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex w-full flex-col gap-9"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Your name"
                    {...field}
                    className="paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Username <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Your username"
                    {...field}
                    className="paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolioWebsite"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Your portfolio URL"
                    {...field}
                    className="paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Where are you from ?"
                    {...field}
                    className="paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Bio <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's special about you?"
                    {...field}
                    className="paragraph-regular light-border-2 background-light900_dark300 text-dark300_light700 min-h-[56px]"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-light-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
