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
    attachDraw(map, callback) {
        this.store.draw = new MapDraw(map)
        this.store.draw.attachDraw((e) => {
            if (this.vectorLayer) {
                map.removeLayer(this.vectorLayer);
            }

            let source = new VectorSource({
                features: [
                    e.feature
                ]
            });

            this.vectorLayer = new VectorLayer({
                source: source,
                style: new Style({
                    fill: new Fill({
                        color: 'rgba(0, 0, 255, 0.2)'
                    })
                })
            })

            map.addLayer(this.vectorLayer);
            this.store.draw.stopDraw()
            
            if (callback)
                callback(source.getExtent())
        })

        this.store.draw.startDraw()
    }

    @action
    detachDraw(){
        this.store.draw.stopDraw()
    }
}

export default new Actions(store)