import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import GeoJSON from 'ol/format/GeoJSON'

import styles from './index.less'

@inject('mapAction', 'mapStore', 'demAction', 'demStore')
@observer
class DEMTools extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            features: null,
            results: false,
            approach: 'numpy'
        }
    }

    componentDidMount() {
        
    }

    handleApproachChange = (e) => {
        this.setState({'approach': e.target.value})
    }

    handleDraw = async () => {
        let { attachDraw, detachDraw, exec } = this.props.demAction
        let { approach } = this.state

        attachDraw(this.props.mapStore.map, 
            async (features) => {
                detachDraw()

                this.setState({ 
                    features: features,
                    loading: true,
                    results: false
                })
                let poly = features[0]
                let geom = poly.getGeometry()
                
                // Convert to GeoJSON, and submit to backend
                let GeoJSONHandler = new GeoJSON()
                let json = GeoJSONHandler.writeFeatures(features)

                let results = await exec('mean', approach, json)
                this.setState({'results': results, 'loading': false})

                // Transform and show on map ?
                // console.log(geom.transform('EPSG:3031', 'EPSG:4326'))
            })
    }

    render() {
        let { enable } = this.props.demStore
        let { loading, results } = this.state
        return (
            <div className={styles.demToolBox} style={{display: enable ? 'block':'none'}}>
                <div className={styles.header}>DEM Analysis</div>
                <div>
                    <span>Algorithm</span>
                    <div>
                        <input type="radio" name="algo" value="mean" 
                            defaultChecked="true" id="algo_mean" />
                            <label htmlFor="algo_mean">Mean</label>
                        <input type="radio" name="algo" value="maximum" 
                            disabled={true} id="algo_max" /> 
                            <label htmlFor="algo_max">Maximum</label>
                        <input type="radio" name="algo" value="minimum" 
                            disabled={true} id="algo_min" />
                            <label htmlFor="algo_min">Minimum</label>
                    </div>
                    <span>Approach</span>
                    <div>
                        <input type="radio" name="approach" onClick={this.handleApproachChange} 
                            value="numpy" defaultChecked="true" id="approach_numpy" /> 
                            <label htmlFor="approach_numpy">Numpy</label>
                        <input type="radio" name="approach" onClick={this.handleApproachChange} 
                            value="gdal" id="approach_gdal" /> 
                            <label htmlFor="approach_gdal">GDAL</label>
                    </div>
                    <div>
                        To analyze the DEM data, please select area on the map
                        <button onClick={this.handleDraw}>Select area</button>
                    </div>
                    <div style={{display: loading ? 'block':'none'}}>
                        Analyzing...
                    </div>
                    <div style={{display: !loading && results && results.mean ? 'block' : 'none'}}>
                        Average elevations {results && results.mean}
                    </div>
                </div>
            </div>
        )
    }
}

export default DEMTools