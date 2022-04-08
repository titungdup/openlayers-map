import styled from 'styled-components'

import { ReactComponent as FlagIcon } from '../assets/images/svg/flag.svg'

interface Props {
  location: number[]
  count: number
}

const LocationInfo = ({ location, count }: Props) => {
  return (
    <LocationContainer>
      <div className="header">
        <FlagIcon />
        <h2 className="title">Location {count + 1}</h2>
      </div>
      <div>
        <div className="coordinates-info">
          <p className="type">Lat</p>
          <p className="value">{location[1]}</p>
        </div>
        <div className="coordinates-info">
          <p className="type">Long</p>
          <p className="value">{location[0]}</p>
        </div>
      </div>
    </LocationContainer>
  )
}

export default LocationInfo

const LocationContainer = styled.div`
  padding: 14px 24px;
  border: 1px solid #f4f4f4;
  background-color: #fff;

  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 22px;
  }
  .title {
    font-size: 15px;
    font-weight: 400;
    margin: 0;
  }
  .coordinates-info {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
  }
  .type {
    font-weight: 700;
    font-size: 13px;
    width: 36px;
    color: #4d4c4c;
  }
  .value {
    font-size: 18px;
    font-weight: 500;
    padding: 6px 10px;
    border: 0.5px solid #c7c7c7;
    border-radius: 5px;
    color: #2b4877;
    flex-grow: 1;
    max-width: 170px;
  }
  p {
    margin: 0;
  }
`
