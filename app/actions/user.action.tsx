"use server";
import { prisma } from "@/lib/db";
import { UserSchema } from "@/lib/user.schema";
import { currentUser } from "@clerk/nextjs/server";
import * as z from "zod";

export const RegisterUser = async (data: z.infer<typeof UserSchema>) => {
  const validData = UserSchema.safeParse(data);
  const LoggedInUser = await currentUser();

  if (validData.success && LoggedInUser) {
    const alreadyExistUser = await findUserByEmail(
      LoggedInUser?.primaryEmailAddress?.emailAddress
    );
    console.log(alreadyExistUser);

    if (!alreadyExistUser.error) {
      const updatedUser = await UpdateUser(validData.data);
      return { update: true };
    }

    try {
      const regUser = await prisma.user.create({
        data: {
          email: LoggedInUser?.primaryEmailAddress?.emailAddress || "",
          username: validData.data.username || "",
          firstName: validData.data.firstName,
          lastName: validData.data.lastName,

          birthday: validData.data.birthday,
          bio: validData.data.bio,
          profilePicture: validData.data.profilePicture,
          carierPaths: validData.data.carierPaths || "",
          workingPlace: validData.data.workingPlace,
        },
      });
      return { success: true };
    } catch (error) {
      return { error: true };
    }
  } else {
    return { error: true };
  }
};

export const UpdateUser = async (data: z.infer<typeof UserSchema>) => {
  const LoggedInUser = await currentUser();
  const validData = UserSchema.safeParse(data);
  if (validData.success && LoggedInUser) {
    try {
      const existInfo = await getUserInfoFromDb(
        LoggedInUser?.primaryEmailAddress?.emailAddress
      );
      if (!existInfo) {
        return { error: true };
      }
      console.log(existInfo);
      const updatedUser = await prisma.user.update({
        where: {
          email: LoggedInUser?.primaryEmailAddress?.emailAddress || "",
        },
        data: {
          username:
            validData.data.username ||
            (existInfo && !("error" in existInfo) ? existInfo.username : ""),
          firstName:
            validData.data.firstName ||
            (existInfo && !("error" in existInfo) ? existInfo.firstName : ""),
          lastName:
            validData.data.lastName ||
            (existInfo && !("error" in existInfo) ? existInfo.lastName : ""),
          birthday:
            validData.data.birthday ||
            (existInfo && !("error" in existInfo) ? existInfo.birthday : ""),
          bio:
            validData.data.bio ||
            (existInfo && !("error" in existInfo) ? existInfo.bio : ""),
          profilePicture:
            validData.data.profilePicture ||
            (existInfo && !("error" in existInfo)
              ? existInfo.profilePicture
              : ""),
          carierPaths:
            validData.data.carierPaths ||
            (existInfo && !("error" in existInfo) ? existInfo.carierPaths : ""),
          workingPlace:
            validData.data.workingPlace ||
            (existInfo && !("error" in existInfo)
              ? existInfo.workingPlace
              : ""),
        },
      });

      return { success: true };
    } catch (error) {
      return { error: true };
    }
  } else {
    return { error: true };
  }
};

export const findUserByEmail = async (email: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return { success: true, user: user };
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: true };
  }
};

export const getUserInfoFromDb = async (email: any) => {
  try {
    const userDat = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return userDat;
  } catch (e) {
    return { error: true };
  }
};

export const getUserInfoFromDbWithEmail = async (email: any) => {
  try {
    const userDat = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return { sucess: true, data: userDat };
  } catch (e) {
    return { error: true };
  }
};

export const registerUserAuto = async (email: any, userInfo: any) => {
  try {
    console.log(userInfo);
    const alreadyExistUser = await getUserInfoFromDbWithEmail(email);
    console.log("Already Exist User Data");
    console.log(alreadyExistUser);
    if (!(alreadyExistUser.data == null)) {
      return { alredyUserSuccess: true };
    } else {
      try {
        const regUser = await prisma.user.create({
          data: {
            email: email,
            username: userInfo.firstName + "_" + userInfo.lastName || "",
            firstName: userInfo.firstName || "",
            lastName: userInfo.lastName || "",
            birthday: "",
            bio: "",
            profilePicture: userInfo.profilePicture || "",
            carierPaths: "",
            workingPlace: "",
          },
        });
        return { regSuccess: true, data: regUser };
      } catch (error) {
        return { regError: true };
      }
    }
  } catch (error) {
    return { alreadyUserError: true };
  }
};

