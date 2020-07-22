import { Component } from 'react'
import { observer, inject } from 'mobx-react'

import styles from './index.less'

@inject('mapAction', 'mapStore', 'demAction', 'demStore')
@observer
class DEMTools extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        
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
                        <button>Select area on map</button>
                        <button disabled>Analyze</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default DEMTools