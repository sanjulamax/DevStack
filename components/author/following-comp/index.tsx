"use client";
import { fetchFollwings, unFollowAction } from "@/app/actions/user.action";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  UserMinus,
  Search,
  UserPlus,
  UserRound,
  Heart,
  Users,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const FollowingCompo = () => {
  const { isLoaded, user } = useUser();
  const [follwingData, setFollwingData] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [unfollowingId, setUnfollowingId] = React.useState<string | null>(null);

  const getFollowings = async () => {
    setLoading(true);
    if (user?.primaryEmailAddress?.emailAddress) {
      const follwings = await fetchFollwings(
        user?.primaryEmailAddress?.emailAddress
      );
      if (follwings) {
        setFollwingData(follwings.data || []);
      }
    }
    setLoading(false);
  };

  const unFollowFuc = async (followingUserEmail: any) => {
    setUnfollowingId(followingUserEmail);
    if (user) {
      const unFollow = await unFollowAction(
        user?.primaryEmailAddress?.emailAddress,
        followingUserEmail
      );
      if (unFollow.success) {
        window.location.reload();
      }
      setUnfollowingId(null);
    }
  };

  useEffect(() => {
    getFollowings();
  }, [user, isLoaded]);

  // Filter following users based on search query
  const filteredFollowing = follwingData?.filter((followingUser: any) =>
    followingUser?.following?.username
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <SignedIn>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="h-6 w-6 text-rose-500 dark:text-rose-400" />
                People You Follow
                {follwingData?.length > 0 && (
                  <Badge className="ml-2 bg-rose-500 hover:bg-rose-600">
                    {follwingData.length}
                  </Badge>
                )}
              </h1>
            </div>

            {/* Search Bar 
        {follwingData?.length > 0 && (
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search people you follow..."
              className="pl-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}*/}
          </div>

          {/* Following List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Loading people you follow...
                </p>
              </div>
            ) : filteredFollowing?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFollowing.map((followingUser: any, index: any) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10 dark:from-rose-500/5 dark:to-pink-500/5 h-24"></div>

                        <div className="relative p-6 flex flex-col">
                          <div className="flex items-center mb-4">
                            <div className="relative mr-4 flex-shrink-0">
                              {followingUser?.following?.profilePicture ? (
                                <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                                  <Image
                                    alt={`${
                                      followingUser?.following?.username ||
                                      "User"
                                    }'s profile`}
                                    src={
                                      followingUser?.following
                                        ?.profilePicture || "/placeholder.svg"
                                    }
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                                  {followingUser?.following?.username
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </div>
                              )}
                              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full ring-1 ring-white dark:ring-gray-800"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {followingUser?.following?.username ||
                                  "Anonymous User"}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>You're following</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <Link
                              href={`/other-user/${followingUser?.following?.id}`}
                              className="inline-flex"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200"
                              >
                                <ExternalLink className="h-4 w-4 mr-1.5" />
                                View Profile
                              </Button>
                            </Link>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-full transition-all duration-200"
                                    onClick={() =>
                                      unFollowFuc(followingUser?.followingEmail)
                                    }
                                    disabled={
                                      unfollowingId ===
                                      followingUser?.followingEmail
                                    }
                                  >
                                    {unfollowingId ===
                                    followingUser?.followingEmail ? (
                                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <UserMinus className="h-4 w-4 mr-1.5" />
                                    )}
                                    Unfollow
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Stop following this user</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mb-4">
                  <UserRound className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  You're not following anyone yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  When you follow people, they'll appear here. Explore and
                  connect with others in the community!
                </p>
                {/* <Button className="bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-full px-6 py-2 h-auto flex items-center gap-2 mx-auto">
              <UserPlus className="h-4 w-4" />
              Discover People
            </Button> */}
              </div>
            )}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <UserRound className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Authentication Required
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
              Sign in to view and manage following users by you. Connect with
              others and grow your network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] rounded-full transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md">
                <SignInButton>Sign In</SignInButton>
              </Button>
              <Button
                variant="outline"
                className="border-indigo-500 text-indigo-600 dark:text-indigo-400 min-w-[140px] rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-md"
              >
                <SignUpButton>Create Account</SignUpButton>
              </Button>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default FollowingCompo;
