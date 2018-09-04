// @flow

import React from 'react'
import { type Dispatch } from 'redux'
import { connect } from 'react-redux'

import {
  LOCATIFY_ENDPOINT_REST,
  LOCATIFY_ENDPOINT_WEBSOCKET,
  LOCATIFY_API_KEY
} from 'react-native-dotenv'

// utils
import { performApiRequest } from 'react-api-data'
import {
  socketOnConnect,
  socketOnMessage,
  socketOnConnectError
} from '../redux/location'
import NavigationService from '../services/navigation'

// components
import RootNavigator from './AppNavigation'

type Props = {
  tagId: string,
  fetchContent: () => void,
  socketOnConnect: (connected: boolean) => void,
  socketOnMessage: (data: string) => void,
  socketOnConnectError: (data: Object) => void
}

type State = {
  socket?: Object
}

const mapStateToProps = state => ({
  tagId: state.settings.tagId
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
  onGetFloorplan: () => {
    dispatch(performApiRequest('getFloorplan'))
  },
  socketOnConnect: (connected: boolean) => dispatch(socketOnConnect(connected)),
  socketOnMessage: (data: string) => dispatch(socketOnMessage(data)),
  socketOnConnectError: (data: Object) => dispatch(socketOnConnectError(data))
})

class ContentProvider extends React.Component<Props, State> {
  state = {}
  _connectionCheckInterval = 0
  _timeout = undefined

  // get initial location from UltraWideBand server
  loadInitialLocation (tagId: string) {
    fetch(`${LOCATIFY_ENDPOINT_REST}/feeds/${tagId}`, {
      headers: {
        'X-ApiKey': LOCATIFY_API_KEY
      }
    })
      .then(response => {
        return response.json()
      })
      .then(responseJson => {
        this.props.socketOnMessage(JSON.stringify(responseJson))
      })
      .catch(error => {
        this.props.socketOnConnectError({
          message: `Kon geen inititele locatie ophalen voor tag: ${tagId} at ${LOCATIFY_ENDPOINT_REST}`,
          error
        })
      })
  }

  // initialize the websocket connection with the UltraWideBand server
  setupUWBConnection = (tagId: string) => {
    this._connectionCheckInterval && clearInterval(this._connectionCheckInterval)
    let ws
    if (this.state.socket) {
      this.state.socket.close()
    }

    if (LOCATIFY_ENDPOINT_WEBSOCKET === 'https://bam-dimt-websocket-server.now.sh') {
      ws = new WebSocket(LOCATIFY_ENDPOINT_WEBSOCKET, 'bam-protocol')
    } else {
      ws = new WebSocket(LOCATIFY_ENDPOINT_WEBSOCKET)
    }

    ws.onopen = () => {
      // connection opened
      this.props.socketOnConnect(true)
      ws.send(`{
        "headers": {
          "X-ApiKey": "${LOCATIFY_API_KEY}"
        },
        "method": "subscribe",
        "resource": "/feeds/${tagId}"
      }`)
    }

    ws.onmessage = (e) => {
      // a message was received
      if (this._timeout) {
        clearTimeout(this._timeout)
      }
      this._timeout = setTimeout(() => {
        this.props.socketOnMessage(String(e.data))
      }, 200)
    }

    ws.onerror = (error) => {
      // an error occurred
      this.props.socketOnConnectError({
        message: `Socket error`,
        error
      })
    }

    ws.onclose = (event) => {
      this.props.socketOnConnectError({
        message: `socket closed, reason: ${event.code}`,
        error: null
      })
      this.check()
    }

    this.setState({
      socket: ws
    })

    this._connectionCheckInterval = setInterval(() => this.check, 5000)
  }

  check () {
    if (!this.state.socket || this.state.socket.readyState === WebSocket.CLOSED) {
      this.setupUWBConnection(this.props.tagId)
    }
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.tagId !== prevProps.tagId) {
      this.loadInitialLocation(this.props.tagId)
      this.setupUWBConnection(this.props.tagId)
    }
  }

  componentDidMount () {
    const { tagId } = this.props
    this.loadInitialLocation(tagId)
    this.setupUWBConnection(tagId)
  }

  componentWillUnmount () {
    this._timeout && clearTimeout(this._timeout)
    this._connectionCheckInterval && clearInterval(this._connectionCheckInterval)
  }

  render () {
    return (
      <RootNavigator
        ref={(navigatorRef) => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentProvider)
