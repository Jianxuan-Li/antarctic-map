import { Component } from 'react'

export default class LakesLegend extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return (<div>
            <span style={{'color':'#666666'}}>▉</span> Rock outcrop
        </div>)
    }
}