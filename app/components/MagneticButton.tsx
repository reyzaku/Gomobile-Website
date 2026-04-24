"use client";
import { useRef, type MouseEvent, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export function MagneticButton({ children, className = "", onClick, strength = 0.35 }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMove = (e: MouseEvent) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
  };

  const handleLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease" }}
    >
      {children}
    </button>
  );
}
