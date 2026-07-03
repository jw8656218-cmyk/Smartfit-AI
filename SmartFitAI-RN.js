import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, ScrollView,
  StyleSheet, SafeAreaView, ActivityIndicator,
  Alert, Platform, Animated
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Design Tokens ───────────────────────────────────────────────
const C = {
  bg: '#0A0B14',
  surface: '#12141F',
  card: '#1A1D2E',
  border: '#2A2D42',
  accent: '#7C5CFC',
  accentLight: '#A78BFA',
  gold: '#F5C518',
  success: '#22D3A0',
  danger: '#F43F5E',
  textPrimary: '#F0F0FF',
  textSecondary: '#8B8FA8',
  textMuted: '#4B4F6A',
  white: '#FFFFFF',
};

// ─── Onboarding ──────────────────────────────────────────────────
const slides = [
  {
    emoji: '✨',
    title: 'Your AI Fashion Stylist',
    subtitle: 'Upload your photo + any outfit and get an instant style rating — like having a personal stylist in your pocket.',
    cta: "Let's Go",
  },
  {
    emoji: '👗',
    title: 'See It Before You Wear It',
    subtitle: 'Get honest feedback on fit, color harmony, and overall vibe — before you step out the door.',
    cta: 'Sounds Good',
  },
  {
    emoji: '🏆',
    title: 'Dress Like a 10 Every Day',
    subtitle: 'Our AI has studied thousands of fashion trends. Get a score, style tips, and alternatives — in seconds.',
    cta: 'Try It Free',
  },
];

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <LinearGradient colors={['#1a0a3e', '#0A0B14']} style={s.flex}>
      <SafeAreaView style={[s.flex, s.onboardWrap]}>
        <TouchableOpacity onPress={onComplete} style={s.skipBtn}>
          <Text style={s.skipTxt}>Skip</Text>
        </TouchableOpacity>

        <View style={s.onboardCenter}>
          <LinearGradient colors={[C.accentLight, C.accent]} style={s.orb}>
            <Text style={s.orbEmoji}>{slide.emoji}</Text>
          </LinearGradient>
          <Text style={s.onboardTitle}>{slide.title}</Text>
          <Text style={s.onboardSub}>{slide.subtitle}</Text>
        </View>

        <View style={s.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[s.dot, i === step && s.dotActive]} />
          ))}
        </View>

        <TouchableOpacity onPress={() => isLast ? onComplete() : setStep(s => s + 1)}>
          <LinearGradient colors={[C.accent, '#9B6DFF']} style={s.ctaBtn}>
            <Text style={s.ctaTxt}>{slide.cta} →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={s.noCc}>No credit card required to start</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Paywall ─────────────────────────────────────────────────────
const plans = [
  { id: 'weekly',  label: 'Weekly',  price: '$14', per: '/ week',  badge: null,          saving: null },
  { id: 'monthly', label: 'Monthly', price: '$25', per: '/ month', badge: 'Most Popular', saving: 'Save 55%' },
  { id: 'yearly',  label: 'Yearly',  price: '$100', per: '/ year', badge: 'Best Value',   saving: 'Save 76%' },
];
const features = [
  'Unlimited AI outfit ratings',
  'Detailed color & fit analysis',
  'Style alternative suggestions',
  'Trend compatibility score',
];

