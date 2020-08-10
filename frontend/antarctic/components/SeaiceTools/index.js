import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import GeoJSON from 'ol/format/GeoJSON'
import Spinner from '@components/Spinner'

import styles from './index.less'

@inject('mapAction', 'mapStore', 'seaiceAction', 'seaiceStore')
@observer
class SeaIceTools extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            features: null,
            currentIndex: 0,
            dataset: [],
            playing: false
        }
    }

    componentDidMount = async () => {
        let { seaiceAction, mapStore } = this.props

        this.setState({loading: true})
        let dataset = await seaiceAction.getDataset()
        const current = dataset[this.state.currentIndex]
        seaiceAction.changeLayer(mapStore.map, current['date'], current['png_name'])
        this.setState({loading: false, dataset: dataset})
    }

    handleDateChange = (e) => {
        const current = this.state.dataset[e.target.value]
        this.props.seaiceAction.changeLayer(
            this.props.mapStore.map, current['date'], current['png_name'])
        this.setState({currentIndex: e.target.value})
    }

    handlePlay = () => {
        let { mapStore, seaiceAction, seaiceStore } = this.props
        let { dataset, currentIndex, playing } = this.state

        if (playing){
            seaiceAction.stop(mapStore.map)
            this.setState({playing: false})
            let current = this.state.dataset[currentIndex]
            seaiceAction.changeLayer(mapStore.map, current['date'], current['png_name'])
            return
        }

        seaiceAction.play(mapStore.map, dataset, currentIndex, (status) => {
            switch (status) {
                case 'prepare':
                    this.setState({loading: true})
                    break;
                case 'loaded':
                    this.setState({loading: false})
                    break;
                case 'started':
                    this.setState({playing: true})
                    break;
                default:
                    break;
            }
        }, (current) => {
            this.setState({currentIndex: current})
        })
        this.setState({playing: true})
    }

    render() {
        let { loading, currentIndex, dataset, playing } = this.state
        return (
            <div className={styles.demToolBox}>
                <div className={styles.header}>Sea ice dataset</div>
                <div>
                    <span>view by date</span>
                    <div style={{display: loading ? 'block':'none'}}><Spinner /></div>
                    {dataset.length > 0 && dataset.map((item, index) => {
                        return (<div key={item.date}>
                            <input type="radio" name="date" value={index} id={"date_"+item.date}
                            onChange={(e) => this.handleDateChange(e)} 
                            checked={index == currentIndex} disabled={playing} />
                            <label htmlFor={"date_"+item.date}>{item.date}</label>
                        </div>)
                    })}

                    <button onClick={this.handlePlay}>{playing ? 'Stop':'Play'}</button>
                </div>
            </div>
        )
    }
}

export default SeaIceTools