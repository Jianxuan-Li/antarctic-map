import TileWMS from 'ol/source/TileWMS'
import TileGrid from 'ol/tilegrid/TileGrid';
import TileLayer from 'ol/layer/Tile';
import { getTopLeft } from 'ol/extent'

import Layers from '../layers'

export default class WMSLayer extends Layers {
    constructor() {
        super(...arguments)
    }

    getWMS(){
        return this.baseUrl + this.workSpace + '/wms'
    }

    create(name, options = {}){
        let alignParameters = this.generateAlignParameter(21)

        let wmsConfig = {
            url: this.getWMS(),
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                'TILED': true,
                'STYLES': '',
                'LAYERS': this.getLayerName(name),
                'SRS': this.srs,
                'tilesOrigin': getTopLeft(this.projection.getExtent())
            },
            tileGrid: new TileGrid({
                origin: getTopLeft(this.projection.getExtent()),
                ...alignParameters
            })
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