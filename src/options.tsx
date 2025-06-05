
import { useState, useEffect } from "react"
import { UserService } from "~src/services/user-service"
import { AFFILIATE_PROGRAMS } from "~src/config/affiliate-programs"
import { useUser } from "~src/hooks/useUser"
import { sendMessage, MessageActions } from "~src/utils/messaging"
import { Dashboard } from "~src/components/Dashboard"
import { AffiliateIdValidator, type ValidationResult } from "~src/utils/validation"
import type { UserAffiliateSettings, LinkConversion } from "~src/types"

function OptionsPage() {
  const { user, isLoading, signIn, signOut } = useUser()
  const [affiliateSettings, setAffiliateSettings] = useState<UserAffiliateSettings>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [recentConversions, setRecentConversions] = useState<LinkConversion[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationResult>>({})

  // Add Studio Ghibli-inspired custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');
      
      .affiliate-input::placeholder {
        color: #8faa96;
        font-weight: 400;
        opacity: 0.8;
        font-style: italic;
      }
      .affiliate-input:focus::placeholder {
        color: #a8bfaa;
        opacity: 0.6;
      }
      
      .ghibli-card {
        background: linear-gradient(135deg, #faf8f5 0%, #f0f4f1 50%, #e8f2ea 100%);
        border: 2px solid #d4d9c7;
        position: relative;
        overflow: hidden;
      }
      
      .ghibli-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(143, 170, 150, 0.05) 0%, transparent 60%);
        animation: gentleFloat 8s ease-in-out infinite;
        pointer-events: none;
      }
      
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
      }
      
      .nature-accent {
        background: linear-gradient(45deg, #8faa96, #a8bfaa, #c1d4c1);
        background-size: 200% 200%;
        animation: naturalFlow 6s ease-in-out infinite;
      }
      
      @keyframes naturalFlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .whimsical-shadow {
        box-shadow: 0 8px 32px rgba(143, 170, 150, 0.15), 0 2px 8px rgba(200, 215, 200, 0.3);
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
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      // Load current settings
      const settingsResponse = await sendMessage({ action: MessageActions.GET_SETTINGS })
      if (settingsResponse?.success) {
        setAffiliateSettings(settingsResponse.data || {})
      }

      // Load recent conversions if user is signed in
      if (user) {
        const userService = UserService.getInstance()
        const conversions = await userService.getRecentConversions(10)
        setRecentConversions(conversions)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleSettingChange = (programId: string, value: string) => {
    setAffiliateSettings(prev => ({
      ...prev,
      [programId]: value
    }))

    // Validate the input as user types
    const validation = AffiliateIdValidator.validateById(programId, value)
    setValidationErrors(prev => ({
      ...prev,
      [programId]: validation
    }))
  }

  const handleSave = async () => {
    // Validate all settings before saving
    const validationResults = AffiliateIdValidator.validateAllSettings(affiliateSettings)
    setValidationErrors(validationResults)

    // Check if there are any validation errors for non-empty fields
    const hasErrors = Object.entries(validationResults).some(([_, result]) => !result.isValid)
    if (hasErrors) {
      setSaveMessage("Please fix validation errors before saving")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }

    setIsSaving(true)
    setSaveMessage("")
    
    try {
      await sendMessage({
        action: MessageActions.UPDATE_SETTINGS,
        settings: affiliateSettings
      })
      
      setSaveMessage("Settings saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      setSaveMessage("Error saving settings")
    }
    
    setIsSaving(false)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + " " + new Date(timestamp).toLocaleTimeString()
  }

  if (isLoading) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e8f2ea 0%, #c8dbc8 30%, #a8bfaa 70%, #8faa96 100%)",
      backgroundAttachment: "fixed",
      padding: "40px 20px",
      position: "relative"
    }}>
      {/* Floating nature elements */}
      <div style={{
        position: "fixed",
        top: "10%",
        right: "15%",
        fontSize: "24px",
        opacity: 0.6,
        animation: "gentleFloat 12s ease-in-out infinite",
        zIndex: 1
      }}>🍃</div>
      <div style={{
        position: "fixed",
        top: "70%",
        left: "8%",
        fontSize: "20px",
        opacity: 0.5,
        animation: "gentleFloat 15s ease-in-out infinite reverse",
        zIndex: 1
      }}>🌸</div>
      <div style={{
        position: "fixed",
        top: "40%",
        right: "5%",
        fontSize: "18px",
        opacity: 0.4,
        animation: "gentleFloat 18s ease-in-out infinite",
        zIndex: 1
      }}>☁️</div>
      
      <div style={{ 
        maxWidth: 1000, 
        margin: "0 auto",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        zIndex: 2
      }}>
        {/* Header Section */}
        <div style={{ 
          background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
          borderRadius: 24, 
          padding: 48, 
          marginBottom: 40,
          boxShadow: "0 16px 48px rgba(143, 170, 150, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          textAlign: "center",
          border: "3px solid #e8f2ea",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative elements */}
          <div style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            fontSize: "32px",
            opacity: 0.15,
            transform: "rotate(-15deg)"
          }}>🌿</div>
          <div style={{
            position: "absolute",
            bottom: "20px",
            right: "40px",
            fontSize: "28px",
            opacity: 0.15,
            transform: "rotate(25deg)"
          }}>🍄</div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ 
              fontSize: 56, 
              marginRight: 20,
              filter: "drop-shadow(0 4px 8px rgba(143, 170, 150, 0.3))"
            }}>💰</div>
            <div>
              <h1 className="storybook-text" style={{ 
                margin: 0, 
                fontSize: 42, 
                fontWeight: "600", 
                color: "#3d5a3d",
                textShadow: "0 2px 4px rgba(143, 170, 150, 0.1)"
              }}>Creator Monetizer</h1>
              <p className="clean-text" style={{ 
                margin: "12px 0 0 0", 
                color: "#6b7c6b", 
                fontSize: 18,
                fontStyle: "italic"
              }}>A magical place to configure your affiliate programs ✨</p>
            </div>
          </div>

          {!user ? (
            <div style={{ marginTop: 40 }}>
              <p className="storybook-text" style={{ 
                marginBottom: 32, 
                fontSize: 18, 
                color: "#5a6b5a", 
                lineHeight: "1.8",
                maxWidth: 480,
                margin: "0 auto 32px auto"
              }}>
                Sign in to sync your magical settings across all your devices and track your enchanting conversions ✨
              </p>
              <button
                onClick={signIn}
                className="nature-accent"
                style={{
                  color: "white",
                  border: "none",
                  padding: "16px 40px",
                  borderRadius: 50,
                  cursor: "pointer",
                  fontSize: 16,
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 8px 24px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.02)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(143, 170, 150, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                }}
              >
                🌟 Sign in with Google
              </button>
            </div>
          ) : (
            <div style={{ 
              marginTop: 32, 
              padding: 24, 
              background: "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)", 
              borderRadius: 20,
              border: "2px solid #d4d9c7",
              boxShadow: "inset 0 2px 4px rgba(143, 170, 150, 0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="clean-text" style={{ fontSize: 14, color: "#6b7c6b", marginBottom: 6 }}>
                    🌱 Signed in as
                  </div>
                  <div className="storybook-text" style={{ fontWeight: "600", fontSize: 18, color: "#3d5a3d" }}>
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={signOut}
                  style={{
                    background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
                    color: "#6b7c6b",
                    border: "2px solid #d4d9c7",
                    padding: "10px 20px",
                    borderRadius: 15,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: "500",
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 8px rgba(143, 170, 150, 0.2)"
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
            </div>
          )}
        </div>

        {/* Affiliate Settings Section */}
        <div className="whimsical-shadow" style={{ 
          background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
          borderRadius: 24, 
          padding: 48, 
          marginBottom: 40,
          border: "3px solid #e8f2ea",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative corner elements */}
          <div style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            fontSize: "24px",
            opacity: 0.2,
            transform: "rotate(15deg)"
          }}>🌺</div>
          <div style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            fontSize: "20px",
            opacity: 0.2,
            transform: "rotate(-20deg)"
          }}>🦋</div>
          
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <h2 className="storybook-text" style={{ 
              fontSize: 32, 
              marginBottom: 16, 
              fontWeight: "600", 
              color: "#3d5a3d",
              textShadow: "0 2px 4px rgba(143, 170, 150, 0.1)"
            }}>
              🌟 Affiliate Program Settings
            </h2>
            <p className="clean-text" style={{ 
              color: "#6b7c6b", 
              marginBottom: 0, 
              fontSize: 18, 
              lineHeight: "1.7", 
              maxWidth: 640, 
              margin: "0 auto",
              fontStyle: "italic"
            }}>
              Enter your magical affiliate IDs for each program. Links will be automatically transformed when you paste them, like magic! ✨
            </p>
          </div>

          <div style={{ display: "grid", gap: 32, gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))" }}>
            {AFFILIATE_PROGRAMS.map(program => (
              <div key={program.id} className="ghibli-card" style={{ 
                borderRadius: 20, 
                padding: 28,
                transition: "all 0.3s ease",
                position: "relative"
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.01)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(143, 170, 150, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5)";
                (e.currentTarget as HTMLElement).style.borderColor = "#c1d4c1";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(143, 170, 150, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                (e.currentTarget as HTMLElement).style.borderColor = "#d4d9c7";
              }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ 
                    fontSize: 32, 
                    marginRight: 18,
                    padding: 12,
                    background: "linear-gradient(135deg, #fdfcf8 0%, #f0f4f1 100%)",
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(143, 170, 150, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                    border: "2px solid #e8f2ea"
                  }}>
                    {program.icon}
                  </div>
                  <div>
                    <h3 className="storybook-text" style={{ 
                      margin: 0, 
                      fontSize: 20, 
                      fontWeight: "600", 
                      color: "#3d5a3d",
                      marginBottom: 4
                    }}>
                      {program.name}
                    </h3>
                    <div className="clean-text" style={{ fontSize: 13, color: "#6b7c6b", marginTop: 4 }}>
                      Parameter: <code style={{ 
                        background: "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)", 
                        padding: "3px 8px", 
                        borderRadius: 8,
                        fontSize: 12,
                        border: "1px solid #d4d9c7",
                        color: "#3d5a3d",
                        fontWeight: "500"
                      }}>{program.paramName}</code>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: 20 }}>
                  <input
                    type="text"
                    className="affiliate-input clean-text"
                    value={affiliateSettings[program.id] || ""}
                    onChange={(e) => handleSettingChange(program.id, e.target.value)}
                    placeholder={`✨ Enter your ${program.name} ID`}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      border: `3px solid ${validationErrors[program.id] && !validationErrors[program.id].isValid ? "#d69e2e" : "#d4d9c7"}`,
                      borderRadius: 16,
                      fontSize: 15,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: "500",
                      lineHeight: "1.5",
                      textAlign: "left",
                      transition: "all 0.3s ease",
                      outline: "none",
                      background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
                      color: "#3d5a3d",
                      boxSizing: "border-box",
                      boxShadow: "inset 0 2px 4px rgba(143, 170, 150, 0.1)"
                    }}
                  onFocus={(e) => {
                    if (!validationErrors[program.id] || validationErrors[program.id].isValid) {
                      (e.target as HTMLInputElement).style.borderColor = "#8faa96";
                      (e.target as HTMLInputElement).style.boxShadow = "0 0 0 4px rgba(143, 170, 150, 0.15), inset 0 2px 4px rgba(143, 170, 150, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLInputElement).style.borderColor = validationErrors[program.id] && !validationErrors[program.id].isValid ? "#d69e2e" : "#d4d9c7";
                    (e.target as HTMLInputElement).style.boxShadow = "inset 0 2px 4px rgba(143, 170, 150, 0.1)";
                  }}
                />
                </div>
                
                {/* Validation feedback */}
                {validationErrors[program.id] && !validationErrors[program.id].isValid && (
                  <div className="clean-text" style={{ 
                    fontSize: 13, 
                    color: "#8b4513",
                    marginTop: 12,
                    padding: 16,
                    background: "linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%)",
                    borderRadius: 14,
                    border: "2px solid #f6ad55",
                    boxShadow: "0 4px 12px rgba(246, 173, 85, 0.2)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>🍂</span>
                      <strong className="storybook-text" style={{ fontSize: 14 }}>{validationErrors[program.id].error}</strong>
                    </div>
                    {validationErrors[program.id].suggestion && (
                      <div style={{ fontStyle: "italic", fontSize: 12, color: "#744210", marginLeft: 24 }}>
                        ✨ {validationErrors[program.id].suggestion}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Valid state indicator */}
                {validationErrors[program.id] && validationErrors[program.id].isValid && affiliateSettings[program.id] && (
                  <div className="clean-text" style={{ 
                    fontSize: 13, 
                    color: "#2f5233",
                    marginTop: 12,
                    padding: 12,
                    background: "linear-gradient(135deg, #f0f9f0 0%, #c6f6d5 100%)",
                    borderRadius: 14,
                    border: "2px solid #9ae6b4",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(154, 230, 180, 0.2)"
                  }}>
                    <span style={{ fontSize: 16 }}>🌱</span>
                    <span className="storybook-text" style={{ fontWeight: "500" }}>Perfect! Your {program.name} ID is ready to work its magic</span>
                  </div>
                )}
                
                {/* Examples */}
                <div className="clean-text" style={{ 
                  fontSize: 12, 
                  color: "#6b7c6b", 
                  marginTop: 16,
                  padding: 16,
                  background: "linear-gradient(135deg, #f5f8f5 0%, #e8f2ea 100%)",
                  borderRadius: 12,
                  border: "2px solid #d4d9c7",
                  boxShadow: "inset 0 2px 4px rgba(143, 170, 150, 0.1)"
                }}>
                  <div className="storybook-text" style={{ fontWeight: "600", marginBottom: 8, color: "#3d5a3d", fontSize: 13 }}>
                    🌟 Example ID:
                  </div>
                  <code style={{ 
                    background: "linear-gradient(135deg, #fdfcf8 0%, #f0f4f1 100%)", 
                    padding: "6px 12px", 
                    borderRadius: 8,
                    fontSize: 11,
                    fontFamily: "Monaco, Consolas, 'Courier New', monospace",
                    color: "#3d5a3d",
                    fontWeight: "600",
                    border: "1px solid #c8dbc8",
                    display: "inline-block",
                    boxShadow: "0 2px 4px rgba(143, 170, 150, 0.1)"
                  }}>
                    {program.id === "amazon" ? "yourname-20" :
                     program.id === "ebay" ? "5338177094" :
                     program.id === "booking" ? "812345" :
                     program.id === "aliexpress" ? "mm_12345678_0_0" :
                     program.id === "walmart" ? "WL123456789" :
                     program.id === "target" ? "123456" :
                     program.id === "shareasale" ? "12345" :
                     program.id === "cj" ? "1234567" :
                     program.id === "impact" ? "abc123xyz" :
                     program.id === "flexoffers" ? "12345" :
                     "your-affiliate-id"}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={isSaving ? "clean-text" : "nature-accent clean-text"}
              style={{
                background: isSaving ? "linear-gradient(135deg, #c8dbc8 0%, #a8bfaa 100%)" : undefined,
                color: "white",
                border: "none",
                padding: "16px 40px",
                borderRadius: 50,
                cursor: isSaving ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: "600",
                fontFamily: "'Inter', sans-serif",
                boxShadow: isSaving ? "0 4px 12px rgba(143, 170, 150, 0.2)" : "0 8px 24px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s ease",
                minWidth: 180,
                position: "relative",
                overflow: "hidden"
              }}
              onMouseOver={(e) => {
                if (!isSaving) {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.02)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 12px 32px rgba(143, 170, 150, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                if (!isSaving) {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(143, 170, 150, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                }
              }}
            >
              {isSaving ? "🌱 Saving your magic..." : "✨ Save Magical Settings"}
            </button>
            
            {saveMessage && (
              <div className="clean-text" style={{ 
                color: saveMessage.includes("Error") ? "#8b4513" : "#2f5233",
                fontSize: 15,
                fontWeight: "600",
                padding: "12px 20px",
                background: saveMessage.includes("Error") ? "linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%)" : "linear-gradient(135deg, #f0f9f0 0%, #c6f6d5 100%)",
                borderRadius: 50,
                border: saveMessage.includes("Error") ? "2px solid #f6ad55" : "2px solid #9ae6b4",
                boxShadow: saveMessage.includes("Error") ? "0 4px 12px rgba(246, 173, 85, 0.2)" : "0 4px 12px rgba(154, 230, 180, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}>
                <span style={{ fontSize: 16 }}>
                  {saveMessage.includes("Error") ? "🍂" : "🌸"}
                </span>
                <span className="storybook-text">
                  {saveMessage.includes("Error") ? saveMessage : "Your magical settings have been saved! ✨"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Conversions Section */}
        {user && recentConversions.length > 0 && (
          <div className="whimsical-shadow" style={{ 
            background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)", 
            borderRadius: 24, 
            padding: 48, 
            marginBottom: 40,
            border: "3px solid #e8f2ea",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Decorative elements */}
            <div style={{
              position: "absolute",
              top: "25px",
              right: "35px",
              fontSize: "28px",
              opacity: 0.15,
              transform: "rotate(20deg)"
            }}>🌟</div>
            <div style={{
              position: "absolute",
              bottom: "25px",
              left: "35px",
              fontSize: "24px",
              opacity: 0.15,
              transform: "rotate(-10deg)"
            }}>💫</div>
            
            <h2 className="storybook-text" style={{ 
              fontSize: 32, 
              marginBottom: 32, 
              fontWeight: "600", 
              color: "#3d5a3d",
              textAlign: "center",
              textShadow: "0 2px 4px rgba(143, 170, 150, 0.1)"
            }}>
              ✨ Recent Magical Conversions
            </h2>
            
            <div style={{ 
              border: "2px solid #d4d9c7", 
              borderRadius: 20, 
              background: "linear-gradient(135deg, #fdfcf8 0%, #f0f4f1 100%)",
              overflow: "hidden",
              boxShadow: "inset 0 2px 4px rgba(143, 170, 150, 0.1)"
            }}>
              {recentConversions.map((conversion, index) => (
                <div 
                  key={conversion.id} 
                  style={{ 
                    padding: 24, 
                    borderBottom: index < recentConversions.length - 1 ? "2px solid #e8f2ea" : "none",
                    transition: "all 0.3s ease",
                    position: "relative"
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #f5f8f5 0%, #e8f2ea 100%)";
                    (e.currentTarget as HTMLElement).style.transform = "translateX(8px)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 20 }}>
                    <div style={{ flex: 1 }}>
                      <div className="clean-text" style={{ 
                        fontSize: 14, 
                        color: "#6b7c6b", 
                        marginBottom: 12,
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                      }}>
                        <span style={{ fontSize: 16 }}>🕐</span>
                        {formatDate(conversion.timestamp)} • {conversion.program}
                      </div>
                      <div className="clean-text" style={{ 
                        fontSize: 13, 
                        wordBreak: "break-all",
                        color: "#3d5a3d",
                        fontFamily: "Monaco, Consolas, 'Courier New', monospace",
                        background: "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: "2px solid #d4d9c7",
                        lineHeight: "1.4",
                        boxShadow: "inset 0 2px 4px rgba(143, 170, 150, 0.1)"
                      }}>
                        {conversion.originalUrl}
                      </div>
                    </div>
                    <div style={{ 
                      background: "linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)", 
                      color: "#2f5233", 
                      padding: "10px 18px", 
                      borderRadius: 50,
                      fontSize: 13,
                      fontWeight: "600",
                      border: "2px solid #9ae6b4",
                      boxShadow: "0 4px 12px rgba(154, 230, 180, 0.3)",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}>
                      <span style={{ fontSize: 14 }}>🌱</span>
                      <span className="clean-text">Converted</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Component */}
        {user && <Dashboard user={user} />}
      </div>
    </div>
  )
}

export default OptionsPage
