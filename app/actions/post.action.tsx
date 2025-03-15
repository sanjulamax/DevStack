"use server";
import { prisma } from "@/lib/db";
import { PostSchema } from "@/lib/post.schema";
import { ReplySchema } from "@/lib/reply.schema";
import * as z from "zod";

export const CreatePost = async (postData: z.infer<typeof PostSchema>) => {
  const validData = PostSchema.safeParse(postData);

  if (validData.error) {
    return { error: true };
  }

  try {
    const createdPost = await prisma.post.create({
      data: {
        title: validData.data.title,
        content: validData.data.content,
        category: validData.data.category,
        media: validData.data.media,
        authorEmail: validData.data.authorEmail,
        createdAt: validData.data.createdAt,
        updatedAt: validData.data.updatedAt,
      },
    });
    return { success: true, data: createdPost };
  } catch (error) {
    return { error: true };
  }
};

let arrowdata = [];

export const GetAllPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        upVotesUser: true,
        reply: true,
        downVotesUser: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    return { error: true };
  }
};

export const GetAllPostsForSpeacilUser = async (id: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        author: {
          id: id,
        },
      },
      include: {
        author: true,
        upVotesUser: true,
        reply: true,
        downVotesUser: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    return { error: true };
  }
};

export const GetPostById = async (id: any) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: { author: true, upVotesUser: true, downVotesUser: true },
    });

    return { success: true, data: post };
  } catch (error) {
    return { error: true };
  }
};

export const getPostByUserEmail = async (userEmail: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorEmail: userEmail,
      },
      include: {
        author: true,
        upVotesUser: true,
        reply: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { succes: true, data: posts };
  } catch (error) {
    return { error: true };
  }
};

export const getPostByUserId = async (userId: any) => {
  try {
    const posts = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        post: true,
      },
    });
    return { succes: true, data: posts };
  } catch (error) {
    return { error: true };
  }
};

export const AdddUparrow = async (id: any, email: any) => {
  const alreadyDone = await alreadyUpVoted(id, email);

  if (alreadyDone.error) {
    return { alreadyVoted: true };
  }

  try {
    const upArrowPost = await prisma.post.update({
      where: {
        id,
      },

      data: {
        upVotesUser: {
          connect: {
            email: email,
          },
        },
        upVotes: {
          increment: 1,
        },
      },
    });

    return { UPaRROW: true, data: upArrowPost };
  } catch (error) {
    return { error: true };
  }
};

export const AddDownArrow = async (id: any, email: any) => {
  const alreadyDone = await alreadyDownVoted(id, email);

  if (alreadyDone.error) {
    return { alreadyVoted: true };
  }
  try {
    const downArrowPost = await prisma.post.update({
      where: {
        id,
      },

      data: {
        downVotesUser: {
          connect: {
            email: email,
          },
        },
        downVotes: {
          increment: 1,
        },
      },
    });

    return { success: true, data: downArrowPost };
  } catch (error) {
    return { error: true };
  }
};

export const alreadyUpVoted = async (postId: any, email: any) => {
  try {
    const upvoted = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        upVotesUser: {
          where: {
            email: email,
          },
        },
      },
    });

    if (upvoted?.upVotesUser.length == 0) {
      return { success: true };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: true };
  }
};

export const alreadyDownVoted = async (postId: any, email: any) => {
  try {
    const downvoted = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        downVotesUser: {
          where: {
            email: email,
          },
        },
      },
    });

    if (downvoted?.downVotesUser.length == 0) {
      return { success: true };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: true };
  }
};

export const AddReplys = async (replyData: z.infer<typeof ReplySchema>) => {
  try {
    const reply = await prisma.reply.create({
      data: {
        content: replyData.content,
        authorEmail: replyData.authorEmail || "",
        psotId: replyData.psotId || "",
        createdAt: replyData.createdAt,
        updatedAt: replyData.updatedAt,
      },
    });

    return { success: true, data: reply };
  } catch (error) {
    return { error: true };
  }
};

