import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import GeoJSON from 'ol/format/GeoJSON'

import styles from './index.less'

@inject('mapAction', 'mapStore', 'seaiceAction', 'seaiceStore')
@observer
class SeaIceTools extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            features: null,
            dataset: []
        }
    }

    componentDidMount = async () => {
        let { seaiceAction } = this.props

        let dataset = await seaiceAction.getDataset()
        this.setState({
            dataset: dataset
        })
    }

    handleDateChange = (e) => {
        const current = this.state.dataset[e.target.value]
        this.props.seaiceAction.changeLayer(
                                                this.props.mapStore.map,
                                                current['date'], 
                                                current['png_name']
                                            )
    }

    render() {
        let { date } = this.props.seaiceStore
        let { loading, dataset } = this.state
        return (
            <div className={styles.demToolBox}>
                <div className={styles.header}>Sea ice dataset</div>
                <div>
                    <span>view by date</span>
                    {dataset.length > 0 && dataset.map((item, index) => {
                        return (<div key={item.date}>
                            <input type="radio" name="date" value={index} id={"date_"+item.date}
                            onChange={(e) => this.handleDateChange(e)} 
                            checked={index == item.value}/>
                            <label htmlFor={"date_"+item.date}>{item.date}</label>
                        </div>)
                    })}

                    {/* <span>animation</span> */}

                </div>
            </div>
        )
    }
}

export default SeaIceTools