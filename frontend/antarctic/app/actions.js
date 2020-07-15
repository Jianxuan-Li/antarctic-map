import {action, runInAction} from 'mobx'
import {message} from 'antd'
import {history} from 'react-router-dom'
import store from './store'
import Cookie from 'js-cookie'

import BaseActions from '@components/BaseActions'
import * as apis from '@constant/apis'

import { Map, View } from 'ol';
import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import Projection from 'ol/proj/Projection';
import { Fill, Icon, Stroke, Style, Text } from 'ol/style.js';
import TileWMS from 'ol/source/TileWMS'

import { Animations } from './animation'
import LayersUtil from '@util/map/layers'
let layerCreator = new LayersUtil(GEOSERVER_URL, 'antarctic', 'EPSG:3031')

let bounds = [-4524537.706531357, -4524537.706531357, 
              4524537.706531376, 4524537.706531376];

class Actions extends BaseActions {

    @action
    merge = (obj = {}) => {
        Object.assign(this.store, obj)
    }

    @action
    initMap(target){
        let projection = new Projection({
            code: 'EPSG:3031',
            units: 'm',
            axisOrientation: 'neu',
            global: false
        });

        this.store.view = new View({
            projection: projection
        });

        this.store.map = new Map({
            interactions: defaultInteractions().extend([
                new DragRotateAndZoom()
            ]),
            target: target,
            layers: [],
            controls: [],
            view: this.store.view
        });
        
        this.store.map.getView().fit(bounds);
    }

    @action
    addSeaMask(){
        this.store.sources.seaMask = new TileWMS({
            url: GEOSERVER_URL + "antarctic/wms",
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.1',
                'TILED': true,
                'STYLES': '',
                'LAYERS': 'antarctic:Seamask_medium_res_polygon',
                'SRS': 'EPSG:3031',
                'tilesOrigin': -4524537.706531357 + "," + -4524537.706531357
            }
        });

        let layer = new TileLayer({
            source: this.store.sources.seaMask,
            opacity: 1,
            visible: true
        })
        this.store.map.addLayer(layer)
    }

    @action
    attachOnClick(){
        let { map, sources } = this.store
        map.on('singleclick', function(evt) {
            if (!sources || !sources['seaMask'])
                return false
            
            let view = map.getView();
            let viewResolution = view.getResolution();
            console.log(viewResolution)
        });
    }

    @action
    zoomIn(){
        let zoom = this.store.view.getZoom();
        let maxZoom = this.store.view.getMaxZoom();
        if(zoom >= maxZoom){
            return false;
        }
        this.store.view.animate({zoom: zoom + 1});
    }

    @action
    zoomOut(){
        let zoom = this.store.view.getZoom();
        let minZoom = this.store.view.getMinZoom();
        if(zoom <= minZoom){
            return false;
        }
        this.store.view.animate({zoom: zoom - 1});
    }

    @action
    changeLayer(layer) {
        let { map,  } = this.store
        if(this.store.currentLayer){
            map.removeLayer(this.store.currentLayer)
        }
        this.store.currentLayer = layerCreator.createWmsLayer(layer)
        map.addLayer(this.store.currentLayer)
        map.getView().fit(bounds, {duration: 1500});
    }

    @action
    getCenter(){
        console.log(this.store.view.getCenter())
    }
}

export default new Actions(store)