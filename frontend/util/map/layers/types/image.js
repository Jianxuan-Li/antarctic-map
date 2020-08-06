import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import { getTopLeft } from 'ol/extent'

import Layers from '../layers'

export default class ImageLayerA extends Layers {
    constructor() {
        super(...arguments)
        this.imageUrlPrefix = PRODUCTION ? '/sea_ice/' : '/static/sea_ice/'
    }

    create(name, url, extent, options = {}){
        let layer = new ImageLayer({
            source: new Static({
                url: this.imageUrlPrefix + url,
                projection: this.projection,
                imageExtent: extent,
            }),
            opacity: 1,
            visible: true,
            ...options
        })

        layer.set('name', name)

        return layer
    }
}