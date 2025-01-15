import { isNumber, shuffle } from 'lodash-es';

import { UserInputError } from './error.js';
import type { GraphQLContext } from './utils.js';
import { curatedListsData, featuredComicSeriesUuids, mostPopularComicSeriesUuids } from '../shared/utils/hardcoded.js';
import type { ListModel } from '../shared/database/types.js';

import type { 
  QueryResolvers, 
} from '../shared/graphql/types.js';

import type { ComicSeriesModel } from '../shared/database/types.js';
import { ComicSeries } from '../shared/models/index.js';

const HomeScreenDefinitions = `
type HomeScreenComicSeries {
  " Id of the home screen comic series "
  id: ID

  " List of comic series "
  comicSeries: [ComicSeries]
}

type HomeScreenCuratedList {
  " Id of the home screen curated list "
  id: ID

  " List of curated lists "
  lists: [List]
}
`

const HomeScreenQueriesDefinitions = `
" Get a list of recently added comics "
getRecentlyAddedComicSeries(
  " (Optional) Default is 1, Max value allowed is 20 "
  page: Int,

  " (Optional) Return up to this number of comics. Default is 10, Max value allowed is 20 results per page "
  limitPerPage: Int,
): HomeScreenComicSeries

" Get a list of recently updated comics "
getRecentlyUpdatedComicSeries(
  " (Optional) Default is 1, Max value allowed is 20 "
  page: Int,

  " (Optional) Return up to this number of comics. Default is 10, Max value allowed is 20 results per page "
  limitPerPage: Int,
): HomeScreenComicSeries

" Get a list of most popular comics "
getMostPopularComicSeries(
  " (Optional) Default is 1, Max value allowed is 20 "
  page: Int,

  " (Optional) Return up to this number of comics. Default is 10, Max value allowed is 20 results per page "
  limitPerPage: Int,
): HomeScreenComicSeries

" Get a list of featured comics "
getFeaturedComicSeries(
  " (Optional) Default is 1, Max value allowed is 20 "
  page: Int,

  " (Optional) Return up to this number of comics. Default is 10, Max value allowed is 20 results per page "
  limitPerPage: Int,
): HomeScreenComicSeries

" Get a list of curated lists "
getCuratedLists(
  " (Optional) Default is 1, Max value allowed is 20 "
  page: Int,

  " (Optional) Return up to this number of comics. Default is 10, Max value allowed is 20 results per page "
  limitPerPage: Int,
): HomeScreenCuratedList
`

const HomeScreenQueries: QueryResolvers = {
  async getRecentlyAddedComicSeries(root: any, { page = 1, limitPerPage = 10 }, context: GraphQLContext) : Promise<{ id: string; comicSeries: ComicSeriesModel[] | null }> {
    if (!isNumber(page) || page < 1 || page > 8) { throw new UserInputError('page must be between 1 and 20') }
    if (!isNumber(limitPerPage) || limitPerPage < 1 || limitPerPage > 25) { throw new UserInputError('limitPerPage must be between 1 and 20') }

    const comicSeries = await ComicSeries.getRecentlyAddedComicSeries(page, limitPerPage);
    return {
      id: `recently-added-comicseries`,
      comicSeries,
    };
  },

  async getRecentlyUpdatedComicSeries(root: any, { page = 1, limitPerPage = 10 }, context: GraphQLContext): Promise<{ id: string; comicSeries: ComicSeriesModel[] | null }> {
    if (!isNumber(page) || page < 1 || page > 8) { throw new UserInputError('page must be between 1 and 20') }
    if (!isNumber(limitPerPage) || limitPerPage < 1 || limitPerPage > 25) { throw new UserInputError('limitPerPage must be between 1 and 20') }

    const comicSeries = await ComicSeries.getRecentlyUpdatedComicSeries(page, limitPerPage);
    return {
      id: `recently-updated-comicseries`,
      comicSeries,
    };
  },

  async getMostPopularComicSeries(root: any, { page = 1, limitPerPage = 10 }, context: GraphQLContext): Promise<{ id: string; comicSeries: ComicSeriesModel[] | null }> {
    if (!isNumber(page) || page < 1 || page > 8) { throw new UserInputError('page must be between 1 and 20') }
    if (!isNumber(limitPerPage) || limitPerPage < 1 || limitPerPage > 25) { throw new UserInputError('limitPerPage must be between 1 and 20') }
    
    const comicSeries = await ComicSeries.getComicSeriesByUuids(mostPopularComicSeriesUuids);

    const shuffledComicSeries = shuffle(comicSeries);

    return {
      id: `most-popular-comicseries`,
      comicSeries: shuffledComicSeries,
    };
  },

  async getFeaturedComicSeries(root: any, { page = 1, limitPerPage = 10 }, context: GraphQLContext): Promise<{ id: string; comicSeries: ComicSeriesModel[] | null }> {
    if (!isNumber(page) || page < 1 || page > 8) { throw new UserInputError('page must be between 1 and 20') }
    if (!isNumber(limitPerPage) || limitPerPage < 1 || limitPerPage > 100) { throw new UserInputError('limitPerPage must be between 1 and 100') }

    const comicSeries = await ComicSeries.getComicSeriesByUuids(featuredComicSeriesUuids);

    return {
      id: `featured-comicseries`,
      comicSeries,
    };
  },

  async getCuratedLists(root: any, { page = 1, limitPerPage = 10 }, context: GraphQLContext): Promise<{ id: string; lists: ListModel[] | null }> {
    if (!isNumber(page) || page < 1 || page > 8) { throw new UserInputError('page must be between 1 and 20') }
    if (!isNumber(limitPerPage) || limitPerPage < 1 || limitPerPage > 25) { throw new UserInputError('limitPerPage must be between 1 and 20') }

    const curatedLists = Object.values(curatedListsData);

    return {
      id: `curated-lists`,
      lists: curatedLists
    };
  }
};

export {
  HomeScreenDefinitions,
  HomeScreenQueriesDefinitions,
  HomeScreenQueries,
}