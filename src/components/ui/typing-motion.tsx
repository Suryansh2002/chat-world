import React, { useState, useEffect } from "react";

export function TypingMotion() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "....";
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length-1) {
        setDisplayedText((prev) => prev + fullText[index]);
        index++;
      } else {
        setDisplayedText("");
        index = 0;
      }
    }, 300);

    return () => clearInterval(interval); 
  }, []);

  return <span>{displayedText}</span>;
};
