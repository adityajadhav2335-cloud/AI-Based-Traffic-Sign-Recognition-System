import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  CloudUpload,
  Compass,
  FileImage,
  ImagePlus,
  Languages,
  Leaf,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import './App.css'
import heroImage from './assets/hero.png'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const copy = {
  English: {
    hello: 'Hello, road explorer',
    heading: 'Know the sign.\nKnow what to do.',
    subheading: 'Upload a road image to check the API workflow. The trained recognition model is not connected yet; the separate sample is illustrative only.',
    uploadTitle: 'Start with a road image',
    uploadDesc: 'Drop an image here or choose one from your device.',
    browse: 'Browse files',
    meaningTitle: 'What this sign means',
    instructionTitle: 'What you should do',
    mockNote: 'DEMO OUTPUT — ILLUSTRATIVE EXAMPLE, NOT A REAL MODEL PREDICTION',
    purposeTitle: 'Why this sign is used',
    tip: 'Always follow the sign as posted. This educational tool is not a substitute for road rules or attentive driving.',
    idle: 'Your sign explanation will appear here',
    idleDesc: 'Choose an image or try the sample to preview the experience.',
    select: 'Choose an image to continue',
    formats: 'JPG, PNG or WEBP · up to 10 MB',
  },
  Hindi: {
    hello: 'नमस्ते, सड़क यात्री',
    heading: 'संकेत समझें।\nसुरक्षित चलें।',
    subheading: 'यातायात संकेत का अर्थ जानने के लिए सड़क की तस्वीर अपलोड करें। यह डेमो है; परिणाम AI से नहीं आते।',
    uploadTitle: 'सड़क की तस्वीर चुनें',
    uploadDesc: 'यहाँ तस्वीर छोड़ें या अपने डिवाइस से चुनें।',
    browse: 'फ़ाइल चुनें',
    meaningTitle: 'इस संकेत का अर्थ',
    instructionTitle: 'आपको क्या करना चाहिए',
    mockNote: 'डेमो परिणाम — उदाहरण मात्र, वास्तविक मॉडल का पूर्वानुमान नहीं',
    purposeTitle: 'इस संकेत का उद्देश्य',
    tip: 'सड़क पर लगे संकेतों का पालन करें। यह शैक्षिक टूल सड़क नियमों या सावधानीपूर्वक वाहन चलाने का विकल्प नहीं है।',
    idle: 'संकेत की जानकारी यहाँ दिखाई देगी',
    idleDesc: 'तस्वीर चुनें या अनुभव देखने के लिए नमूना आज़माएँ।',
    select: 'जारी रखने के लिए तस्वीर चुनें',
    formats: 'JPG, PNG या WEBP · अधिकतम 10 MB',
  },
}

function Sidebar({ active, onNavigate, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'recognize', label: 'Recognize a sign', icon: Compass },
    { id: 'library', label: 'Sign library', icon: BookOpen },
  ]

  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#top" aria-label="Roadwise home" onClick={() => onNavigate('recognize')}>
          <span className="brand-mark"><Compass size={21} strokeWidth={2.5} /></span>
          <span className="brand-name">roadwise<span>.</span></span>
        </a>

        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`nav-link ${active === id ? 'nav-link-active' : ''}`}
              onClick={() => { onNavigate(id); setMobileOpen(false) }}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {id === 'recognize' && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help-icon"><CircleHelp size={18} /></div>
          <div><strong>Learning project</strong><p>Built for safer, clearer roads.</p></div>
          <a href="#about" aria-label="About this project"><ArrowUpRight size={16} /></a>
        </div>
        <div className="sidebar-version">INDIA · EDUCATION EDITION <span>v0.1</span></div>
      </aside>
    </>
  )
}

