import { PrismaClient } from '@prisma/client';
import graphql from 'graphql';

import { UUIDType } from './uuid.js';
import { profileType } from './profile.js';
import { postType } from './post.js';
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat, GraphQLList } =
  graphql;
const prisma = new PrismaClient();

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      async resolve(user: { id: string }) {
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
        });
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve(user: { id: string }) {
        return await prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },

    userSubscribedTo: {type: new GraphQLList(userType),
    async resolve(user: { id: string }) {
      const indexes = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: user.id },
      });

      return await prisma.user.findMany({
        where: {
          id: {
            in: indexes.map((user) => user.authorId),
          },
        },
      });
    }
    },
    subscribedToUser: {type: new GraphQLList(userType),
    async resolve(user: { id: string }) {
      const indexes =  await prisma.subscribersOnAuthors.findMany({
        where: { authorId: user.id },
      });

      return await prisma.user.findMany({
        where: {
          id: {
            in: indexes.map((user) => user.subscriberId), 
          },
        },
      });
    }
    },
  }),
});
