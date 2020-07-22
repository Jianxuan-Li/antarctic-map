import { Component } from 'react'
import { observer, inject } from 'mobx-react'

import styles from './index.less'

@inject('mapAction', 'mapStore')
@observer
class Scale extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { scale } = this.props.mapStore
        return (
            <div className={styles.scale}>
                Scale = 1 : {scale}
            </div>
        )
    }
}

export default Scale