import {action, runInAction} from 'mobx'
import store from '@antarctic/store/dem'

import { Vector as VectorLayer} from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Style, Fill } from 'ol/style.js';

import BaseActions from '@components/BaseActions'
import * as apis from '@constant/apis'

import MapDraw from '@util/map/draw'

import { ImageLayerUtil } from '@util/map/layers'
let ImageLayerCreator = new ImageLayerUtil(false, false, 'EPSG:3031')

class Actions extends BaseActions {
    @action
    merge = (obj = {}) => {
        Object.assign(this.store, obj)
    }

    @action
    getDataset = async () => await this.get(apis.SEAICE_DATASET)

    @action
    changeLayer(map, name, url){
        this.clearLayer(map)
        let extent = ['-3961771.235', '-3961770.607', '4362963.182', '3961770.565' ]
        this.store.currentLayer = ImageLayerCreator.create(name, url, extent)
        this.store.currentLayer.setZIndex(1)
        map.addLayer(this.store.currentLayer)
    }

    @action
    clearLayer(map){
        if(this.store.currentLayer){
            map.removeLayer(this.store.currentLayer)
        }
    }
}

export default new Actions(store)