import { validateAndTrimUuid } from './error.js';
import type { GraphQLContext } from './utils.js';

import { SortOrder, TaddyType } from '../shared/graphql/types.js';
import type { CreatorContentResolvers, QueryResolvers } from '../shared/graphql/types.js';
import type { CreatorContentModel } from '../shared/database/types.js';

import * as CreatorContentFns from '../shared/models/creatorcontent.js';
import * as ComicSeries from '../shared/models/comicseries.js';

const CreatorContentDefinitions = `
" CreatorContent Details "
type CreatorContent {
  " (Old) Unique identifier for this creatorcontent "
  id: ID

  " Unique identifier for this creatorcontent "
  mergedUuid: ID

  " A hash of all creatorcontent details "
  hash: String

  " Unique identifier for the creator "
  creatorUuid: ID

  " Unique identifier for the content "
  contentUuid: ID

  " Content type "
  contentType: TaddyType

  " Roles for the creator for this content "
  roles: [ContentRole]

  " Position on the creator feed "
  position: Int

  " Position on the content feed "
  contentPosition: Int

  " If content is a comic - Details for the content "
  comicseries: ComicSeries
}
`

const CreatorContentQueriesDefinitions = `
" Get details on a Creator "
getCreatorContent(
  " Get creatorcontent by its unique identifier (uuid) "
  mergedUuid: ID
):CreatorContent
`

const CreatorContentQueries: QueryResolvers<CreatorContentModel> = {
  async getCreatorContent(root, { mergedUuid }, context): Promise<CreatorContentModel | null> {    
    // if (mergedUuid){
    //   const splitUuid = mergedUuid.split(':')
    //   const [ creatorUuid, contentUuid ] = splitUuid;
    //   if (!creatorUuid || !contentUuid) return null;
    //   const safeCreatorUuid = validateAndTrimUuid(creatorUuid);
    //   const safeSortOrder = SortOrder.Latest;
    //   const content = await CreatorContentFns.getContentForCreator(safeCreatorUuid, safeSortOrder);
    //   return content[0] ?? null;
    // }else{
      return null;
    // }
  },
}

const CreatorContentFieldResolvers: CreatorContentResolvers<CreatorContentModel> = {
  CreatorContent: {
    mergedUuid({ creatorUuid, contentUuid }: CreatorContentModel, _: any, context: GraphQLContext) {
      return `${creatorUuid}:${contentUuid}`
    },

    contentType({ contentType }: CreatorContentModel, _: any, context: GraphQLContext) {
      return contentType.toUpperCase();
    },

    comicseries({ contentUuid, contentType }: CreatorContentModel, _: any, context: GraphQLContext) {
      if (contentType !== TaddyType.Comicseries) return null
      if (!contentUuid) return null

      return ComicSeries.getComicSeriesByUuid(contentUuid)
    }
  }
}

export {
  CreatorContentDefinitions,
  CreatorContentQueriesDefinitions,
  CreatorContentQueries,
  CreatorContentFieldResolvers,
}