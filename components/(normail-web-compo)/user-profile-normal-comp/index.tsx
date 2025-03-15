"use client";
import { getPostByUserEmail } from "@/app/actions/post.action";
import { useUser } from "@clerk/nextjs";
import React, { startTransition, useEffect, useState } from "react";

const UserProfileNormalComp = () => {
  const { isLoaded, user } = useUser();
  const [posts, setPosts] = useState<any>();
  const [postLoaded, showPostLoaded] = useState(false);

  const getPost = () => {
    startTransition(async () => {
      const posts = await getPostByUserEmail(
        user?.primaryEmailAddress?.emailAddress
      );
      setPosts(posts.data);
    });
  };

  useEffect(() => {
    getPost();
    if (posts?.length > 0) {
      showPostLoaded(true);
    }
  }, [isLoaded, user]);

  return <div></div>;
};

export default UserProfileNormalComp;
