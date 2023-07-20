import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import schema from './gql.js';
//import gql from 'fastify-gql'
//import gql from 'fastify-gql'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query } = req.body;
      const result = await graphql({
        schema,
        source: query,
        contextValue: {prisma}
      });
      return result;
    },
  });
};

export default plugin;
