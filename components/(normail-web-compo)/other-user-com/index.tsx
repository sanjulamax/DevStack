"use client";
//the follings and follwers are upside down . do not mess with it . it is working fine
import {
  GetAllPostsForSpeacilUser,
  getPostByUserId,
} from "@/app/actions/post.action";
import IteratorUserProfile from "./iterator-uer";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UserCheck, UserMinus, Briefcase, Loader2, Edit } from "lucide-react";
import { SignedIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  addFollwers,
  createNotificationUser,
  getFollowersOfUser,
  getFollowingsOfUser,
  getFollwers,
  unFollowAction,
} from "@/app/actions/user.action";
import { Button } from "@/components/ui/button";

const OtherUserProfileCompo = ({ userId }: { userId: any }) => {
  const [userInfo, setUserInfo] = useState<any>();
  const [postsData, setPostsData] = useState<any[]>([]);
  const [loader, setLoader] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>();
  const { isLoaded, user } = useUser();
  const [numberOfFollowers, setNumberOfFollowers] = useState<number>(0);
  const [numberOfFollowings, setNumberOfFollowings] = useState<number>(0);
  const [loadFollwers, setLoadFollwers] = useState(false);
  const [alreadyFollowed, setAlreadyFollowed] = useState(false);
  const [followButtonLoading, setFollowButtonLoading] = useState(false);
  const [recheckFollow, setReCheckFollow] = useState(false);

  const getUserInfo = async () => {
    try {
      const userInfos = await getPostByUserId(userId);

      if (userInfos.data) {
        setUserInfo(userInfos.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUser?.primaryEmailAddress?.emailAddress || !userInfo?.email) {
      return;
    }

    try {
      setFollowButtonLoading(false);
      const followData = await getFollwers(
        currentUser.primaryEmailAddress.emailAddress,
        userInfo.email
      );

      if (followData.succes) {
        setAlreadyFollowed(true);
      } else {
        setAlreadyFollowed(false);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setFollowButtonLoading(true);
    }
  };

  useEffect(() => {
    if (currentUser && userInfo?.email) {
      checkFollowStatus();
    }
  }, [currentUser, userInfo?.email, recheckFollow]);

  const followFunction = async () => {
    try {
      setFollowButtonLoading(false);
      await addFollwers(
        currentUser.primaryEmailAddress.emailAddress,
        userInfo.email,
        userInfo.id
      );
      const noti = await createNotificationUser(
        currentUser.primaryEmailAddress.emailAddress,
        "New_Follower",
        userInfo.email
      );

      // Toggle the follow status immediately for UI feedback
      setAlreadyFollowed(true);
      // Then verify with the server
      setReCheckFollow((prev) => !prev);
    } catch (error) {
      console.error("Error following user:", error);
    }

    window.location.reload();
  };

  const unFollowFuc = async () => {
    setFollowButtonLoading(false);
    const unFollow = await unFollowAction(
      currentUser.primaryEmailAddress.emailAddress,
      userInfo.email
    );
    if (unFollow.success) {
      window.location.reload();
    }
    setFollowButtonLoading(true);
  };

  // Modify these functions to return promises
  const getFollowersNumber = async () => {
    if (!userInfo?.email) return;

    const follwers = await getFollowersOfUser(userInfo.email);
    if (follwers.error) return;
    if (follwers.data) {
      const followNo = follwers.data?.length || 0;
      setNumberOfFollowers(followNo);
    }
  };

  const getFollowingsNumber = async () => {
    if (!userInfo?.email) return;

    const follwwings = await getFollowingsOfUser(userInfo.email);
    if (follwwings.error) return;
    if (follwwings.data) {
      const followNos = follwwings.data?.length || 0;
      setNumberOfFollowings(followNos);
    }
  };

  useEffect(() => {
    setCurrentUser(user);
  }, [isLoaded, user]);

  const getUserPosts = async () => {
    if (userId) {
      try {
        const posts = await GetAllPostsForSpeacilUser(userId);

        if (posts.data) {
          setPostsData(posts.data || []);
        }
      } finally {
        setLoading(false);
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    getUserPosts();
    // Move these calls to a separate useEffect that runs when userInfo is available
  }, [userId]);

  // Update the useEffect to properly handle the loading state
  useEffect(() => {
    if (userInfo?.email) {
      setLoadFollwers(false); // Set to false when starting to fetch

      // Use Promise.all to wait for both API calls to complete
      Promise.all([getFollowersNumber(), getFollowingsNumber()]).finally(() => {
        setLoadFollwers(true); // Set to true only after both calls complete
      });
    }
  }, [userInfo]);

  const [loading, setLoading] = useState(true);

  return (
    <div className="bg-gradient-to-br min-h-screen h-full w-full from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30">
      <div className="container  max-w-4xl px-4 py-8 mx-auto ">
        {userInfo ? (
          <div className="overflow-hidden rounded-2xl mt-20 shadow-xl bg-card border border-primary/5 transition-all hover:shadow-primary/5">
            {/* Profile Content */}
            <div className="p-8 bg-gradient-to-b from-card to-card/95">
              {/* Profile Picture and Identity Section */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative w-36 h-36 overflow-hidden bg-muted rounded-full ring-4 ring-background shadow-lg mb-6 group">
                  {userInfo?.profilePicture ? (
                    <Image
                      src={userInfo.profilePicture}
                      alt="Profile Picture"
                      layout="fill"
                      objectFit="cover"
                      className="hover:scale-110 transition-transform duration-500"
                    />
                  ) : userInfo?.username ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/30">
                      <span className="text-5xl font-bold text-primary drop-shadow-md">
                        {userInfo?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/30">
                      <span className="text-5xl font-bold text-primary drop-shadow-md">
                        {userInfo?.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* User Identity */}
                <div className="flex flex-col items-center w-full">
                  <h2 className="text-3xl font-bold text-foreground tracking-tight drop-shadow-sm flex gap-5 items-center">
                    {userInfo?.username ||
                      `${userInfo?.firstName} ${userInfo?.lastName || ""}`}
                    {currentUser?.primaryEmailAddress?.emailAddress ===
                      userInfo?.email && (
                      <Link href="/account-manage">
                        <button className="transform -translate-y-1 hover:scale-110 transition-all duration-300 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg border border-white/20">
                          <Edit className="w-5 h-5 text-black" />
                        </button>
                      </Link>
                    )}
                  </h2>

                  <div className="mt-4">
                    {currentUser?.primaryEmailAddress?.emailAddress !==
                      userInfo?.email && (
                      <>
                        {followButtonLoading ? (
                          alreadyFollowed ? (
                            <SignedIn>
                              <Button
                                onClick={unFollowFuc}
                                variant="outline"
                                size="sm"
                                className="h-9 px-4 rounded-full border border-primary/20 bg-white/80 dark:bg-black/20 backdrop-blur-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-800 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 font-medium flex items-center gap-1.5 shadow-sm"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                                <span>Unfollow</span>
                              </Button>
                            </SignedIn>
                          ) : (
                            <SignedIn>
                              <Button
                                onClick={followFunction}
                                disabled={!followButtonLoading}
                                size="sm"
                                className="h-9 px-4 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-md hover:shadow-primary/20 transition-all duration-300 font-medium flex items-center gap-1.5 transform hover:-translate-y-0.5"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Follow</span>
                              </Button>
                            </SignedIn>
                          )
                        ) : (
                          <div className="flex items-center justify-center h-9 px-4">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                              <span className="text-xs text-muted-foreground font-medium">
                                Loading
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {userInfo?.bio && (
                  <p className="mt-3 text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    {userInfo.bio}
                  </p>
                )}
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                  <div className="flex items-center p-5 rounded-xl bg-card/50 border backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/30 hover:translate-y-[-2px]">
                    <div className="p-2.5 rounded-full bg-primary/10 mr-4">
                      <UserCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        First Name
                      </p>
                      <p className="font-medium text-foreground">
                        {userInfo?.firstName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-5 rounded-xl bg-card/50 border backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/30 hover:translate-y-[-2px]">
                    <div className="p-2.5 rounded-full bg-primary/10 mr-4">
                      <UserMinus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Name
                      </p>
                      <p className="font-medium text-foreground">
                        {userInfo?.lastName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-5 rounded-xl bg-card/50 border backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/30 hover:translate-y-[-2px]">
                    <div className="p-2.5 rounded-full bg-primary/10 mr-4">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Career Path
                      </p>
                      <p className="font-medium text-foreground">
                        {userInfo?.carierPaths || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-5 rounded-xl bg-card/50 border backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/30 hover:translate-y-[-2px]">
                    <div className="p-2.5 rounded-full bg-primary/10 mr-4">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Posts
                      </p>
                      <p className="font-medium text-foreground flex items-center">
                        <span className="text-lg font-semibold mr-1.5">
                          {userInfo?.post.length || 0}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          published
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-5 rounded-xl bg-card/50 border backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/30 hover:translate-y-[-2px]">
                    <div className="p-2.5 rounded-full bg-primary/10 mr-4">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Followings
                      </p>
                      <p className="font-medium text-foreground flex items-center">
                        <span className="text-lg font-semibold mr-1.5">
                          {loadFollwers ? (
                            numberOfFollowers
                          ) : (
                            <span className="text-sm flex items-center">
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading...
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Followings
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-5 rounded-xl bg-card/50 border backdrop-blur-sm transition-all hover:shadow-md hover:border-primary/30 hover:translate-y-[-2px]">
                    <div className="p-2.5 rounded-full bg-primary/10 mr-4">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Followers
                      </p>
                      <p className="font-medium text-foreground flex items-center">
                        <span className="text-lg font-semibold mr-1.5">
                          {loadFollwers ? (
                            numberOfFollowings
                          ) : (
                            <span className="text-sm flex items-center">
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading...
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Followers
                        </span>
                      </p>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-72 mt-20 flex flex-col items-center justify-center rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10 p-8 shadow-lg">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary opacity-20"></div>
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-5 relative" />
            </div>
            <p className="text-muted-foreground mt-4 font-medium">
              Loading user profile...
            </p>
          </div>
        )}

        <div className="w-full ">
          <div className="min-h-fit mt-5 py-5 md:px-10 rounded-lg  md:bg-card">
            <div className="relative py-6 mb-8 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text ">
                    {userInfo?.username || "User"}'s Portfolio
                  </h2>
                  <p className="text-muted-foreground">
                    Explore the latest topics shared by this creator
                  </p>
                </div>
                <div className="hidden sm:flex items-center px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping bg-green-500  absolute inline-flex h-full w-full rounded-full  opacity-75"></span>
                    <span className="relative bg-green-500 inline-flex rounded-full h-3 w-3 "></span>
                  </span>
                  {postsData?.length || 0} Published Topics
                </div>
              </div>
            </div>
            <div className="max-w-6xl mx-auto">
              {loader ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-card rounded-xl shadow-md overflow-hidden animate-pulse border border-border"
                    >
                      <div className="flex items-center p-4">
                        <div className="rounded-full bg-muted w-10 h-10 mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="h-5 bg-muted rounded w-4/5 mb-3"></div>
                        <div className="h-24 bg-muted rounded mb-3"></div>
                      </div>
                      <div className="h-[200px] bg-muted w-full"></div>
                      <div className="p-4">
                        <div className="flex gap-2">
                          <div className="h-6 bg-muted rounded w-16"></div>
                          <div className="h-6 bg-muted rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid  gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ">
                  {postsData?.map((post: any, index: number) => (
                    <div key={index} className="">
                      <IteratorUserProfile post={post} index={index} />
                    </div>
                  ))}
                </div>
              )}

              {!loading && userInfo?.post.length === 0 && (
                <div className="  flex flex-col items-center justify-center h-64 bg-card/50 rounded-xl border border-border p-8">
                  <svg
                    className="w-16 h-16 text-muted-foreground mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    ></path>
                  </svg>

                  <h3 className="text-lg font-medium text-foreground">
                    No posts found
                  </h3>

                  <p className="text-muted-foreground">
                    Be the first to share a post!
                  </p>
                  <Link href="/post-create">
                    <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      Create a post
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfileCompo;
