function Placeholder({ title }) {
  return (
    <div className="page-with-navbar flex-center" style={{ flexDirection: 'column', textAlign: 'center' }}>
      <p className="eyebrow" style={{ marginBottom: 12 }}>Coming next</p>
      <h1 style={{ fontSize: 28 }}>{title}</h1>
      <p className="text-dim" style={{ marginTop: 10, fontSize: 14 }}>
        This page will connect to the Milap backend.
      </p>
    </div>
  )
}

export default Placeholder
