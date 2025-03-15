"use client";
import {
  GetAllPosts,
  searchFunction,
  sortByCategory,
  sortByDownVotes,
  sortByPopularity,
  sortByUpVotes,
} from "@/app/actions/post.action";
import { useEffect, useState } from "react";
import Link from "next/link";
import Iterator from "./comp";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import {
  getFollwingUsersPosts,
  registerUserAuto,
} from "@/app/actions/user.action";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  AtomIcon,
  Boxes,
  Code2,
  Cpu,
  DatabaseZap,
  Filter,
  Gamepad2,
  LaptopMinimalIcon as LaptopMinimalCheck,
  Layers,
  LucideCloudDownload,
  MicroscopeIcon as Microchip,
  MonitorSmartphone,
  Network,
  Search,
  ShieldCheck,
  TabletSmartphone,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Sparkles,
  UserCheck,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HomeComponent = () => {
  const [postsData, setPostsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { isLoaded, user } = useUser();
  const [userInfo, setUerInfo] = useState<string | null>(null);
  const [postAllData, setPostAllData] = useState<any>([]);
  const [uData, setUData] = useState<any>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<string>("popular");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    setUerInfo(user?.primaryEmailAddress?.emailAddress || null);
    setUData(user);
  }, [isLoaded, user, userInfo]);

  const autoRegister = async () => {
    const userData = {
      email: uData?.primaryEmailAddress?.emailAddress || "",
      username: uData?.username || "",
      firstName: uData?.firstName || "",
      lastName: uData?.lastName || "",
      birthday: uData?.birthday || "",
      bio: uData?.bio || "",
      profilePicture: uData?.imageUrl || "",
      carierPaths: uData?.carierPaths || "",
      workingPlace: uData?.workingPlace || "",
    };
    const registeruser = await registerUserAuto(userInfo, userData);
    if (registeruser.alredyUserSuccess) {
    } else if (registeruser.regSuccess) {
    } else if (registeruser.regError) {
    } else if (registeruser.alreadyUserError) {
    } else {
    }
  };

  useEffect(() => {
    if (uData?.length > 0 || uData !== undefined) {
      autoRegister();
    }
  }, [uData]);

  const getPosts = async () => {
    try {
      const posts = await GetAllPosts();
      setPostsData(posts.data || []);
      setPostAllData(posts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [userInfo]);

  // Pagination Section
  const [currentPage, setCurrentPage] = useState<any>(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = postsData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(postsData.length / itemsPerPage);

  // Search Components
  const [search, setSearch] = useState<string>("");
  const searchFunc = async (searchString: any) => {
    setLoading(true);
    const searchPosts = await searchFunction(searchString);
    if (searchPosts?.success) {
      setPostsData(searchPosts.data);
      setLoading(false);
    } else {
      setLoading(false);
      return { error: true };
    }
  };

  const mostPopularPostsFunction = async () => {
    setLoading(true);
    setActiveSort("popular");
    const mostPopularPosts = await sortByPopularity();
    if (mostPopularPosts.success) {
      setPostsData(mostPopularPosts.data || []);
      setLoading(false);
    }
  };

  const sortByUpvortesFunction = async () => {
    setLoading(true);
    setActiveSort("upvotes");
    const mostUpvoted = await sortByUpVotes();
    if (mostUpvoted.success) {
      setPostsData(mostUpvoted.data || []);
      setLoading(false);
    }
  };

  const sortByDownvortesFunction = async () => {
    setLoading(true);
    setActiveSort("downvotes");
    const mostDownvoted = await sortByDownVotes();
    if (mostDownvoted.success) {
      setPostsData(mostDownvoted.data || []);
      setLoading(false);
    }
  };

  const sortByCategoryFunc = async (category: string) => {
    setLoading(true);
    setActiveCategory(category);
    const categoryPosts = await sortByCategory(category);
    if ((categoryPosts.data?.length ?? 0) > 0) {
      setPostsData(categoryPosts.data || []);
      setLoading(false);
    } else {
      setPostsData([]);
      setLoading(false);
    }
  };

  const getFollwersPosts = async () => {
    setLoading(true);
    setActiveSort("followers");
    const followersPostData = await getFollwingUsersPosts(userInfo);
    if (followersPostData?.success) {
      setPostsData(followersPostData.data || []);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const categories = [
    { name: "Programming", icon: <Code2 className="h-4 w-4" /> },
    {
      name: "Computer Science",
      icon: <LaptopMinimalCheck className="h-4 w-4" />,
    },
    { name: "Computer Hardware", icon: <Cpu className="h-4 w-4" /> },
    { name: "Networking", icon: <Network className="h-4 w-4" /> },
    {
      name: "Cloud Computing",
      icon: <LucideCloudDownload className="h-4 w-4" />,
    },
    { name: "Gaming", icon: <Gamepad2 className="h-4 w-4" /> },
    { name: "AI & ML", icon: <AtomIcon className="h-4 w-4" /> },
    { name: "IOT", icon: <MonitorSmartphone className="h-4 w-4" /> },
    { name: "Data Base", icon: <DatabaseZap className="h-4 w-4" /> },
    { name: "Cyber Security", icon: <ShieldCheck className="h-4 w-4" /> },
    { name: "Software Engineering", icon: <Boxes className="h-4 w-4" /> },
    { name: "Android & IOS", icon: <TabletSmartphone className="h-4 w-4" /> },
    { name: "Operating Systems", icon: <Microchip className="h-4 w-4" /> },
  ];

  const sortOptions = [
    {
      name: "Most Popular",
      value: "popular",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      name: "Most Upvoted",
      value: "upvotes",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    {
      name: "Most Downvoted",
      value: "downvotes",
      icon: <ThumbsDown className="h-4 w-4" />,
    },
    {
      name: "Follwers Topics",
      value: "followers",
      icon: <UserCheck className="h-4 w-4" />,
    },
  ];

  const sortOptions1 = [
    {
      name: "Most Popular",
      value: "popular",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      name: "Most Upvoted",
      value: "upvotes",
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    {
      name: "Most Downvoted",
      value: "downvotes",
      icon: <ThumbsDown className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen pb-10 pt-20 px-4 sm:px-6 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30">
      <div className="max-w-screen mx-auto">
        {/* Header with search and filters */}
        <div className="w-[100%]   flex justify-center align-middle">
          <div className="relative w-[1000px]  z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl md:p-6 p-2 shadow-lg border border-indigo-100 dark:border-indigo-900/50 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl -z-10"></div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Search Bar */}
              <div className="w-[300px] lg:w-full md:w-auto flex-1 max-w-2xl relative group">
                <div
                  className={`absolute inset-0 bg-indigo-400/20 dark:bg-indigo-600/30 rounded-full blur ${
                    isSearchFocused ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                ></div>
                <div className="relative">
                  <Search
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                      isSearchFocused
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-muted-foreground"
                    } transition-colors duration-300`}
                  />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for topics, questions, or keywords..."
                    className="pl-12 pr-20 py-7 border-2 rounded-full bg-white/90 dark:bg-gray-900/90 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-base transition-all duration-300"
                    onKeyDown={(e) => e.key === "Enter" && searchFunc(search)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <Button
                    onClick={() => searchFunc(search)}
                    className="absolute right-1.5 top-1/2 transform -translate-y-1/2 rounded-full h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {/* Active Filters Display */}
                {activeCategory && (
                  <div className="hidden md:flex items-center">
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 py-1 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5"
                    >
                      <span>{activeCategory}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200"
                        onClick={() => {
                          setActiveCategory(null);
                          getPosts();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </Button>
                    </Badge>
                  </div>
                )}

                {/* Mobile filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="md:hidden relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-indigo-400/20 dark:bg-indigo-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Filter className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span>Filters</span>
                      {activeCategory && (
                        <Badge className="ml-2 bg-indigo-600 text-white">
                          1
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[300px] sm:w-[400px] border-l border-indigo-200 dark:border-indigo-800 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-950 dark:to-indigo-950/30"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Filters & Categories
                      </SheetTitle>
                      <SheetDescription>
                        Sort posts or filter by category
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 ">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <ArrowUpDown className="h-4 w-4" />
                        Sort by
                      </h3>
                      <SignedIn>
                        {" "}
                        <div className="space-y-2 mb-6">
                          {sortOptions.map((option) => (
                            <Button
                              key={option.value}
                              variant={
                                activeSort === option.value
                                  ? "default"
                                  : "ghost"
                              }
                              className={`w-full justify-start ${
                                activeSort === option.value
                                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                              }`}
                              onClick={() => {
                                if (option.value === "popular")
                                  mostPopularPostsFunction();
                                else if (option.value === "upvotes")
                                  sortByUpvortesFunction();
                                else if (option.value === "downvotes")
                                  sortByDownvortesFunction();
                                else if (option.value === "followers")
                                  getFollwersPosts();
                              }}
                            >
                              <span className="mr-2">{option.icon}</span>
                              {option.name}
                            </Button>
                          ))}
                        </div>
                      </SignedIn>
                      <SignedOut>
                        <div className="space-y-2 mb-6">
                          {sortOptions1.map((option) => (
                            <Button
                              key={option.value}
                              variant={
                                activeSort === option.value
                                  ? "default"
                                  : "ghost"
                              }
                              className={`w-full justify-start ${
                                activeSort === option.value
                                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                              }`}
                              onClick={() => {
                                if (option.value === "popular")
                                  mostPopularPostsFunction();
                                else if (option.value === "upvotes")
                                  sortByUpvortesFunction();
                                else if (option.value === "downvotes")
                                  sortByDownvortesFunction();
                                else if (option.value === "followers")
                                  getFollwersPosts();
                              }}
                            >
                              <span className="mr-2">{option.icon}</span>
                              {option.name}
                            </Button>
                          ))}
                        </div>
                      </SignedOut>

                      <Separator className="my-4 bg-indigo-200 dark:bg-indigo-800" />

                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <Layers className="h-4 w-4" />
                        Categories
                      </h3>
                      <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-[calc(100vh-400px)] pr-2">
                        <Button
                          variant={
                            activeCategory === null ? "default" : "ghost"
                          }
                          className={`justify-start ${
                            activeCategory === null
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                          }`}
                          onClick={() => {
                            setActiveCategory(null);
                            getPosts();
                          }}
                        >
                          All Topics
                        </Button>
                        {categories.map((category) => (
                          <Button
                            key={category.name}
                            variant={
                              activeCategory === category.name
                                ? "default"
                                : "ghost"
                            }
                            className={`justify-start ${
                              activeCategory === category.name
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                            }`}
                            onClick={() => sortByCategoryFunc(category.name)}
                          >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Button className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700">
                        Apply Filters
                      </Button>
                    </SheetClose>
                  </SheetContent>
                </Sheet>

                {/* Desktop pagination indicator */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="hidden md:flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-full shadow-sm border border-indigo-200 dark:border-indigo-800 backdrop-blur-sm">
                        <span className="text-sm font-medium text-muted-foreground">
                          Page
                        </span>
                        <Badge
                          variant="secondary"
                          className="rounded-full h-8 w-8 flex items-center justify-center font-bold bg-indigo-600 text-white"
                        >
                          {currentPage}
                        </Badge>
                        <span className="text-sm font-medium text-muted-foreground">
                          of
                        </span>
                        <Badge
                          variant="outline"
                          className="rounded-full h-8 w-8 flex items-center justify-center border-indigo-200 dark:border-indigo-800"
                        >
                          {totalPages}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Current page: {currentPage} of {totalPages}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Category chips (desktop only) 
          <div className="hidden md:flex flex-wrap gap-2 mt-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                >
                  More Categories...
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-l border-indigo-200 dark:border-indigo-800 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-950 dark:to-indigo-950/30"
              >
                <SheetHeader>
                  <SheetTitle className="text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    All Categories
                  </SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-1 gap-2 py-4">
                  {categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={
                        activeCategory === category.name ? "default" : "ghost"
                      }
                      className={`justify-start ${
                        activeCategory === category.name
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                      }`}
                      onClick={() => {
                        sortByCategoryFunc(category.name);
                      }}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>*/}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop left sidebar */}
          <div className="hidden lg:block w-60 shrink-0">
            <Card className="sticky top-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 -z-10"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <SignedIn>
                  {" "}
                  <div className="space-y-2 mb-6">
                    {sortOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          activeSort === option.value ? "default" : "ghost"
                        }
                        className={`w-full justify-start ${
                          activeSort === option.value
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        }`}
                        onClick={() => {
                          if (option.value === "popular")
                            mostPopularPostsFunction();
                          else if (option.value === "upvotes")
                            sortByUpvortesFunction();
                          else if (option.value === "downvotes")
                            sortByDownvortesFunction();
                          else if (option.value === "followers")
                            getFollwersPosts();
                        }}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.name}
                      </Button>
                    ))}
                  </div>
                </SignedIn>
                <SignedOut>
                  <div className="space-y-2 mb-6">
                    {sortOptions1.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          activeSort === option.value ? "default" : "ghost"
                        }
                        className={`w-full justify-start ${
                          activeSort === option.value
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        }`}
                        onClick={() => {
                          if (option.value === "popular")
                            mostPopularPostsFunction();
                          else if (option.value === "upvotes")
                            sortByUpvortesFunction();
                          else if (option.value === "downvotes")
                            sortByDownvortesFunction();
                          else if (option.value === "followers")
                            getFollwersPosts();
                        }}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.name}
                      </Button>
                    ))}
                  </div>
                </SignedOut>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1 ">
            {/* Posts grid */}
            {loading ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50"
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Skeleton className="h-5 w-4/5 mb-3" />
                      <Skeleton className="h-24 w-full mb-3" />
                    </CardContent>
                    <Skeleton className="h-[200px] w-full" />
                    <CardFooter className="p-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              !loading &&
              !(currentItems.length === 0) && (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {currentItems?.map((post: any, index: number) => (
                    <div
                      key={index}
                      className="transition-all duration-300 hover:translate-y-[-4px]"
                    >
                      <Iterator post={post} index={index} loading={loading} />
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Empty state */}
            {!loading && postsData.length === 0 && (
              <Card className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 -z-10"></div>
                <div className="rounded-full bg-indigo-600/10 p-4 mb-4">
                  <Layers className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="mb-2 text-indigo-700 dark:text-indigo-300">
                  No posts found
                </CardTitle>
                <CardDescription className="mb-6">
                  {activeCategory
                    ? `No posts found in the "${activeCategory}" category.`
                    : "Be the first to share a post!"}
                </CardDescription>
                <Link href="/post-create">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Create a post
                  </Button>
                </Link>
              </Card>
            )}

            {/* Pagination */}
            {!loading && postsData.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="flex flex-wrap items-center gap-2 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                    <PaginationItem>
                      <PaginationPrevious
                        className={cn(
                          "transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
                          currentPage === 1 && "pointer-events-none opacity-50"
                        )}
                        onClick={() =>
                          setCurrentPage((prev: any) => Math.max(prev - 1, 1))
                        }
                      />
                    </PaginationItem>

                    {totalPages > 7 ? (
                      <>
                        {[...Array(Math.min(3, totalPages))].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              className={cn(
                                "transition-transform hover:scale-110",
                                currentPage === i + 1 &&
                                  "font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                              )}
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {currentPage > 4 && (
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        )}

                        {currentPage > 3 && currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationLink
                              className="transition-transform hover:scale-110 font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                              isActive={true}
                              onClick={() => {}}
                            >
                              {currentPage}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {currentPage < totalPages - 3 && (
                          <PaginationItem>
                            <span className="px-2">...</span>
                          </PaginationItem>
                        )}

                        {[...Array(Math.min(3, totalPages))].map((_, i) => (
                          <PaginationItem key={totalPages - 3 + i}>
                            <PaginationLink
                              className={cn(
                                "transition-transform hover:scale-110",
                                currentPage === totalPages - 2 + i &&
                                  "font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                              )}
                              isActive={currentPage === totalPages - 2 + i}
                              onClick={() => setCurrentPage(totalPages - 2 + i)}
                            >
                              {totalPages - 2 + i}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      </>
                    ) : (
                      Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            className={cn(
                              "transition-transform hover:scale-110",
                              currentPage === i + 1 &&
                                "font-bold bg-indigo-600 text-white hover:bg-indigo-700"
                            )}
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    )}

                    <PaginationItem>
                      <PaginationNext
                        className={cn(
                          "transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
                          currentPage === totalPages &&
                            "pointer-events-none opacity-50"
                        )}
                        onClick={() =>
                          setCurrentPage((prev: any) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>

          {/* Desktop right sidebar */}
          <div className="hidden lg:block w-60 shrink-0">
            <Card className="sticky top-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 -z-10"></div>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Layers className="h-4 w-4" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                <Button
                  variant={activeCategory === null ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeCategory === null
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                  }`}
                  onClick={() => {
                    setActiveCategory(null);
                    getPosts();
                  }}
                >
                  All Topics
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={
                      activeCategory === category.name ? "default" : "ghost"
                    }
                    className={`w-full justify-start ${
                      activeCategory === category.name
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                    }`}
                    onClick={() => sortByCategoryFunc(category.name)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
