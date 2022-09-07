import { useState } from 'react'
import './App.css'
import gifFTLogo from './assets/gifft.svg';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>GifFT</h1>
      <h2>Your gift as NFT</h2>
      <img src={gifFTLogo} alt="GifFT logo" />
      <h1>Comming soon</h1>
    </div>
  )
}

export default App
