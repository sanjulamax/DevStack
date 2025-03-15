"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PostSchema } from "@/lib/post.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { toast } from "sonner";
import { title } from "process";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { CreatePost } from "@/app/actions/post.action";

const CreatePostComponent = () => {
  const { user, isLoaded } = useUser();
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      authorEmail: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      media: null,
    },
  });

  const [isPending, startTransition] = useTransition();

  const SubmitHandler = async (data: z.infer<typeof PostSchema>) => {
    {
      user &&
        startTransition(async () => {
          console.log(data);

          await CreatePost(data);
          toast("You Topic Now Online");
          setMediaUrl(null);
        });
    }
    form.reset();
    window.location.reload();
  };

  const imageUploadHandler = (data: any) => {
    form.setValue("media", data.info.secure_url);
    setMediaUrl(data.info.secure_url);
    console.log(data.info.secure_url);
  };

  const [authorEmail, setAuthorEmail] = useState<string | null>(null);

  useEffect(() => {
    setAuthorEmail(user?.primaryEmailAddress?.emailAddress || "");
    form.setValue("authorEmail", authorEmail);
  }, [isLoaded, user]);

  useEffect(() => {
    form.setValue("authorEmail", authorEmail);
    console.log("author email");
  }, [authorEmail]);

  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen  bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="md:flex">
              {/* Left Side - Form */}
              <div className="w-full md:w-1/2 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Create a New Topic
                </h1>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(SubmitHandler)}
                    className="space-y-5"
                  >
                    <FormField
                      name="title"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Title</FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              disabled={isPending}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                              placeholder="Enter your post title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="content"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Content
                          </FormLabel>
                          <FormControl>
                            <textarea
                              disabled={isPending}
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                              placeholder="Share your thoughts..."
                              {...field}
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            Category
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ""}
                              disabled={isPending}
                            >
                              <SelectTrigger className="w-full text-black">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Programming">
                                  Programming
                                </SelectItem>
                                <SelectItem value="Computer Science">
                                  Computer Science
                                </SelectItem>
                                <SelectItem value="Computer Hardware">
                                  Computer Hardware
                                </SelectItem>
                                <SelectItem value="Computer Computing">
                                  Cloud Computing
                                </SelectItem>
                                <SelectItem value="Networkinge">
                                  Networkinge
                                </SelectItem>
                                <SelectItem value="Gaming">Gaming</SelectItem>
                                <SelectItem value="AI & ML">AI & ML</SelectItem>
                                <SelectItem value="IOT">IOT</SelectItem>
                                <SelectItem value="Data Base">
                                  Data Base
                                </SelectItem>
                                <SelectItem value="Cyber Security">
                                  Cyber Security
                                </SelectItem>
                                <SelectItem value="Software Engineering">
                                  Software Engineering
                                </SelectItem>
                                <SelectItem value="Android & IOS">
                                  Android & IOS
                                </SelectItem>
                                <SelectItem value="Operating Systems">
                                  Operating Systems
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Create Topic
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Right Side - Image Upload and Preview */}
              <div className="w-full md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-l border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Upload Image
                </h2>
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                  }
                  options={{
                    sources: [
                      "local",
                      "camera",
                      "dropbox",
                      "google_drive",
                      "url",
                    ],
                    multiple: false,
                    maxFiles: 1,
                  }}
                  onSuccess={imageUploadHandler}
                >
                  {({ open }) => (
                    <Button
                      type="button"
                      onClick={() => open()}
                      disabled={isPending}
                      className="mb-6 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Choose Image
                    </Button>
                  )}
                </CldUploadWidget>
                {mediaUrl && (
                  <div className="w-full">
                    <CldImage
                      width="480"
                      height="320"
                      src={mediaUrl}
                      sizes="100vw"
                      alt="Uploaded Content"
                      className="rounded-lg object-cover shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Authentication Required
                </h2>
                <p className="text-gray-600">
                  Please sign in to create and share your topics
                </p>
              </div>

              <div className="space-y-4">
                <SignInButton>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-blue-200">
                    Sign In to Your Account
                  </Button>
                </SignInButton>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <SignUpButton>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-200">
                    Create New Account
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </>
  );
};

export default CreatePostComponent;