export const addFollwers = async (
  followerEmai: any,
  followinfEmail: any,
  userId: any
) => {
  try {
    const follow = await prisma.follow.create({
      data: {
        followerEmail: followerEmai,
        followingEmail: followinfEmail,
        userId: userId,
      },
    });
    return { success: true, data: follow };
  } catch (error) {
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getFollwers = async (email: any, postEmail: any) => {
  // Guard clause for missing or invalid inputs
  if (!email || !postEmail) {
    return { notFollwed: true, error: "Missing email parameters" };
  }

  try {
    const follwed = await prisma.follow.findMany({
      where: {
        followerEmail: email,
        followingEmail: postEmail,
      },
    });

    // Return consistent structure: success/error flag + data
    if (follwed && follwed.length > 0) {
      return { succes: true, data: follwed };
    } else {
      return { notFollwed: true, data: [] };
    }
  } catch (error) {
    console.error("Error checking follow status:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const unFollowAction = async (email: any, postEmail: any) => {
  try {
    const unFollwed = await prisma.follow.deleteMany({
      where: {
        followerEmail: email,
        followingEmail: postEmail,
      },
    });
    return { success: true, data: unFollwed };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const removeFollwers = async (email: any, postEmail: any) => {
  try {
    const unFollwed = await prisma.follow.deleteMany({
      where: {
        followingEmail: email,
        followerEmail: postEmail,
      },
    });
    return { success: true, data: unFollwed };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getFollowersOfUser = async (email: any) => {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followerEmail: email,
      },
      select: {
        followingEmail: true,
      },
    });
    return { success: true, data: followers };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getFollowingsOfUser = async (email: any) => {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingEmail: email,
      },
      select: {
        followerEmail: true,
      },
    });
    return { success: true, data: followers };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return {
      error: true,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
// get users that followed by me
export const fetchFollwings = async (email: any) => {
  try {
    const followings = await prisma.follow.findMany({
      where: {
        followerEmail: email,
      },
      include: {
        following: true,
        follower: true,
      },
    });
    return { success: true, data: followings };
  } catch (e) {
    return { error: true };
  }
};

export const fetchFollwers = async (email: any) => {
  try {
    const followings = await prisma.follow.findMany({
      where: {
        followingEmail: email,
      },
      include: {
        following: true,
        follower: true,
      },
    });
    return { success: true, data: followings };
  } catch (e) {
    return { error: true };
  }
};

export const getFollwingUsersPosts = async (email: any) => {
  const followers = await getFollowersOfUser(email);
  console.log("followers data");
  console.log(followers);
  if (followers.error) {
    return {
      error: true,
      message: "Error fetching followers",
    };
  }

  if (followers.data) {
    if (followers.data.length > 0) {
      try {
        const posts = await prisma.post.findMany({
          where: {
            authorEmail: {
              in: followers?.data.map((f: any) => f.followingEmail),
            },
          },
          include: {
            author: true,
            upVotesUser: true,
            reply: true,
          },
        });
        return { success: true, data: posts };
      } catch (error) {
        return {
          error: true,
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    }
  }
};

export const createNotificationUser = async (
  cId: any,

  type: any,
  rId: any
) => {
  try {
    const notification = await prisma.notificationsuser.create({
      data: {
        creatorId: cId,

        type: type,
        recieverId: rId,
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

export const getNotificationUser = async (rId: any) => {
  try {
    const notification = await prisma.notificationsuser.findMany({
      where: {
        recieverId: rId,
      },
      include: {
        creator: true,
        reciever: true,
      },
      orderBy: {
        createdAt: "desc",
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
