import { PrismaClient } from '@prisma/client';
import graphql from 'graphql';

import { UUIDType } from './uuid.js';
import { profileType } from './profile.js';
import { postType } from './post.js';
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList,
  GraphQLInputObjectType,
} = graphql;

interface MyContext {
  prisma: PrismaClient;
}

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileType,
      async resolve(user: { id: string }, args,context: MyContext) {
        const profile = await context.prisma.profile.findUnique({
          where: { userId: user.id },
        });
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve(user: { id: string }, args,context: MyContext) {
        return await context.prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(userType),
      async resolve(user: { id: string }, args,context: MyContext) {
        const indexes = await context.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
        });

        return await context.prisma.user.findMany({
          where: {
            id: {
              in: indexes.map((user) => user.authorId),
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      async resolve(user: { id: string }, args,context: MyContext) {
        const indexes = await context.prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
        });

        return await context.prisma.user.findMany({
          where: {
            id: {
              in: indexes.map((user) => user.subscriberId),
            },
          },
        });
      },
    },
  }),
});

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: GraphQLFloat },
  }),
});
export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
