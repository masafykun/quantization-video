import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

const BG = '#0F1117';
const TEXT = '#E8E8E8';
const DIM = '#888';
const ACCENT = '#FF6B6B';
const GREEN = '#4ECDC4';
const YELLOW = '#FFE66D';
const BLUE = '#74B9FF';

// Scene boundaries (frames at 30fps)
const SCENES = {
  intro:     { start: 0,    end: 702  },
  what:      { start: 702,  end: 1914 },
  size:      { start: 1914, end: 3400 },
  apple:     { start: 3400, end: 5242 },
  diff:      { start: 5242, end: 6303 },
  recommend: { start: 6303, end: 7432 },
  summary:   { start: 7432, end: 8482 },
};

function fadeIn(frame, startFrame, duration = 20) {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function slideIn(frame, startFrame, duration = 20) {
  return interpolate(frame, [startFrame, startFrame + duration], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// ── Scene 1: イントロ ──────────────────────────────────────────
function IntroScene() {
  const frame = useCurrentFrame();
  const lf = frame - SCENES.intro.start;
  const scale = spring({ frame: lf, fps: 30, from: 0.85, to: 1, durationInFrames: 45 });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Audio src={staticFile('01_intro.mp3')} startFrom={0} />

      <div style={{ transform: `scale(${scale})`, textAlign: 'center', padding: '0 80px' }}>
        <div style={{ fontSize: 16, color: ACCENT, letterSpacing: 4, fontFamily: 'sans-serif', marginBottom: 20, opacity: fadeIn(lf, 10) }}>
          AI技術をやさしく解説
        </div>
        <div style={{ fontSize: 58, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif', lineHeight: 1.2, opacity: fadeIn(lf, 0) }}>
          量子化って何？
        </div>
        <div style={{ fontSize: 28, color: ACCENT, fontFamily: 'sans-serif', marginTop: 16, opacity: fadeIn(lf, 20) }}>
          AIは「りんご」をどう認識してるのか
        </div>
        <div style={{ fontSize: 20, color: DIM, fontFamily: 'sans-serif', marginTop: 32, opacity: fadeIn(lf, 40) }}>
          5GBと56GBで何が違う？
        </div>

        {/* 装飾ライン */}
        <div style={{
          width: interpolate(lf, [30, 90], [0, 400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          height: 3,
          backgroundColor: ACCENT,
          margin: '40px auto 0',
          borderRadius: 2,
        }} />
      </div>

      {/* 下部タグ */}
      <div style={{ position: 'absolute', bottom: 50, opacity: fadeIn(lf, 60), display: 'flex', gap: 16 }}>
        {['#AI', '#量子化', '#機械学習', '#初心者向け'].map(tag => (
          <div key={tag} style={{ fontSize: 16, color: DIM, fontFamily: 'sans-serif', padding: '6px 14px', border: '1px solid #333', borderRadius: 20 }}>
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 2: 量子化とは ───────────────────────────────────────
function WhatScene() {
  const frame = useCurrentFrame();
  const lf = frame - SCENES.what.start;

  const steps = [
    { before: '3.14159265358979', after: '→ そのまま', label: 'float32（元の数値）', color: GREEN },
    { before: '3.14159265358979', after: '→ 3.1416', label: 'float16（16ビット）', color: BLUE },
    { before: '3.14159265358979', after: '→ 3.1', label: 'Q8（8ビット）', color: YELLOW },
    { before: '3.14159265358979', after: '→ 3', label: 'Q4（4ビット）', color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: '60px 80px', flexDirection: 'column', justifyContent: 'center' }}>
      <Audio src={staticFile('02_what.mp3')} startFrom={0} />

      <div style={{ opacity: fadeIn(lf, 0), marginBottom: 12 }}>
        <div style={{ fontSize: 14, color: ACCENT, letterSpacing: 3, fontFamily: 'sans-serif' }}>WHAT IS QUANTIZATION</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 5), marginBottom: 8 }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif' }}>
          量子化 ＝ 数値を「丸める」技術
        </div>
      </div>
      <div style={{ opacity: fadeIn(lf, 15), marginBottom: 50 }}>
        <div style={{ fontSize: 20, color: DIM, fontFamily: 'sans-serif' }}>
          量子力学とは無関係。精度を落としてファイルを圧縮する。
        </div>
      </div>

      {steps.map((s, i) => {
        const startF = 40 + i * 50;
        const op = fadeIn(lf, startF);
        const tx = slideIn(lf, startF);
        return (
          <div key={i} style={{ opacity: op, transform: `translateX(${tx}px)`, display: 'flex', alignItems: 'center', marginBottom: 22, padding: '16px 24px', backgroundColor: '#ffffff08', borderRadius: 10, border: `1px solid ${s.color}44` }}>
            <div style={{ fontFamily: 'monospace', fontSize: 22, color: DIM, width: 280 }}>{s.before}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 22, color: s.color, width: 160 }}>{s.after}</div>
            <div style={{ fontSize: 18, color: TEXT, fontFamily: 'sans-serif' }}>{s.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ── Scene 3: サイズ比較 ───────────────────────────────────────
function SizeScene() {
  const frame = useCurrentFrame();
  const lf = frame - SCENES.size.start;

  const rows = [
    { fmt: 'float32', size: '56GB', desc: '高性能サーバー向け', color: '#666', bar: 1.0 },
    { fmt: 'float16', size: '28GB', desc: '高級GPU必要', color: '#888', bar: 0.5 },
    { fmt: 'Q8（8bit）', size: '14GB', desc: 'ギリギリ動く', color: YELLOW, bar: 0.25 },
    { fmt: 'Q4（4bit）', size: '9GB', desc: '家庭用GPUで動く ✓', color: GREEN, bar: 0.16 },
    { fmt: 'Q2（2bit）', size: '5GB', desc: '精度はかなり落ちる', color: ACCENT, bar: 0.09 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: '60px 80px', flexDirection: 'column', justifyContent: 'center' }}>
      <Audio src={staticFile('03_size.mp3')} startFrom={0} />

      <div style={{ opacity: fadeIn(lf, 0), marginBottom: 6 }}>
        <div style={{ fontSize: 14, color: ACCENT, letterSpacing: 3, fontFamily: 'sans-serif' }}>SIZE COMPARISON</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 5), marginBottom: 6 }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif' }}>
          どれくらい小さくなる？
        </div>
      </div>
      <div style={{ opacity: fadeIn(lf, 15), marginBottom: 44 }}>
        <div style={{ fontSize: 18, color: DIM, fontFamily: 'sans-serif' }}>Qwen2.5 14B モデルの場合</div>
      </div>

      {rows.map((r, i) => {
        const startF = 35 + i * 55;
        const barW = interpolate(lf, [startF, startF + 40], [0, r.bar * 480], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        const op = fadeIn(lf, startF, 25);
        return (
          <div key={i} style={{ opacity: op, display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 19, color: r.color, width: 150 }}>{r.fmt}</div>
            <div style={{ height: 30, width: barW, backgroundColor: r.color, borderRadius: 4, marginRight: 16, transition: 'width 0.1s' }} />
            <div style={{ fontSize: 20, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif', width: 65 }}>{r.size}</div>
            <div style={{ fontSize: 16, color: DIM, fontFamily: 'sans-serif' }}>{r.desc}</div>
          </div>
        );
      })}

      <div style={{ opacity: fadeIn(lf, 350), marginTop: 20, padding: '16px 24px', backgroundColor: `${GREEN}18`, border: `1px solid ${GREEN}55`, borderRadius: 10 }}>
        <div style={{ fontSize: 18, color: GREEN, fontFamily: 'sans-serif' }}>
          💡 56GB → 9GB：元の6分の1以下まで圧縮できる
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 4: りんごの認知解像度 ──────────────────────────────
function AppleScene() {
  const frame = useCurrentFrame();
  const lf = frame - SCENES.apple.start;

  const vectors = [
    { label: 'float32（56GB）', vals: '[0.8231, -0.4471, 0.9823, 0.1204, -0.7652, ...]', desc: '「赤い」「甘い」「秋」「ニュートン」との距離が細かく表現できる', color: GREEN },
    { label: 'Q4（9GB）', vals: '[0.8,    -0.4,    1.0,    0.1,    -0.8,    ...]', desc: '近い概念はわかるが、微妙なニュアンスが丸まる', color: YELLOW },
    { label: 'Q2（5GB）', vals: '[0.67,   -0.33,   1.0,    0.0,    -0.67,   ...]', desc: '-0.7652 が -0.67 になるレベルで情報が飛ぶ', color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: '60px 80px', flexDirection: 'column', justifyContent: 'center' }}>
      <Audio src={staticFile('04_apple.mp3')} startFrom={0} />

      <div style={{ opacity: fadeIn(lf, 0), marginBottom: 6 }}>
        <div style={{ fontSize: 14, color: ACCENT, letterSpacing: 3, fontFamily: 'sans-serif' }}>COGNITIVE RESOLUTION</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 5), marginBottom: 8 }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif' }}>「りんご」の認知解像度</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 15), marginBottom: 44 }}>
        <div style={{ fontSize: 20, color: DIM, fontFamily: 'sans-serif' }}>
          AIの中で「りんご」は数千次元のベクトルとして存在する
        </div>
      </div>

      {vectors.map((v, i) => {
        const startF = 35 + i * 120;
        const op = fadeIn(lf, startF, 25);
        const tx = slideIn(lf, startF, 25);
        return (
          <div key={i} style={{ opacity: op, transform: `translateX(${tx}px)`, marginBottom: 28, padding: '20px 28px', border: `2px solid ${v.color}44`, borderRadius: 14, backgroundColor: `${v.color}0d` }}>
            <div style={{ fontSize: 19, color: v.color, fontFamily: 'sans-serif', fontWeight: 'bold', marginBottom: 10 }}>{v.label}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 17, color: TEXT, marginBottom: 10, letterSpacing: 1 }}>{v.vals}</div>
            <div style={{ fontSize: 16, color: DIM, fontFamily: 'sans-serif' }}>→ {v.desc}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ── Scene 5: 差が出る場面 ─────────────────────────────────────
function DiffScene() {
  const frame = useCurrentFrame();
  const lf = frame - SCENES.diff.start;

  const affected = ['長い文章での一貫性', '詩・文学的なニュアンス', '複雑な論理の連鎖', '多言語混じりの推論'];
  const noChange = ['日常会話・チャット', '簡単な質問応答', 'コード生成（シンプルなもの）', '「りんごは果物？」レベルの質問'];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: '60px 80px', flexDirection: 'column', justifyContent: 'center' }}>
      <Audio src={staticFile('05_diff.mp3')} startFrom={0} />

      <div style={{ opacity: fadeIn(lf, 0), marginBottom: 6 }}>
        <div style={{ fontSize: 14, color: ACCENT, letterSpacing: 3, fontFamily: 'sans-serif' }}>WHERE IT MATTERS</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 5), marginBottom: 44 }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif' }}>実際にどんな差が出る？</div>
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        <div style={{ flex: 1, opacity: fadeIn(lf, 30) }}>
          <div style={{ fontSize: 20, color: ACCENT, fontFamily: 'sans-serif', fontWeight: 'bold', marginBottom: 20 }}>
            ⚠️ 差が出やすい場面
          </div>
          {affected.map((item, i) => (
            <div key={i} style={{ opacity: fadeIn(lf, 40 + i * 20), transform: `translateX(${slideIn(lf, 40 + i * 20)}px)`, display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT, marginRight: 14, flexShrink: 0 }} />
              <div style={{ fontSize: 18, color: TEXT, fontFamily: 'sans-serif' }}>{item}</div>
            </div>
          ))}
        </div>

        <div style={{ width: 1, backgroundColor: '#333' }} />

        <div style={{ flex: 1, opacity: fadeIn(lf, 100) }}>
          <div style={{ fontSize: 20, color: GREEN, fontFamily: 'sans-serif', fontWeight: 'bold', marginBottom: 20 }}>
            ✓ ほぼ変わらない場面
          </div>
          {noChange.map((item, i) => (
            <div key={i} style={{ opacity: fadeIn(lf, 110 + i * 20), transform: `translateX(${slideIn(lf, 110 + i * 20)}px)`, display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GREEN, marginRight: 14, flexShrink: 0 }} />
              <div style={{ fontSize: 18, color: TEXT, fontFamily: 'sans-serif' }}>{item}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 6: 用途別推奨 ───────────────────────────────────────
function RecommendScene() {
  const frame = useCurrentFrame();
  const lf = frame - SCENES.recommend.start;

  const recs = [
    { use: '日常会話・チャット', rec: 'Q4', color: GREEN },
    { use: 'コード生成（一般的）', rec: 'Q4', color: GREEN },
    { use: '長文ライティング', rec: 'Q6〜Q8', color: YELLOW },
    { use: '精度が重要な業務利用', rec: 'Q8以上', color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: '60px 80px', flexDirection: 'column', justifyContent: 'center' }}>
      <Audio src={staticFile('06_recommend.mp3')} startFrom={0} />

      <div style={{ opacity: fadeIn(lf, 0), marginBottom: 6 }}>
        <div style={{ fontSize: 14, color: ACCENT, letterSpacing: 3, fontFamily: 'sans-serif' }}>RECOMMENDATION</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 5), marginBottom: 8 }}>
        <div style={{ fontSize: 40, fontWeight: 'bold', color: TEXT, fontFamily: 'sans-serif' }}>結局どれを使えばいい？</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 15), marginBottom: 44 }}>
        <div style={{ fontSize: 18, color: DIM, fontFamily: 'sans-serif' }}>用途別おすすめ早見表</div>
      </div>

      {recs.map((r, i) => {
        const startF = 35 + i * 50;
        const op = fadeIn(lf, startF);
        return (
          <div key={i} style={{ opacity: op, display: 'flex', alignItems: 'center', marginBottom: 22, padding: '18px 28px', backgroundColor: '#ffffff08', borderRadius: 12, border: `1px solid #333` }}>
            <div style={{ fontSize: 20, color: TEXT, fontFamily: 'sans-serif', flex: 1 }}>{r.use}</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: r.color, fontFamily: 'monospace', padding: '6px 20px', backgroundColor: `${r.color}22`, borderRadius: 8 }}>
              {r.rec}
            </div>
          </div>
        );
      })}

      <div style={{ opacity: fadeIn(lf, 280), marginTop: 24, padding: '16px 24px', backgroundColor: `${BLUE}18`, border: `1px solid ${BLUE}44`, borderRadius: 10 }}>
        <div style={{ fontSize: 17, color: BLUE, fontFamily: 'sans-serif' }}>
          💻 RTX 3060（VRAM 12GB）なら Q4 がちょうどいい
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 7: まとめ ───────────────────────────────────────────
function SummaryScene() {
  const frame = useCurrentFrame();
  const lf = frame - SCENES.summary.start;

  const points = [
    { text: '量子化 ＝ 数値を低精度に丸めてサイズ圧縮', color: GREEN },
    { text: '量子力学とは完全に無関係', color: BLUE },
    { text: '日常利用ならQ4で十分', color: YELLOW },
    { text: '精度が必要な業務利用はQ8以上を推奨', color: ACCENT },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: '60px 80px', flexDirection: 'column', justifyContent: 'center' }}>
      <Audio src={staticFile('07_summary.mp3')} startFrom={0} />

      <div style={{ opacity: fadeIn(lf, 0), marginBottom: 6 }}>
        <div style={{ fontSize: 14, color: ACCENT, letterSpacing: 3, fontFamily: 'sans-serif' }}>SUMMARY</div>
      </div>
      <div style={{ opacity: fadeIn(lf, 5), marginBottom: 50 }}>
        <div style={{ fontSize: 46, fontWeight: 'bold', color: ACCENT, fontFamily: 'sans-serif' }}>まとめ</div>
      </div>

      {points.map((p, i) => {
        const startF = 20 + i * 40;
        const op = fadeIn(lf, startF);
        const ty = slideIn(lf, startF);
        return (
          <div key={i} style={{ opacity: op, transform: `translateY(${ty}px)`, display: 'flex', alignItems: 'center', marginBottom: 30 }}>
            <div style={{ width: 6, height: 40, backgroundColor: p.color, borderRadius: 3, marginRight: 24, flexShrink: 0 }} />
            <div style={{ fontSize: 24, color: TEXT, fontFamily: 'sans-serif', lineHeight: 1.4 }}>{p.text}</div>
          </div>
        );
      })}

      <div style={{ opacity: fadeIn(lf, 220), marginTop: 30, textAlign: 'center' }}>
        <div style={{ fontSize: 18, color: DIM, fontFamily: 'sans-serif' }}>
          難しそうな言葉も、やってることは「細かい数値をざっくりにする」だけ
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ── メインコンポーネント ──────────────────────────────────────
export function QuantizationVideo() {
  const frame = useCurrentFrame();

  if (frame < SCENES.what.start)      return <IntroScene />;
  if (frame < SCENES.size.start)      return <WhatScene />;
  if (frame < SCENES.apple.start)     return <SizeScene />;
  if (frame < SCENES.diff.start)      return <AppleScene />;
  if (frame < SCENES.recommend.start) return <DiffScene />;
  if (frame < SCENES.summary.start)   return <RecommendScene />;
  return <SummaryScene />;
}
