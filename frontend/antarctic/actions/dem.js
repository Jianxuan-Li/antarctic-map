import {action, runInAction} from 'mobx'
import store from '@antarctic/store/dem'

import { Vector as VectorLayer} from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Style, Fill } from 'ol/style.js';

import BaseActions from '@components/BaseActions'
import * as apis from '@constant/apis'

import MapDraw from '@util/map/draw'

class Actions extends BaseActions {
    @action
    merge = (obj = {}) => {
        Object.assign(this.store, obj)
    }

    @action
    toggleDemTools(enable = null) {
        if (enable !== null){
            this.store.enable = enable
            return
        }

        this.store.enable = !this.store.enable
    }

    @action
    attachDraw = (map, callback) => {
        this.store.draw = new MapDraw(map)

        this.store.draw.attachDraw((e) => {
            if (this.store.paintedLayer) {
                map.removeLayer(this.store.paintedLayer);
            }

            let source = new VectorSource({
                features: [
                    e.feature
                ]
            });

            this.store.paintedLayer = new VectorLayer({
                source: source,
                style: new Style({
                    fill: new Fill({
                        color: 'rgba(125, 125, 125, 0.5)'
                    })
                })
            })

            this.store.paintedLayer.setZIndex(2)

            map.addLayer(this.store.paintedLayer);
            this.store.draw.stopDraw()
            
            if (callback)
                callback(source.getFeatures())
        })

        this.store.draw.startDraw()
    }

    @action
    detachDraw = () => {
        this.store.draw.stopDraw()
    }

    @action
    clearDraw(map){
        if (this.store.paintedLayer){
            map.removeLayer(this.store.paintedLayer);
        }
    }

    @action
    exec = async (algo, approach, polyFeature) => {
        let result = await this.post(
                                apis.DEM_MEAN(approach), 
                                {geom_string: JSON.stringify(polyFeature)}, 
                                true)
        return result
    }
}

export default new Actions(store)