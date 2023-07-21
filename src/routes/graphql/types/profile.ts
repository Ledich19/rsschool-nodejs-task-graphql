import graphql from 'graphql';
import { UUIDType } from './uuid.js';
import { memberType } from './member.js';
const { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLBoolean } = graphql;
import { PrismaClient } from '@prisma/client';
import { userType } from './user.js';

const prisma = new PrismaClient();

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },

    memberType: {
      type: memberType,
      async resolve(profile: {memberTypeId: string}) {
        console.log('------------------', profile);

        return await prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});
