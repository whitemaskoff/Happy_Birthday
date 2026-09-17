let ctx
let master
let hissGain
let rumbleGain
let rumbleOsc
let alarmNodes = []
let rewindOsc
let started = false

function env() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.6
  master.connect(ctx.destination)
  return ctx
}

async function wake() {
  env()
  started = true
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume()
    } catch {
      /* ignore */
    }
  }
}

function noiseBuffer(seconds = 0.08) {
  const ac = env()
  const n = Math.max(1, Math.floor(ac.sampleRate * seconds))
  const buffer = ac.createBuffer(1, n, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < n; i += 1) data[i] = Math.random() * 2 - 1
  return buffer
}

function blip({ freq = 720, fall = 380, dur = 0.045, gain = 0.22, noise = 0.08, type = 'sine' }) {
  const ac = env()
  const osc = ac.createOscillator()
  const og = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(Math.max(60, fall), ac.currentTime + dur)
  og.gain.setValueAtTime(gain, ac.currentTime)
  og.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur)
  osc.connect(og)
  og.connect(master)
  osc.start()
  osc.stop(ac.currentTime + dur + 0.02)
  if (noise > 0) {
    const src = ac.createBufferSource()
    const ng = ac.createGain()
    const f = ac.createBiquadFilter()
    f.type = 'bandpass'
    f.frequency.value = freq * 1.3
    f.Q.value = 1.6
    src.buffer = noiseBuffer(dur)
    ng.gain.setValueAtTime(noise, ac.currentTime)
    ng.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur)
    src.connect(f)
    f.connect(ng)
    ng.connect(master)
    src.start()
    src.stop(ac.currentTime + dur + 0.02)
  }
}