function PaywallScreen({ onUnlock, onSkip }) {
  const [selected, setSelected] = useState('monthly');

  return (
    <SafeAreaView style={[s.flex, { backgroundColor: C.bg }]}>
      <ScrollView contentContainerStyle={s.paywallWrap} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[C.accent, '#9B6DFF']} style={s.paywallIcon}>
          <Text style={{ fontSize: 36 }}>✨</Text>
        </LinearGradient>
        <Text style={s.paywallTitle}>Unlock SmartFit AI</Text>
        <Text style={s.paywallSub}>Get unlimited outfit ratings, style tips, and fashion insights</Text>

        {features.map(f => (
          <View key={f} style={s.featureRow}>
            <LinearGradient colors={[C.accent, '#9B6DFF']} style={s.featureCheck}>
              <Text style={{ color: C.white, fontSize: 11, fontWeight: '700' }}>✓</Text>
            </LinearGradient>
            <Text style={s.featureTxt}>{f}</Text>
          </View>
        ))}

        <View style={{ height: 20 }} />

        {plans.map(plan => (
          <TouchableOpacity key={plan.id} onPress={() => setSelected(plan.id)}
            style={[s.planCard, selected === plan.id && s.planCardSelected]}>
            <View style={s.planLeft}>
              <View style={[s.radio, selected === plan.id && s.radioSelected]}>
                {selected === plan.id && <View style={s.radioDot} />}
              </View>
              <View>
                <Text style={s.planLabel}>{plan.label}</Text>
                {plan.saving && <Text style={s.planSaving}>{plan.saving}</Text>}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.planPrice}>{plan.price}<Text style={s.planPer}> {plan.per}</Text></Text>
              {plan.badge && (
                <LinearGradient colors={[C.accent, '#9B6DFF']} style={s.badge}>
                  <Text style={s.badgeTxt}>{plan.badge}</Text>
                </LinearGradient>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => onUnlock(selected)}>
          <LinearGradient colors={[C.accent, '#9B6DFF']} style={s.ctaBtn}>
            <Text style={s.ctaTxt}>Start Free Trial →</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={s.noCc}>Cancel anytime · Secure payment · No hidden fees</Text>
        <TouchableOpacity onPress={onSkip}>
          <Text style={[s.noCc, { marginTop: 4 }]}>Continue without premium</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Upload Box ───────────────────────────────────────────────────
function UploadBox({ label, icon, image, onUpload }) {
  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to upload images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onUpload({ uri: asset.uri, base64: asset.base64, mimeType: asset.mimeType || 'image/jpeg' });
    }
  };

  return (
    <View style={s.uploadWrap}>
      <Text style={s.uploadLabel}>{label}</Text>
      <TouchableOpacity onPress={pick}
        style={[s.uploadBox, image && { borderColor: C.accent, borderStyle: 'solid' }]}>
        {image ? (
          <>
            <Image source={{ uri: image.uri }} style={s.uploadImg} />
            <View style={s.changeTag}><Text style={{ color: C.white, fontSize: 10 }}>Change</Text></View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 30, marginBottom: 6 }}>{icon}</Text>
            <Text style={s.uploadHint}>Tap to upload</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Rating Bar ───────────────────────────────────────────────────
function RatingBar({ label, value }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <View style={s.barHeader}>
        <Text style={s.barLabel}>{label}</Text>
        <Text style={[s.barValue, { color: C.accentLight }]}>{value}/10</Text>
      </View>
      <View style={s.barTrack}>
        <LinearGradient colors={[C.accent, C.accentLight]}
          style={[s.barFill, { width: `${value * 10}%` }]} />
      </View>
    </View>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('onboarding');
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
      setError('Please upload both a photo of yourself and your outfit.');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      // Get base64 — ImagePicker already gives us base64 when base64:true
      let selfieB64 = selfieImg.base64;
      let outfitB64 = outfitImg.base64;

      // Fallback: read from filesystem if base64 not available
      if (!selfieB64) selfieB64 = await FileSystem.readAsStringAsync(selfieImg.uri, { encoding: FileSystem.EncodingType.Base64 });
      if (!outfitB64) outfitB64 = await FileSystem.readAsStringAsync(outfitImg.uri, { encoding: FileSystem.EncodingType.Base64 });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: selfieImg.mimeType, data: selfieB64 } },
              { type: 'image', source: { type: 'base64', media_type: outfitImg.mimeType, data: outfitB64 } },
              {
                type: 'text',
                text: `You are SmartFit AI, an expert fashion stylist. Analyze the first image (person) and second image (outfit). Rate how well this outfit suits this person.

Respond ONLY with valid JSON, no markdown:
{
  "overallScore": <1-10>,
  "scores": { "fitStyle": <1-10>, "colorHarmony": <1-10>, "trendScore": <1-10>, "versatility": <1-10> },
  "verdict": "<2-word verdict>",
  "highlights": ["<positive 1>", "<positive 2>"],
  "improvements": ["<tip 1>", "<tip 2>"],
  "stylistNote": "<1-2 sentence stylist note>"
}`
              }
            ]
          }]
        })
      });

      const data = await response.json();
      const text = data.content.map(b => b.text || '').join('');
      const clean = text.replace(/```json|```/g, '').trim();
      setResult(JSON.parse(clean));
    } catch (err) {
      setError('Couldn\'t analyze your outfit. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (v) => v >= 8 ? C.success : v >= 6 ? C.gold : C.danger;
  const scoreEmoji = (v) => v >= 9 ? '🔥' : v >= 7 ? '✨' : v >= 5 ? '👍' : '💡';

  if (screen === 'onboarding') return <OnboardingScreen onComplete={() => setScreen('paywall')} />;
  if (screen === 'paywall') return <PaywallScreen onUnlock={(p) => { setPlan(p); setScreen('main'); }} onSkip={() => setScreen('main')} />;

  return (
    <SafeAreaView style={[s.flex, { backgroundColor: C.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['rgba(124,92,252,0.15)', 'transparent']} style={s.header}>
          <View>
            <Text style={s.headerTitle}>SmartFit <Text style={{ color: C.accent }}>AI</Text></Text>
            <Text style={s.headerSub}>Your personal AI fashion stylist</Text>
          </View>
          {plan && (
            <LinearGradient colors={[C.accent, '#9B6DFF']} style={s.proBadge}>
              <Text style={s.proBadgeTxt}>PRO</Text>
            </LinearGradient>
          )}
        </LinearGradient>

        <View style={s.body}>
          {/* Upload Card */}
          <View style={s.card}>
            <Text style={s.cardHint}>Upload your photo & outfit to get rated</Text>

            {/* Side by side boxes */}
            <View style={s.uploadRow}>
              <UploadBox label="Your Photo" icon="🧍" image={selfieImg}
                onUpload={img => { setSelfieImg(img); setResult(null); setError(null); }} />
              <UploadBox label="The Outfit" icon="👗" image={outfitImg}
                onUpload={img => { setOutfitImg(img); setResult(null); setError(null); }} />
            </View>

            {/* Swap */}
            <TouchableOpacity onPress={handleSwap} style={s.swapBtn}>
              <Text style={s.swapTxt}>⇄  Swap Images</Text>
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error && (
            <View style={s.errorBox}>
              <Text style={{ color: C.danger, fontSize: 14 }}>{error}</Text>
            </View>
          )}

          {/* Rate Button */}
          <TouchableOpacity onPress={handleRate} disabled={loading}>
            <LinearGradient
              colors={loading ? [C.border, C.border] : [C.accent, '#9B6DFF']}
              style={s.rateBtn}>
              {loading
                ? <ActivityIndicator color={C.white} />
                : <Text style={s.rateTxt}>✨  Rate This Outfit</Text>}
            </LinearGradient>
          </TouchableOpacity>

          {/* Results */}
          {result && (
            <View>
              {/* Score Hero */}
              <View style={s.resultHero}>
                <View style={[s.scoreDial, { borderColor: scoreColor(result.overallScore) }]}>
                  <Text style={{ fontSize: 22 }}>{scoreEmoji(result.overallScore)}</Text>
                  <Text style={[s.scoreNum, { color: scoreColor(result.overallScore) }]}>{result.overallScore}</Text>
                  <Text style={s.scoreDenom}>/10</Text>
                </View>
                <Text style={s.verdict}>{result.verdict}</Text>
                <Text style={s.stylistNote}>{result.stylistNote}</Text>
              </View>

              {/* Breakdown */}
              <View style={s.section}>
                <Text style={s.sectionTitle}>Style Breakdown</Text>
                <RatingBar label="Fit & Style" value={result.scores.fitStyle} />
                <RatingBar label="Color Harmony" value={result.scores.colorHarmony} />
                <RatingBar label="Trend Score" value={result.scores.trendScore} />
                <RatingBar label="Versatility" value={result.scores.versatility} />
              </View>

              {/* Highlights */}
              <View style={[s.section, s.sectionGreen]}>
                <Text style={[s.sectionTitle, { color: C.success }]}>✅ What's Working</Text>
                {result.highlights.map((h, i) => (
                  <Text key={i} style={s.bulletTxt}>· {h}</Text>
                ))}
              </View>

              {/* Tips */}
              <View style={[s.section, s.sectionPurple]}>
                <Text style={[s.sectionTitle, { color: C.accentLight }]}>💡 Style Tips</Text>
                {result.improvements.map((t, i) => (
                  <Text key={i} style={s.bulletTxt}>· {t}</Text>
                ))}
              </View>

              {/* Reset */}
              <TouchableOpacity onPress={() => { setSelfieImg(null); setOutfitImg(null); setResult(null); }}
                style={s.resetBtn}>
                <Text style={s.resetTxt}>Try Another Outfit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  flex: { flex: 1 },

  // Onboarding
  onboardWrap: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 32, alignItems: 'center', justifyContent: 'space-between' },
  skipBtn: { alignSelf: 'flex-end', padding: 8 },
  skipTxt: { color: C.textSecondary, fontSize: 14 },
  onboardCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  orb: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  orbEmoji: { fontSize: 50 },
  onboardTitle: { color: C.textPrimary, fontSize: 28, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
  onboardSub: { color: C.textSecondary, fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 8 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotActive: { width: 24, backgroundColor: C.accent },
  ctaBtn: { borderRadius: 16, paddingVertical: 18, paddingHorizontal: 32, alignItems: 'center', width: '100%' },
  ctaTxt: { color: C.white, fontSize: 18, fontWeight: '700', letterSpacing: 0.3 },
  noCc: { color: C.textMuted, fontSize: 12, marginTop: 14, textAlign: 'center' },

  // Paywall
  paywallWrap: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 36, alignItems: 'center' },
  paywallIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  paywallTitle: { color: C.textPrimary, fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  paywallSub: { color: C.textSecondary, fontSize: 15, textAlign: 'center', marginBottom: 28, maxWidth: 300 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%', maxWidth: 360, marginBottom: 10 },
  featureCheck: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  featureTxt: { color: C.textPrimary, fontSize: 15 },
  planCard: { width: '100%', maxWidth: 360, marginBottom: 12, borderRadius: 16, borderWidth: 2, borderColor: C.border, backgroundColor: C.card, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planCardSelected: { borderColor: C.accent, backgroundColor: 'rgba(124,92,252,0.08)' },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.textMuted, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: C.accent, backgroundColor: C.accent },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.white },
  planLabel: { color: C.textPrimary, fontWeight: '700', fontSize: 15 },
  planSaving: { color: C.accentLight, fontSize: 12, fontWeight: '600' },
  planPrice: { color: C.textPrimary, fontWeight: '800', fontSize: 20 },
  planPer: { color: C.textSecondary, fontSize: 13, fontWeight: '400' },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4, alignSelf: 'flex-end' },
  badgeTxt: { color: C.white, fontSize: 10, fontWeight: '700' },

  // Main
  header: { paddingTop: 20, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: C.textPrimary, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: C.textSecondary, fontSize: 13, marginTop: 2 },
  proBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  proBadgeTxt: { color: C.white, fontSize: 11, fontWeight: '700' },
  body: { paddingHorizontal: 16, paddingBottom: 40 },
  card: { backgroundColor: C.surface, borderRadius: 20, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 14 },
  cardHint: { color: C.textSecondary, fontSize: 13, textAlign: 'center', marginBottom: 14 },
  uploadRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  uploadWrap: { flex: 1 },
  uploadLabel: { color: C.textSecondary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  uploadBox: { height: 160, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: C.border, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  uploadImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadHint: { color: C.textMuted, fontSize: 12 },
  changeTag: { position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  swapBtn: { borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.card, paddingVertical: 12, alignItems: 'center' },
  swapTxt: { color: C.textSecondary, fontSize: 14, fontWeight: '600' },
  errorBox: { backgroundColor: 'rgba(244,63,94,0.1)', borderWidth: 1, borderColor: 'rgba(244,63,94,0.3)', borderRadius: 12, padding: 12, marginBottom: 12 },
  rateBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 20 },
  rateTxt: { color: C.white, fontSize: 18, fontWeight: '700' },

  // Results
  resultHero: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 24, padding: 24, marginBottom: 14, alignItems: 'center' },
  scoreDial: { width: 100, height: 100, borderRadius: 50, borderWidth: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  scoreNum: { fontSize: 28, fontWeight: '900', lineHeight: 30 },
  scoreDenom: { color: C.textMuted, fontSize: 11 },
  verdict: { color: C.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  stylistNote: { color: C.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  section: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 18, marginBottom: 12 },
  sectionGreen: { backgroundColor: 'rgba(34,211,160,0.06)', borderColor: 'rgba(34,211,160,0.2)' },
  sectionPurple: { backgroundColor: 'rgba(124,92,252,0.06)', borderColor: 'rgba(124,92,252,0.2)' },
  sectionTitle: { color: C.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  bulletTxt: { color: C.textPrimary, fontSize: 14, lineHeight: 22, marginBottom: 4 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  barLabel: { color: C.textSecondary, fontSize: 13 },
  barValue: { fontSize: 13, fontWeight: '700' },
  barTrack: { backgroundColor: C.border, borderRadius: 6, height: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  resetBtn: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  resetTxt: { color: C.textSecondary, fontSize: 16, fontWeight: '600' },
});
