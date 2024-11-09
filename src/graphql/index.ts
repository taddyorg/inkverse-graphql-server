import { gql } from 'graphql-tag';
import type { Resolvers } from '../shared/graphql/types.js';

import { CommonDefinitions } from './common.js';
import { 
  ComicSeriesDefinitions, 
  ComicSeriesQueriesDefinitions, 
  ComicSeriesQueries, 
  ComicSeriesFieldResolvers 
} from './comicseries.js';

import { 
  ComicIssueDefinitions, 
  ComicIssueQueriesDefinitions, 
  ComicIssueQueries, 
  ComicIssueFieldResolvers 
} from './comicissue.js';

import { 
  ComicStoryDefinitions, 
  ComicStoryQueriesDefinitions, 
  ComicStoryQueries, 
  ComicStoryFieldResolvers 
} from './comicstory.js';

import { 
  CreatorDefinitions, 
  LinkDefinitions,
  CreatorLinkDefintions,
  CreatorQueriesDefinitions, 
  CreatorQueries, 
  CreatorFieldResolvers 
} from './creator.js';

import { 
  CreatorContentDefinitions, 
  CreatorContentQueriesDefinitions, 
  CreatorContentQueries, 
  CreatorContentFieldResolvers 
} from './creatorcontent.js';

import {
  DocsDefinitions,
  DocsQueriesDefinitions,
  DocsQueries,
} from './docs.js';

export const typeDefs = gql`#graphql
  ${CommonDefinitions}
  ${ComicSeriesDefinitions}
  ${ComicIssueDefinitions}
  ${ComicStoryDefinitions}
  ${CreatorDefinitions}
  ${LinkDefinitions}
  ${CreatorLinkDefintions}
  ${CreatorContentDefinitions}
  ${DocsDefinitions}

  type Query {
    ${ComicSeriesQueriesDefinitions}
    ${ComicIssueQueriesDefinitions}
    ${ComicStoryQueriesDefinitions}
    ${CreatorQueriesDefinitions}
    ${CreatorContentQueriesDefinitions}
    ${DocsQueriesDefinitions}
  }
`;

// Resolvers define the technique for fetching types
export const resolvers: Resolvers = {
  Query: {
    ...ComicSeriesQueries,
    ...ComicIssueQueries,
    ...ComicStoryQueries,
    ...CreatorQueries,
    ...CreatorContentQueries,
    ...DocsQueries,
  },
  ...ComicSeriesFieldResolvers,
  ...ComicIssueFieldResolvers,
  ...ComicStoryFieldResolvers,
  ...CreatorFieldResolvers,
  ...CreatorContentFieldResolvers,
};
