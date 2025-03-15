"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AddDownArrow,
  AdddUparrow,
  deletePost,
  createNotification,
} from "@/app/actions/post.action";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  MessageSquare,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  addFollwers,
  createNotificationUser,
  getFollwers,
  unFollowAction,
} from "@/app/actions/user.action";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  author?: {
    profilePicture?: string;
    username?: string;
    firstName: string;
    id: string;
  };
  createdAt?: string;
  title: string;
  content: string;
  media?: string;
  upVotes: number;
  downVotes: number;
  commentsCount: number;
  category?: string;
  username?: string;
  authorEmail?: string;
  reply: any;
  upVotesUser: any;
  downVotesUser: any;
}

const Iterator = ({
  post,
  index,
  loading,
}: {
  post: Post;
  index: any;
  loading: any;
}) => {
  const [votedDown, setVotedDown] = useState(false);
  const [votedUp, setVotedUp] = useState(false);
  const [revVotedUp, setRevVotedUp] = useState(false);
  const [revVotedDown, setRevVotedDown] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [alreadyUpVotedstat, setAlreadyUpVotedstat] = useState(false);
  const [alreadyDownVotedstat, setAlreadyDownVotedstat] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  const { isLoaded, user } = useUser();
  const [isPending, startTransition] = React.useTransition();
  const [alreadyFollowed, setAlreadyFollowed] = useState(false);
  const [followButtonLoading, setFollowButtonLoading] = useState(true);
  const [recheckFollow, setReCheckFollow] = useState(false);

  const alreadyVotedOne = async () => {
    const votedOne = post?.upVotesUser?.find(
      (item: any) =>
        item.email === currentUser?.primaryEmailAddress?.emailAddress
    );

    const votedTwo = post?.downVotesUser?.find(
      (item: any) =>
        item.email === currentUser?.primaryEmailAddress?.emailAddress
    );

    if (!(votedOne == undefined)) {
      setAlreadyUpVotedstat(true);
      setShowSensitive(true); //this removed becouse of follow button loading after this loaded . if follow button removed make those lines available
    } else {
      setAlreadyUpVotedstat(false);
      setShowSensitive(true);
    }
    if (!(votedTwo == undefined)) {
      setAlreadyDownVotedstat(true);
      setShowSensitive(true);
    } else {
      setAlreadyDownVotedstat(false);
      setShowSensitive(true);
    }
  };

  useEffect(() => {
    setCurrentUser(user);
    alreadyVotedOne();
  }, [isLoaded, user]);

  const followFunction = async () => {
    try {
      setFollowButtonLoading(true);
      await addFollwers(
        currentUser.primaryEmailAddress.emailAddress,
        post.authorEmail,
        post.author?.id
      );
      const noti = await createNotificationUser(
        currentUser.primaryEmailAddress.emailAddress,
        "New_Follower",
        post.authorEmail
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

  const checkFollowStatus = async () => {
    if (!currentUser?.primaryEmailAddress?.emailAddress || !post?.authorEmail) {
      return;
    }

    try {
      setFollowButtonLoading(true);
      const followData = await getFollwers(
        currentUser.primaryEmailAddress.emailAddress,
        post.authorEmail
      );

      if (followData.succes) {
        setAlreadyFollowed(true);
      } else {
        setAlreadyFollowed(false);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setFollowButtonLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && post?.authorEmail) {
      checkFollowStatus();
    }
  }, [currentUser, post?.authorEmail, recheckFollow]);

  const unFollowFuc = async () => {
    setFollowButtonLoading(true);
    const unFollow = await unFollowAction(
      currentUser.primaryEmailAddress.emailAddress,
      post.authorEmail
    );
    if (unFollow.success) {
      window.location.reload();
    }
    setFollowButtonLoading(false);
  };

  const formattedDate = new Date(post?.createdAt || "").toLocaleString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }
  );

  return (
    <div
      className="group relative rounded-xl shadow-lg overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 transition-all duration-500 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover effect overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`}
      ></div>

      {/* Post Header */}
      <div className="flex items-center p-4 border-b border-indigo-100 dark:border-indigo-900/50">
        <Link href={`/other-user/${post.author?.id}`} className="relative">
          {post.author?.profilePicture ? (
            <div className="relative w-12 h-12 mr-3 flex-shrink-0 ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 rounded-full overflow-hidden transition-transform group-hover:scale-105">
              <Image
                fill
                className="rounded-full object-cover"
                src={post.author?.profilePicture || "/placeholder.png"}
                alt={post.author?.username || "profile"}
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 relative w-12 h-12 mr-3 flex-shrink-0 ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105">
              {post.author?.firstName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
        </Link>

        <div className="flex flex-col justify-center flex-1 min-w-0">
          <div className="flex items-center justify-between w-full">
            <Link
              href={`/other-user/${post.author?.id}`}
              className="group/username"
            >
              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate group-hover/username:text-indigo-600 dark:group-hover/username:text-indigo-400 transition-colors">
                @{post.author?.username || "Anonymous"}
              </p>
            </Link>

            {showSensitive ? (
              <div>
                {post.authorEmail ===
                currentUser?.primaryEmailAddress?.emailAddress ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete Post"
                          disabled={isPending}
                          onClick={async () => {
                            startTransition(async () => {
                              const deleteRespons = await deletePost(post.id);
                              if (deleteRespons.error) {
                                toast("Error Deleting Post");
                              } else {
                                toast("Post Deleted");
                              }
                              window.location.reload();
                            });
                          }}
                          className="h-8 w-8 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete this post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : followButtonLoading ? (
                  <SignedIn>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="h-8 rounded-full"
                    >
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading
                    </Button>
                  </SignedIn>
                ) : alreadyFollowed ? (
                  <SignedIn>
                    <Button
                      onClick={unFollowFuc}
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                    >
                      Unfollow
                    </Button>
                  </SignedIn>
                ) : (
                  <SignedIn>
                    <Button
                      onClick={followFunction}
                      disabled={followButtonLoading}
                      size="sm"
                      className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Follow
                    </Button>
                  </SignedIn>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center w-8 h-8">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
      </div>

      <Link href={`/question-view/${post.id}`} className="block">
        {/* Post Content */}
        <div className="p-4 flex-grow relative z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {post.title}
          </h2>
          <div className="relative h-24 mb-3 rounded-lg overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div className="text-gray-700 dark:text-gray-300 text-sm p-3 overflow-hidden absolute inset-0">
              {post.content}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-indigo-50 dark:from-gray-900 to-transparent"></div>
          </div>
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
            Read more
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Post Media */}
        {post.media ? (
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={post.media || "/placeholder.svg"}
              alt="Post media"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ) : (
          <div className="relative h-56 w-full overflow-hidden bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
            <Image
              src="/def.gif"
              alt="Default media"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        )}
      </Link>

      {/* Post Footer */}
      <div className="px-4 py-3 border-t border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/10 dark:to-purple-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SignedIn>
            <div>
              {/* Vote Buttons */}
              {showSensitive ? (
                <div className="flex items-center gap-4">
                  <button
                    className={`flex items-center gap-2 transition-all rounded-full px-3 py-1.5 ${
                      alreadyUpVotedstat || votedUp
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600"
                    }`}
                    aria-label="Upvote"
                    onClick={async () => {
                      if (alreadyUpVotedstat) return;
                      setVotedUp(true);
                      startTransition(async () => {
                        await AdddUparrow(
                          post.id,
                          currentUser.primaryEmailAddress.emailAddress
                        );

                        const noti = await createNotification(
                          currentUser.primaryEmailAddress.emailAddress,
                          post.id,
                          "up_vote",
                          post.authorEmail
                        );
                      });
                    }}
                    disabled={votedUp || isPending}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 ${
                        alreadyUpVotedstat || votedUp ? "fill-green-500" : ""
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {votedUp ? post.upVotes + 1 : post.upVotes || 0}
                    </span>
                  </button>
                  <button
                    className={`flex items-center gap-2 transition-all rounded-full px-3 py-1.5 ${
                      alreadyDownVotedstat || votedDown
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                    }`}
                    aria-label="Downvote"
                    disabled={votedDown || isPending}
                    onClick={() => {
                      if (alreadyDownVotedstat) return;
                      setVotedDown(true);
                      startTransition(async () => {
                        await AddDownArrow(
                          post.id,
                          currentUser.primaryEmailAddress.emailAddress
                        );

                        const noti = await createNotification(
                          currentUser.primaryEmailAddress.emailAddress,
                          post.id,
                          "down_vote",
                          post.authorEmail
                        );
                      });
                    }}
                  >
                    <ThumbsDown
                      className={`w-4 h-4 ${
                        alreadyDownVotedstat || votedDown ? "fill-red-500" : ""
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {votedDown ? post.downVotes + 1 : post.downVotes || 0}
                    </span>
                  </button>
                  <Link href={`/question-view/${post.id}`}>
                    <button
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      aria-label="Comments"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {post?.reply?.length || 0}
                      </span>
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-center h-10">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </SignedIn>
          <SignedOut>
            <div>
              {/* Vote Buttons for Signed Out Users */}
              {showSensitive ? (
                <div className="flex items-center gap-4">
                  <button
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors rounded-full px-3 py-1.5 hover:bg-green-50 dark:hover:bg-green-900/20"
                    aria-label="Upvote"
                    onClick={() => toast("Please Sign In to Vote")}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {post.upVotes || 0}
                    </span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors rounded-full px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                    aria-label="Downvote"
                    onClick={() => toast("Please Sign In to Vote")}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {post.downVotes || 0}
                    </span>
                  </button>
                  <Link href={`/question-view/${post.id}`}>
                    <button
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full px-3 py-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      aria-label="Comments"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {post?.reply?.length || 0}
                      </span>
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-center h-10">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </SignedOut>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 overflow-hidden">
            {post.category && (
              <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-3 py-1 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {post.category}
              </Badge>
            )}

            {post.username && (
              <Badge
                variant="outline"
                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 border-gray-200 dark:border-gray-700"
              >
                {post.username}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iterator;
