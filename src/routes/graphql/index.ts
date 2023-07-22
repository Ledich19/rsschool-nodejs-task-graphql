import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
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
    async handler(req, reply) {
      const { query, variables } = req.body;
      // console.log('query;;;;;;;;;;;;;;;;;;;;', query);
      // console.log('variables;;;;;;;;;;;;;;;;;;;;', variables);
      const parsedData = parse(query);
      //console.log('-----------------------', parsedData);
      const errors = validate(schema, parsedData, [depthLimit(5)]);
      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => error.message);
        console.log('------------------', errors);
        
        await reply.send({
          errors: formattedErrors.map((error) => ({message: error})),
        });
        return;
      }

      const result = await graphql({
        schema,
        source: query,
        contextValue: { prisma },
        variableValues: variables,
      });
      return result;
    },
  });
};

export default plugin;
