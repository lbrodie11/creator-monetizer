import { useState, useEffect } from "react"
import { AFFILIATE_PROGRAMS } from "~src/config/affiliate-programs"
import { useUser } from "~src/hooks/useUser"
import { sendMessage, MessageActions } from "~src/utils/messaging"
import { ErrorBoundary } from "~src/components/ErrorBoundary"

function IndexPopup() {
  const { user, isLoading, signIn, signOut } = useUser()
  const [isEnabled, setIsEnabled] = useState(true)
  const [recentConversions, setRecentConversions] = useState(0)

  // Add Studio Ghibli-inspired custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
      
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-3px) rotate(1deg); }
      }
      
      @keyframes naturalFlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .nature-accent {
        background: linear-gradient(45deg, #8faa96, #a8bfaa, #c1d4c1);
        background-size: 200% 200%;
        animation: naturalFlow 6s ease-in-out infinite;
      }
      
      .storybook-text {
        font-family: 'Crimson Text', serif;
        letter-spacing: 0.3px;
        line-height: 1.6;
      }
      
      .clean-text {
        font-family: 'Inter', sans-serif;
        letter-spacing: 0.2px;
      }
      
      .ghibli-popup {
        background: linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%);
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(143, 170, 150, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border: 2px solid #e8f2ea;
        position: relative;
        overflow: hidden;
      }
      
      .popup-card {
        background: linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%);
        border: 2px solid #d4d9c7;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(143, 170, 150, 0.15);
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    loadExtensionState()
  }, [])

  const loadExtensionState = async () => {
    try {
      // Check if extension is enabled
      const enabledResponse = await sendMessage({ action: "GET_SETTINGS" })
      if (enabledResponse?.success) {
        setIsEnabled(enabledResponse.data?.isEnabled ?? true)
      }
    } catch (error) {
      console.error("Error loading extension state:", error)
    }
  }

  const handleToggleEnabled = async (enabled: boolean) => {
    setIsEnabled(enabled)
    try {
      await sendMessage({ 
        action: MessageActions.TOGGLE_ENABLED, 
        enabled 
      })
    } catch (error) {
      console.error("Error toggling extension:", error)
      // Revert on error
      setIsEnabled(!enabled)
    }
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  if (isLoading) {
    return (
      <div className="ghibli-popup clean-text" style={{ 
        padding: 24, 
        width: 360, 
        textAlign: "center",
        position: "relative"
      }}>
        {/* Floating decorative element */}
        <div style={{
          position: "absolute",
          top: "15px",
          right: "20px",
          fontSize: "16px",
          opacity: 0.4,
          animation: "gentleFloat 8s ease-in-out infinite"
        }}>🍃</div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: 12,
          color: "#3d5a3d"
        }}>
          <div style={{ 
            width: 20, 
            height: 20, 
            border: "3px solid #e8f2ea",
            borderTop: "3px solid #8faa96",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <span style={{ fontSize: 16, fontWeight: "500" }}>Loading your magical settings...</span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="ghibli-popup" style={{ 
      padding: 24, 
      width: 360, 
      position: "relative"
    }}>
      {/* Floating decorative elements */}
      <div style={{
        position: "absolute",
        top: "12px",
        right: "18px",
        fontSize: "14px",
        opacity: 0.3,
        animation: "gentleFloat 10s ease-in-out infinite"
      }}>🌸</div>
      <div style={{
        position: "absolute",
        bottom: "15px",
        left: "20px",
        fontSize: "12px",
        opacity: 0.25,
        animation: "gentleFloat 12s ease-in-out infinite reverse"
      }}>☁️</div>
      
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ 
            fontSize: 32, 
            marginRight: 12,
            filter: "drop-shadow(0 2px 4px rgba(143, 170, 150, 0.3))"
          }}>💰</div>
          <h2 className="storybook-text" style={{ 
            margin: 0, 
            fontSize: 24, 
            fontWeight: "600", 
            color: "#3d5a3d",
            textShadow: "0 1px 2px rgba(143, 170, 150, 0.1)"
          }}>Creator Monetizer</h2>
        </div>
        <p className="clean-text" style={{ 
          margin: 0, 
          color: "#6b7c6b", 
          fontSize: 13,
          fontStyle: "italic"
        }}>
          ✨ Your magical affiliate companion
        </p>
      </div>

      {!user ? (
        <div style={{ textAlign: "center" }}>
          <p className="storybook-text" style={{ 
            marginBottom: 24, 
            color: "#5a6b5a", 
            fontSize: 15, 
            lineHeight: "1.6",
            fontStyle: "italic" 
          }}>
            Sign in to sync your magical settings across all your enchanted devices ✨
          </p>
          <button
            onClick={signIn}
            className="nature-accent"
            style={{
              color: "white",
              border: "none",
              padding: "14px 28px",
              borderRadius: 25,
              cursor: "pointer",
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 6px 20px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              transition: "all 0.3s ease",
              width: "100%"
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.01)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(143, 170, 150, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
            }}
          >
            🌟 Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          {/* User info card */}
          <div className="popup-card" style={{ 
            marginBottom: 20, 
            padding: 16,
            position: "relative"
          }}>
            <div className="clean-text" style={{ fontSize: 12, color: "#6b7c6b", marginBottom: 4 }}>
              🌱 Signed in as
            </div>
            <div className="storybook-text" style={{ 
              fontWeight: "600", 
              fontSize: 15, 
              color: "#3d5a3d",
              wordBreak: "break-word"
            }}>
              {user.email}
            </div>
          </div>

          {/* Toggle switch */}
          <div className="popup-card" style={{ 
            padding: 16, 
            marginBottom: 20,
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }}>
            <label className="clean-text" style={{ 
              fontSize: 15, 
              color: "#3d5a3d", 
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              ✨ Auto-convert links
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => handleToggleEnabled(e.target.checked)}
                style={{
                  width: 44,
                  height: 24,
                  appearance: "none",
                  background: isEnabled ? "linear-gradient(135deg, #8faa96 0%, #a8bfaa 100%)" : "#d4d9c7",
                  borderRadius: 12,
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                  outline: "none"
                }}
              />
              <div style={{
                position: "absolute",
                top: "3px",
                left: isEnabled ? "22px" : "3px",
                width: 16,
                height: 16,
                background: "white",
                borderRadius: "50%",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 4px rgba(143, 170, 150, 0.3)",
                pointerEvents: "none"
              }} />
            </div>
          </div>

          {/* Supported programs */}
          <div className="popup-card" style={{ padding: 16, marginBottom: 20 }}>
            <div className="clean-text" style={{ 
              fontSize: 13, 
              color: "#6b7c6b", 
              marginBottom: 12,
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              🌟 Supported Programs:
            </div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(2, 1fr)", 
              gap: 8,
              maxHeight: 120,
              overflowY: "auto"
            }}>
              {AFFILIATE_PROGRAMS.map(program => (
                <div key={program.id} style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: 6,
                  background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
                  borderRadius: 8,
                  border: "1px solid #e8f2ea",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
                >
                  <span style={{ marginRight: 8, fontSize: 14 }}>{program.icon}</span>
                  <span className="clean-text" style={{ fontSize: 11, color: "#3d5a3d", fontWeight: "500" }}>
                    {program.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={openOptions}
            className="nature-accent"
            style={{
              width: "100%",
              color: "white",
              border: "none",
              padding: "14px 20px",
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 12,
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "'Inter', sans-serif",
              boxShadow: "0 6px 20px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(143, 170, 150, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
            }}
          >
            ⚙️ Configure Affiliate IDs
          </button>

          <button
            onClick={signOut}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
              color: "#6b7c6b",
              border: "2px solid #d4d9c7",
              padding: "10px 20px",
              borderRadius: 12,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(143, 170, 150, 0.15)"
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.background = "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)";
              (e.target as HTMLButtonElement).style.borderColor = "#c1d4c1";
              (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.background = "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)";
              (e.target as HTMLButtonElement).style.borderColor = "#d4d9c7";
              (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            🚪 Sign Out
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="clean-text" style={{ 
        marginTop: 20, 
        fontSize: 11, 
        color: "#8faa96", 
        textAlign: "center", 
        lineHeight: "1.4",
        fontStyle: "italic",
        borderTop: "1px solid #e8f2ea",
        paddingTop: 16
      }}>
        ✨ Automatically transforms your links into magical affiliate links
      </div>
    </div>
  )
}

// Wrap the popup with ErrorBoundary
function PopupWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <IndexPopup />
    </ErrorBoundary>
  )
}

export default PopupWithErrorBoundary
