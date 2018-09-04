// flow
import type { IPoint, ISpaceHotspot } from '../entities'

const RADIUS: number = 120

// Checks if a hotspot is within RADIUS distance from position
export default (position: IPoint, hotspot: ISpaceHotspot): boolean =>
  Math.sqrt(
    (hotspot.locationX - position.x) * (hotspot.locationX - position.x) +
    (hotspot.locationY - position.y) * (hotspot.locationY - position.y)
  ) < RADIUS
