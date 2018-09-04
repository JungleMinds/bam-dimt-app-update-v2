// @flow

export type IOption = {
  title: string,
  id: number,
  customerRating: 0 | 1 | 2
}

export type IOptionGroup = {
  title: string,
  id: number,
  options: Array<IOption>
}

export type ISpaceHotspot = {
  title: string,
  id: number,
  locationX: number,
  locationY: number,
  hasRating: boolean
}

export type ICoordinates = Array<number>

export type IPoint = {
  x: number,
  y: number,
  z?: number
}

type IDataStream = {
  id: string,
  current_value: string,
  at: string
}

export type ILocationData = {
  body: {
    id: string,
    datastreams: Array<IDataStream>,
    tags: Array<string>,
    resource: string
  }
}

export type IPolygon = Array<Array<number>>

export type IShape = Array<ICoordinates>

export type ISpaceTheme = {
  id: number,
  title: string,
  slug: string
}

export type ISpace = {
  title: string,
  id: number,
  area: IShape,
  theme: ISpaceTheme,
  progress: number,
  hotspots: Array<ISpaceHotspot>
}

export type IStudio = {
  area: IShape,
  id: number,
  spaces: Array<ISpace>,
  title: string
}

export type IContent = Array<IStudio>

export type IProfile = {
  data: {
    id: number,
    name: string,
    image?: string,
    lastLogin: string,
    firstName?: string,
    lastName?: string,
    email: string,
    gender?: string,
    customer: {
      id: number,
      customerName: string,
      customerImage: string,
      bio: string,
      publicProfile: boolean,
      address?: string,
      addressHousenumber?: string,
      addressHousenumberAddition?: string,
      postalCode?: string,
      city?: string,
      country?: string,
      phone?: string,
      mobile?: string,
      users: [
        {
          id: number,
          name: string,
          email: string
        }
      ]
    }
  }
}
