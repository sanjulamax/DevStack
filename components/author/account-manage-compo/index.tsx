"use client";
import { UserSchema } from "@/lib/user.schema";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

import { CldUploadWidget } from "next-cloudinary";
import { CldImage } from "next-cloudinary";
import { findUserByEmail, RegisterUser } from "@/app/actions/user.action";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AccountManageCompo = () => {
  const [isPending, startTransition] = React.useTransition();
  const [returnMsg, setReturnMsg] = useState<any>();
  const [imageUrl, setImageUrl] = React.useState("");
  const [userInfo, setUserInfo] = useState<any>({});
  const { user, isLoaded } = useUser();
  const [userExist, setUserExist] = useState(false);
  const [existUserData, setExistUserData] = useState<any>();
  const [dataLoaded, setDataLoaded] = useState(false);

  const existUser = async (email: any) => {
    if (!email) {
      setDataLoaded(true);
      return;
    }

    const existUserConform = await findUserByEmail(email);
    if (existUserConform.success) {
      setUserExist(true);
      setExistUserData(existUserConform.user);
    } else {
      setUserExist(false);
    }
    // Always set dataLoaded to true after the API call completes
    setDataLoaded(true);
  };

  useEffect(() => {}, [userExist]);

  useEffect(() => {
    if (isLoaded) {
      setUserInfo(user);

      if (user?.primaryEmailAddress?.emailAddress) {
        existUser(user.primaryEmailAddress.emailAddress);
      } else {
        setDataLoaded(true);
      }
    }
  }, [isLoaded, user]);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      // Changed from email to userInfo.primaryEmailAddress.emailAddress
      username: null, // Changed from userName to username
      firstName: null,
      lastName: null,
      role: "USER",
      birthday: null,
      bio: null,
      profilePicture: null,
      carierPaths: "Happy Coder",
      workingPlace: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const submitAction = (data: z.infer<typeof UserSchema>) => {
    startTransition(async () => {
      const submitionAfterCall = await RegisterUser(data);

      setReturnMsg(submitionAfterCall);
      form.reset();
      setImageUrl("");
      window.location.reload();
    });
  };

  const imageUploadHandler = (data: any) => {
    setImageUrl(data.info.secure_url);
    form.setValue("profilePicture", data.info.secure_url);
  };

  return (
    <div>
      <SignedIn>
        <div className="container h-screen mx-auto p-8 max-w-6xl">
          <div className="bg-white dark:bg-card dark:border-2 rounded-2xl shadow-xl p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-400/20 to-yellow-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Account Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Upload Section */}
              <div className="flex flex-col items-center justify-start">
                <div className="mb-6 relative group">
                  {imageUrl ? (
                    dataLoaded ? (
                      <div className="relative w-64 h-64 rounded-full overflow-hidden ring-4 ring-offset-4 ring-purple-400 ring-offset-white transition-all duration-300 shadow-lg hover:shadow-2xl">
                        <CldImage
                          width="300"
                          height="300"
                          src={imageUrl}
                          sizes="100%"
                          alt="Profile Image"
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner ring-4 ring-offset-4 ring-purple-400/30 ring-offset-white">
                        <Loader2 className="size-60"></Loader2>
                      </div>
                    )
                  ) : dataLoaded ? (
                    existUserData?.profilePicture ? (
                      (console.log("this is dp url"),
                      console.log(""),
                      (
                        <div className="relative w-64 h-64 rounded-full overflow-hidden ring-4 ring-offset-4 ring-purple-400 ring-offset-white transition-all duration-300 shadow-lg hover:shadow-2xl">
                          <Image
                            width="300"
                            height="300"
                            src={existUserData?.profilePicture}
                            sizes="100%"
                            alt="Profile Image"
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner ring-4 ring-offset-4 ring-purple-400/30 ring-offset-white">
                        <span className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-6xl font-medium w-full h-full flex items-center justify-center rounded-full">
                          {existUserData?.firstName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="w-64 h-64 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner ring-4 ring-offset-4 ring-purple-400/30 ring-offset-white">
                      <Image
                        src="/imgLoader.gif"
                        alt="loading"
                        width={150}
                        height={150}
                      />
                    </div>
                  )}
                </div>
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
                  onSuccess={(data) => {
                    imageUploadHandler(data);
                  }}
                  onCloseAction={(data) => {}}
                >
                  {({ open }) => {
                    return (
                      <button
                        onClick={() => open()}
                        className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Upload Photo
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>

              {/* Form Section */}
              <div className="bg-white dark:bg-card dark:border-2 p-5 rounded-xl">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => {
                      submitAction(data);
                    })}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                disabled={isPending || !dataLoaded}
                                {...field}
                                value={field.value ?? existUserData?.firstName}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 focus:outline-none"
                                placeholder="Your first name"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                disabled={isPending || !dataLoaded}
                                {...field}
                                value={field.value ?? existUserData?.lastName}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 focus:outline-none"
                                placeholder="Your last name"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Username
                          </FormLabel>
                          <FormControl>
                            <input
                              type="text"
                              disabled={isPending || !dataLoaded}
                              {...field}
                              value={field.value ?? existUserData?.username}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 focus:outline-none"
                              placeholder="Choose a username"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Bio
                          </FormLabel>
                          <FormControl>
                            <textarea
                              disabled={isPending || !dataLoaded}
                              {...field}
                              value={field.value ?? existUserData?.bio}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 focus:outline-none min-h-[120px] resize-none"
                              placeholder="Tell us about yourself"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="carierPaths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Career Path
                            </FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                disabled={isPending || !dataLoaded}
                                {...field}
                                value={
                                  field.value ?? existUserData?.carierPaths
                                }
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 focus:outline-none"
                                placeholder="Your career path"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="workingPlace"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Workplace
                            </FormLabel>
                            <FormControl>
                              <input
                                type="text"
                                disabled={isPending || !dataLoaded}
                                {...field}
                                value={
                                  field.value ?? existUserData?.workingPlace
                                }
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 focus:outline-none"
                                placeholder="Current workplace"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="birthday"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Birthday
                          </FormLabel>
                          <FormControl>
                            <input
                              type="date"
                              disabled={isPending || !dataLoaded}
                              {...field}
                              value={field.value ?? existUserData?.birthday}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 focus:outline-none"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex justify-center items-center gap-2"
                      >
                        {isPending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                        )}
                        {isPending ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            {/* Messages */}
            <div className="mt-8">
              {returnMsg?.success && (
                <div className="animate-fadeIn bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-green-800 font-medium">
                    Successfully updated your profile!
                  </span>
                </div>
              )}
              {returnMsg?.update && (
                <div className="animate-fadeIn bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    Your changes have been updated.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="container mx-auto p-8 max-w-md h-screen flex items-center justify-center">
          <div className="bg-white dark:bg-card dark:border-2 rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Unlock Your Experience
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign up or log in to access personalized features and exclusive
              content.
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300">
              <SignUpButton>Sign Up</SignUpButton>
            </Button>
            <div className="mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?
              </span>
              <Button
                variant="link"
                className="text-blue-600 dark:text-blue-500 hover:underline ml-1"
              >
                <SignInButton>Log In</SignInButton>
              </Button>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default AccountManageCompo;
