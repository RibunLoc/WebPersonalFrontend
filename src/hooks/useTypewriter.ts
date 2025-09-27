import { useEffect, useState } from "react";

export default function useTypewriter(
  words: string[],
  speed = 60,
  deleteSpeed = 35,
  pause = 1200
) {
  const [text, setText] = useState("");
  const [isDeleting, setDeleting] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const current = words[idx % words.length];
    let t: number;

    if (!isDeleting && text.length < current.length) {
      t = window.setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!isDeleting && text.length === current.length) {
      t = window.setTimeout(() => setDeleting(true), pause);
    } else if (isDeleting && text.length > 0) {
      t = window.setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
    } else if (isDeleting && text.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
    }

    return () => clearTimeout(t);
  }, [text, isDeleting, idx, words, speed, deleteSpeed, pause]);

  return { text, isDeleting };
}
