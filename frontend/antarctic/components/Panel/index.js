import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import queryString from 'query-string'

import ProgressBar from '@components/Progressbar'

import styles from './index.less'

@inject('mapAction', 'mapStore', 'demAction', 'seaiceAction')
@observer
class Panel extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        
    }

    clearLayerAndDataset() {
        let { mapAction, seaiceAction } = this.props
        let { map } = this.props.mapStore

        // Clear tiled layers on map
        mapAction.clearLayer()

        // Clear dataset selection
        mapAction.clearDataset()

        // Clear layers for each datasets
        seaiceAction.clearLayer(map)
    }

    handleLayerChange = (e) => {
        let { mapAction, seaiceAction } = this.props
        // Clear layers for each datasets
        this.clearLayerAndDataset()
        mapAction.changeLayer(e.target.value)
    }

    handleDatasetChange = (e) => {
        let { mapAction } = this.props
        this.clearLayerAndDataset()
        mapAction.changeDataset(e.target.value)
    }

    handleBaseLayerChange = (e) => {
        this.props.mapAction.changeBaseLayer(e.target.value)
        if (e.target.value == 'dem_hillshade'){
            this.props.demAction.toggleDemTools(true)
        }else{
            this.props.demAction.toggleDemTools(false)
            this.props.demAction.clearDraw(this.props.mapStore.map)
        }
    }

    handleClearLayer = (e) => {
        this.props.mapAction.clearLayer()
    }

    render() {
        let layers = this.props.mapStore.availableLayers;
        let { baseLayers, currentBaseLayerValue, currentLayerValue, currentDataset,
             baseLayerLoading, baseLayerProgress } = this.props.mapStore;
        
        let { showPanel } = this.props

        return (
            <div className={styles.panel} style={{display: showPanel ? 'block':'none'}}>
                <h1 className={styles.title}>AntarcticMap</h1>
                
                <div>
                    <h2>Base map</h2>
                    { baseLayers && baseLayers.length > 0 && baseLayers.map((item, index) => {
                        return (<div key={item.key}>
                            <input type="radio" name="baseLayer" value={item.value} id={"radio_"+item.value}
                                onChange={(e) => this.handleBaseLayerChange(e)} 
                                checked={currentBaseLayerValue == item.value} /> <label htmlFor={"radio_"+item.value}>{item.name}</label>
                            {currentBaseLayerValue == item.value && baseLayerLoading && <ProgressBar progress={baseLayerProgress} />}
                        </div>)
                    })}
                </div>

                <div>
                    <h2>Layers</h2>
                    {layers && layers.length > 0 && layers.map((item, index) => {
                        return (<div key={item.key}>
                            <input type="radio" name="layer" value={item.value} id={"layer_"+item.value}
                            onChange={(e) => this.handleLayerChange(e)} 
                            checked={currentLayerValue == item.value}/> <label htmlFor={"layer_"+item.value}>{item.name}</label>
                        </div>)
                    })}
                    <button onClick={this.handleClearLayer} 
                        style={{display: currentLayerValue ? 'block':'none'}}>Clear</button>
                </div>

                <div>
                    <h2>Dataset</h2>
                    <input type="radio" name="dataset" value="seaice" id="dataset_seaice"
                        onChange={(e) => this.handleDatasetChange(e)} 
                        checked={currentDataset == "seaice"}/> <label htmlFor="dataset_seaice">Sea ice</label>
                </div>

                <div className={styles.badges}>
                    <a href="https://gitlab.com/FreeYeti/antarctic-map/">
                        <img alt="Gitlab" src="https://img.shields.io/badge/gitlab-fork-brightgreen"/></a>
                    <a href="https://gitlab.com/FreeYeti/antarctic-data">
                        <img alt="Gitlab" src="https://img.shields.io/badge/data-access-brightgreen"/></a>
                    <a href="https://gitlab.com/FreeYeti/antarctic-map/-/pipelines">
                        <img alt="pipeline status" src="https://gitlab.com/FreeYeti/antarctic-map/badges/master/pipeline.svg" /></a>
                    <a href="https://gitlab.com/FreeYeti/antarctic-map/">
                        <img alt="pipeline status" src="https://gitlab.com/FreeYeti/antarctic-map/badges/master/coverage.svg" /></a>
                </div>
            </div>
        )
    }
}

export default Panel