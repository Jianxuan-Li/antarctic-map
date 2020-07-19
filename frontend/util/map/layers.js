import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import { getWidth, getTopLeft, Extent } from 'ol/extent';
import TileWMS from 'ol/source/TileWMS'
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import TileGrid from 'ol/tilegrid/TileGrid';
import TileLayer from 'ol/layer/Tile';

proj4.defs("EPSG:3031","+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
register(proj4)

export default class Layers{
    
    constructor(baseUrl, workSpace, srs) {
        this.baseUrl = baseUrl;
        this.workSpace = workSpace;
        this.srs = srs;
        this.maxZoom = 21;
        this.projection = getProjection(this.srs);
        this.projection.setExtent([-3333134.027630277, -3333134.027630277, 3333134.027630277, 3333134.027630277]);
    }

    getWMS(){
        return this.baseUrl + this.workSpace + '/wms'
    }

    getWMTS(){
        return this.baseUrl + this.workSpace + '/wmts'
    }

    getLayerName(name){
        return this.workSpace + ':' + name
    }

    createWmsLayer(name, options = {}, origin = false){
        let projectionExtent = this.projection.getExtent()
        let size = getWidth(projectionExtent) / 256;
        let resolutions = new Array(this.maxZoom);
        let matrixIds = new Array(this.maxZoom);
        for (let z = 0; z < this.maxZoom; ++z) {
            // generate resolutions and matrixIds arrays for this WMS
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }

        let wmsConfig = {
            url: this.getWMS(),
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                'TILED': true,
                'STYLES': '',
                'LAYERS': this.getLayerName(name),
                'SRS': this.srs,
                'tilesOrigin': getTopLeft(projectionExtent)
            },
            tileGrid: new TileGrid({
                origin: getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
            })
        }

        if(origin && origin.length && origin[0] && origin[1]){
            wmsConfig.params['tilesOrigin'] =  origin[0] + "," + origin[1]
        }

        let layer = new TileLayer({
            source: new TileWMS(wmsConfig),
            opacity: 1,
            visible: true,
            ...options
        })

        return layer
    }


    createWMTSLayer(name, options = {}, wrapX = false){
        let projectionExtent = this.projection.getExtent()
        let size = getWidth(projectionExtent) / 256;
        let resolutions = new Array(14);
        let matrixIds = new Array(14);
        for (let z = 0; z < 14; ++z) {
            // generate resolutions and matrixIds arrays for this WMTS
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }

        let wmtsConfig = {
            url: this.getWMS(),
            matrixSet: this.srs,
            format: 'image/png',
            projection: this.srs,
            tileGrid: new WMTSTileGrid({
                origin: getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
            }),
            style: 'default',
            wrapX: wrapX
        }

        let layer = new TileLayer({
            source: new WMTS(wmtsConfig),
            opacity: 1,
            visible: true,
            ...options
        })

        return layer
    }
}