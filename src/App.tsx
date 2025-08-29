import React from 'react'
import './App.css'
import ImageUploader from './components/imageUploader'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <ImageUploader />
      </header>
    </div>
  )
}

export default App
