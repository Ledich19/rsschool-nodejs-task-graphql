import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import graphql from 'graphql';
const {
  // GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLSchema,
} = graphql;

const prisma = new PrismaClient();


const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    discount: { type: GraphQLInt },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(memberType),
      async resolve(parent, args, context) {
        return await prisma.memberType.findMany()
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
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});
export default schema;
