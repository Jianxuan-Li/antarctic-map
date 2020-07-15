import React, { Component } from 'react'
import { Route } from 'react-router-dom'

class Loader extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      instance: null
    }
  }

  UNSAFE_componentWillMount () {
    this.load(this.props)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load (props) {
    this.setState({
      instance: null
    })

    props.load((instance) => {
      this.setState({
        instance: instance.default || instance
      })
    })
  }

  render () {
    return this.state.instance ? this.props.render(this.state.instance) : null
  }
}

class Dynamic extends Component {
  render () {
    return (
      <Route {...this.props} render={props => {
        return <Loader load={this.props.load} render={Component => <Component {...props} />}/>
      }}/>
    )
  }
}

export default Dynamic
