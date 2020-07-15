import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import styles from './index.less'

import Panel from './panel'

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
        mapAction.attachOnClick()
    }

    render() {
        return (
            <div>
                <div className={styles.panel}>
                    <Panel />
                </div>
                <div className={styles.map} id="map2d"></div>
            </div>
        )
    }
}

export default AntarcticMap