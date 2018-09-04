// @flow
const bathroomImage = require('../assets/images/maps/bathroom.png')
const kitchenImage = require('../assets/images/maps/kitchen.png')
const doorsImage = require('../assets/images/maps/doors.png')
const gardensImage = require('../assets/images/maps/gardens.png')
const floorsWallsImage = require('../assets/images/maps/floors_walls.png')
const extraImage = require('../assets/images/maps/extra.png')
const knowledgeStudio = require('../assets/images/maps/knowledge-studio.png')
const building = require('../assets/images/maps/building.png')

export type SpaceOffset = {
  x: number,
  y: number,
  imageScale: number,
  imageSrc?: Object,
  imageWidth: number,
  imageHeight: number
}

export const floorplanOffsets = {
  bathroom: {
    // bathroom
    x: 2218,
    y: 55,
    imageScale: 601 / (96 * 6.923), // imageWidth in pixels divided by floorplanWidth in cm 601/(98*6,923)
    imageSrc: bathroomImage,
    imageWidth: 601,
    imageHeight: 676
  },
  kitchen: {
    // kitchen
    x: 216 * 6.923,
    y: 24 * 6.923,
    imageScale: 519 / (100 * 6.923),
    imageSrc: kitchenImage,
    imageWidth: 519,
    imageHeight: 528
  },
  doors: {
    // doors
    x: 122 * 6.923,
    y: 18 * 6.923,
    imageScale: 384 / (71 * 6.923),
    imageSrc: doorsImage,
    imageWidth: 384,
    imageHeight: 660
  },
  garden: {
    // gardens
    x: 156,
    y: 90,
    imageScale: 2.477,
    imageSrc: gardensImage,
    imageWidth: 503,
    imageHeight: 54
  },
  'living-plus': {
    // extra
    x: 22 * 6.923,
    y: 96 * 6.923,
    imageScale: 491 / (98 * 6.923),
    imageSrc: extraImage,
    imageWidth: 491,
    imageHeight: 685
  },
  'floors-and-walls': {
    // floors and walls
    x: 32 * 6.923,
    y: 55 * 6.923,
    imageScale: 625 / (85 * 6.923),
    imageSrc: floorsWallsImage,
    imageWidth: 625,
    imageHeight: 382
  },
  knowledgestudio: {
    // knowledgestudio
    x: -270,
    y: -5,
    imageScale: 0.23013, // 658/(412*6,923)
    imageSrc: knowledgeStudio,
    imageWidth: 800,
    imageHeight: 587
  },
  building: {
    x: 8 / 0.0880,
    y: 8 / 0.0880,
    imageScale: 0.0880, // 665 / (1091 * 6.923)
    imageSrc: building,
    imageWidth: 680,
    imageHeight: 506
  }
}
