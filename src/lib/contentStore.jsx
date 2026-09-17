import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { defaultContent, PHOTO_SLOTS } from '../data/siteContent'
import {
  blobToDataUrl,
  clearAllPhotos,
  dataUrlToBlob,
  deletePhoto,
  loadAllPhotos,
  savePhoto,
} from './mediaStore'

const KEY = 'maryam-radio-v6'
const ContentCtx = createContext(null)

function mergeContent(saved) {
  const base = structuredClone(defaultContent)
  if (!saved || typeof saved !== 'object') return base
  const next = { ...base, ...saved }
  next.blocks =
    Array.isArray(saved.blocks) && saved.blocks.length ? saved.blocks : base.blocks
  next.nightLines =
    Array.isArray(saved.nightLines) && saved.nightLines.length
      ? saved.nightLines
      : base.nightLines
  return next
}

function readSaved() {
  try {
    return mergeContent(JSON.parse(localStorage.getItem(KEY) || 'null'))
  } catch {
    return mergeContent(null)
  }
}

export function ContentProvider({ children }) {
  const [content, setContentState] = useState(readSaved)
  const [photos, setPhotos] = useState({})
  const [ready, setReady] = useState(true)

  useEffect(() => {
    const created = []
    let cancelled = false
    const timeout = setTimeout(() => {
      if (!cancelled) setReady(true)
    }, 250)
    loadAllPhotos()
      .then((blobs) => {
        if (cancelled) return
        const map = {}
        for (const [key, blob] of Object.entries(blobs)) {
          const url = URL.createObjectURL(blob)
          created.push(url)
          map[key] = url
        }
        setPhotos(map)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
      clearTimeout(timeout)
      created.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const persist = useCallback((next) => {
    setContentState(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }, [])

  const updateContent = useCallback((patch) => {
    setContentState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : mergeContent({ ...prev, ...patch })
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setPhoto = useCallback(async (key, file) => {
    const blob = file instanceof Blob ? file : new Blob([file])
    await savePhoto(key, blob)
    const url = URL.createObjectURL(blob)
    setPhotos((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key])
      return { ...prev, [key]: url }
    })
  }, [])

  const removePhoto = useCallback(async (key) => {
    await deletePhoto(key)
    setPhotos((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key])
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const resetToDefault = useCallback(async () => {
    await clearAllPhotos()
    setPhotos((prev) => {
      Object.values(prev).forEach((url) => URL.revokeObjectURL(url))
      return {}
    })
    persist(mergeContent(null))
  }, [persist])

  const exportBundle = useCallback(async () => {
    const blobs = await loadAllPhotos()
    const photosB64 = {}
    for (const [key, blob] of Object.entries(blobs)) {
      photosB64[key] = await blobToDataUrl(blob)
    }
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      content,
      photos: photosB64,
    }
  }, [content])

  const importBundle = useCallback(async (bundle) => {
    if (!bundle || typeof bundle !== 'object') throw new Error('Invalid backup file')
    const next = mergeContent(bundle.content)
    persist(next)
    await clearAllPhotos()
    const map = {}
    for (const [key, dataUrl] of Object.entries(bundle.photos || {})) {
      const blob = await dataUrlToBlob(dataUrl)
      await savePhoto(key, blob)
      map[key] = URL.createObjectURL(blob)
    }
    setPhotos((prev) => {
      Object.values(prev).forEach((url) => URL.revokeObjectURL(url))
      return map
    })
  }, [persist])

  const value = useMemo(
    () => ({
      ready,
      content,
      photos,
      slots: PHOTO_SLOTS,
      updateContent,
      setPhoto,
      removePhoto,
      resetToDefault,
      exportBundle,
      importBundle,
    }),
    [
      ready,
      content,
      photos,
      updateContent,
      setPhoto,
      removePhoto,
      resetToDefault,
      exportBundle,
      importBundle,
    ],
  )

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>
}

export function useContent() {
  const ctx = useContext(ContentCtx)
  if (!ctx) throw new Error('useContent must be used inside ContentProvider')
  return ctx
}