export const soundtrack = {
  async unlock() {
    await wake()
  },
  setMuted(muted) {
    env()
    master.gain.cancelScheduledValues(env().currentTime)
    master.gain.linearRampToValueAtTime(muted ? 0 : 0.6, env().currentTime + 0.08)
  },
  hiss(on, volume = 0.014) {
    if (!started) return
    const ac = env()
    if (!hissGain) {
      hissGain = ac.createGain()
      hissGain.gain.value = 0
      const f = ac.createBiquadFilter()
      f.type = 'highpass'
      f.frequency.value = 2400
      const src = ac.createBufferSource()
      src.buffer = noiseBuffer(1.5)
      src.loop = true
      src.connect(f)
      f.connect(hissGain)
      hissGain.connect(master)
      src.start()
    }
    hissGain.gain.cancelScheduledValues(ac.currentTime)
    hissGain.gain.linearRampToValueAtTime(on ? volume : 0, ac.currentTime + 0.2)
  },
  key(ch) {
    if (!started) return
    wake()
    if (ch === ' ' || ch === '\n') {
      blip({ freq: 420, fall: 260, dur: 0.02, gain: 0.04, noise: 0.015 })
      return
    }
    blip({
      freq: 640 + Math.random() * 160,
      fall: 340,
      dur: 0.036,
      gain: 0.24,
      noise: 0.06,
    })
  },
  back() {
    if (!started) return
    wake()
    blip({ freq: 260, fall: 480, dur: 0.028, gain: 0.09, noise: 0.03 })
  },
  noiseBurst({ dur = 0.4, freq = 2000, q = 0.4, gain = 0.4, type = 'bandpass' } = {}) {
    if (!started) return
    wake()
    const ac = env()
    const src = ac.createBufferSource()
    const g = ac.createGain()
    const f = ac.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    f.Q.value = q
    src.buffer = noiseBuffer(Math.max(dur, 0.05))
    g.gain.setValueAtTime(gain, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur)
    src.connect(f)
    f.connect(g)
    g.connect(master)
    src.start()
    src.stop(ac.currentTime + dur + 0.02)
  },
  glitchTv(pattern = 0) {
    if (!started) return
    wake()
    const ac = env()
    const p = Math.abs(pattern) % 12
    const now = ac.currentTime
    if (p === 0) {
      this.noiseBurst({ dur: 0.62, freq: 2800, q: 0.22, gain: 0.52, type: 'bandpass' })
    } else if (p === 1) {
      blip({ freq: 110, fall: 55, dur: 0.04, gain: 0.28, noise: 0.12, type: 'sine' })
      this.noiseBurst({ dur: 0.07, freq: 5000, type: 'highpass', gain: 0.22 })
    } else if (p === 2) {
      const osc = ac.createOscillator()
      const g = ac.createGain()
      const lfo = ac.createOscillator()
      const lg = ac.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = 160
      lfo.frequency.value = 6
      lg.gain.value = 70
      lfo.connect(lg)
      lg.connect(osc.frequency)
      g.gain.setValueAtTime(0.14, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)
      osc.connect(g)
      g.connect(master)
      osc.start(now)
      lfo.start(now)
      osc.stop(now + 0.45)
      lfo.stop(now + 0.45)
      this.noiseBurst({ dur: 0.4, freq: 1100, q: 1.8, gain: 0.18 })
    } else if (p === 3) {
      ;[60, 120, 180].forEach((f, i) => {
        const osc = ac.createOscillator()
        const g = ac.createGain()
        osc.type = 'sine'
        osc.frequency.value = f
        g.gain.setValueAtTime(0.16 / (i + 1), now)
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
        osc.connect(g)
        g.connect(master)
        osc.start(now)
        osc.stop(now + 0.52)
      })
    } else if (p === 4) {
      blip({ freq: 75, fall: 38, dur: 0.09, gain: 0.38, noise: 0.18, type: 'sine' })
    } else if (p === 5) {
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(210, now)
      osc.frequency.linearRampToValueAtTime(170, now + 0.2)
      osc.frequency.linearRampToValueAtTime(230, now + 0.45)
      g.gain.setValueAtTime(0.15, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
      osc.connect(g)
      g.connect(master)
      osc.start(now)
      osc.stop(now + 0.52)
    } else if (p === 6) {
      ;[0, 0.05, 0.11, 0.18, 0.26].forEach((t, i) => {
        const osc = ac.createOscillator()
        const g = ac.createGain()
        osc.type = 'triangle'
        osc.frequency.value = 1700 + i * 380
        g.gain.setValueAtTime(0, now + t)
        g.gain.linearRampToValueAtTime(0.11, now + t + 0.004)
        g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.035)
        osc.connect(g)
        g.connect(master)
        osc.start(now + t)
        osc.stop(now + t + 0.04)
      })
    } else if (p === 7) {
      this.noiseBurst({ dur: 0.55, freq: 90, q: 0.8, gain: 0.32, type: 'lowpass' })
    } else if (p === 8) {
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = 'square'
      osc.frequency.value = 1575
      g.gain.setValueAtTime(0.08, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
      osc.connect(g)
      g.connect(master)
      osc.start(now)
      osc.stop(now + 0.24)
      this.noiseBurst({ dur: 0.2, freq: 800, q: 5, gain: 0.2 })
    } else if (p === 9) {
      this.noiseBurst({ dur: 0.75, freq: 3500, q: 0.2, gain: 0.58 })
    } else if (p === 10) {
      blip({ freq: 3579, fall: 3400, dur: 0.28, gain: 0.11, noise: 0.08, type: 'sine' })
    } else {
      blip({ freq: 100, fall: 50, dur: 0.06, gain: 0.3, noise: 0.2, type: 'sine' })
      this.noiseBurst({ dur: 0.28, freq: 1600, q: 0.6, gain: 0.42 })
    }
  },
  glitchRgb(pattern = 0) {
    if (!started) return
    wake()
    const ac = env()
    const p = Math.abs(pattern) % 12
    const now = ac.currentTime
    const zip = (t, freq, dur = 0.028, gain = 0.15) => {
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = 'square'
      osc.frequency.value = freq
      g.gain.setValueAtTime(0, now + t)
      g.gain.linearRampToValueAtTime(gain, now + t + 0.003)
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + dur)
      osc.connect(g)
      g.connect(master)
      osc.start(now + t)
      osc.stop(now + t + dur + 0.01)
    }
    if (p === 0) {
      zip(0, 180, 0.04, 0.14)
      zip(0.05, 310, 0.04, 0.12)
      zip(0.11, 95, 0.05, 0.16)
    } else if (p === 1) {
      ;[0, 0.025, 0.05, 0.075, 0.11, 0.14, 0.19].forEach((t, i) => zip(t, 70 + i * 55, 0.018, 0.12))
    } else if (p === 2) {
      blip({ freq: 1400, fall: 280, dur: 0.22, gain: 0.2, noise: 0.04, type: 'sawtooth' })
    } else if (p === 3) {
      this.noiseBurst({ dur: 0.12, freq: 400, q: 0.15, gain: 0.4, type: 'lowpass' })
      zip(0.08, 90, 0.04, 0.12)
    } else if (p === 4) {
      blip({ freq: 980, fall: 70, dur: 0.4, gain: 0.17, noise: 0.07, type: 'sawtooth' })
    } else if (p === 5) {
      zip(0, 880, 0.05, 0.14)
      zip(0.09, 880, 0.05, 0.14)
      zip(0.18, 880, 0.05, 0.14)
    } else if (p === 6) {
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = 'square'
      osc.frequency.value = 55
      g.gain.setValueAtTime(0.28, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)
      osc.connect(g)
      g.connect(master)
      osc.start(now)
      osc.stop(now + 0.08)
    } else if (p === 7) {
      ;[0, 0.03, 0.06, 0.09, 0.12, 0.16, 0.2, 0.24].forEach((t) => zip(t, 240, 0.02, 0.13))
    } else if (p === 8) {
      zip(0, 4200, 0.05, 0.1)
      this.noiseBurst({ dur: 0.08, freq: 6000, type: 'highpass', gain: 0.18 })
    } else if (p === 9) {
      zip(0, 440, 0.07, 0.14)
      zip(0.09, 220, 0.1, 0.16)
    } else if (p === 10) {
      this.noiseBurst({ dur: 0.1, freq: 2000, q: 0.4, gain: 0.28 })
      zip(0.04, 1500, 0.03, 0.12)
      zip(0.08, 400, 0.04, 0.12)
    } else {
      zip(0.09, 90, 0.06, 0.2)
    }
  },
  sysTick() {
    if (!started) return
    wake()
    blip({ freq: 880, fall: 700, dur: 0.05, gain: 0.14, noise: 0.02, type: 'square' })
  },
  crackle() {
    this.glitchTv()
  },
  glitchKey() {
    this.glitchTv()
  },
  rumble(level = 1) {
    if (!started) return
    wake()
    const ac = env()
    if (!rumbleOsc) {
      rumbleOsc = ac.createOscillator()
      rumbleGain = ac.createGain()
      rumbleOsc.type = 'sine'
      rumbleOsc.frequency.value = 38
      rumbleGain.gain.value = 0.0001
      rumbleOsc.connect(rumbleGain)
      rumbleGain.connect(master)
      rumbleOsc.start()
    }
    rumbleGain.gain.cancelScheduledValues(ac.currentTime)
    rumbleGain.gain.linearRampToValueAtTime(0.08 + level * 0.12, ac.currentTime + 0.25)
    rumbleOsc.frequency.linearRampToValueAtTime(32 + level * 8, ac.currentTime + 0.3)
  },
  alarm() {
    if (!started) return
    wake()
    this.stopAlarm()
    const ac = env()
    const make = (freq, delay) => {
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = 'sawtooth'
      osc.frequency.value = freq
      g.gain.value = 0.09
      const lfo = ac.createOscillator()
      const lg = ac.createGain()
      lfo.frequency.value = 2.2
      lg.gain.value = freq * 0.18
      lfo.connect(lg)
      lg.connect(osc.frequency)
      osc.connect(g)
      g.connect(master)
      osc.start(ac.currentTime + delay)
      lfo.start(ac.currentTime + delay)
      alarmNodes.push(osc, lfo)
    }
    make(780, 0)
    make(520, 0)
  },
  stopAlarm() {
    alarmNodes.forEach((n) => {
      try {
        n.stop()
      } catch {
        /* */
      }
    })
    alarmNodes = []
  },
  crackGlass() {
    if (!started) return
    wake()
    const ac = env()
    const src = ac.createBufferSource()
    const g = ac.createGain()
    const f = ac.createBiquadFilter()
    f.type = 'highpass'
    f.frequency.value = 2800
    src.buffer = noiseBuffer(0.28)
    g.gain.setValueAtTime(0.45, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.25)
    src.connect(f)
    f.connect(g)
    g.connect(master)
    src.start()
    src.stop(ac.currentTime + 0.3)
    blip({ freq: 2100, fall: 400, dur: 0.12, gain: 0.16, noise: 0, type: 'triangle' })
  },
  impact() {
    if (!started) return
    wake()
    blip({ freq: 90, fall: 32, dur: 0.45, gain: 0.4, noise: 0.2, type: 'sine' })
  },
  rewind() {
    if (!started) return
    wake()
    this.stopRewind()
    const ac = env()
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(1100, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(55, ac.currentTime + 12)
    g.gain.setValueAtTime(0.12, ac.currentTime)
    g.gain.linearRampToValueAtTime(0.18, ac.currentTime + 6)
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 12.2)
    osc.connect(g)
    g.connect(master)
    osc.start()
    osc.stop(ac.currentTime + 12.3)
    rewindOsc = osc
  },
  stopRewind() {
    if (rewindOsc) {
      try {
        rewindOsc.stop()
      } catch {
        /* */
      }
      rewindOsc = null
    }
  },
  stopDisaster() {
    this.stopAlarm()
    this.stopRewind()
    if (rumbleGain) {
      rumbleGain.gain.linearRampToValueAtTime(0.0001, env().currentTime + 0.4)
    }
  },
  present() {
    if (!started) return
    this.stopDisaster()
    this.hiss(true, 0.01)
  },
  dead() {
    if (!started) return
    this.glitchTv()
    this.hiss(false)
  },
  off() {
    if (!started) return
    this.impact()
    this.glitchTv()
    this.hiss(false)
    this.stopDisaster()
  },
}
