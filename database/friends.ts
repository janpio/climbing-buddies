import { prismadb } from '@/utils/prismadb';
import { Friend, FriendshipStatus } from '@prisma/client';

const prisma = prismadb;

export const createFriendship = async (
  userId: number,
  friendId: number,
): Promise<Friend | null> => {
  try {
    const friendship = await prisma.friend.create({
      data: {
        userId: userId,
        friendId: friendId,
        sentById: userId,
        receivedById: friendId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        user: true,
        friend: true,
        sentBy: true,
        receivedBy: true,
      },
    });

    return friendship;
  } catch (error) {
    return null;
  }
};

export const acceptFriendship = async (
  friendshipId: number,
): Promise<Friend | null> => {
  try {
    const updatedFriendship = await prisma.friend.update({
      where: { id: friendshipId },
      data: {
        status: FriendshipStatus.ACCEPTED,
        friendId: friendshipId, // provide the friendId to update the relationship
      },
      include: {
        user: true,
        friend: true,
        sentBy: true,
        receivedBy: true,
      },
    });

    return updatedFriendship;
  } catch (error) {
    return null;
  }
};

export const rejectFriendship = async (
  friendshipId: number,
): Promise<Friend | null> => {
  try {
    const updatedFriendship = await prisma.friend.update({
      where: { id: friendshipId },
      data: {
        status: FriendshipStatus.REJECTED,
        friendId: friendshipId, // provide the friendId to update the relationship
      },
      include: {
        user: true,
        friend: true,
        sentBy: true,
        receivedBy: true,
      },
    });

    return updatedFriendship;
  } catch (error) {
    return null;
  }
};

export const removeFriend = async (
  userId: number,
  friendId: number,
): Promise<void> => {
  try {
    await prisma.friend.deleteMany({
      where: {
        userId,
        friendId,
      },
    });
  } catch (error) {
    throw new Error('Failed to remove friend');
  }
};

export const getFriendList = async (userId: number) => {
  try {
    const friends = await prisma.friend.findMany({
      where: {
        userId,
        status: 'ACCEPTED', // Assuming only accepted friendships are considered in the friend list
      },
      include: {
        friend: true,
      },
    });

    // Extract the friend data from the list
    const friendList = friends.map((friendship) => friendship.friend);

    return friendList;
  } catch (error) {
    return null;
  }
};
