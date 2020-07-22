import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { transform } from 'ol/proj';
import { getTopLeft, getBottomRight } from 'ol/extent';

import styles from './index.less'

@inject('mapAction', 'mapStore', 'demAction', 'demStore')
@observer
class DEMTools extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            coordinates: {
                north: 0,
                west: 0,
                south: 0,
                east: 0,
            }
        }
    }

    componentDidMount() {
        
    }

    handleDraw = () => {
        this.props.demAction.attachDraw(this.props.mapStore.map, 
            (val) => {
                let topLeft = transform(getTopLeft(val), 'EPSG:3031', 'EPSG:4326')
                let bottomRight = transform(getBottomRight(val), 'EPSG:3031', 'EPSG:4326')
                this.setState({
                    coordinates: {
                        north: topLeft[1],
                        west: topLeft[0],
                        south: bottomRight[1],
                        east: bottomRight[0],
                    }
                })
                console.log(this.state.coordinates)
            })
    }

    render() {
        let { enable } = this.props.demStore
        return (
            <div className={styles.demToolBox} style={{display: enable ? 'block':'none'}}>
                <div className={styles.header}>DEM Analysis</div>
                <div>
                    <span>Algorithm</span>
                    <div>
                        <input type="radio" name="algo" value="mean" defaultChecked="true" /> Mean
                        <input type="radio" name="algo" value="maximum" disabled="true" /> Maximum
                        <input type="radio" name="algo" value="minimum" disabled="true" /> Minimum
                    </div>
                    <span>Approach</span>
                    <div>
                        <input type="radio" name="approach" value="gdal" disabled="true" /> GDAL
                        <input type="radio" name="approach" value="spark" disabled="true" /> Apache Spark
                        <input type="radio" name="approach" value="numpy" defaultChecked="true" /> Numpy
                    </div>
                    <div>
                        <button onClick={this.handleDraw}>Select area on map</button>
                        <button disabled>Analyze</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default DEMTools