import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { get as getProjection } from 'ol/proj';
import { getWidth, Extent } from 'ol/extent';

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

    getLayerName(name){
        return this.workSpace + ':' + name
    }

    generateAlignParameter(zoom){
        zoom = zoom > this.maxZoom ? this.maxZoom : zoom

        let projectionExtent = this.projection.getExtent()
        let size = getWidth(projectionExtent) / 256;
        
        let resolutions = new Array(zoom);
        let matrixIds = new Array(zoom);

        for (let z = 0; z < zoom; ++z) {
            // generate resolutions and matrixIds arrays for this WMS
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }

        return { resolutions, matrixIds}
    }
}