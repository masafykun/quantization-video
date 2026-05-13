import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const ACCENT = '#FF6B6B';
const BG = '#0F1117';
const TEXT = '#E8E8E8';
const DIM = '#888';
const GREEN = '#4ECDC4';
const YELLOW = '#FFE66D';

function FadeIn({ children, startFrame = 0, duration = 20 }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <div style={{ opacity }}>{children}</div>;
}

// Scene 1: タイトル (0-90f = 3秒)
function TitleScene() {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, from: 0.8, to: 1, durationInFrames: 40 });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ transform: `scale(${scale})`, textAlign: 'center' }}>
        <div style={{ fontSize: 52, fontWeight: 'bold', color: ACCENT, fontFamily: 'sans-serif', lineHeight: 1.3 }}>
          量子化って何？
        </div>
        <FadeIn startFrame={25}>
          <div style={{ fontSize: 26, color: DIM, marginTop: 20, fontFamily: 'sans-serif' }}>
            AIは「りんご」をどう認識してるのか
          </div>
        </FadeIn>
        <FadeIn startFrame={45}>
          <div style={{ fontSize: 18, color: DIM, marginTop: 40, fontFamily: 'sans-serif' }}>
            5GBと56GBで何が違う？
          </div>
        </FadeIn>
      </div>
    </AbsoluteFill>
  );
}

