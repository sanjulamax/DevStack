"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { CldImage } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { findUserByEmail } from "@/app/actions/user.action";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  Loader2,
  Moon,
  Slash,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const NavBarComponent = () => {
  const { setTheme } = useTheme();
  const [existUserData, setExistUserData] = useState<any>();
  const [userExist, setUserExist] = useState(false);
  const { isLoaded, user } = useUser();
  const [userInfo, setUserInfo] = useState<any>();
  const [imageUrl, setImageUrl] = React.useState("");

  const existUser = async (email: any) => {
    const existUserConform = await findUserByEmail(email);
    if (existUserConform.success) {
      setUserExist(true);
      setExistUserData(existUserConform.user);
    } else {
      setUserExist(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      setUserInfo(user);
      existUser(user?.primaryEmailAddress?.emailAddress);
    }
  }, [isLoaded, user]);
  console.log("existUserData");

  console.log(existUserData);
  return (
    <nav className="bg-slate-200 dark:bg-gray-900 shadow fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Label className="font-bold text-xl" id="logo">
                <div className="flex justify-center align-middle items-center hover:text-green-500 transition-colors duration-400 ease-in-out">
                  <Link
                    href="/"
                    className="flex  justify-center align-middle items-center"
                  >
                    {" "}
                    <ChevronLeft></ChevronLeft>DevStack
                    <ChevronRight></ChevronRight>{" "}
                  </Link>
                </div>
              </Label>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Add navigation links here */}
                <a
                  href="/"
                  className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </a>
                <SignedIn>
                  <a
                    href="/post-create"
                    className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Create Topic
                  </a>
                  <a
                    href="/notifications"
                    className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Notification Center
                  </a>

                  {existUserData?.id ? (
                    <a
                      href={`other-user/${existUserData?.id}`}
                      className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Space
                    </a>
                  ) : (
                    <div className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Loading...
                    </div>
                  )}
                </SignedIn>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <SignedOut>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <SignInButton>SignIn</SignInButton>
                </Button>
                <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
                  <SignUpButton>SignUp</SignUpButton>
                </Button>
              </SignedOut>

              <SignedIn>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 flex items-center justify-center cursor-pointer">
                      {existUserData?.profilePicture ? (
                        <Image
                          width="100"
                          height="100"
                          className="w-full h-full object-cover"
                          src={imageUrl || existUserData?.profilePicture}
                          sizes="10vw"
                          alt="Profile Picture"
                        />
                      ) : (
                        <Image
                          alt="img"
                          width={100}
                          height={100}
                          src={user?.imageUrl || ""}
                        />
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="flex flex-col align-middle justify-center items-center"
                    align="center"
                  >
                    <DropdownMenuItem className="w-full">
                      <Link className="w-full" href="account-manage">
                        <Button className="w-full" variant="outline">
                          Profile
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="w-full">
                      <SignOutButton>
                        <Button className="w-full" variant="outline">
                          Sign Out
                        </Button>
                      </SignOutButton>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="w-full">
                      <Link href="/followers" className="w-full">
                        <Button className="w-full" variant="outline">
                          Your Followers
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="w-full">
                      <Link href="/following" className="w-full">
                        <Button variant="outline" className="w-full">
                          Following By You
                        </Button>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Label className="ml-4">{userInfo?.fullName}</Label>
              </SignedIn>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="ml-4">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4">
                <div className="flex flex-col space-y-4">
                  <a
                    href="/"
                    className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </a>
                  <a
                    href="/post-create"
                    className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Create Topic
                  </a>
                  <a
                    href="/notifications"
                    className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Notification Center
                  </a>
                  {existUserData?.id && (
                    <a
                      href={`other-user/${existUserData?.id}`}
                      className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Space
                    </a>
                  )}

                  <SignedOut>
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      <SignInButton>SignIn</SignInButton>
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
                      <SignUpButton>SignUp</SignUpButton>
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      href="account-manage"
                    >
                      Profile
                    </Link>

                    <Link
                      href="/followers"
                      className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Button variant="outline">Your Followers</Button>
                    </Link>
                    <Link
                      href="/following"
                      className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Button variant="outline">Following By You</Button>
                    </Link>

                    <SignOutButton>
                      <Button className="text-gray-500 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Sign Out
                      </Button>
                    </SignOutButton>
                  </SignedIn>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="ml-4">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBarComponent;
