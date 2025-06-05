
import { useState, useEffect } from "react"
import { UserService } from "~src/services/user-service"
import { AFFILIATE_PROGRAMS } from "~src/config/affiliate-programs"
import type { LinkConversion } from "~src/types"

interface DashboardProps {
  user: any
}

export const Dashboard = ({ user }: DashboardProps) => {
  const [conversions, setConversions] = useState<LinkConversion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalConversions: 0,
    thisWeek: 0,
    thisMonth: 0,
    byProgram: {} as Record<string, number>
  })

  // Add Studio Ghibli styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .dashboard-card {
        background: linear-gradient(135deg, #faf8f5 0%, #f0f4f1 50%, #e8f2ea 100%);
        border: 2px solid #d4d9c7;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .dashboard-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(143, 170, 150, 0.2);
        border-color: #c1d4c1;
      }
      
      .stat-card {
        background: linear-gradient(135deg, #8faa96 0%, #a8bfaa 100%);
        color: white;
        border-radius: 18px;
        text-align: center;
        position: relative;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 24px rgba(143, 170, 150, 0.3);
      }
      
      .stat-card::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
        animation: gentleFloat 12s ease-in-out infinite;
        pointer-events: none;
      }
      
      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-8px) rotate(2deg); }
      }
      
      .activity-item {
        background: linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%);
        border: 1px solid #e8f2ea;
        transition: all 0.2s ease;
      }
      
      .activity-item:hover {
        background: linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%);
        transform: translateX(4px);
        border-color: #d4d9c7;
      }
      
      .program-item {
        background: linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%);
        border: 1px solid #d4d9c7;
        border-radius: 14px;
        transition: all 0.2s ease;
      }
      
      .program-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(143, 170, 150, 0.2);
        border-color: #c1d4c1;
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
    if (user) {
      loadConversions()
    }
  }, [user])

  const loadConversions = async () => {
    try {
      const userService = UserService.getInstance()
      const recentConversions = await userService.getRecentConversions(50)
      setConversions(recentConversions)
      calculateStats(recentConversions)
    } catch (error) {
      console.error("Error loading conversions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (conversions: LinkConversion[]) => {
    const now = Date.now()
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const oneMonth = 30 * 24 * 60 * 60 * 1000

    const thisWeek = conversions.filter(c => (now - c.timestamp) < oneWeek).length
    const thisMonth = conversions.filter(c => (now - c.timestamp) < oneMonth).length

    const byProgram: Record<string, number> = {}
    conversions.forEach(c => {
      byProgram[c.program] = (byProgram[c.program] || 0) + 1
    })

    setStats({
      totalConversions: conversions.length,
      thisWeek,
      thisMonth,
      byProgram
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const getProgramName = (programId: string) => {
    const program = AFFILIATE_PROGRAMS.find(p => p.id === programId)
    return program ? program.name : programId
  }

  const getProgramIcon = (programId: string) => {
    const program = AFFILIATE_PROGRAMS.find(p => p.id === programId)
    return program ? program.icon : "🔗"
  }

  if (isLoading) {
    return (
      <div className="dashboard-card clean-text" style={{ 
        textAlign: "center", 
        padding: 40,
        position: "relative"
      }}>
        {/* Floating decorative element */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "25px",
          fontSize: "20px",
          opacity: 0.4,
          animation: "gentleFloat 10s ease-in-out infinite"
        }}>🍃</div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: 12,
          color: "#3d5a3d"
        }}>
          <div style={{ 
            width: 24, 
            height: 24, 
            border: "3px solid #e8f2ea",
            borderTop: "3px solid #8faa96",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <span style={{ fontSize: 16, fontWeight: "500" }}>Loading your magical dashboard...</span>
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
    <div className="dashboard-card" style={{ 
      marginTop: 40,
      padding: 48,
      position: "relative"
    }}>
      {/* Decorative corner elements */}
      <div style={{
        position: "absolute",
        top: "25px",
        right: "30px",
        fontSize: "20px",
        opacity: 0.2,
        transform: "rotate(15deg)"
      }}>📊</div>
      <div style={{
        position: "absolute",
        bottom: "25px",
        left: "30px",
        fontSize: "18px",
        opacity: 0.2,
        transform: "rotate(-20deg)"
      }}>✨</div>
      
      <h2 className="storybook-text" style={{ 
        fontSize: 28, 
        marginBottom: 32, 
        color: "#3d5a3d",
        textAlign: "center",
        fontWeight: "600",
        textShadow: "0 2px 4px rgba(143, 170, 150, 0.1)"
      }}>
        🌟 Your Magical Dashboard
      </h2>
      
      {/* Stats Overview */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 24,
        marginBottom: 40
      }}>
        <div className="stat-card" style={{ 
          background: "linear-gradient(135deg, #8faa96 0%, #a8bfaa 100%)",
          padding: 28
        }}>
          <div style={{ fontSize: 36, fontWeight: "bold", marginBottom: 8, position: "relative", zIndex: 1 }}>
            {stats.totalConversions}
          </div>
          <div className="clean-text" style={{ fontSize: 14, opacity: 0.9, position: "relative", zIndex: 1 }}>
            🌱 Total Conversions
          </div>
        </div>

        <div className="stat-card" style={{ 
          background: "linear-gradient(135deg, #a8bfaa 0%, #c1d4c1 100%)",
          padding: 28
        }}>
          <div style={{ fontSize: 36, fontWeight: "bold", marginBottom: 8, position: "relative", zIndex: 1 }}>
            {stats.thisWeek}
          </div>
          <div className="clean-text" style={{ fontSize: 14, opacity: 0.9, position: "relative", zIndex: 1 }}>
            🌸 This Week
          </div>
        </div>

        <div className="stat-card" style={{ 
          background: "linear-gradient(135deg, #6b8e6b 0%, #8faa96 100%)",
          padding: 28
        }}>
          <div style={{ fontSize: 36, fontWeight: "bold", marginBottom: 8, position: "relative", zIndex: 1 }}>
            {stats.thisMonth}
          </div>
          <div className="clean-text" style={{ fontSize: 14, opacity: 0.9, position: "relative", zIndex: 1 }}>
            🍃 This Month
          </div>
        </div>
      </div>

      {/* Program Breakdown */}
      {Object.keys(stats.byProgram).length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3 className="storybook-text" style={{ 
            fontSize: 20, 
            marginBottom: 20, 
            color: "#3d5a3d",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            🌺 By Program
          </h3>
          <div style={{ 
            display: "grid", 
            gap: 16
          }}>
            {Object.entries(stats.byProgram).map(([program, count]) => (
              <div key={program} className="program-item" style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                padding: 18
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    fontSize: 24,
                    padding: 8,
                    background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
                    borderRadius: 12,
                    border: "2px solid #e8f2ea",
                    boxShadow: "0 2px 8px rgba(143, 170, 150, 0.15)"
                  }}>
                    {getProgramIcon(program)}
                  </div>
                  <span className="clean-text" style={{ 
                    fontSize: 16, 
                    color: "#3d5a3d", 
                    fontWeight: "500" 
                  }}>
                    {getProgramName(program)}
                  </span>
                </div>
                <div style={{ 
                  background: "linear-gradient(135deg, #8faa96 0%, #a8bfaa 100%)",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: "600",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 4px 12px rgba(143, 170, 150, 0.3)",
                  border: "2px solid rgba(255, 255, 255, 0.2)"
                }}>
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {conversions.length > 0 && (
        <div>
          <h3 className="storybook-text" style={{ 
            fontSize: 20, 
            marginBottom: 20, 
            color: "#3d5a3d",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            🦋 Recent Activity
          </h3>
          <div style={{ 
            border: "2px solid #e8f2ea", 
            borderRadius: 16, 
            background: "linear-gradient(135deg, #fdfcf8 0%, #f5f2ed 100%)",
            overflow: "hidden",
            maxHeight: 400,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(143, 170, 150, 0.15)"
          }}>
            {conversions.slice(0, 10).map((conversion, index) => (
              <div 
                key={conversion.id} 
                className="activity-item"
                style={{ 
                  padding: 20, 
                  borderBottom: index < 9 && index < conversions.length - 1 ? "1px solid #e8f2ea" : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 10,
                      marginBottom: 8 
                    }}>
                      <div style={{
                        fontSize: 20,
                        padding: 6,
                        background: "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)",
                        borderRadius: 10,
                        border: "1px solid #d4d9c7"
                      }}>
                        {getProgramIcon(conversion.program)}
                      </div>
                      <span className="clean-text" style={{ fontSize: 13, color: "#6b7c6b", fontWeight: "500" }}>
                        {formatDate(conversion.timestamp)} • {getProgramName(conversion.program)}
                      </span>
                    </div>
                    <div className="clean-text" style={{  
                      wordBreak: "break-all",
                      color: "#3d5a3d",
                      padding: 12,
                      background: "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)",
                      borderRadius: 10,
                      border: "1px solid #d4d9c7",
                      fontFamily: "monospace",
                      fontSize: 12
                    }}>
                      {conversion.originalUrl}
                    </div>
                  </div>
                  <div style={{ 
                    background: "linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%)", 
                    color: "#2f5233", 
                    padding: "8px 16px", 
                    borderRadius: 20,
                    fontSize: 12,
                    marginLeft: 16,
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    fontFamily: "'Inter', sans-serif",
                    border: "2px solid rgba(47, 82, 51, 0.1)",
                    boxShadow: "0 2px 8px rgba(154, 230, 180, 0.3)"
                  }}>
                    🌱 Converted
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {conversions.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: 48,
          background: "linear-gradient(135deg, #f0f4f1 0%, #e8f2ea 100%)",
          borderRadius: 20,
          border: "2px solid #d4d9c7",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative elements */}
          <div style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            fontSize: "16px",
            opacity: 0.2,
            animation: "gentleFloat 10s ease-in-out infinite"
          }}>🍃</div>
          <div style={{
            position: "absolute",
            bottom: "20px",
            right: "30px",
            fontSize: "14px",
            opacity: 0.2,
            animation: "gentleFloat 12s ease-in-out infinite reverse"
          }}>✨</div>
          
          <div style={{ fontSize: 64, marginBottom: 20, filter: "drop-shadow(0 4px 8px rgba(143, 170, 150, 0.2))" }}>📊</div>
          <div className="storybook-text" style={{ 
            fontSize: 20, 
            marginBottom: 12, 
            color: "#3d5a3d", 
            fontWeight: "600" 
          }}>
            Your magical journey begins here!
          </div>
          <div className="clean-text" style={{ 
            fontSize: 16, 
            color: "#6b7c6b",
            lineHeight: "1.6",
            maxWidth: 400,
            margin: "0 auto"
          }}>
            Start pasting affiliate links in your content to see them transform into beautiful conversions here! ✨
          </div>
        </div>
      )}
    </div>
  )
}