export const getReplys = async (postId: any) => {
  try {
    const replyz = await prisma.reply.findMany({
      where: {
        psotId: postId,
      },
      include: {
        relavantPost: true,
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: replyz };
  } catch (error) {
    return { error: true };
  }
};

export const deleteReply = async (replyId: any) => {
  try {
    const deletedReply = await prisma.reply.delete({
      where: {
        id: replyId,
      },
    });

    return { success: true, data: deletedReply };
  } catch (error) {
    return { error: true };
  }
};

export const deletePost = async (postId: any) => {
  try {
    const deleteedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return { success: true, data: deleteedPost };
  } catch (error) {
    return { error: true };
  }
};

export const searchFunction = async (searchString: any) => {
  let contentPost: any = [];
  let userPost: any = [];
  let categoryPosts: any = [];
  try {
    const titlePost = await prisma.post.findMany({
      where: {
        title: {
          contains: searchString,
          mode: "insensitive",
        },
      },
      include: {
        author: true,
        upVotesUser: true,
        reply: true,
        downVotesUser: true,
      },
    });
    if (titlePost.length > 0) {
      console.log("founded from title");
      return {
        success: true,
        data: titlePost,
      };
    }
    if (titlePost.length == 0) {
      contentPost = await prisma.post.findMany({
        where: {
          content: {
            contains: searchString,
            mode: "insensitive",
          },
        },
        include: {
          author: true,
          upVotesUser: true,
          reply: true,
          downVotesUser: true,
        },
      });
      console.log("founded from content");
      return {
        success: true,
        data: contentPost,
      };
    } else if (contentPost.length == 0) {
      userPost = await prisma.post.findMany({
        include: {
          author: {
            where: {
              username: {
                contains: searchString,
                mode: "insensitive",
              },
            },
          },

          upVotesUser: true,
          reply: true,
          downVotesUser: true,
        },
      });
      console.log("founded from user");
      return {
        success: true,
        data: userPost,
      };
    } else if (userPost.length == 0) {
      categoryPosts = await prisma.post.findMany({
        where: {
          category: {
            contains: searchString,
            mode: "insensitive",
          },
        },
        include: {
          author: true,
          upVotesUser: true,
          reply: true,
          downVotesUser: true,
        },
      });
      console.log("founded from category");
      return {
        success: true,
        data: categoryPosts,
      };
    }
  } catch (error) {
    return { error: true };
  }
};

export const sortByCategory = async (category: any) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        category: category,
      },
      include: {
        author: true,
        upVotesUser: true,
        reply: true,
        downVotesUser: true,
      },
    });
    return { sucees: true, data: posts };
  } catch (error) {
    return { error: true };
  }
};

export const sortByUpVotes = async () => {
  try {
    const post = await prisma.post.findMany({
      orderBy: {
        upVotes: "desc",
      },

      include: {
        author: true,
        upVotesUser: true,
        reply: true,
        downVotesUser: true,
      },
    });

    return { success: true, data: post };
  } catch (error) {
    return { error: true };
  }
};

export const sortByPopularity = async () => {
  try {
    const post = await GetAllPosts();

    const sortedPosts = post?.data?.sort(
      (a, b) => b.upVotes - b.downVotes - (a.upVotes - a.downVotes)
    );

    return { success: true, data: sortedPosts };
  } catch (error) {
    return { error: true };
  }
};

export const sortByDownVotes = async () => {
  try {
    const post = await prisma.post.findMany({
      orderBy: {
        downVotes: "desc",
      },

      include: {
        author: true,
        upVotesUser: true,
        reply: true,
        downVotesUser: true,
      },
    });

    return { success: true, data: post };
  } catch (error) {
    return { error: true };
  }
};

export const createNotification = async (
  cId: any,
  pId: any,
  type: any,
  rId: any
) => {
  try {
    const notification = await prisma.notifications.create({
      data: {
        creatorId: cId,
        postId: pId,
        type: type,
        recieverId: rId,
        userId: cId,
      },
    });
    return { success: true, data: notification };
  } catch (error) {
    console.error("Notification creation error:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getNotifications = async (userEmail: any) => {
  try {
    const notifications = await prisma.notifications.findMany({
      where: {
        recieverId: userEmail,
      },
      include: {
        creator: true,
        post: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: notifications };
  } catch (error) {
    return { error: true };
  }
};
