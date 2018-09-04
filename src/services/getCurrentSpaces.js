// flow
import inside from 'point-in-polygon'

import type { IPoint, IContent, ISpace } from '../entities'

const knowledgeStudio = {
  id: 'knowledgestudio',
  title: 'KennisStudio',
  theme: {
    slug: 'knowledgestudio'
  },
  hotspots: [],
  area: [
    [0, 0],
    [416 * 6.923, 0],
    [416 * 6.923, 300 * 6.923],
    [0, 300 * 6.923]
  ]
}

const building = {
  id: 'building',
  title: 'Wegwijzer',
  theme: {
    slug: 'building'
  },
  hotspots: []
}

export const getCurrentSpaces = (
  tagPosition: IPoint,
  content: IContent
): Array<ISpace> => {
  if (tagPosition && content) {
    const { x, y } = tagPosition
    const currentSpaces = content.reduce(
      (accum, studio) => [
        ...accum,
        ...studio.spaces
          .filter(space => space.area && inside([x, y], space.area))
      ],
      []
    )

    if (!currentSpaces.length) {
      const defaultSpace = inside([x, y], knowledgeStudio.area) ? knowledgeStudio : building
      currentSpaces.push(defaultSpace)
    }
    return currentSpaces
  } else {
    return [building]
  }
}
