import React from 'react'
import CardFallback from './CardFallback'

export default class SceneBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[SceneBoundary] 3D scene failed, falling back to 2D card:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <CardFallback />
    }
    return this.props.children
  }
}
