"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "../../../lib/utils";

export function BackgroundBeams({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(mouseY, [0, 800], [30, -30]);
  const rotateY = useTransform(mouseX, [0, 800], [-30, 30]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-950",
        className
      )}
    >
      <div className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="pointer-events-none relative z-40 flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 grid size-full grid-cols-[repeat(20,minmax(0,1fr))] gap-px">
          {Array.from({ length: 400 }).map((_, i) => (
            <div
              key={i}
              className="h-full w-full rounded-full bg-gradient-to-b from-neutral-800 to-neutral-900 opacity-0"
            />
          ))}
        </div>
        <BeamGrid />
      </motion.div>
    </div>
  );
}

function BeamGrid() {
  const beamRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!beamRef.current) return;
      const rect = beamRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const centerX = useTransform(mouseX, (val) => val);
  const centerY = useTransform(mouseY, (val) => val);

  const beam1X1 = useTransform(centerX, (val) => val - 180);
  const beam1Y1 = useTransform(centerY, (val) => val - 180);
  const beam1X2 = useTransform(centerX, (val) => val + 180);
  const beam1Y2 = useTransform(centerY, (val) => val + 180);

  const beam2X1 = useTransform(centerX, (val) => val - 180);
  const beam2Y1 = useTransform(centerY, (val) => val + 180);
  const beam2X2 = useTransform(centerX, (val) => val + 180);
  const beam2Y2 = useTransform(centerY, (val) => val - 180);

  const path1 = useMotionTemplate`M ${beam1X1} ${beam1Y1} L ${beam1X2} ${beam1Y2}`;
  const path2 = useMotionTemplate`M ${beam2X1} ${beam2Y1} L ${beam2X2} ${beam2Y2}`;

  return (
    <div ref={beamRef} className="pointer-events-none absolute inset-0 z-40">
      <svg className="size-full">
        <motion.path
          d={path1}
          stroke="url(# gradient1)"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.6"
        />
        <motion.path
          d={path2}
          stroke="url(#gradient2)"
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.6"
        />
        <defs>
          <linearGradient id="gradient1" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff6b35" stopOpacity="0" />
            <stop stopColor="#ff6b35" />
            <stop offset="1" stopColor="#ff6b35" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff6b35" stopOpacity="0" />
            <stop stopColor="#ff6b35" />
            <stop offset="1" stopColor="#ff6b35" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

