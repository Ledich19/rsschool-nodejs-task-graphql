import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import schema from './gql.js';

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
      const { query, variables } = req.body;
      // console.log('query;;;;;;;;;;;;;;;;;;;;', query);
      // console.log('variables;;;;;;;;;;;;;;;;;;;;', variables);
      
      const result = await graphql({
        schema,
        source: query,
        contextValue: {prisma},
        variableValues: variables
      });
      return result;
    },
  });
};

export default plugin;
