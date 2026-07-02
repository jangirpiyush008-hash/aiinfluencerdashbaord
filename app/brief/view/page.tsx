import { decodeBrief } from '@/lib/brief'
import { CREATOR_META, type Creator } from '@/lib/types'
import { STORY_ARCS } from '@/lib/story'

export const dynamic = 'force-dynamic'

export default function BriefViewPage({ searchParams }: { searchParams: { d?: string } }) {
  const encoded = searchParams.d || ''
  const brief = encoded ? decodeBrief(encoded) : null

  if (!brief) {
    return (
      <main style={{ maxWidth: 720, margin: '40px auto', padding: 24, color: '#eee', background: '#0a0a0a' }}>
        <h1>Missing or invalid brief data</h1>
        <p>The <code>?d=</code> URL param is missing or unreadable.</p>
        <p><a href="/brief/new" style={{ color: '#4af' }}>Start a new brief</a></p>
      </main>
    )
  }

  const meta = brief.creator ? CREATOR_META[brief.creator as Creator] : null
  const arc = STORY_ARCS.find((a) => a.id === brief.storyArcId)

  return (
    <main style={{
      maxWidth: 900, margin: '40px auto', padding: 24,
      color: '#eee', background: '#0a0a0a', fontFamily: '-apple-system, sans-serif', lineHeight: 1.5
    }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>BRIEF ID · {brief.id}</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0' }}>🎥 {brief.productName || '(unnamed)'}</h1>
        <div style={{ fontSize: 14, color: '#aaa' }}>
          {brief.creator} {meta && `· ${meta.handle} · ${meta.city}`}
        </div>
      </div>

      <Sec label="1. Product">
        <Row k="Name" v={brief.productName} />
        <Row k="Brand" v={brief.productBrand} />
        <Row k="Category" v={brief.productCategory} />
        <Row k="Key features">
          <pre style={preStyle}>{brief.keyFeatures || '—'}</pre>
        </Row>
        {brief.productPhotoUrls.length > 0 && (
          <Row k={`Product photos (${brief.productPhotoUrls.length})`}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {brief.productPhotoUrls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer">
                  <img src={url} alt={`product ${i + 1}`} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 6, border: '1px solid #333' }} />
                </a>
              ))}
            </div>
            <ul style={{ marginTop: 8, fontSize: 11, color: '#888', wordBreak: 'break-all' }}>
              {brief.productPhotoUrls.map((url, i) => (
                <li key={i}>{i + 1}. {url}</li>
              ))}
            </ul>
          </Row>
        )}
      </Sec>

      <Sec label="2. Reference videos (learn the format)">
        {brief.referenceVideoUrls.length > 0 ? (
          <ol style={{ paddingLeft: 20, fontSize: 13, color: '#ccc' }}>
            {brief.referenceVideoUrls.map((url, i) => (
              <li key={i} style={{ marginBottom: 4 }}>
                <a href={url} target="_blank" rel="noreferrer" style={{ color: '#4af', wordBreak: 'break-all' }}>{url}</a>
              </li>
            ))}
          </ol>
        ) : (<span style={{ color: '#888' }}>None provided</span>)}
        <Row k="What Piyush likes about them">
          <pre style={preStyle}>{brief.whatYouLike || '—'}</pre>
        </Row>
      </Sec>

      <Sec label="3. Story integration">
        <Row k="Creator" v={brief.creator} />
        {meta && (
          <>
            <Row k="City / niche" v={`${meta.city} · ${meta.niche}`} />
            <Row k="Personality" v={meta.personality} />
            <Row k="Signature looks" v={meta.signatureLooks.join(' · ')} />
            <Row k="Body type" v={meta.bodyType} />
            <Row k="Identity lock" v={meta.identityLock} />
            <Row k="Soul ID" v={meta.soulId} />
          </>
        )}
        {arc && (
          <Row k="Story arc">
            {arc.emoji} <b>{arc.title}</b> — {arc.dateRange}
            <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{arc.description}</div>
          </Row>
        )}
        <Row k="How the product fits into her daily life">
          <pre style={preStyle}>{brief.productInDailyLife || '—'}</pre>
        </Row>
      </Sec>

      <Sec label="4. Video specs">
        <Row k="Duration" v={brief.duration} />
        <Row k="Aspect ratio" v={brief.aspectRatio} />
        <Row k="Shots" v={brief.shots} />
      </Sec>

      <Sec label="5. Scene + mood">
        <Row k="Setting" v={brief.setting} />
        <Row k="Wardrobe"><pre style={preStyle}>{brief.wardrobe || '—'}</pre></Row>
        <Row k="Vibe" v={brief.vibe} />
        <Row k="Face lock mode" v={brief.faceLockMode} />
      </Sec>

      <Sec label="6. Distribution + affiliate">
        <Row k="Affiliate URL" v={brief.affiliateUrl} />
        <Row k="Discount code" v={brief.discountCode} />
        <Row k="Platforms" v={brief.platforms.join(', ')} />
        <Row k="Caption hook" v={brief.captionHook} />
      </Sec>

      <div style={{ marginTop: 32, padding: 16, background: '#0a1e2a', borderLeft: '3px solid #4af', borderRadius: 6, fontSize: 13 }}>
        <b>For Claude:</b> Read every section. Generate an ultra-detailed 8-section Higgsfield prompt with product placement, shot-by-shot breakdown,
        camera moves, wardrobe, lighting, hook (first 1-2 sec), and closing frame. Use trained Soul ID for face lock.
        Report Higgsfield credits before and after generation.
      </div>
    </main>
  )
}

const preStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12, background: '#000', padding: 8, borderRadius: 4, margin: 0, color: '#eee'
}

function Sec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 16, marginBottom: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{label}</h2>
      <div style={{ display: 'grid', gap: 8 }}>{children}</div>
    </section>
  )
}

function Row({ k, v, children }: { k: string; v?: string; children?: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13 }}>
      <span style={{ color: '#888', textTransform: 'uppercase', fontSize: 10, letterSpacing: 1, display: 'block', marginBottom: 2 }}>{k}</span>
      <div>{children ?? (v || <span style={{ color: '#666' }}>—</span>)}</div>
    </div>
  )
}
