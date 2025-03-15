"use client";
import React, { startTransition, use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AddDownArrow,
  AdddUparrow,
  alreadyUpVoted,
  alreadyDownVoted,
  deletePost,
} from "@/app/actions/post.action";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { set } from "zod";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
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

const IteratorUserProfile = ({ post, index }: { post: any; index: any }) => {
  const [votedDown, setVotedDown] = useState(false);
  const [votedUp, setVotedUp] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [alreadyUpVotedstat, setAlreadyUpVotedstat] = useState(false);
  const [alreadyDownVotedstat, setAlreadyDownVotedstat] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  const { isLoaded, user } = useUser();
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = useState(true);

  const alreadyVotedOne = async () => {
    // ...existing code...
    const votedOne = post.upVotesUser.find(
      (item: any) =>
        item.email === currentUser?.primaryEmailAddress?.emailAddress
    );
    console.log("vt one");
    console.log(votedOne);
    const votedTwo = post.downVotesUser.find(
      (item: any) =>
        item.email === currentUser?.primaryEmailAddress?.emailAddress
    );
    console.log("vt two");
    console.log(votedTwo);
    if (votedOne) {
      setAlreadyUpVotedstat(true);
      setShowSensitive(true);
    } else {
      setAlreadyUpVotedstat(false);
      setShowSensitive(true);
    }
    if (votedTwo) {
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
  }, [isLoaded, user, currentUser]);

  return (
    <div>
      <div
        key={index}
        className="group relative rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 transform transition duration-500 hover:scale-105"
      >
        <div>
          {/* Post Header */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            {post.author?.profilePicture ? (
              <div className="relative w-10 h-10 mr-3 flex-shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-indigo-500 rounded-full">
                <Image
                  fill
                  className="rounded-full object-cover"
                  src={post.author?.profilePicture || "/placeholder.png"}
                  alt={post.author?.username || "profile"}
                />
              </div>
            ) : (
              <div className="bg-indigo-500 border-2 border-indigo-300 relative w-10 h-10 mr-3 flex-shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {post.author?.firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col justify-center">
              <div className="flex items-center justify-between w-[250px]">
                <Link href={`/other-user/${post.author?.id}`}>
                  <p className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    @{post.author?.username || "Anonymous"}
                  </p>
                </Link>
                {showSensitive ? (
                  <div>
                    {post.authorEmail ===
                      currentUser?.primaryEmailAddress?.emailAddress && (
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete Post"
                        disabled={isPending}
                        onClick={async () => {
                          console.log(post.id);
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <Image
                      alt="loading"
                      width={50}
                      height={50}
                      src="/redloader2.gif"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post?.createdAt || "").toLocaleString()}
              </p>
            </div>
          </div>

          <Link href={`/question-view/${post.id}`} key={index}>
            {/* Post Content */}
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h2>
              <div className="relative h-24 mb-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="text-gray-700 dark:text-gray-300 text-sm p-2 overflow-hidden absolute inset-0">
                  {post.content}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-gray-50 dark:from-gray-800 to-transparent"></div>
              </div>
              <Link
                href={`/question-view/${post.id}`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium inline-flex items-center"
              >
                See more
                <svg
                  className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </div>

            {/* Post Media */}
            {post.media ? (
              <div className="relative h-48 w-full overflow-hidden rounded-b-xl">
                <Image
                  src={post.media}
                  alt="Post media"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="relative h-48 w-full overflow-hidden rounded-b-xl">
                <Image
                  src="/def.gif"
                  alt="Post media"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            )}
          </Link>
        </div>

        {/* Post Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <SignedIn>
              <div>
                {/* Vote Buttons */}
                {showSensitive ? (
                  <div className="flex items-center gap-4">
                    <button
                      className={`flex items-center gap-2 transition-colors ${
                        alreadyUpVotedstat || votedUp
                          ? "text-green-500"
                          : "text-gray-600 dark:text-gray-300 hover:text-green-500"
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
                        });
                      }}
                      disabled={votedUp || isPending}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 14l5-5 5 5" />
                        <path d="M7 10l5-5 5 5" />
                      </svg>
                      <span className="text-sm font-medium">
                        {votedUp ? post.upVotes + 1 : post.upVotes || 0}
                      </span>
                    </button>
                    <button
                      className={`flex items-center gap-2 transition-colors ${
                        alreadyDownVotedstat || votedDown
                          ? "text-red-500"
                          : "text-gray-600 dark:text-gray-300 hover:text-red-500"
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
                        });
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 4l5 5 5-5" />
                        <path d="M7 10l5 5 5-5" />
                      </svg>
                      <span className="text-sm font-medium">
                        {votedDown ? post.downVotes + 1 : post.downVotes || 0}
                      </span>
                    </button>
                    <Link href={`/question-view/${post.id}`} key={index}>
                      <button
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                        aria-label="Comments"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {post.reply.length || 0}
                        </span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Image
                      alt="loading"
                      width={30}
                      height={30}
                      src="/loader2.gif"
                    />
                  </div>
                )}
              </div>
            </SignedIn>
            <SignedOut>
              <div>
                {/* Vote Buttons */}
                {showSensitive ? (
                  <div className="flex items-center gap-4">
                    <button
                      className={`flex items-center gap-2 transition-colors ${
                        alreadyUpVotedstat || votedUp
                          ? "text-green-500"
                          : "text-gray-600 dark:text-gray-300 hover:text-green-500"
                      }`}
                      aria-label="Upvote"
                      onClick={() => toast("Please Sign In to Vote")}
                      disabled={votedUp || isPending}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 14l5-5 5 5" />
                        <path d="M7 10l5-5 5 5" />
                      </svg>
                      <span className="text-sm font-medium">
                        {votedUp ? post.upVotes + 1 : post.upVotes || 0}
                      </span>
                    </button>
                    <button
                      className={`flex items-center gap-2 transition-colors ${
                        alreadyDownVotedstat || votedDown
                          ? "text-red-500"
                          : "text-gray-600 dark:text-gray-300 hover:text-red-500"
                      }`}
                      aria-label="Downvote"
                      disabled={votedDown || isPending}
                      onClick={() => toast("Please Sign In to Vote")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 4l5 5 5-5" />
                        <path d="M7 10l5 5 5-5" />
                      </svg>
                      <span className="text-sm font-medium">
                        {votedDown ? post.downVotes + 1 : post.downVotes || 0}
                      </span>
                    </button>
                    <Link href={`/question-view/${post.id}`} key={index}>
                      <button
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                        aria-label="Comments"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                        </svg>
                        <span className="text-sm font-medium">
                          {post.reply.length || 0}
                        </span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Image
                      alt="loading"
                      width={30}
                      height={30}
                      src="/loader2.gif"
                    />
                  </div>
                )}
              </div>
            </SignedOut>

            {/* Tags */}
            <div className="mt-3 sm:mt-0 flex flex-wrap gap-2">
              {post.category && (
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium">
                  {post.category}
                </span>
              )}
              {post.username && (
                <span className="px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                  {post.username}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IteratorUserProfile;
