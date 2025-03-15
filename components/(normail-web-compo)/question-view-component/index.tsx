"use client";
import { GetPostById } from "@/app/actions/post.action";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AddReplyCompo from "@/components/author/add-reply-compo";
import { useUser } from "@clerk/nextjs";
import { getFollwers } from "@/app/actions/user.action";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  User,
  Clock,
  Tag,
} from "lucide-react";

const QuestionViewCompo = ({ id }: { id: any }) => {
  const [post, setPost] = useState<any>(null);
  const { isLoaded, user } = useUser();
  const getPost = async () => {
    const postDta = await GetPostById(id);
    return { post: postDta.data };
  };

  useEffect(() => {
    getPost().then((postDetails) => setPost(postDetails.post));
  }, [id]);

  const getFollwedUsers = async () => {
    const follwed = await getFollwers(
      user?.primaryEmailAddress?.emailAddress,
      post?.authorEmail
    );
  };

  useEffect(() => {
    getFollwedUsers();
  }, [user, post, isLoaded]);

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {post ? (
          <div className="relative overflow-hidden">
            {/* Post Card */}
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-indigo-100 dark:border-indigo-900/50 transition-all duration-500 hover:shadow-2xl">
              {/* Author Header */}
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 h-32"></div>

                <div className="relative flex items-center px-6 sm:px-8 pt-12 pb-6">
                  <div className="relative h-20 w-20 mr-5 ring-4 ring-white dark:ring-gray-800 rounded-full overflow-hidden shadow-lg">
                    {post?.author?.profilePicture ? (
                      <Image
                        alt="profile picture"
                        src={post?.author?.profilePicture || "/placeholder.svg"}
                        fill
                        className="rounded-full object-cover"
                        sizes="(max-width: 768px) 80px, 100px"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                        {post?.author?.username?.charAt(0)?.toUpperCase() ||
                          "A"}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                  </div>

                  <div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                      @{post?.author?.username || "Anonymous"}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {formattedDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 sm:px-8 py-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                  {post?.title}
                </h1>

                {/* Post Stats */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {post.category && (
                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-3 py-1 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </Badge>
                  )}

                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-gray-800/80 flex items-center gap-1"
                  >
                    <ThumbsUp className="h-3 w-3 text-green-500" />
                    <span>{post.upVotes || 0} upvotes</span>
                  </Badge>

                  <Badge
                    variant="outline"
                    className="rounded-full px-3 py-1 border-indigo-200 dark:border-indigo-800 bg-white/80 dark:bg-gray-800/80 flex items-center gap-1"
                  >
                    <MessageSquare className="h-3 w-3 text-indigo-500" />
                    <span>{post.reply?.length || 0} replies</span>
                  </Badge>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {post?.content}
                  </p>
                </div>

                {/* Post Media */}
                {post.media && (
                  <div className="rounded-xl overflow-hidden shadow-lg dark:shadow-indigo-900/20 transition-transform hover:scale-[1.01] duration-300 mb-6">
                    <Image
                      alt="post media"
                      src={post?.media || "/placeholder.svg"}
                      width={1200}
                      height={600}
                      className="w-full object-cover aspect-video"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <AddReplyCompo postId={id} />
        </div>
      </div>
    </div>
  );
};

export default QuestionViewCompo;
