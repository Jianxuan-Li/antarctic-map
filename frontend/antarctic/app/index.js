import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styles from './index.less'

import Panel from './panel'
import Control from './control'

import ProgressBar from '@components/progressbar'

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
        mapAction.changeBaseLayer('Seamask_medium_res_polygon')
        mapAction.attachOnChangeResolution()
    }

    handleMenuChange = (e) => {
        this.props.mapAction.togglePanel(e.target.checked)
    }

    render() {
        let { scale, tilesLoading, tilesProgress, showPanel } = this.props.mapStore
        return (
            <div>
                <div className={styles.menuButton} style={{left: showPanel ? '320px': '20px'}}>
                    <label htmlFor="toggleMenu">&#9776;</label>
                    <input type="checkbox" id="toggleMenu" checked={showPanel} defaultChecked={showPanel} onClick={this.handleMenuChange} />
                </div>
                <div className={styles.panel} style={{display: showPanel ? 'block':'none'}}>
                    <Panel />
                </div>
                <div className={styles.tilesLoading}>
                    { /* TODO: progress component */ }
                    {tilesLoading && (<ProgressBar progress={tilesProgress} />)}
                </div>
                <div className={styles.control}>
                    <Control />
                </div>
                { /* TODO: feature: hang out */ }
                <div className={styles.scale}>
                    Scale = 1 : {scale}
                </div>
                <div className={styles.map} id="map2d"></div>
            </div>
        )
    }
}

export default AntarcticMap