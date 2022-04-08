import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import axios from 'axios'

import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import { Point } from 'ol/geom'
import { Style, Circle, Stroke } from 'ol/style'
import { Feature } from 'ol/index'

import { transformCoordinates } from './helper'
import { seoulCityHallCoordinates } from './helper/const'
import LocationInfo from './components/LocationInfo'

import { ReactComponent as LocationIcon } from './assets/images/svg/location.svg'
import { ReactComponent as ScaleIcon } from './assets/images/svg/scale.svg'
import { ReactComponent as LayerIcon } from './assets/images/svg/layer.svg'

function App() {
  const [coordinateData, setCoordinateData] = useState([])
  const [finalCoordinate, setFinalCoordinate] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [map, setMap] = useState<Map>()
  const mapRef = useRef<HTMLDivElement>()
  const apiURL =
    'https://angelswing-frontend-test-serverless-api.vercel.app/api/locations'

  const initialPoint = transformCoordinates(seoulCityHallCoordinates)

  // Load map
  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          }),
        }),
      ],
      view: new View({
        center: initialPoint,
        zoom: 16,
      }),
    })
    setMap(map)
  }, [])

  // Fetch data from api
  useEffect(() => {
    let transformedCoordinates = []
    axios.get(apiURL).then((res) => {
      setIsFetching(false)
      const coordinates = res.data.locations.map((location: Array<number>) => {
        transformedCoordinates = [
          ...transformedCoordinates,
          transformCoordinates([location[1], location[0]]),
        ]
        return [location[1], location[0]]
      })
      setFinalCoordinate(transformedCoordinates)
      setCoordinateData(coordinates)
    })
  }, [])

  // Add marker to map
  useEffect(() => {
    if (finalCoordinate.length > 0) {
      for (let i = 0; i < finalCoordinate.length; i++) {
        const vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: [new Feature(new Point(finalCoordinate[i]))],
          }),
          style: new Style({
            image: new Circle({
              radius: 10,
              stroke: new Stroke({ color: 'blue', width: 2 }),
            }),
          }),
        })

        map.addLayer(vectorLayer)
      }
    }
  }, [finalCoordinate])

  return (
    <Container>
      <Sidebar>
        <StyledTabs>
          <StyledTabList>
            <StyledTab>
              <LocationIcon />
            </StyledTab>
            <StyledTab>
              <ScaleIcon />
            </StyledTab>
            <StyledTab>
              <LayerIcon />
            </StyledTab>
          </StyledTabList>
          <StyledTabPanel>
            {isFetching ? (
              <ContentInfo>Fetching coordinates...</ContentInfo>
            ) : (
              <>
                {coordinateData &&
                  coordinateData.map((location, index) => {
                    return (
                      <LocationInfo
                        key={index}
                        location={location}
                        count={index}
                      />
                    )
                  })}
              </>
            )}
          </StyledTabPanel>
          <StyledTabPanel>
            <ContentInfo>No content!</ContentInfo>
          </StyledTabPanel>
          <StyledTabPanel>
            <ContentInfo>No content!</ContentInfo>
          </StyledTabPanel>
        </StyledTabs>
      </Sidebar>
      <MapContainer ref={mapRef}></MapContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`

const Sidebar = styled.div`
  max-width: 370px;
  flex-basis: 30%;
  @media (max-width: 767px) {
    order: 2;
    max-width: 100%;
  }
`

const MapContainer = styled.div`
  flex: 1;
  background-color: gray;
`

// Styled tabs
const StyledTabs = styled(Tabs)`
  display: flex;
  height: 100%;
`
const StyledTabList = styled(TabList)`
  display: block;
  padding: 8px;
  box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.1),
    0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
  position: relative;
  z-index: 1;
`

const StyledTab = styled(Tab)`
  padding: 14px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  margin-bottom: 16px;
  cursor: pointer;
  color: #c7c7c7;

  &.react-tabs__tab--selected {
    background-color: #1f4782;
    color: #fff;
  }

  &:not(.react-tabs__tab--selected) {
    &:hover {
      background-color: #d7d7d7;
      color: #fff;
    }
  }
`

const StyledTabPanel = styled(TabPanel)`
  background-color: #fbfbfb;
  position: relative;
  z-index: 0;
  width: 100%;

  @media (max-width: 767px) {
    height: 250px;
    overflow: auto;
  }

  &:not(.react-tabs__tab-panel--selected) {
    display: none;
  }
`

const ContentInfo = styled.p`
  font-size: 14px;
  color: #a1a1a1;
  text-align: center;
  margin-top: 20px;
  padding: 14px;
`

export default App
