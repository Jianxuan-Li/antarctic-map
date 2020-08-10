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

const extent = ['-3961771.235', '-3961770.607', '4362963.182', '3961770.565']
const imageUrlPrefix = PRODUCTION ? '/sea_ice/' : '/static/sea_ice/'

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
        this.store.currentLayer = ImageLayerCreator.create(
            name, imageUrlPrefix + url, extent)
        this.store.currentLayer.setZIndex(1)
        map.addLayer(this.store.currentLayer)
    }

    @action
    clearLayer(map){
        if(this.store.currentLayer){
            map.removeLayer(this.store.currentLayer)
        }
    }

    /*
        variables for animation:
        playing: status of animation, true of false
        interval: stop time of each image

    */
    @action
    play(map, dataset, index, progress, current){
        this.store.playing = true
        this.clearLayer(map)

        // prepare animation, return loading progress with callback functions
        progress('prepare')
        this.prepare(dataset)
        this.renderOnMap(map)
        progress('loaded')

        // start animation after resources loaded, and use callback function 
        // to return the current key of dataset
        this.animate(map, index, current)
        progress('started')
    }

    @action
    prepare(dataset){
        let layers = []
        for(let i in dataset){
            layers.push(ImageLayerCreator.create(
                dataset[i]['date'], imageUrlPrefix + dataset[i]['png_name'], extent, 
                {'visible': false}))
            layers[i].setZIndex(1)
        }

        this.store.layers = layers
    }

    // Append layers on map, it will take some times
    @action
    renderOnMap(map){
        for(let i in this.store.layers){
            map.addLayer(this.store.layers[i])
        }
    }

    @action
    animate(map, index, current){
        const len = this.store.layers.length
        
        this.store.timer = setInterval(() => {
            this.store.layers[index].setVisible(true)
            this.store.layers.map((layer, key) => {
                if (key == index) return
                layer.setVisible(false)
            })
            current(index)
            if(index <= 0){
                index = len - 1
            }else{
                index --
            }
        }, 2000);
    }

    @action
    stop(map){
        if(this.store.playing == false) return
        this.store.playing = false
        clearInterval(this.store.timer)
        this.store.timer = null

        this.store.layers.map(layer => map.removeLayer(layer))
    }
}

export default new Actions(store)