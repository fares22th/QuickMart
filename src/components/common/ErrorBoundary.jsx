import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-64 p-8 text-center">
          <p className="text-2xl font-bold text-red-500 mb-2">حدث خطأ</p>
          <p className="text-gray-500">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-xl"
          >
            إعادة المحاولة
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
