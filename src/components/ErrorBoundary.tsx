
import React from "react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  // Add Studio Ghibli styles
  componentDidMount() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
      
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-4px) rotate(1deg); }
      }
      
      .error-card {
        background: linear-gradient(135deg, #faf8f5 0%, #f0f4f1 50%, #e8f2ea 100%);
        border: 2px solid #d4d9c7;
        border-radius: 20px;
        box-shadow: 0 16px 48px rgba(143, 170, 150, 0.2);
        position: relative;
        overflow: hidden;
      }
      
      .storybook-text {
        font-family: 'Crimson Text', serif;
        letter-spacing: 0.3px;
        line-height: 1.7;
      }
      
      .clean-text {
        font-family: 'Inter', sans-serif;
        letter-spacing: 0.2px;
      }
    `;
    document.head.appendChild(styleElement);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-card" style={{
          padding: 40,
          textAlign: "center",
          maxWidth: 500,
          margin: "40px auto",
          position: "relative"
        }}>
          {/* Floating decorative elements */}
          <div style={{
            position: "absolute",
            top: "20px",
            right: "25px",
            fontSize: "16px",
            opacity: 0.3,
            animation: "gentleFloat 8s ease-in-out infinite"
          }}>🍂</div>
          <div style={{
            position: "absolute",
            bottom: "20px",
            left: "25px",
            fontSize: "14px",
            opacity: 0.25,
            animation: "gentleFloat 10s ease-in-out infinite reverse"
          }}>☁️</div>
          
          <div style={{ 
            fontSize: 64, 
            marginBottom: 24,
            filter: "drop-shadow(0 4px 8px rgba(143, 170, 150, 0.2))"
          }}>🌿</div>
          <h3 className="storybook-text" style={{ 
            margin: 0, 
            marginBottom: 16, 
            fontSize: 24, 
            color: "#3d5a3d",
            fontWeight: "600"
          }}>
            Oops! Something magical went awry
          </h3>
          <p className="clean-text" style={{ 
            margin: 0, 
            fontSize: 16,
            color: "#6b7c6b",
            lineHeight: "1.6",
            marginBottom: 24
          }}>
            Don't worry! Even the most enchanted forests have their misty moments. Please try refreshing the page or let us know if this keeps happening.
          </p>
          
          {/* Refresh button */}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #8faa96 0%, #a8bfaa 100%)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: 25,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "600",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 6px 20px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              transition: "all 0.3s ease",
              marginBottom: 20
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.02)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(143, 170, 150, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
            }}
          >
            ✨ Try Again
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: 24, 
              textAlign: "left",
              background: "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)",
              border: "2px solid #d4d9c7",
              borderRadius: 12,
              padding: 16
            }}>
              <summary className="clean-text" style={{ 
                cursor: "pointer", 
                fontSize: 13, 
                color: "#6b7c6b", 
                fontWeight: "500",
                marginBottom: 12
              }}>
                🔍 Error Details (Development Mode)
              </summary>
              <pre className="clean-text" style={{ 
                fontSize: 11, 
                background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)", 
                padding: 16, 
                borderRadius: 8,
                overflow: "auto",
                marginTop: 12,
                border: "1px solid #e8f2ea",
                color: "#3d5a3d",
                lineHeight: "1.4"
              }}>
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
