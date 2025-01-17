import type { GraphQLContext } from './utils.js';
import { SEARCH_FOR_TERM_QUERY, taddyGraphqlRequest } from '../shared/taddy/index.js';
import { ComicSeries } from '../shared/models/index.js';

import type { 
  QueryResolvers,
  QuerySearchForTermArgs,
} from '../shared/graphql/types.js';
import { arrayToObject } from '@/public/utils.js';

const SearchDefinitions = `
" A search result "
type SearchResults {
  " Identifier for the search query being sent "
  searchId: ID!
  
  " A list of ComicSeries items "
  comicSeries: [ComicSeries]
  
  " A list of Creator items "
  creators: [Creator]
}
`

const SearchQueriesDefinitions = `
" Search for a term "
searchForTerm(
  term: String
  page: Int
  limitPerPage: Int
  filterForTypes: [String]
): SearchResults
`

const SearchQueries: QueryResolvers = {
  async searchForTerm(root: any, args: QuerySearchForTermArgs, context: GraphQLContext) {
    const { term = '', page = 1, limitPerPage = 25, filterForTypes = ["COMICSERIES"] } = args;

    const variables = { term, page, limitPerPage, filterForTypes };
    const query = SEARCH_FOR_TERM_QUERY;

    try {
      const data = await taddyGraphqlRequest(query, variables);
      if (!data) { return null; }
      return data.searchForTerm;
    } catch (e) {
      throw new Error(`Error in searchForTerm query: ${e}`);
    }
  }
};

const SearchResolvers = {
  SearchResults: {
    async comicSeries({ comicSeries }: any, _: any, context: GraphQLContext) {
      const uuids = comicSeries.map((series: any) => series.uuid);
      const data = await ComicSeries.getComicSeriesByUuids(uuids);
      const dataByUuid = arrayToObject(data, 'uuid');

      return uuids.map((uuid: string) => dataByUuid[uuid]).filter(Boolean);
    }
  }
};

export {
  SearchDefinitions,
  SearchQueriesDefinitions,
  SearchQueries,
  SearchResolvers,
};