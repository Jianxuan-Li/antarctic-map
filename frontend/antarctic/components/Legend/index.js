import { Component } from 'react'
import { observer, inject } from 'mobx-react'

import styles from './index.less'

import { DEMLegend, LakesLegend, RockLegend } from './types'

@inject('mapAction', 'mapStore')
@observer
class Legend extends Component{
    constructor(props){
        super(props)

        this.state = {
            loading: false
        }
    }

    componentDidMount(){
    }

    render(){
        let { currentLayer } = this.props.mapStore

        let legendMap = {
            'krigged_dem_nsidc': (<DEMLegend />),
            'Lakes_high_res_polygon': (<LakesLegend />),
            'Rock_outcrop_medium_res_polygon': (<RockLegend />),
            'Contours_medium_res_line': null,
        }

        if (!currentLayer || !currentLayer.get('name'))
            return null

        let layerName = currentLayer.get('name')

        return(
            <div className={styles.legend}>
                {legendMap[layerName]}
            </div>
        )
    }


}

export default Legend