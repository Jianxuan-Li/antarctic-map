import WMTSTileGrid from 'ol/tilegrid/WMTS';
import WMTS from 'ol/source/WMTS';
import TileLayer from 'ol/layer/Tile';
import { getTopLeft } from 'ol/extent'

import Layers from '../layers'

export default class WMTSLayer extends Layers{
    constructor() {
        super(...arguments)
    }

    getWMTS(){
        return this.baseUrl + this.workSpace + '/wmts'
    }

    create(name, options = {}, wrapX = false){
        let alignParameters = this.generateAlignParameter(14)

        let wmtsConfig = {
            url: this.getWMTS(),
            matrixSet: this.srs,
            format: 'image/png',
            projection: this.srs,
            tileGrid: new WMTSTileGrid({
                origin: getTopLeft(this.projection.getExtent()),
                ...alignParameters
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