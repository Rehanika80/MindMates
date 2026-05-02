import { useEffect, useRef, useState } from 'react'
import { apiRequest } from '../../lib/api.js'

const Piano = ({ onClose, emotion }) => {
  const audioContextRef = useRef(null)
  const [notes, setNotes] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const startTimeRef = useRef(Date.now())
  const [isSaving, setIsSaving] = useState(false)

  // Piano note frequencies (in Hz)
  const PIANO_NOTES = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392,
    A4: 440,
    B4: 493.88,
    C5: 523.25,
  }

  const NOTE_LABELS = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']
  const NOTE_KEYS = Object.keys(PIANO_NOTES)

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
  }, [])

  const playNote = (frequency, duration = 0.5) => {
    const ctx = audioContextRef.current
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.frequency.value = frequency
      osc.type = 'sine'

      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)

      osc.start(now)
      osc.stop(now + duration)

      setNotes((prev) => [...prev, { frequency, time: new Date().toLocaleTimeString() }])
    } catch (error) {
      console.error('Error playing note:', error)
    }
  }

  const handleKeyClick = (noteKey) => {
    playNote(PIANO_NOTES[noteKey])
  }

  const playMelody = async () => {
    setIsPlaying(true)
    const melody = [
      { note: 'C4', duration: 0.3 },
      { note: 'E4', duration: 0.3 },
      { note: 'G4', duration: 0.3 },
      { note: 'C5', duration: 0.6 },
      { note: 'B4', duration: 0.3 },
      { note: 'G4', duration: 0.3 },
      { note: 'A4', duration: 0.3 },
      { note: 'G4', duration: 0.6 },
    ]

    for (const { note, duration } of melody) {
      playNote(PIANO_NOTES[note], duration)
      await new Promise((resolve) => setTimeout(resolve, duration * 1000 + 100))
    }

    setIsPlaying(false)
  }

  const clearNotes = () => {
    setNotes([])
  }

  const logGameSession = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      await apiRequest('/games/session', {
        method: 'POST',
        body: JSON.stringify({
          gameId: 'piano',
          score: notes.length * 5,
          duration: duration,
          emotion: emotion,
        }),
      })
    } catch (error) {
      console.error('Error logging game session:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    logGameSession()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg p-8 border border-purple-400/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-white">🎹 Piano Master</h2>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
          >
            Close
          </button>
        </div>

        <p className="text-slate-300 mb-6 text-lg">
          {emotion === 'Stressed' || emotion === 'Tired'
            ? 'Play soothing melodies to relax and unwind'
            : 'Express yourself through music and enjoy peaceful playing'}
        </p>

        {/* Piano Keys */}
        <div className="mb-8 p-6 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg border border-purple-400/20">
          <p className="text-white mb-4 font-semibold">Click keys or use keyboard</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {NOTE_KEYS.map((key, idx) => (
              <button
                key={key}
                onClick={() => handleKeyClick(key)}
                disabled={isPlaying}
                className="w-16 h-24 bg-gradient-to-b from-white to-gray-200 text-black font-bold text-xl rounded-b-lg shadow-lg hover:from-gray-50 hover:to-gray-100 active:from-gray-300 active:to-gray-400 disabled:opacity-50 border-2 border-gray-300 transition transform hover:scale-105"
              >
                {NOTE_LABELS[idx]}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <button
            onClick={playMelody}
            disabled={isPlaying}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 disabled:opacity-50 transition"
          >
            🎵 Play Demo Melody
          </button>
          <button
            onClick={clearNotes}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            🗑️ Clear Notes
          </button>
        </div>

        {/* Notes Log */}
        {notes.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-4 border border-purple-400/20 max-h-48 overflow-y-auto">
            <p className="text-white font-semibold mb-3">Notes Played: {notes.length}</p>
            <div className="space-y-1">
              {notes.map((note, idx) => (
                <div key={idx} className="text-sm text-slate-300 flex justify-between">
                  <span>♪ {(note.frequency).toFixed(2)} Hz</span>
                  <span>{note.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Piano
