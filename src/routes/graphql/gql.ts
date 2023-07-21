import { Post, PrismaClient, Profile, User } from '@prisma/client';
import graphql from 'graphql';
import { UUIDType } from './types/uuid.js';
import { memberType, memberTypeIdEnum } from './types/member.js';
import { CreatePostInput,  postType } from './types/post.js';
import { CreateUserInput,  userType } from './types/user.js';
import { CreateProfileInput, profileType } from './types/profile.js';
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInputObjectType,
} = graphql;

const prisma = new PrismaClient();

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(memberType),
      async resolve(parent, args, context) {
        return await prisma.memberType.findMany();
      },
    },
    posts: {
      type: new GraphQLList(postType),
      async resolve(parent, args, context) {
        return await prisma.post.findMany();
      },
    },
    users: {
      type: new GraphQLList(userType),
      async resolve(parent, args, context) {
        return await prisma.user.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
      async resolve(parent, args, context) {
        return await prisma.profile.findMany();
      },
    },

    memberType: {
      type: memberType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeIdEnum) },
      },
      async resolve(parent, args: { id: string }, context) {
        const memberType = await prisma.memberType.findUnique({
          where: { id: args.id },
        });
        return memberType;
      },
    },
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args: { id: string }, context) {
        const post = await prisma.post.findUnique({
          where: { id: args.id },
        });
        return post;
      },
    },
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args: { id: string }) {
        console.log('ID:', args.id);

        const user = await prisma.user.findUnique({
          where: { id: args.id },
        });
        return user;
      },
    },
    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(parent, args: { id: string }, context) {
        const profile = await prisma.profile.findUnique({
          where: { id: args.id },
        });
        return profile;
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createPost: {
      type: postType,
      args: { dto: { type: CreatePostInput } },
      async resolve(parent, args: { dto: Post }, context) {
        return prisma.post.create({
          data: args.dto,
        });
      },
    },
    createUser: {
      type: userType,
      args: { dto: { type: CreateUserInput} },
      async resolve(parent, args: { dto: User }, context) {
        return prisma.user.create({
          data: args.dto,
        });
      },
    },
    createProfile: {
      type: profileType,
      args: { dto: { type: CreateProfileInput} },
      async resolve(parent, args: { dto: Profile }, context) {
        return prisma.profile.create({
          data: args.dto,
        });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  types: [userType, memberType, postType, profileType],
});
export default schema;
