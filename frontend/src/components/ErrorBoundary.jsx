import React from 'react';
import { FaTimes, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-gradient-to-br from-red-800/50 to-red-900/50 backdrop-blur-md p-8 rounded-xl border border-red-500/20 shadow-lg max-w-md w-full">
            <div className="flex items-center text-red-400 mb-4">
              <FaTimes className="text-3xl mr-3" />
              <h2 className="text-xl font-bold">Something went wrong</h2>
            </div>
            <p className="text-gray-300 mb-3">
              {this.state.error && this.state.error.toString()}
            </p>
            <details className="mb-6 text-gray-400 text-sm border border-red-500/20 p-3 rounded">
              <summary>Error Details</summary>
              <pre className="mt-2 overflow-auto max-h-[200px]">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button 
              onClick={this.handleRetry}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <FaRedo className="mr-2" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 