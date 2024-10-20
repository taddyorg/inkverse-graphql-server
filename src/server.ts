import express from 'express';
import cors from 'cors';
import http from 'http';
import type { ValidationRule } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { depthLimit } from './graphql/validators/depth-limit.js';
import { requiredFields } from './graphql/validators/required-fields.js';
import { createComplexityLimitRule } from './graphql/validators/complexity-cost/index.js';
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import type { GraphQLContext } from './graphql/utils.js';

import { typeDefs, resolvers } from './graphql/index.js';
import { errorMessageToJsonError, graphqlFormatError } from './graphql/error.js';

// const { setupFirebase } = require("./shared/firebase/setup");
// const { setUpLogger } = require('./shared/utils/errors');
// const { User } = require('./shared/models');
import { verifyToken } from "./shared/utils/authentication.js";

const PORT = 3010;
const QUERY_MAX_DEPTH = 4;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,POST,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 3600,
};

async function startServer() {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageDisabled(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    introspection: true,
    csrfPrevention: false,
    persistedQueries: false,
    validationRules: [
      depthLimit(QUERY_MAX_DEPTH) as ValidationRule,
      createComplexityLimitRule(4000, {
        scalarCost: 1,
        objectCost: 18, 
        listFactor: 12,
        introspectionListFactor: 1,
      } as any) as ValidationRule,
      requiredFields() as ValidationRule,
    ],
    formatError: graphqlFormatError as any,
  });

  await server.start();

  const graphqlPath = '/api/graphql';

  app.use(
    graphqlPath,
    cors(corsOptions),
    express.urlencoded({ extended: false }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const context: GraphQLContext = {
          
        };
        // const decodeToken = verifyToken({ req, res });

        // // if token, return user
        // if (decodeToken) {
        //   const userId = decodeToken.sub;
        //   const user = await User.getLogInInfoForUserId(userId)
        //   return { user }
        // }

        // // if no token, return empty object
        // else {
          return context;
        // }
      },
    }),
  );

  // setupFirebase();
  // setUpLogger();
  // setUpClient();

  app.get('/api', (req, res) => {
    res.send('😁')
  });

  app.get('/api/healthcheck', (req, res) => {
    res.send('😁')
  });

  app.use((error: any, req: any, res: any, next: any) => {
    return errorMessageToJsonError(res, error)
  });


  httpServer.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${graphqlPath}`);
  });

  return { server, app };
}

startServer()
