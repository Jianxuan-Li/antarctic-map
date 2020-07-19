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
import { getScale } from '@util/map/resolution'
import { handleTilesLoading } from '@util/map/loading'
let layerCreator = new LayersUtil(GEOSERVER_URL, 'antarctic', 'EPSG:3031')

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
        
        this.store.map.getView().fit(this.store.bounds);
        this.store.scale = getScale(this.store.map)
    }

    @action
    changeBaseLayer(layer) {
        let { map } = this.store
        if(this.store.currentBaseLayer){
            map.removeLayer(this.store.currentBaseLayer)
        }
        this.store.currentBaseLayer = layerCreator.createWmsLayer(layer)
        this.store.currentBaseLayerValue = layer
        this.store.bounds = this.store.baseLayerBounds[layer]
        this.store.currentBaseLayer.setZIndex(0)
        map.addLayer(this.store.currentBaseLayer)
        map.getView().fit(this.store.bounds)

        let source = this.store.currentBaseLayer.getSource()

        handleTilesLoading(source, (loading, progress) => {
            this.store.baseLayerLoading = loading
            this.store.baseLayerProgress = progress
        })

        setTimeout(() => {
            this.togglePanel(false)
        }, 1500);
    }

    @action
    attachOnChangeResolution() {
        let { map } = this.store
        map.getView().on('change:resolution', (evt) => {
            this.store.scale = getScale(map, evt)
        });
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
        this.store.currentLayer.setZIndex(1)
        map.addLayer(this.store.currentLayer)
        map.getView().fit(this.store.bounds, {duration: 1500});

        let source = this.store.currentLayer.getSource()

        handleTilesLoading(source, (loading, progress) => {
            this.store.tilesLoading = loading
            this.store.tilesProgress = progress
        })

        setTimeout(() => {
            this.togglePanel(false)
        }, 1500);
    }

    @action
    getCenter(){
        console.log(this.store.view.getCenter())
    }

    @action
    togglePanel(v){
        if(this.store.windowSize > 768) return
        this.store.showPanel = v
    }

    @action
    setWindowSize(windowSize){
        this.store.windowSize = windowSize
    }
}

export default new Actions(store)