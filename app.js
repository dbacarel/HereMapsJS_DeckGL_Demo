import {Deck} from '@deck.gl/core';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import "@here/maps-api-for-javascript/bin/mapsjs.bundle.harp.js";


// Common
const lookAtData = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 3,
  // bearing: 0,
  pitch: 45
};


/** ************************************************ HERE Maps API for JavaScript ************************************************ */

function updateMapCamera(map, lookAtData) {
    map.getViewModel().setLookAtData({
      position: {lat: lookAtData.latitude, lng: lookAtData.longitude},
      zoom: lookAtData.zoom + 1,
      heading: lookAtData.bearing - 180,
      tilt: lookAtData.pitch
    })
}

const apikey = 'YOUR_API_KEY';
const engineType = H.map.render.RenderEngine.EngineType.HARP;
const pixelRatio = window.devicePixelRatio || 1;
const center = {lat: lookAtData.latitude, lng: lookAtData.longitude};
const zoom = lookAtData.zoom;

const platform = new H.service.Platform({ apikey });

const maptypes = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320,
    engineType
  });


const map = new H.Map(
    document.getElementById('container'),
    maptypes.vector.normal.mapnight,
    {
      zoom,
      center,
      engineType,
      pixelRatio
    }
);

new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
window.addEventListener('resize', () => map.getViewPort().resize());

/** ************************************************ DECK.GL ************************************************ */
// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

export const deck = new Deck({
  initialViewState: lookAtData,
  controller: true,
  // Synchronize both cameras
  onViewStateChange: ({viewState}) => updateMapCamera(map, viewState),
  onResize: ({width, height}) => map.getViewPort().resize(),
  layers: [
    new GeoJsonLayer({
      id: 'airports',
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getPointRadius: f => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: info =>
        // eslint-disable-next-line
        info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
    }),
    new ArcLayer({
      id: 'arcs',
      data: AIR_PORTS,
      dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
      // Styles
      getSourcePosition: f => [-0.4531566, 51.4709959], // London
      getTargetPosition: f => f.geometry.coordinates,
      getSourceColor: [0, 128, 200],
      getTargetColor: [200, 0, 80],
      getWidth: 1
    })
  ]
});