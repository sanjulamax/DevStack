"use client";
import {
  AddReplys,
  createNotification,
  deleteReply,
  GetPostById,
  getReplys,
} from "@/app/actions/post.action";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ReplySchema } from "@/lib/reply.schema";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownLeftFromSquare,
  ArrowUpRightFromSquare,
  Clock,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  UserRoundCheck,
  UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const AddReplyCompo = ({ postId }: { postId: any }) => {
  const [isPending, startTransition] = useTransition();
  const [userInfo, setUserInfo] = useState<any>(null);
  const form = useForm<z.infer<typeof ReplySchema>>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      content: "",
      authorEmail: "",
      psotId: postId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const { user, isLoaded } = useUser();
  const [replys, setReplys] = useState<any>([]);
  const router = useRouter();
  const [replyLoading, setReplyLoading] = useState(true);
  const [replyLoaded, setReplyLoaded] = useState(false);
  const [replyWriterTogle, setReplyWriterTogle] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const getUserEmail = async () => {
    const userDetails = await GetPostById(postId);
    if (userDetails.data) {
      setUserDetails(userDetails.data);
    }
  };

  useEffect(() => {
    getUserEmail();
  }, [postId]);

  useEffect(() => {
    if (isLoaded && user) {
      setUserInfo(user);
      form.setValue(
        "authorEmail",
        user.primaryEmailAddress?.emailAddress || ""
      );
      form.setValue("psotId", postId);
    }
  }, [isLoaded, user, postId, form]);

  const submitHandler = async (data: z.infer<typeof ReplySchema>) => {
    startTransition(async () => {
      const replyAdder = await AddReplys(data);
      console.log(replyAdder);
      form.reset();
      window.location.reload();

      const noti = await createNotification(
        userInfo.primaryEmailAddress.emailAddress,
        postId,
        "add_reply",
        userDetails.author.email
      );
      console.log(noti.data);
    });
  };

  useEffect(() => {
    const getAllReplys = async () => {
      const replyz = await getReplys(postId);
      if (replyz.data) {
        setReplyLoading(false);
      }

      return replyz.data;
    };

    getAllReplys().then((rep) => setReplys(rep));
    setReplyLoaded(true);
  }, []);

  useEffect(() => {}, [replyLoaded]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8">
      {/* Discussion Header */}
      <div className="w-full text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <MessageCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          Discussion ({replys.length})
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
      </div>

      <SignedIn>
        {/* Add Reply Section - Fixed at bottom */}
        <div className="fixed z-20 bottom-0 left-0 right-0 w-full md:left-1/2 md:-translate-x-1/2 md:w-[90%] lg:w-[800px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-indigo-200 dark:border-indigo-900/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] transition-all duration-300">
          <div className="flex items-center justify-between px-4 py-2 border-b border-indigo-100 dark:border-indigo-900/50">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full"
                    onClick={() => setReplyWriterTogle(!replyWriterTogle)}
                  >
                    {replyWriterTogle ? (
                      <ArrowUpRightFromSquare className="h-5 w-5" />
                    ) : (
                      <ArrowDownLeftFromSquare className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{replyWriterTogle ? "Expand" : "Collapse"} reply box</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Badge
              variant="outline"
              className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
            >
              Replying as @{userDetails?.author.username || "Anonymous"}
            </Badge>
          </div>

          <div
            className={`p-4 transition-all duration-300 ${
              replyWriterTogle ? "h-0 p-0 overflow-hidden" : "h-auto"
            }`}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(submitHandler)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={3}
                          placeholder="Share your thoughts on this post..."
                          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 resize-none transition-colors duration-200"
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Post Reply
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        {/* Sign In/Up Call to Action */}
        <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-xl shadow-lg">
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10 backdrop-blur-[1px]"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <Sparkles className="h-8 w-8 text-yellow-300" />
              <h3 className="text-2xl font-bold">Join the Conversation</h3>
              <p className="text-indigo-100 max-w-md">
                Sign in or create an account to share your thoughts, ask
                questions, and connect with other members of our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <SignInButton>
                  <Button className="bg-white text-indigo-700 hover:bg-indigo-50 rounded-full px-6 py-5 h-auto font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                    <UserRoundCheck className="h-5 w-5" />
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="bg-indigo-900/30 backdrop-blur-sm text-white hover:bg-indigo-900/40 border border-white/20 rounded-full px-6 py-5 h-auto font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
                    <UserRoundPlus className="h-5 w-5" />
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      {/* Replies Section */}
      {replyLoading ? (
        <div className="flex justify-center items-center p-8 w-full">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto pb-24">
          {replys.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No replies yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Be the first to share your thoughts on this post and start the
                conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {replys.map((reply: any) => {
                const isCurrentUser =
                  reply.authorEmail ===
                  userInfo?.primaryEmailAddress?.emailAddress;

                const replyDate = new Date(reply.createdAt).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <div
                    key={reply.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    } group`}
                  >
                    {!isCurrentUser && (
                      <div className="flex-shrink-0 mr-3">
                        {reply.author.profilePicture ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                            <Image
                              src={
                                reply.author.profilePicture ||
                                "/placeholder.svg"
                              }
                              alt="profile"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                            {reply.author?.firstName?.charAt(0).toUpperCase() ||
                              "A"}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-md px-5 py-4 rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-lg ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none mr-3"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-indigo-100 dark:border-indigo-900/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-medium text-sm ${
                              isCurrentUser
                                ? "text-indigo-100"
                                : "text-indigo-600 dark:text-indigo-400"
                            }`}
                          >
                            @{reply.author.username || "Anonymous"}
                          </span>
                        </div>

                        {isCurrentUser && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => {
                                    deleteReply(reply.id);
                                    window.location.reload();
                                  }}
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full ml-3 bg-red-500 hover:bg-red-700 text-white"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete your reply</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>

                      <div
                        className={`text-base leading-relaxed ${
                          isCurrentUser
                            ? "text-white/95"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {reply.content}
                      </div>

                      <div
                        className={`mt-3 flex items-center text-xs ${
                          isCurrentUser
                            ? "text-indigo-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {replyDate}
                      </div>
                    </div>

                    {isCurrentUser && (
                      <div className="flex-shrink-0 ml-3">
                        {userInfo?.imageUrl ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                            <Image
                              src={userInfo.imageUrl || "/placeholder.svg"}
                              alt="profile"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900">
                            {userInfo?.firstName?.charAt(0).toUpperCase() ||
                              "Y"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddReplyCompo;
