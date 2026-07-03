import { useState, useRef } from "react";

// ─── Design Tokens ───────────────────────────────────────────────
// Palette: deep midnight navy + electric violet accent + soft pearl whites
// Signature: animated gradient "aura" behind the outfit rating reveal
const C = {
  bg: "#0A0B14",
  surface: "#12141F",
  card: "#1A1D2E",
  border: "#2A2D42",
  accent: "#7C5CFC",
  accentLight: "#A78BFA",
  accentGlow: "rgba(124,92,252,0.25)",
  gold: "#F5C518",
  success: "#22D3A0",
  danger: "#F43F5E",
  textPrimary: "#F0F0FF",
  textSecondary: "#8B8FA8",
  textMuted: "#4B4F6A",
  white: "#FFFFFF",
};

// ─── Onboarding Screens ───────────────────────────────────────────
const onboardingSlides = [
  {
    emoji: "✨",
    title: "Your AI Fashion Stylist",
    subtitle: "Upload your photo + any outfit and get an instant style rating from our AI — like having a personal stylist in your pocket.",
    cta: "Let's Go",
    bg: "linear-gradient(160deg, #1a0a3e 0%, #0A0B14 60%)",
  },
  {
    emoji: "👗",
    title: "See It Before You Wear It",
    subtitle: "Stop guessing. Get honest, detailed feedback on fit, color harmony, and overall vibe — before you step out the door.",
    cta: "Sounds Good",
    bg: "linear-gradient(160deg, #0d1a3e 0%, #0A0B14 60%)",
  },
  {
    emoji: "🏆",
    title: "Dress Like a 10 Every Day",
    subtitle: "Our AI has analyzed thousands of fashion trends. Get a score, style tips, and outfit alternatives — all in seconds.",
    cta: "Try It Free",
    bg: "linear-gradient(160deg, #1a0a2e 0%, #0A0B14 60%)",
  },
];

