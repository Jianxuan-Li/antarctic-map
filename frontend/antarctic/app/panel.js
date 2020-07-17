import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import queryString from 'query-string'

import styles from './index.less'

@inject('mapAction', 'mapStore')
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

    handleLayerChange = (e) => {
        this.props.mapAction.changeLayer(e.target.value)
    }

    handleBaseLayerChange = (e) => {
        this.props.mapAction.changeBaseLayer(e.target.value)
    }

    render() {
        let layers = this.props.mapStore.availableLayers;
        let { baseLayers, currentBaseLayerValue } = this.props.mapStore; 

        return (
            <div>
                <h1 className={styles.title}>AntarcticMap</h1>
                <div className={styles.badges}>
                    <a href="https://gitlab.com/FreeYeti/antarctic-map/">
                        <img alt="Gitlab" src="https://img.shields.io/badge/gitlab-fork-brightgreen"/></a>
                    <a href="https://gitlab.com/FreeYeti/antarctic-map/-/pipelines">
                        <img alt="pipeline status" src="https://gitlab.com/FreeYeti/antarctic-map/badges/master/pipeline.svg" /></a>
                    <a href="https://gitlab.com/FreeYeti/antarctic-map/">
                        <img alt="pipeline status" src="https://gitlab.com/FreeYeti/antarctic-map/badges/master/coverage.svg" /></a>
                </div>
                
                <div>
                    <h2>Base map</h2>
                    { baseLayers && baseLayers.length > 0 && baseLayers.map((item, index) => {
                        return (<div key={item.key}>
                            <input type="radio" name="baseLayer" value={item.value} onChange={(e) => this.handleBaseLayerChange(e)} checked={currentBaseLayerValue == item.value ? true : false} />{item.name}
                            </div>)
                    })}
                </div>

                <div>
                    <h2>Layers</h2>
                    {layers && layers.length > 0 && layers.map((item, index) => {
                        return (<div key={item.key}>
                            <input type="radio" name="layer" value={item.value} onChange={(e) => this.handleLayerChange(e)} />{item.name}
                            </div>)
                    })}
                </div>
            </div>
        )
    }
}

export default Panel