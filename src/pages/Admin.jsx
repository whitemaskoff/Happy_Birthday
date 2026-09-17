import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PHOTO_SLOTS } from '../data/siteContent'
import { useContent } from '../lib/contentStore'

const UNLOCK = 'maryam-admin-ok'

export default function Admin() {
  const {
    content,
    photos,
    updateContent,
    setPhoto,
    removePhoto,
    resetToDefault,
    exportBundle,
    importBundle,
  } = useContent()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(UNLOCK) === '1',
  )
  const [status, setStatus] = useState('')

  const unlock = (e) => {
    e.preventDefault()
    if (pin === String(content.pin || '2036')) {
      sessionStorage.setItem(UNLOCK, '1')
      setUnlocked(true)
      setError('')
    } else {
      setError('Wrong PIN.')
    }
  }

  const setField = (key, value) => updateContent({ [key]: value })

  const setBlock = (id, text) =>
    updateContent((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === id
          ? { ...b, lines: text.split('\n').filter((x) => x.length) }
          : b,
      ),
    }))

  const onExport = async () => {
    const bundle = await exportBundle()
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'maryam-radio-backup.json'
    a.click()
    URL.revokeObjectURL(a.href)
    setStatus('Backup downloaded.')
  }

  const onImport = async (file) => {
    try {
      const bundle = JSON.parse(await file.text())
      await importBundle(bundle)
      setStatus('Backup restored.')
    } catch {
      setStatus('Could not read that backup file.')
    }
  }

  if (!unlocked) {
    return (
      <div className="admin-shell grid min-h-[100dvh] place-items-center px-6">
        <form onSubmit={unlock} className="holo-frame w-full max-w-sm rounded-2xl p-6">
          <p className="hud-kicker mb-3">Admin</p>
          <h1 className="story-title mb-6 text-3xl">PIN</h1>
          <input
            className="field"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="2036"
            autoFocus
          />
          {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
          <button type="submit" className="ghost-btn mt-5 w-full">
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="admin-shell px-4 py-8 text-cyan-50 md:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="hud-kicker">What she hears</p>
            <h1 className="story-title text-4xl">One line at a time</h1>
          </div>
          <Link to="/" className="ghost-btn text-xs">
            Listen
          </Link>
        </header>

        {status ? <p className="text-sm text-cyan-200">{status}</p> : null}

        <section className="holo-frame rounded-2xl p-5">
          <h2 className="mb-4 font-hud text-xs tracking-[0.25em] uppercase text-cyan-200">
            Names
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Her name" value={content.herName} onChange={(v) => setField('herName', v)} />
            <Field label="Nickname" value={content.nickname} onChange={(v) => setField('nickname', v)} />
            <Field label="Your name" value={content.fromName} onChange={(v) => setField('fromName', v)} />
            <label className="block">
              <span className="field-label">Birthday date</span>
              <input
                className="field"
                type="date"
                value={content.birthdayDate || ''}
                onChange={(e) => setField('birthdayDate', e.target.value)}
              />
            </label>
            <Field label="Admin PIN" value={content.pin} onChange={(v) => setField('pin', v)} />
            <Field
              label="Relatives ({{relatives}})"
              value={content.relatives}
              onChange={(v) => setField('relatives', v)}
            />
            <Field
              label="Turn-on label"
              value={content.listenLabel}
              onChange={(v) => setField('listenLabel', v)}
            />
            <Field
              label="Replay label"
              value={content.replayLabel}
              onChange={(v) => setField('replayLabel', v)}
            />
            <Field
              label="Gift line (before she opens it)"
              value={content.giftTease}
              onChange={(v) => setField('giftTease', v)}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Toggle
              label="Mute by default"
              checked={content.muteByDefault}
              onChange={(v) => setField('muteByDefault', v)}
            />
            <Toggle
              label="Show next"
              checked={content.showSkip}
              onChange={(v) => setField('showSkip', v)}
            />
            <Toggle
              label="Companion"
              checked={content.companionOn}
              onChange={(v) => setField('companionOn', v)}
            />
          </div>
        </section>

        <section className="holo-frame rounded-2xl p-5">
          <h2 className="mb-2 font-hud text-xs tracking-[0.25em] uppercase text-cyan-200">
            The talk
          </h2>
          <p className="mb-4 text-sm text-cyan-100/60">
            Each box is one screen. Related sentences go in the same box, one per line. Short punchlines stay in a box by themselves.
          </p>
          <div className="flex flex-col gap-4">
            {(content.blocks || []).map((block, i) => (
              <div key={block.id} className="rounded-xl border border-cyan-200/15 bg-black/25 p-3">
                <span className="field-label">Screen {i + 1}</span>
                <textarea
                  className="field min-h-[90px]"
                  value={(block.lines || []).join('\n')}
                  onChange={(e) => setBlock(block.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="holo-frame rounded-2xl p-5">
          <h2 className="mb-4 font-hud text-xs tracking-[0.25em] uppercase text-cyan-200">
            Photos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PHOTO_SLOTS.map((slot) => (
              <PhotoSlot
                key={slot.key}
                slot={slot}
                preview={photos[slot.key]}
                onFile={(file) => setPhoto(slot.key, file)}
                onClear={() => removePhoto(slot.key)}
              />
            ))}
          </div>
        </section>

        <section className="holo-frame flex flex-wrap gap-3 rounded-2xl p-5">
          <button type="button" className="ghost-btn" onClick={onExport}>
            Export backup
          </button>
          <label className="ghost-btn cursor-pointer">
            Import backup
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
            />
          </label>
          <button
            type="button"
            className="ghost-btn"
            onClick={async () => {
              if (window.confirm('Reset the talk to the default lines?')) {
                await resetToDefault()
                setStatus('Reset.')
              }
            }}
          >
            Reset to default
          </button>
        </section>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input className="field" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}

function PhotoSlot({ slot, preview, onFile, onClear }) {
  return (
    <div className="rounded-xl border border-cyan-200/15 bg-black/20 p-3">
      <p className="field-label">{slot.label}</p>
      <div className="mb-3 aspect-[3/4] overflow-hidden rounded-lg bg-black/40">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center font-hud text-[10px] tracking-[0.2em] text-cyan-200/50">
            EMPTY
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <label className="ghost-btn flex-1 cursor-pointer px-2 py-2 text-center text-[10px]">
          Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
        </label>
        {preview ? (
          <button type="button" className="ghost-btn px-2 py-2 text-[10px]" onClick={onClear}>
            Clear
          </button>
        ) : null}
      </div>
    </div>
  )
}