// Scene 2: 量子化の説明 (90-210f = 4秒)
function WhatIsQuantization() {
  const frame = useCurrentFrame();
  const localFrame = frame - 90;

  const numbers = [
    { val: '3.14159265358979', label: 'float32（元の精度）', color: GREEN },
    { val: '3.1416', label: 'float16', color: YELLOW },
    { val: '3.1', label: 'Q8（8bit）', color: '#FFA07A' },
    { val: '3', label: 'Q4（4bit）', color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: 80, flexDirection: 'column', justifyContent: 'center' }}>
      <FadeIn startFrame={0}>
        <div style={{ fontSize: 36, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif', marginBottom: 16 }}>
          量子化 ＝ 数値を「丸める」技術
        </div>
        <div style={{ fontSize: 20, color: DIM, fontFamily: 'sans-serif', marginBottom: 48 }}>
          量子力学とは無関係。精度を落としてファイルを小さくする。
        </div>
      </FadeIn>
      {numbers.map((n, i) => {
        const startF = 20 + i * 20;
        const opacity = interpolate(localFrame, [startF, startF + 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const translateX = interpolate(localFrame, [startF, startF + 15], [-30, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{ opacity, transform: `translateX(${translateX}px)`, display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 28, color: n.color, width: 340 }}>
              {n.val}
            </div>
            <div style={{ fontSize: 18, color: DIM, fontFamily: 'sans-serif' }}>← {n.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// Scene 3: サイズ比較表 (210-360f = 5秒)
function SizeTable() {
  const frame = useCurrentFrame();
  const localFrame = frame - 210;

  const rows = [
    { fmt: 'float32', size: '56GB', vram: '高性能サーバー', color: '#666', bar: 1.0 },
    { fmt: 'float16', size: '28GB', vram: '高級GPU必要', color: '#888', bar: 0.5 },
    { fmt: 'Q8（8bit）', size: '14GB', vram: 'ギリギリ', color: YELLOW, bar: 0.25 },
    { fmt: 'Q4（4bit）', size: '9GB', vram: '家庭用GPUで動く', color: GREEN, bar: 0.16 },
    { fmt: 'Q2（2bit）', size: '5GB', vram: '精度は落ちる', color: ACCENT, bar: 0.09 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: 60, flexDirection: 'column', justifyContent: 'center' }}>
      <FadeIn startFrame={0}>
        <div style={{ fontSize: 34, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif', marginBottom: 8 }}>
          量子化するとどれくらい小さくなる？
        </div>
        <div style={{ fontSize: 18, color: DIM, fontFamily: 'sans-serif', marginBottom: 40 }}>
          Qwen2.5 14Bモデルの場合
        </div>
      </FadeIn>
      {rows.map((r, i) => {
        const startF = 15 + i * 18;
        const barWidth = interpolate(localFrame, [startF, startF + 25], [0, r.bar * 400], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(localFrame, [startF, startF + 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{ opacity, display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 20, color: r.color, width: 160 }}>{r.fmt}</div>
            <div style={{ height: 28, width: barWidth, backgroundColor: r.color, borderRadius: 4, marginRight: 16 }} />
            <div style={{ fontSize: 20, color: TEXT, fontFamily: 'sans-serif', width: 70 }}>{r.size}</div>
            <div style={{ fontSize: 16, color: DIM, fontFamily: 'sans-serif' }}>{r.vram}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// Scene 4: りんごの認知解像度 (360-510f = 5秒)
function AppleScene() {
  const frame = useCurrentFrame();
  const localFrame = frame - 360;

  const vectors = [
    {
      label: 'float32（56GB）',
      vals: '[0.8231, -0.4471, 0.9823, 0.1204, ...]',
      desc: '微妙な距離感まで細かく表現',
      color: GREEN,
    },
    {
      label: 'Q4（9GB）',
      vals: '[0.8, -0.4, 1.0, 0.1, ...]',
      desc: '近い概念はわかるが微妙なニュアンスが丸まる',
      color: YELLOW,
    },
    {
      label: 'Q2（5GB）',
      vals: '[0.67, -0.33, 1.0, 0.0, ...]',
      desc: '情報がかなり飛ぶ',
      color: ACCENT,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: 60, flexDirection: 'column', justifyContent: 'center' }}>
      <FadeIn startFrame={0}>
        <div style={{ fontSize: 34, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif', marginBottom: 8 }}>
          「りんご」の認知解像度
        </div>
        <div style={{ fontSize: 18, color: DIM, fontFamily: 'sans-serif', marginBottom: 40 }}>
          AIの内部では単語は数千次元のベクトルで表現されている
        </div>
      </FadeIn>
      {vectors.map((v, i) => {
        const startF = 20 + i * 35;
        const opacity = interpolate(localFrame, [startF, startF + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{ opacity, marginBottom: 32, padding: '20px 28px', border: `2px solid ${v.color}33`, borderRadius: 12, backgroundColor: `${v.color}11` }}>
            <div style={{ fontSize: 20, color: v.color, fontFamily: 'sans-serif', fontWeight: 'bold', marginBottom: 8 }}>{v.label}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 18, color: TEXT, marginBottom: 8 }}>{v.vals}</div>
            <div style={{ fontSize: 16, color: DIM, fontFamily: 'sans-serif' }}>→ {v.desc}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// Scene 5: まとめ (510-630f = 4秒)
function SummaryScene() {
  const frame = useCurrentFrame();
  const localFrame = frame - 510;

  const points = [
    '量子化 ＝ AIの数値を低精度に丸めて圧縮する技術',
    '量子力学とは無関係',
    '日常会話・コード生成ならQ4で十分',
    '精度が必要な業務利用はQ8以上を推奨',
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: 80, flexDirection: 'column', justifyContent: 'center' }}>
      <FadeIn startFrame={0}>
        <div style={{ fontSize: 38, fontWeight: 'bold', color: ACCENT, fontFamily: 'sans-serif', marginBottom: 48 }}>
          まとめ
        </div>
      </FadeIn>
      {points.map((p, i) => {
        const startF = 15 + i * 20;
        const opacity = interpolate(localFrame, [startF, startF + 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const translateY = interpolate(localFrame, [startF, startF + 15], [20, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{ opacity, transform: `translateY(${translateY}px)`, display: 'flex', alignItems: 'flex-start', marginBottom: 28 }}>
            <div style={{ color: ACCENT, fontSize: 24, marginRight: 16, marginTop: 2 }}>▸</div>
            <div style={{ fontSize: 24, color: TEXT, fontFamily: 'sans-serif', lineHeight: 1.4 }}>{p}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// メインコンポーネント
export function QuantizationVideo() {
  const frame = useCurrentFrame();

  let Scene;
  if (frame < 90) Scene = TitleScene;
  else if (frame < 210) Scene = WhatIsQuantization;
  else if (frame < 360) Scene = SizeTable;
  else if (frame < 510) Scene = AppleScene;
  else Scene = SummaryScene;

  return <Scene />;
}
