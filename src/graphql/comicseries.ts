import { isNumber } from 'lodash-es';

import { validateAndTrimUuid } from './error.js';
import type { GraphQLContext } from './utils.js';

import type { 
  QueryResolvers, 
  ComicSeriesResolvers,
} from '../shared/graphql/types.js';
import { TaddyType } from '../shared/graphql/types.js';

import type { ComicSeriesModel } from '../shared/database/types.js';
import { ComicSeries, Creator } from '../shared/models/index.js';

const ComicSeriesDefinitions = `
  " Comic Series Details "
  type ComicSeries {
    " Unique identifier for this comic "
    uuid: ID!

    " Date when the comic series was published (Epoch time in seconds) "
    datePublished: Int

    " The name (title) for a comic series "
    name: String

    " The description for a comic series "
    description: String

    " The unique url ending for a comic series "
    shortUrl: String

    " Stringified JSON details for the cover art. Convert to JSON to use. "
    coverImageAsString: String

    " Stringified JSON details for the banner art. Convert to JSON to use. "
    bannerImageAsString: String

    " Stringified JSON details for the thumbnail art. Convert to JSON to use. "
    thumbnailImageAsString: String

    " A hash of all comic details. It may be useful for you to save this property in your database and compare it to know if any comic details have updated since the last time you checked "
    hash: String

    " A hash of the details for all issues for this comic. It may be useful for you to save this property in your database and compare it to know if there are any new or updated issues since the last time you checked "
    issuesHash: String

    " Tags for the comic series "
    tags: [String]

    " 1st Genre for the comic series "
    genre0: Genre

    " 2nd Genre for the comic series "
    genre1: Genre

    " 3rd Genre for the comic series  "
    genre2: Genre

    " The language the comic series is in "
    language: Language

    " Type of the comic series "
    seriesType: ComicSeriesType

    " Layout type of the comic series "
    layoutType: ComicSeriesLayoutType

    " Rating of the comic series "
    contentRating: ContentRating

    " Url for the comic series' SSS feed "
    sssUrl: String

    " Name to use for contacting the owner of this feed "
    sssOwnerName: String

    " Email to use for contacting the owner of this feed "
    sssOwnerPublicEmail: String

    " Copyright details for this feed "
    copyright: String

    " If the comic series is finished / complete "
    isCompleted: Boolean

    " If the content has violated Taddy's distribution policies for illegal or harmful content it will be blocked from getting any updates "
    isBlocked: Boolean

    " Creators of the comic series "
    creators: [Creator]

    " Number of issues in a comic series "
    issueCount: Int

    " The UUID of the hosting provider for this comic series' SSS feed "
    hostingProviderUuid: ID

    " The scopes for the exclusive content - e.g. 'patreon' "
    scopesForExclusiveContent: [String]
  }
`

const ComicSeriesQueriesDefinitions = `
  " Get details on a Comic Series "
  getComicSeries(
    " Get a comic series by its unique identifier (uuid) "
    uuid: ID

    " Get a comic series by its shortUrl "
    shortUrl: String
  ):ComicSeries
`

const ComicSeriesQueries: QueryResolvers<ComicSeriesModel> = {
  async getComicSeries(root, { uuid, shortUrl }, context: GraphQLContext){
    if (uuid) {
      const trimmedUuid = validateAndTrimUuid(uuid);
      return await ComicSeries.getComicSeriesByUuid(trimmedUuid);
    } else if (shortUrl) {
      return await ComicSeries.getComicSeriesByShortUrl(shortUrl);
    } else {
      return null;
    }
  },
};

const ComicSeriesFieldResolvers: ComicSeriesResolvers<ComicSeriesModel> = {
  ComicSeries: {
    sssUrl({ sssUrl, isBlocked }: ComicSeriesModel, input:{}, context: GraphQLContext) {
      return isBlocked ? null : sssUrl;
    },

    coverImageAsString({ coverImage }: ComicSeriesModel, input:{}, context: GraphQLContext): string | null {
      return coverImage ? JSON.stringify(coverImage) : null;
    },

    bannerImageAsString({ bannerImage }: ComicSeriesModel, input:{}, context: GraphQLContext): string | null {
      return bannerImage ? JSON.stringify(bannerImage) : null;
    },
    
    thumbnailImageAsString({ thumbnailImage }: ComicSeriesModel, input:{}, context: GraphQLContext): string | null {
      return thumbnailImage ? JSON.stringify(thumbnailImage) : null;
    },

    async creators({ uuid }: ComicSeriesModel, _: Record<string, unknown>, context: GraphQLContext) {
      return await Creator.getCreatorsForContent(uuid, TaddyType.COMICSERIES);
    },

    async issueCount({ uuid }: ComicSeriesModel, _: Record<string, unknown>, context: GraphQLContext) {
      return await ComicSeries.getIssueCount(uuid);
    },
  },
}

export {
  ComicSeriesDefinitions,
  ComicSeriesQueriesDefinitions,
  ComicSeriesQueries,
  ComicSeriesFieldResolvers,
}