// ─── Sub-components ──────────────────────────────────────────────

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const slide = onboardingSlides[step];
  const isLast = step === onboardingSlides.length - 1;

  return (
    <div style={{
      minHeight: "100vh", background: slide.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "60px 28px 48px", fontFamily: "'Inter', sans-serif",
      transition: "background 0.5s ease",
    }}>
      {/* Skip */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onComplete} style={{
          background: "none", border: "none", color: C.textSecondary,
          fontSize: 14, cursor: "pointer", fontFamily: "inherit",
        }}>Skip</button>
      </div>

      {/* Content */}
      <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        {/* Animated emoji orb */}
        <div style={{
          width: 120, height: 120, borderRadius: "50%", margin: "0 auto",
          background: `radial-gradient(circle at 40% 40%, ${C.accentLight}, ${C.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 52,
          boxShadow: `0 0 60px ${C.accentGlow}, 0 0 120px rgba(124,92,252,0.1)`,
          animation: "pulse 3s ease-in-out infinite",
        }}>
          {slide.emoji}
        </div>

        <h1 style={{
          color: C.textPrimary, fontSize: 30, fontWeight: 800,
          letterSpacing: "-0.5px", margin: 0, lineHeight: 1.2,
        }}>{slide.title}</h1>

        <p style={{
          color: C.textSecondary, fontSize: 17, lineHeight: 1.65,
          margin: 0, maxWidth: 320,
        }}>{slide.subtitle}</p>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {onboardingSlides.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 24 : 8, height: 8, borderRadius: 4,
            background: i === step ? C.accent : C.border,
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => isLast ? onComplete() : setStep(s => s + 1)} style={{
        width: "100%", padding: "18px 0", borderRadius: 16,
        background: `linear-gradient(135deg, ${C.accent}, #9B6DFF)`,
        border: "none", color: C.white, fontSize: 18, fontWeight: 700,
        cursor: "pointer", letterSpacing: "0.3px",
        boxShadow: `0 8px 32px ${C.accentGlow}`,
        fontFamily: "inherit",
      }}>
        {slide.cta} →
      </button>

      <p style={{ color: C.textMuted, fontSize: 12, marginTop: 16, textAlign: "center" }}>
        No credit card required to start
      </p>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 0 60px rgba(124,92,252,0.25)} 50%{transform:scale(1.05);box-shadow:0 0 80px rgba(124,92,252,0.4)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes auraGrow { 0%{opacity:0;transform:scale(0.8)} 100%{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

function PaywallScreen({ onUnlock, onSkip }) {
  const [selected, setSelected] = useState("monthly");

  const plans = [
    { id: "weekly", label: "Weekly", price: "$14", per: "/ week", badge: null, saving: null },
    { id: "monthly", label: "Monthly", price: "$25", per: "/ month", badge: "Most Popular", saving: "Save 55%" },
    { id: "yearly", label: "Yearly", price: "$100", per: "/ year", badge: "Best Value", saving: "Save 76%" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: "'Inter', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 24px 36px",
    }}>
      {/* Header */}
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: `linear-gradient(135deg, ${C.accent}, #9B6DFF)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36, marginBottom: 20,
        boxShadow: `0 8px 32px ${C.accentGlow}`,
      }}>✨</div>

      <h2 style={{ color: C.textPrimary, fontSize: 28, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>
        Unlock SmartFit AI
      </h2>
      <p style={{ color: C.textSecondary, fontSize: 15, textAlign: "center", margin: "0 0 32px", maxWidth: 300 }}>
        Get unlimited outfit ratings, style tips, and fashion insights
      </p>

      {/* Features */}
      {["Unlimited AI outfit ratings", "Detailed color & fit analysis", "Style alternative suggestions", "Trend compatibility score"].map(f => (
        <div key={f} style={{
          display: "flex", alignItems: "center", gap: 12, width: "100%",
          maxWidth: 360, marginBottom: 10,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.accent}, #9B6DFF)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, flexShrink: 0,
          }}>✓</div>
          <span style={{ color: C.textPrimary, fontSize: 15 }}>{f}</span>
        </div>
      ))}

      <div style={{ height: 24 }} />

      {/* Plans */}
      {plans.map(plan => (
        <div key={plan.id} onClick={() => setSelected(plan.id)} style={{
          width: "100%", maxWidth: 360, marginBottom: 12, borderRadius: 16,
          border: `2px solid ${selected === plan.id ? C.accent : C.border}`,
          background: selected === plan.id ? `rgba(124,92,252,0.08)` : C.card,
          padding: "16px 20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "all 0.2s ease",
          boxShadow: selected === plan.id ? `0 0 0 4px rgba(124,92,252,0.12)` : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: `2px solid ${selected === plan.id ? C.accent : C.textMuted}`,
              background: selected === plan.id ? C.accent : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {selected === plan.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.white }} />}
            </div>
            <div>
              <div style={{ color: C.textPrimary, fontWeight: 700, fontSize: 15 }}>{plan.label}</div>
              {plan.saving && <div style={{ color: C.accentLight, fontSize: 12, fontWeight: 600 }}>{plan.saving}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ color: C.textPrimary, fontWeight: 800, fontSize: 20 }}>{plan.price}</span>
            <span style={{ color: C.textSecondary, fontSize: 13 }}> {plan.per}</span>
            {plan.badge && (
              <div style={{
                background: `linear-gradient(135deg, ${C.accent}, #9B6DFF)`,
                color: C.white, fontSize: 10, fontWeight: 700,
                padding: "2px 8px", borderRadius: 20, marginTop: 4, display: "inline-block",
              }}>{plan.badge}</div>
            )}
          </div>
        </div>
      ))}

      <div style={{ height: 8 }} />

      {/* CTA */}
      <button onClick={() => onUnlock(selected)} style={{
        width: "100%", maxWidth: 360, padding: "18px 0", borderRadius: 16,
        background: `linear-gradient(135deg, ${C.accent}, #9B6DFF)`,
        border: "none", color: C.white, fontSize: 18, fontWeight: 700,
        cursor: "pointer", letterSpacing: "0.3px",
        boxShadow: `0 8px 32px ${C.accentGlow}`, fontFamily: "inherit",
      }}>
        Start Free Trial →
      </button>

      <p style={{ color: C.textMuted, fontSize: 12, marginTop: 12, textAlign: "center" }}>
        Cancel anytime · Secure payment · No hidden fees
      </p>

      <button onClick={onSkip} style={{
        background: "none", border: "none", color: C.textMuted,
        fontSize: 13, cursor: "pointer", marginTop: 8, fontFamily: "inherit",
      }}>
        Continue without premium
      </button>
    </div>
  );
}

function UploadBox({ label, icon, image, onUpload }) {
  const id = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload({ dataUri: reader.result, mimeType: file.type || "image/jpeg" });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ color: C.textSecondary, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
        {label}
      </span>

      {/* Use <label htmlFor> — the only reliable way to open file picker inside sandboxed iframes */}
      <label htmlFor={id} style={{
        height: 170, borderRadius: 16,
        border: `2px dashed ${image ? C.accent : C.border}`,
        background: image ? "transparent" : C.card,
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", cursor: "pointer", overflow: "hidden",
        position: "relative", transition: "all 0.2s ease",
      }}>
        {image ? (
          <img src={image.dataUri} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
        ) : (
          <>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
            <span style={{ color: C.textMuted, fontSize: 13, textAlign: "center", padding: "0 12px" }}>
              Tap to upload
            </span>
          </>
        )}
        {image && (
          <div style={{
            position: "absolute", top: 6, right: 6,
            background: "rgba(0,0,0,0.6)", borderRadius: 20,
            padding: "2px 8px", color: C.white, fontSize: 11,
            pointerEvents: "none",
          }}>Change</div>
        )}
      </label>

      <input
        id={id}
        type="file"
        accept="image/*"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}

function RatingBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: C.textSecondary, fontSize: 13 }}>{label}</span>
        <span style={{ color: color || C.accentLight, fontWeight: 700, fontSize: 13 }}>{value}/10</span>
      </div>
      <div style={{ background: C.border, borderRadius: 8, height: 6, overflow: "hidden" }}>
        <div style={{
          width: `${value * 10}%`, height: "100%",
          background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
          borderRadius: 8, transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────
export default function SmartFitAI() {
  const [screen, setScreen] = useState("onboarding"); // onboarding | paywall | main
  const [selfieImg, setSelfieImg] = useState(null);
  const [outfitImg, setOutfitImg] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);

  const handleSwap = () => {
    const tmp = selfieImg;
    setSelfieImg(outfitImg);
    setOutfitImg(tmp);
    setResult(null);
    setError(null);
  };

  const handleRate = async () => {
    if (!selfieImg || !outfitImg) {
      setError("Please upload both a photo of yourself and your outfit.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      // Use base64 stored directly at upload time — no blob:// fetch needed
      const selfieB64 = selfieImg.dataUri.split(",")[1];
      const outfitB64 = outfitImg.dataUri.split(",")[1];
      const selfieMime = selfieImg.mimeType || "image/jpeg";
      const outfitMime = outfitImg.mimeType || "image/jpeg";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: selfieMime, data: selfieB64 },
              },
              {
                type: "image",
                source: { type: "base64", media_type: outfitMime, data: outfitB64 },
              },
              {
                type: "text",
                text: `You are SmartFit AI, an expert fashion stylist and image consultant. Analyze the first image (person) and the second image (outfit/clothing). Rate how well this outfit would look on this person and provide detailed fashion feedback. 

Respond ONLY with valid JSON in this exact format, no markdown:
{
  "overallScore": <number 1-10>,
  "scores": {
    "fitStyle": <number 1-10>,
    "colorHarmony": <number 1-10>,
    "trendScore": <number 1-10>,
    "versatility": <number 1-10>
  },
  "verdict": "<2-word punchy verdict like 'Style Icon' or 'Needs Work'>",
  "highlights": ["<positive point 1>", "<positive point 2>"],
  "improvements": ["<tip 1>", "<tip 2>"],
  "stylistNote": "<1-2 sentence personal note from the AI stylist>"
}`
              }
            ],
          }],
        }),
      });

      const data = await response.json();
      const text = data.content.map(b => b.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Couldn't analyze your outfit. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return C.success;
    if (score >= 6) return C.gold;
    return C.danger;
  };

  const getScoreEmoji = (score) => {
    if (score >= 9) return "🔥";
    if (score >= 7) return "✨";
    if (score >= 5) return "👍";
    return "💡";
  };

  if (screen === "onboarding") {
    return <OnboardingScreen onComplete={() => setScreen("paywall")} />;
  }

  if (screen === "paywall") {
    return <PaywallScreen
      onUnlock={(p) => { setPlan(p); setScreen("main"); }}
      onSkip={() => setScreen("main")}
    />;
  }

  // ── Main Screen ──
  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Inter', sans-serif", color: C.textPrimary,
      maxWidth: 480, margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes auraGrow { 0%{transform:scale(0.85);opacity:0} 100%{transform:scale(1);opacity:1} }
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "52px 24px 20px",
        background: `linear-gradient(180deg, rgba(124,92,252,0.12) 0%, transparent 100%)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px" }}>
              SmartFit <span style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>AI</span>
            </h1>
            <p style={{ margin: "4px 0 0", color: C.textSecondary, fontSize: 13 }}>
              Your personal AI fashion stylist
            </p>
          </div>
          {plan && (
            <div style={{
              background: `linear-gradient(135deg, ${C.accent}, #9B6DFF)`,
              padding: "4px 12px", borderRadius: 20,
              fontSize: 11, fontWeight: 700, color: C.white,
            }}>PRO</div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 24px 40px" }}>

        {/* Upload Section */}
        <div style={{
          background: C.surface, borderRadius: 20,
          border: `1px solid ${C.border}`, padding: "20px",
          marginBottom: 16,
        }}>
          <p style={{ color: C.textSecondary, fontSize: 13, margin: "0 0 16px", textAlign: "center" }}>
            Upload your photo & outfit to get rated
          </p>

          {/* Side-by-side upload boxes */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <UploadBox
              label="Your Photo"
              icon="🧍"
              image={selfieImg}
              onUpload={img => { setSelfieImg(img); setResult(null); setError(null); }}
            />
            <UploadBox
              label="The Outfit"
              icon="👗"
              image={outfitImg}
              onUpload={img => { setOutfitImg(img); setResult(null); setError(null); }}
            />
          </div>

          {/* Swap Button */}
          <button onClick={handleSwap} style={{
            width: "100%", padding: "12px 0", borderRadius: 12,
            background: C.card, border: `1px solid ${C.border}`,
            color: C.textSecondary, fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8, fontFamily: "inherit",
            transition: "all 0.2s ease",
          }}>
            <span style={{ fontSize: 18 }}>⇄</span> Swap Images
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(244,63,94,0.1)", border: `1px solid rgba(244,63,94,0.3)`,
            borderRadius: 12, padding: "12px 16px", marginBottom: 16,
            color: C.danger, fontSize: 14,
          }}>{error}</div>
        )}

        {/* Rate Button */}
        <button onClick={handleRate} disabled={loading} style={{
          width: "100%", padding: "18px 0", borderRadius: 16,
          background: loading
            ? C.border
            : `linear-gradient(135deg, ${C.accent}, #9B6DFF)`,
          border: "none", color: C.white, fontSize: 18, fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : `0 8px 32px ${C.accentGlow}`,
          fontFamily: "inherit", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10, marginBottom: 24,
          transition: "all 0.3s ease",
        }}>
          {loading ? (
            <>
              <div style={{
                width: 20, height: 20, border: `2px solid rgba(255,255,255,0.3)`,
                borderTopColor: C.white, borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              Analyzing your style…
            </>
          ) : "✨ Rate This Outfit"}
        </button>

        {/* Result Card */}
        {result && (
          <div style={{ animation: "auraGrow 0.5s ease forwards" }}>

            {/* Score Hero */}
            <div style={{
              background: `radial-gradient(ellipse at 50% 0%, rgba(124,92,252,0.2) 0%, ${C.surface} 70%)`,
              border: `1px solid ${C.border}`, borderRadius: 24,
              padding: "32px 24px 24px", marginBottom: 16, textAlign: "center",
            }}>
              <div style={{
                width: 100, height: 100, borderRadius: "50%", margin: "0 auto 16px",
                background: `conic-gradient(${getScoreColor(result.overallScore)} ${result.overallScore * 36}deg, ${C.border} 0)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: C.surface, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 24 }}>{getScoreEmoji(result.overallScore)}</span>
                  <span style={{
                    color: getScoreColor(result.overallScore),
                    fontSize: 20, fontWeight: 900, lineHeight: 1,
                  }}>{result.overallScore}</span>
                  <span style={{ color: C.textMuted, fontSize: 9 }}>/ 10</span>
                </div>
              </div>

              <div style={{
                color: C.textPrimary, fontSize: 24, fontWeight: 800,
                marginBottom: 4,
              }}>{result.verdict}</div>
              <div style={{ color: C.textSecondary, fontSize: 14 }}>
                {result.stylistNote}
              </div>
            </div>

            {/* Scores Breakdown */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 20, padding: "20px 20px 12px", marginBottom: 16,
            }}>
              <h3 style={{ color: C.textPrimary, fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>
                Style Breakdown
              </h3>
              <RatingBar label="Fit & Style" value={result.scores.fitStyle} />
              <RatingBar label="Color Harmony" value={result.scores.colorHarmony} />
              <RatingBar label="Trend Score" value={result.scores.trendScore} />
              <RatingBar label="Versatility" value={result.scores.versatility} />
            </div>

            {/* Highlights */}
            <div style={{
              background: "rgba(34,211,160,0.06)", border: `1px solid rgba(34,211,160,0.2)`,
              borderRadius: 20, padding: "18px 20px", marginBottom: 12,
            }}>
              <h3 style={{ color: C.success, fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>
                ✅ What's Working
              </h3>
              {result.highlights.map((h, i) => (
                <p key={i} style={{ color: C.textPrimary, fontSize: 14, margin: "0 0 6px", lineHeight: 1.5 }}>
                  · {h}
                </p>
              ))}
            </div>

            {/* Improvements */}
            <div style={{
              background: "rgba(124,92,252,0.06)", border: `1px solid rgba(124,92,252,0.2)`,
              borderRadius: 20, padding: "18px 20px", marginBottom: 24,
            }}>
              <h3 style={{ color: C.accentLight, fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>
                💡 Style Tips
              </h3>
              {result.improvements.map((t, i) => (
                <p key={i} style={{ color: C.textPrimary, fontSize: 14, margin: "0 0 6px", lineHeight: 1.5 }}>
                  · {t}
                </p>
              ))}
            </div>

            {/* Rate another */}
            <button onClick={() => { setSelfieImg(null); setOutfitImg(null); setResult(null); }} style={{
              width: "100%", padding: "16px 0", borderRadius: 16,
              background: C.card, border: `1px solid ${C.border}`,
              color: C.textSecondary, fontSize: 16, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Try Another Outfit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
