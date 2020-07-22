import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styles from './index.less'

import Panel from './Panel'
import Control from './Control'

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
        this.props.mapAction.setWindowSize(window.innerWidth)

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768){
                this.props.mapAction.togglePanel(true)
            }
            this.props.mapAction.setWindowSize(window.innerWidth)
        });
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
                <Panel showPanel={showPanel} />
                <div className={styles.tilesLoading}>
                    {tilesLoading && (<ProgressBar progress={tilesProgress} />)}
                </div>
                <Control />
                <div className={styles.scale}>
                    Scale = 1 : {scale}
                </div>
                { /* TODO: legend */ }
                <div className={styles.map} id="map2d"></div>
            </div>
        )
    }
}

export default AntarcticMap