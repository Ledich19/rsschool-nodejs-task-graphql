import graphql from 'graphql';
import { UUIDType } from './uuid.js';
import { memberType, memberTypeIdEnum } from './member.js';
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInputObjectType,
} = graphql;
import { MemberType, PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';

export type DtoProfileType = {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
};
interface MyContext {
  prisma: PrismaClient;
}

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },

    memberType: {
      type: memberType,
      async resolve(profile: { memberTypeId: string }, args,context: MyContext) {
        return await context.prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    memberTypeId: {type: memberTypeIdEnum},
    userId: {type: UUIDType},
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: {type: GraphQLBoolean},
    yearOfBirth: {type: GraphQLInt},
    memberTypeId: {type: memberTypeIdEnum},
  }),
});
