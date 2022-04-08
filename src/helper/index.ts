import { transform } from "ol/proj"

export const transformCoordinates = (coordinates: number[]) => {
  const [x, y] = coordinates
  return transform([x, y], 'EPSG:4326', 'EPSG:3857')
}