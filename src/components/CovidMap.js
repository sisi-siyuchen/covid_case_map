import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { CovidDataServive } from '../service/CovidDataService';
import { MapUtils } from '../utils/MapUtils';
import CaseCard from './CaseCard';



class CovidMap extends Component {
  static defaultProps = {
    center: {
      lat: 40,
      lng: -95
    },
    zoom: 6
  };

  state = {
      points: {},
      zoomLevel: 6,
      boundary: {}
  }

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals={true}
          bootstrapURLKeys={{ key: "Google Map API Key here"}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          onGoogleApiLoaded={
              () => (
                  CovidDataServive.getAllCountyCases()
                  .then(response => {
                      this.setState({
                          points: MapUtils.convertCovidPoints(response.data)
                      })
                      

                  }).catch(error => console.error(error))
              )
          }
          onChange={
              ({center, zoom, bounds, marginBounds }) =>{
                  this.setState({
                      zoomLevel: zoom,
                      boundary: bounds
                  })
              }
          }
        >
        {this.renderCovidPoints()}
        </GoogleMapReact>
      </div>
    );
  }

  renderCovidPoints() {
    let result = [];
    const zoomLevel = this.state.zoomLevel;
    // 1-4 nation level
    // 5-9 state level
    // 10-20 county level
    let pointsLevel = 'county';
    if (zoomLevel >= 1 && zoomLevel <= 4){
        pointsLevel = 'nation';
    } else if (zoomLevel > 4 && zoomLevel <=9){
        pointsLevel = 'state';
    }

    const pointsToRender = this.state.points[pointsLevel];
    // api call hasn't got any response yet
    if (!pointsToRender) {
        return result;
    }
    if (pointsLevel === 'county'){
        // county data is an array
        for (const point of pointsToRender){
            if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)){
                result.push(
                    <CaseCard 
                        key = {point.county}
                        lat = {point.coordinates.latitude}
                        lng = {point.coordinates.longitude}
                        title = {point.province}
                        subTitle = {point.county}
                        confirmed = {point.stats.confirmed}
                        deaths = {point.stats.deaths}
                    />
                )
            }
        }
    } else if (pointsLevel === 'state'){
        // state data is an object
        for (const state in pointsToRender){
            const point = pointsToRender[state];
            if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)){
                result.push(
                    <CaseCard 
                        key = {state}
                        lat = {point.coordinates.latitude}
                        lng = {point.coordinates.longitude}
                        title = {point.country}
                        subTitle = {state}
                        confirmed = {point.confirmed}
                        deaths = {point.deaths}
                    />
                )
            }
        }
    } else {
        for (const nation in pointsToRender){
            const point = pointsToRender[nation];
            if (MapUtils.isInBoundary(this.state.boundary, point.coordinates)){
                result.push(
                    <CaseCard 
                        key = {nation}
                        lat = {point.coordinates.latitude}
                        lng = {point.coordinates.longitude}
                        title = {""}
                        subTitle = {nation}
                        confirmed = {point.confirmed}
                        deaths = {point.deaths}
                    />
                )
            }
        }
    }
    return result;
  }
}

export default CovidMap;

