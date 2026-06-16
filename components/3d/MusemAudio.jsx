// src/components/ui/MuseumAudio.jsx
import { useEffect, useRef, useState } from "react";

export default function MuseumAudio({ audioSrc = "/music/museum-ambient.mp3" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Initialiser l'audio
    audioRef.current = new Audio(audioSrc);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25; // Volume doux et élégant

    // Gérer le premier clic n'importe où sur la page pour lancer la musique
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
          })
          .catch(err => console.warn("Autoplay bloqué par le navigateur:", err));
        
        // Retirer l'écouteur après la première interaction
        document.removeEventListener("click", handleFirstInteraction);
      }
    };

    document.addEventListener("click", handleFirstInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      document.removeEventListener("click", handleFirstInteraction);
    };
  }, [audioSrc, hasInteracted]);

  const toggleMute = (e) => {
    e.stopPropagation(); // Éviter de déclencher d'autres clics
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{
      position: "absolute",
      bottom: "30px",
      right: "30px",
      zIndex: 1000 // S'assure que le bouton est au-dessus du Canvas 3D
    }}>
      <button 
        onClick={toggleMute}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 16px",
          background: "rgba(26, 12, 16, 0.85)", // Rappel de la couleur des plinthes
          color: "#C9A040", // Doré des cadres
          border: "1px solid #C9A040",
          borderRadius: "4px",
          cursor: "pointer",
          fontFamily: "sans-serif",
          fontSize: "14px",
          letterSpacing: "1px",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(42, 18, 24, 0.95)"}
        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(26, 12, 16, 0.85)"}
      >
        {isPlaying ? (
          <>
            <span>||</span> MUSIQUE
          </>
        ) : (
          <>
            <span>▶</span> MUSIQUE
          </>
        )}
      </button>
    </div>
  );
}