function UploadPanel({ file, previewUrl, onFile, onRemove, onDemo, error, t }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (selected) => {
    if (selected) onFile(selected)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <section className={`upload-card ${dragging ? 'upload-card-dragging' : ''}`} aria-labelledby="upload-heading">
      <div className="card-heading-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-number">01</span> UPLOAD</div>
          <h2 id="upload-heading">{t.uploadTitle}</h2>
          <p className="card-subtitle">{t.uploadDesc}</p>
        </div>
        <div className="upload-step-icon"><ImagePlus size={19} /></div>
      </div>

      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Choose a road image"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div
        className={`drop-zone ${file ? 'drop-zone-has-file' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inputRef.current?.click() } }}
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files?.[0]) }}
      >
        {file && previewUrl ? (
          <div className="preview-wrap">
            <img className="image-preview" src={previewUrl} alt={`Preview of ${file.name}`} />
            <div className="preview-file-chip"><FileImage size={14} /><span>{file.name}</span></div>
            <button
              type="button"
              className="remove-file"
              aria-label="Remove selected image"
              onClick={(event) => { event.stopPropagation(); onRemove() }}
            ><X size={16} /></button>
          </div>
        ) : (
          <div className="drop-content">
            <div className="upload-art" aria-hidden="true">
              <div className="upload-art-ring" />
              <div className="upload-art-icon"><CloudUpload size={27} strokeWidth={1.7} /></div>
              <span className="upload-art-spark spark-one">✳</span>
              <span className="upload-art-spark spark-two">✳</span>
            </div>
            <strong>{t.select}</strong>
            <span className="drop-detail">{t.formats}</span>
            <span className="browse-button"><Upload size={15} />{t.browse}</span>
          </div>
        )}
      </div>

      <div className="upload-footnote">
        <span><ShieldCheck size={15} /> Sent to your local API for analysis</span>
        <span><Clock3 size={14} /> Usually under 5 sec</span>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="demo-divider"><span>OR TRY A SAMPLE</span></div>
      <button className="sample-button" type="button" onClick={onDemo}>
        <span className="sample-icon"><Sparkles size={16} /></span>
        <span><strong>Show Illustrative Example</strong><small>A Stop sign reference · not a model prediction</small></span>
        <ArrowDownRight size={17} className="sample-arrow" />
      </button>
    </section>
  )
}

function ResultPanel({ analysisState, analysisResult, analysisError, t, onRetry }) {
  const prediction = analysisResult?.prediction
  const hasResult = analysisState === 'success' && prediction

  return (
    <section className="result-card" aria-labelledby="result-heading" aria-live="polite">
      <div className="card-heading-row result-heading-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-number">02</span> EXPLANATION</div>
          <h2 id="result-heading">{hasResult ? 'Your sign, explained' : analysisState === 'loading' ? 'Reading your image' : 'A clearer view ahead'}</h2>
          <p className="card-subtitle">{analysisState === 'success' ? 'Model result with a confidence estimate.' : 'An uploaded image is shown separately. Analysis appears here.'}</p>
        </div>
      </div>

      {analysisState === 'loading' ? (
        <div className="analysis-state" role="status"><span className="analysis-spinner" /><h3>Checking your image…</h3><p>The image is sent to the local API. Recognition requires a trained model.</p></div>
      ) : analysisState === 'error' ? (
        <div className="analysis-state analysis-error-state" role="alert"><span className="analysis-state-icon"><X size={18} /></span><h3>We couldn’t analyze this image</h3><p>{analysisError}</p><button type="button" className="analysis-retry" onClick={onRetry}>Try again</button></div>
      ) : analysisState === 'success' && !prediction ? (
        <div className="analysis-state" role="status"><span className="analysis-state-icon"><Search size={18} /></span><h3>No classification returned</h3><p>The API did not return a sign classification for this image.</p></div>
      ) : hasResult ? (
        <>
          <div className="api-result-banner"><Check size={14} /><span>Recognized by the local model</span><strong>{Math.round(prediction.confidence * 100)}% match</strong></div>
          <div className="result-main">
            <div className="result-info">
              <div className="result-category"><span className="category-dot" />{prediction.category}</div>
              <h3>{prediction.label}</h3>
              <p className="result-caption">{`Class ${prediction.class_id} · ${analysisResult.model.name}`}</p>
            </div>
          </div>

          <div className="explanation-grid">
            <div className="explanation-item">
              <div className="explanation-icon meaning-icon"><BookOpen size={16} /></div>
              <div><h4>{t.meaningTitle}</h4><p>{prediction.explanation.meaning}</p></div>
            </div>
            <div className="explanation-item">
              <div className="explanation-icon meaning-icon"><Compass size={16} /></div>
              <div><h4>{t.purposeTitle}</h4><p>{prediction.explanation.purpose}</p></div>
            </div>
            <div className="explanation-item">
              <div className="explanation-icon action-icon"><Check size={16} /></div>
              <div><h4>{t.instructionTitle}</h4><p>{prediction.explanation.recommended_driver_action}</p></div>
            </div>
          </div>
          <div className="safety-note"><ShieldCheck size={16} /><span>{t.tip}</span></div>
        </>
      ) : (
        <div className="empty-result">
          <div className="empty-road-art" aria-hidden="true">
            <div className="empty-sun" />
            <div className="road-hill hill-back" />
            <div className="road-hill hill-front" />
            <div className="empty-road"><span /><span /><span /></div>
            <div className="empty-signpost"><div className="empty-sign"><span /></div><i /></div>
          </div>
          <h3>{analysisState === 'error' ? 'AI recognition is not available yet.' : t.idle}</h3>
          <p>{analysisState === 'error' ? analysisError : t.idleDesc}</p>
          {analysisState === 'idle' && <div className="empty-checklist"><span><Check size={13} /> Easy to understand</span><span><Check size={13} /> Made for Indian roads</span></div>}
        </div>
      )}
    </section>
  )
}

function IllustrativeExample({ visible, t, onClose }) {
  if (!visible) return null

  return (
    <section className="result-card illustrative-example" aria-labelledby="illustrative-example-heading">
      <div className="card-heading-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-number">REFERENCE</span> NOT MODEL OUTPUT</div>
          <h2 id="illustrative-example-heading">Illustrative Example</h2>
          <p className="card-subtitle">A fixed Stop-sign example for demonstrating the result layout.</p>
        </div>
        <button className="icon-button reset-button" type="button" aria-label="Hide illustrative example" onClick={onClose}><X size={16} /></button>
      </div>
      <div className="mock-banner"><Sparkles size={14} /><span>{t.mockNote}</span></div>
      <div className="result-main illustrative-result-main">
        <div className="sign-preview-area"><StopSign /></div>
        <div className="result-info">
          <div className="result-category"><span className="category-dot" />Mandatory / Regulatory</div>
          <h3>Stop</h3>
        </div>
      </div>
      <div className="explanation-grid">
        <div className="explanation-item"><div className="explanation-icon meaning-icon"><BookOpen size={16} /></div><div><h4>{t.meaningTitle}</h4><p>A driver facing a Stop sign must stop before the stop line. If no line is marked or visible, stop immediately before the sign.</p></div></div>
        <div className="explanation-item"><div className="explanation-icon meaning-icon"><Compass size={16} /></div><div><h4>{t.purposeTitle}</h4><p>To control right of way at a junction and prevent conflicting traffic movements.</p></div></div>
        <div className="explanation-item"><div className="explanation-icon action-icon"><Check size={16} /></div><div><h4>{t.instructionTitle}</h4><p>Give way to major-road traffic and pedestrians where applicable. Enter only when the way ahead is clear.</p></div></div>
      </div>
    </section>
  )
}

function StopSign() {
  return (
    <div className="sign-illustration" aria-label="Illustration of a Stop sign">
      <div className="stop-post" />
      <div className="stop-octagon"><span>STOP</span></div>
      <div className="sign-ground" />
    </div>
  )
}

const trafficSigns = [
  { id: 'stop', label: 'Stop', category: 'Mandatory', shape: 'stop', code: 'R-1', meaning: 'Come to a complete stop before the stop line. Proceed only when the way is clear.', action: 'Stop fully, check all directions, give way to pedestrians, and continue only when it is safe.' },
  { id: 'no-entry', label: 'No Entry', category: 'Prohibitory', shape: 'no-entry', code: 'R-5', meaning: 'Vehicles are not allowed to enter the road or lane from this direction.', action: 'Do not enter. Find a permitted route and follow any diversion signs.' },
  { id: 'speed', label: 'Speed Limit · 50', category: 'Regulatory', shape: 'speed', code: 'R-2', meaning: 'The maximum permitted speed on this stretch is 50 km/h.', action: 'Keep your speed at or below the posted limit and reduce it further for road, weather, and traffic conditions.' },
  { id: 'school', label: 'School Ahead', category: 'Cautionary', shape: 'school', code: 'W-11', meaning: 'A school or school crossing is ahead, where children may cross the road.', action: 'Slow down, watch both sides of the road, and be ready to stop for children.' },
  { id: 'pedestrian', label: 'Pedestrian Crossing', category: 'Cautionary', shape: 'pedestrian', code: 'W-8', meaning: 'A marked crossing for people walking is ahead.', action: 'Slow down and give pedestrians space to cross safely.' },
  { id: 'no-parking', label: 'No Parking', category: 'Prohibitory', shape: 'no-parking', code: 'R-10', meaning: 'Parking is prohibited in the area covered by this sign.', action: 'Keep the area clear and look for a designated parking space.' },
  { id: 'give-way', label: 'Give Way', category: 'Mandatory', shape: 'give-way', code: 'R-2A', meaning: 'You must yield to traffic on the road you are approaching.', action: 'Slow down, check for traffic and pedestrians, and wait until there is a safe gap.' },
  { id: 'no-uturn', label: 'No U-turn', category: 'Prohibitory', shape: 'no-uturn', code: 'R-9', meaning: 'Making a U-turn is prohibited at this point.', action: 'Continue ahead and turn around only where signs and road markings allow it.' },
]

const signCategories = ['All signs', 'Mandatory', 'Cautionary', 'Prohibitory', 'Regulatory']

function LibraryPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All signs')
  const [selectedSign, setSelectedSign] = useState(null)
  const visibleSigns = trafficSigns.filter((sign) => {
    const matchesCategory = category === 'All signs' || sign.category === category
    const matchesQuery = `${sign.label} ${sign.category} ${sign.meaning}`.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  return (
    <section className="library-page" aria-labelledby="library-heading">
      <div className="library-page-heading">
        <div className="library-breadcrumb"><span>Workspace</span><span>/</span><strong>Sign library</strong></div>
        <div className="library-heading-row">
          <div><span className="library-kicker"><BookOpen size={14} /> ROADWISE REFERENCE</span><h1 id="library-heading">Sign library</h1><p>Browse common road signs and learn what to do when you see one.</p></div>
          <div className="library-count"><strong>{trafficSigns.length}</strong><span>signs to explore</span></div>
        </div>
      </div>

      <div className="library-browser">
        <div className="library-browser-main">
          <div className="library-toolbar">
            <div className="library-search"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedSign(null) }} placeholder="Search signs" aria-label="Search signs" />{query && <button type="button" onClick={() => { setQuery(''); setSelectedSign(null) }} aria-label="Clear search"><X size={15} /></button>}</div>
            <span className="library-results-count">{visibleSigns.length} {visibleSigns.length === 1 ? 'sign' : 'signs'}</span>
          </div>
          <div className="library-filter-row" aria-label="Filter signs by category">
            {signCategories.map((item) => <button type="button" key={item} className={`library-filter ${category === item ? 'library-filter-active' : ''}`} onClick={() => { setCategory(item); setSelectedSign(null) }}>{item}</button>)}
          </div>
          {visibleSigns.length ? (
            <div className={`sign-card-grid ${selectedSign ? 'sign-card-grid-selected' : ''}`}>
              {visibleSigns.map((sign) => <button type="button" className={`sign-card ${selectedSign?.id === sign.id ? 'sign-card-selected' : ''}`} key={sign.id} onClick={() => setSelectedSign(sign)} aria-pressed={selectedSign?.id === sign.id}>
                <span className={`sign-card-art sign-shape-${sign.shape}`}><LibrarySign sign={sign.shape} /></span>
                <span className="sign-card-copy"><strong>{sign.label}</strong><small>{sign.category}</small></span>
                <span className="sign-card-arrow"><ArrowUpRight size={15} /></span>
              </button>)}
            </div>
          ) : <div className="library-empty"><Search size={22} /><strong>No signs found</strong><span>Try another search or category.</span></div>}
        </div>

        <aside className={`sign-detail-panel ${selectedSign ? 'sign-detail-open' : ''}`} aria-live="polite">
          {selectedSign ? <>
            <div className="detail-panel-top"><span>PREVIEW</span><button type="button" onClick={() => setSelectedSign(null)} aria-label="Close sign details"><X size={17} /></button></div>
            <div className={`detail-sign-art sign-shape-${selectedSign.shape}`}><LibrarySign sign={selectedSign.shape} /></div>
            <div className="detail-title-row"><div><span className="detail-code">SIGN {selectedSign.code}</span><h2>{selectedSign.label}</h2></div><span className={`detail-category category-${selectedSign.category.toLowerCase()}`}>{selectedSign.category}</span></div>
            <div className="detail-info-block"><span className="detail-info-icon"><BookOpen size={16} /></span><div><h3>What it means</h3><p>{selectedSign.meaning}</p></div></div>
            <div className="detail-info-block"><span className="detail-info-icon detail-action-icon"><Check size={16} /></span><div><h3>What you should do</h3><p>{selectedSign.action}</p></div></div>
            <div className="detail-safety"><ShieldCheck size={16} /><span>Always follow the sign and road markings as posted.</span></div>
          </> : <div className="detail-empty"><span className="detail-empty-icon"><BookOpen size={20} /></span><strong>Choose a sign to preview</strong><p>Select any sign card to see its meaning and what to do next.</p></div>}
        </aside>
      </div>
      <footer className="page-footer library-footer"><span>ROADWISE <b>·</b> A STUDENT LEARNING PROJECT</span><span><ShieldCheck size={14} /> Examples are for learning. Always follow signs as posted.</span></footer>
    </section>
  )
}

function LibrarySign({ sign }) {
  if (sign === 'no-entry') return <><span className="mini-red-ring" /><span className="mini-white-bar" /></>
  if (sign === 'speed') return <span className="mini-speed">50</span>
  if (sign === 'school') return <span className="mini-school"><i /><i /><b /></span>
  if (sign === 'pedestrian') return <span className="mini-pedestrian"><i /><b /></span>
  if (sign === 'no-parking') return <span className="mini-no-parking">P</span>
  if (sign === 'give-way') return <span className="mini-give-way" />
  if (sign === 'no-uturn') return <span className="mini-no-uturn">↶</span>
  return <span className="mini-stop">STOP</span>
}

function App() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const [analysisState, setAnalysisState] = useState('idle')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  const [language, setLanguage] = useState('English')
  const [activeNav, setActiveNav] = useState('recognize')
  const [mobileOpen, setMobileOpen] = useState(false)
  const analysisRequestRef = useRef(0)
  const t = copy[language]

  useEffect(() => {
    if (!previewUrl) return undefined
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const runAnalysis = async (selectedFile) => {
    if (!selectedFile) return
    const requestId = ++analysisRequestRef.current
    const formData = new FormData()
    formData.append('file', selectedFile)
    setAnalysisState('loading')
    setAnalysisResult(null)
    setAnalysisError('')
    setShowDemo(false)

    try {
      const response = await fetch('/api/analyze', { method: 'POST', body: formData })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.detail || `Analysis failed (${response.status}).`)
      if (requestId !== analysisRequestRef.current) return
      setAnalysisResult(payload)
      setAnalysisState('success')
    } catch (requestError) {
      if (requestId !== analysisRequestRef.current) return
      setAnalysisError(requestError instanceof TypeError
        ? 'Could not connect to the backend. Start the FastAPI service in a second terminal.'
        : requestError.message)
      setAnalysisState('error')
    }
  }

  const selectFile = (selectedFile) => {
    analysisRequestRef.current += 1
    setError('')
    setShowDemo(false)
    setAnalysisState('idle')
    setAnalysisResult(null)
    setAnalysisError('')
    if (!selectedFile) return
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setFile(null)
      setPreviewUrl('')
      setError('That file type is not supported. Please choose a JPG, PNG or WEBP image.')
      return
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null)
      setPreviewUrl('')
      setError('This image is larger than 10 MB. Please choose a smaller file.')
      return
    }
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    runAnalysis(selectedFile)
  }

  const runDemo = () => {
    setError('')
    analysisRequestRef.current += 1
    setAnalysisState('idle')
    setAnalysisResult(null)
    setAnalysisError('')
    setShowDemo(true)
  }
  const resetResult = () => {
    analysisRequestRef.current += 1
    setShowDemo(false)
    setAnalysisState('idle')
    setAnalysisResult(null)
    setAnalysisError('')
  }
  const removeSelectedFile = () => {
    analysisRequestRef.current += 1
    setFile(null)
    setPreviewUrl('')
    setShowDemo(false)
    setAnalysisState('idle')
    setAnalysisResult(null)
    setAnalysisError('')
  }

  return (
    <div className="app-shell" id="top">
      <Sidebar active={activeNav} onNavigate={setActiveNav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="main-content">
        <header className="topbar">
          <button type="button" className="mobile-menu-button icon-button" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{activeNav === 'library' ? 'Sign library' : 'Recognition'}</strong></div>
          <div className="topbar-actions">
            <div className="demo-status"><span className="status-indicator" /><span>UI demo</span></div>
            <div className="language-control"><Languages size={16} /><select aria-label="Select language" value={language} onChange={(event) => setLanguage(event.target.value)}><option>English</option><option>Hindi</option></select><ChevronDown size={13} className="language-chevron" /></div>
            <div className="avatar" aria-label="Student profile">A</div>
          </div>
        </header>

        {activeNav === 'library' ? <div className="page-content"><LibraryPage /></div> : <div className="page-content">
          <section className="welcome-section">
            <div className="welcome-copy">
            <div className="welcome-eyebrow"><span className="welcome-sun">✳</span> A LITTLE MORE CLARITY ON THE ROAD</div>
              <h1>{t.heading.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
              <p>{t.subheading}</p>
              <div className="welcome-meta"><span><MapPin size={14} /> Designed for India</span><i /><span><Leaf size={14} /> Learning as we go</span></div>
            </div>
            <div className="welcome-visual">
              <img
                className="welcome-photo"
                src={heroImage}
                alt="A city street framed by buildings and trees"
                fetchPriority="high"
              />
              <div className="welcome-photo-shade" />
              <div className="photo-caption"><span className="photo-caption-icon"><Compass size={15} /></span><span><strong>Look closer.</strong><small>Every sign has a story.</small></span></div>
              <div className="photo-index"><span>01</span><i /> ROADWISE FIELD NOTES</div>
            </div>
          </section>

          <div className="workspace-grid" id="recognize">
            <UploadPanel file={file} previewUrl={previewUrl} onFile={selectFile} onRemove={removeSelectedFile} onDemo={runDemo} error={error} t={t} />
            <ResultPanel analysisState={analysisState} analysisResult={analysisResult} analysisError={analysisError} t={t} onRetry={() => runAnalysis(file)} />
          </div>
          <IllustrativeExample visible={showDemo} t={t} onClose={resetResult} />

          <footer className="page-footer" id="about">
            <span>ROADWISE <b>·</b> A STUDENT LEARNING PROJECT</span>
            <span><ShieldCheck size={14} /> Always drive attentively. <a href="#top">Back to top <ArrowUpRight size={13} /></a></span>
          </footer>
        </div>}
      </main>
    </div>
  )
}

export default App
