'use client'
import { STORY_ARCS, CREATOR_CAST, Character } from '@/lib/story'
import { CREATOR_META, Creator } from '@/lib/types'
import { CALENDAR } from '@/lib/calendar'
import { useState } from 'react'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

export default function StoryView() {
  const [selectedCreator, setSelectedCreator] = useState<Creator>('Kiara')

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* HERO */}
      <div>
        <h2 className="text-3xl font-bold mb-2">📖 The Story</h2>
        <p className="text-neutral-400 max-w-3xl">
          4 college friends from Yale, now living their post-grad lives in 4 cities. Their July 2026 unfolds in 5 arcs — from establishing their worlds, to family cameos, to the Dubai reunion, to their solo beach escapes, and finally back to reality with first affiliate deals.
        </p>
      </div>

      {/* TIMELINE */}
      <div>
        <h3 className="text-xl font-bold mb-5">🗓️ July 2026 Story Arcs</h3>
        <div className="space-y-4">
          {STORY_ARCS.map((arc) => {
            const arcPostCount = CALENDAR.filter(p => {
              const [start, end] = arc.dateRange.split(' – ')
              const parse = (s: string) => new Date(s + ', 2026').getTime()
              const t = new Date(p.date).getTime()
              return t >= parse(start) && t <= parse(end)
            }).length

            return (
              <div key={arc.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6" style={{ borderLeftColor: arc.color, borderLeftWidth: 4 }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-3xl">{arc.emoji}</span>
                      <h4 className="text-xl font-bold">{arc.title}</h4>
                    </div>
                    <div className="text-sm text-neutral-500 mb-3">{arc.dateRange} · {arcPostCount} posts · {arc.creators.length} creators</div>
                  </div>
                </div>
                <p className="text-neutral-300 text-sm mb-4">{arc.description}</p>
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Key moments</div>
                  <ul className="text-sm text-neutral-300 space-y-1">
                    {arc.keyMoments.map((m, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-neutral-600">•</span>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CAST */}
      <div>
        <h3 className="text-xl font-bold mb-3">👨‍👩‍👧‍👦 The Cast — Family + Boyfriends + Pets</h3>
        <p className="text-neutral-400 text-sm mb-6">
          Every supporting character in each creator's world. Face locks needed when they first appear in a post — I'll generate anchor images + save Reference Elements when their post-date arrives.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {CREATORS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCreator(c)}
              className="text-sm px-4 py-2 rounded-full border transition-all"
              style={{
                background: selectedCreator === c ? `${CREATOR_META[c].color}22` : 'transparent',
                borderColor: selectedCreator === c ? CREATOR_META[c].color : 'rgb(38 38 38)',
                color: selectedCreator === c ? CREATOR_META[c].color : 'rgb(163 163 163)'
              }}
            >
              {c}'s world
            </button>
          ))}
        </div>

        <CastGrid creator={selectedCreator} />
      </div>

      {/* NEXT — AUGUST */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-3">📅 What's next — August 2026</h3>
        <p className="text-neutral-300 text-sm mb-4">
          On Jul 31, we plan the full August calendar together. Ideas already brewing:
        </p>
        <ul className="text-sm text-neutral-300 space-y-2 list-inside">
          <li>🎂 <span className="text-neutral-400">Birthday arc</span> — someone's birthday party as reunion moment #2</li>
          <li>💍 <span className="text-neutral-400">Wedding season</span> — Indian summer weddings for Siya + Kiara</li>
          <li>🏃‍♀️ <span className="text-neutral-400">Chicago marathon</span> for Mia (real event)</li>
          <li>👗 <span className="text-neutral-400">NYFW Sept prep</span> for Ava</li>
          <li>🛍️ <span className="text-neutral-400">Deeper affiliate mix</span> — 4-6 product videos per creator per week</li>
          <li>👨‍👩‍👧 <span className="text-neutral-400">Boyfriend/family character faces</span> generated + trained as Soul IDs</li>
        </ul>
      </div>
    </div>
  )
}

function CastGrid({ creator }: { creator: Creator }) {
  const cast = CREATOR_CAST[creator]
  const meta = CREATOR_META[creator]
  const characters: Character[] = [cast.boyfriend, ...cast.family]
  if (cast.pet) characters.push(cast.pet)

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5" style={{ borderTopColor: meta.color, borderTopWidth: 3 }}>
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">📍 Where {creator} lives + travels</div>
        <div className="flex flex-wrap gap-2">
          {cast.locations.map((l) => (
            <span key={l} className="text-xs bg-neutral-800 px-3 py-1.5 rounded-full">{l}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((c) => (
          <CharacterCard key={c.name} character={c} creatorColor={meta.color} />
        ))}
      </div>
    </div>
  )
}

function CharacterCard({ character, creatorColor }: { character: Character; creatorColor: string }) {
  const statusBadge = {
    trained: { text: '✅ Soul ID Trained', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    pending: { text: '⏳ Pending training', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    concept: { text: '💭 Concept (locks on first appearance)', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
  }[character.soulIdStatus]

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
      <div>
        <div className="text-lg font-bold" style={{ color: creatorColor }}>{character.name}</div>
        <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">{character.role} · {character.age}</div>
      </div>

      <div className="text-sm text-neutral-300">{character.vibe}</div>

      <div>
        <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Face description</div>
        <div className="text-xs text-neutral-400 leading-relaxed">{character.faceDescription}</div>
      </div>

      <div className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border inline-block ${statusBadge.color}`}>
        {statusBadge.text}
      </div>
    </div>
  )
}
