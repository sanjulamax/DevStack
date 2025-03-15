"use client";
import { getNotifications } from "@/app/actions/post.action";
import { getNotificationUser } from "@/app/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const NotificationComp = () => {
  const { isLoaded, user } = useUser();
  const [notificationData, setNotificationData] = React.useState<any | null>(
    null
  );

  const getUserNotifications = async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const notifications: any = await getNotifications(
        user?.primaryEmailAddress?.emailAddress
      );
      const flwNotifications: any = await getNotificationUser(
        user?.primaryEmailAddress?.emailAddress
      );
      if (notifications?.data?.length > 0) {
        setNotificationData(notifications.data);
      } else {
        setNotificationData([]);
      }
      if (flwNotifications?.data?.length > 0) {
        setNotificationData((prev: any) => {
          const updatedNotifications = [...prev, ...flwNotifications.data];
          return updatedNotifications.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      }
    }
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getUserNotifications();
    }
  }, [isLoaded, user]);

  return (
    <div>
      <SignedIn>
        <div className="w-full rounded-lg overflow-hidden border border-border shadow-sm dark:bg-gray-800">
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <h2 className="text-xl font-semibold text-card-foreground">
              Notifications
            </h2>
            {notificationData?.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                {notificationData.length}
              </span>
            )}
          </div>

          {notificationData ? (
            notificationData.length > 0 ? (
              <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
                {notificationData.map((notificationItem: any, index: any) => {
                  const isFromSelf =
                    notificationItem?.creator?.email ===
                    user?.primaryEmailAddress?.emailAddress;

                  return (
                    <div
                      key={index}
                      className="p-4 bg-card dark:hover:bg-accent/10 hover:bg-black/10  transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${
                            notificationItem.type === "comment"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-primary/20 text-primary"
                          }`}
                        >
                          {notificationItem.type === "comment" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                          )}
                        </div>
                        <div className="rounded-full overflow-hidden flex-shrink-0">
                          {notificationItem.creator.profilePicture ? (
                            <Image
                              alt="profile image"
                              height={50}
                              width={50}
                              src={
                                notificationItem?.creator?.profilePicture || ""
                              }
                            />
                          ) : (
                            <div className="h-12 w-12 bg-fuchsia-600 flex items-center justify-center text-primary">
                              <span>
                                {notificationItem?.creator?.username
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <p className="text-sm text-card-foreground">
                            <span className="font-medium">
                              New {notificationItem.type}
                            </span>{" "}
                            from{" "}
                            {isFromSelf ? (
                              <span className="font-semibold">yourself</span>
                            ) : (
                              <span className="font-semibold">
                                {notificationItem?.creator?.username}
                              </span>
                            )}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {notificationItem?.message}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            {notificationItem.type === "New_Follower" ? (
                              notificationItem?.creator.id ? (
                                <Link
                                  href={`/other-user/${notificationItem?.creator?.id}`}
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium group"
                                >
                                  View Follower's Profile
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="group-hover:translate-x-0.5 transition-transform"
                                  >
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                  </svg>
                                </Link>
                              ) : (
                                <div>Loading...</div>
                              )
                            ) : (
                              <Link
                                href={`/question-view/${notificationItem?.post?.id}`}
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium group"
                              >
                                View Topic
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="group-hover:translate-x-0.5 transition-transform"
                                >
                                  <path d="M5 12h14"></path>
                                  <path d="m12 5 7 7-7 7"></path>
                                </svg>
                              </Link>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                notificationItem?.updatedAt
                              ).toLocaleString() || "Just now"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
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
                    className="text-primary"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    <path d="M22 2 2 22"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-card-foreground">
                  No notifications
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up! We'll notify you when something new
                  arrives.
                </p>
              </div>
            )
          ) : (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="animate-pulse flex flex-col items-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-muted"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </div>
            </div>
          )}
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
              Sign in to view your notifications and stay updated with your
              latest activities.
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

export default NotificationComp;
