import graphql from 'graphql';
import { UUIDType } from './uuid.js';
const { GraphQLObjectType, GraphQLInt, GraphQLNonNull, GraphQLBoolean } = graphql;

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});
