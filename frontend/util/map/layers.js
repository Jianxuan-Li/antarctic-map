import TileWMS from 'ol/source/TileWMS'
import TileLayer from 'ol/layer/Tile';

export default class Layers{
    
    constructor(baseUrl, workSpace, srs) {
        this.baseUrl = baseUrl;
        this.workSpace = workSpace;
        this.srs = srs;
    }

    getWms(){
        return this.baseUrl + this.workSpace + '/wms'
    }

    getLayerName(name){
        return this.workSpace + ':' + name
    }

    createWmsLayer(name, options = {}, origin = false){
        let wmsConfig = {
            url: this.getWms(),
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                'TILED': true,
                'STYLES': '',
                'LAYERS': this.getLayerName(name),
                'SRS': this.srs
            }
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
}