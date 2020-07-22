import { Component } from 'react'
import styles from './index.less'

class ProgressBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            progress: '0%'
        }
    }

    componentDidMount() {
        
    }

    render() {
        let { progress } = this.props 
        return (
            <div>
                <div className={styles.meter}>
                    <span style={{width: progress}}></span>
                </div>
                <div>Loading: {progress}</div>
            </div>
        )
    }
}

export default ProgressBar