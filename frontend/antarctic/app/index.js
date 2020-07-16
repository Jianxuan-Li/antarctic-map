import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styles from './index.less'

import Panel from './panel'
import Control from './control'

@inject('mapAction', 'mapStore')
@observer
class AntarcticMap extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        let { mapAction } = this.props
        mapAction.initMap('map2d')
        mapAction.addSeaMask()
        mapAction.attachOnChangeResolution()
    }

    render() {
        let { scale, tilesLoading, tilesProgress } = this.props.mapStore
        return (
            <div>
                <div className={styles.panel}>
                    <Panel />
                </div>
                <div className={styles.tilesLoading}>
                    {tilesLoading && (<div>Loading: {tilesProgress}</div>)}
                </div>
                <div className={styles.control}>
                    <Control />
                </div>
                <div className={styles.scale}>
                    Scale = 1 : {scale}
                </div>
                <div className={styles.map} id="map2d"></div>
            </div>
        )
    }
}

export default AntarcticMap