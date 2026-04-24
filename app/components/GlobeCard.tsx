"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Market = { name: string; lat: number; lon: number; region: string; campaigns: string };
type TooltipState = { name: string; region: string; campaigns: string; x: number; y: number } | null;

const MARKETS: Market[] = [
  { name: "Russia",     lat: 62,   lon: 95,    region: "CIS",   campaigns: "840+"  },
  { name: "Kazakhstan", lat: 48,   lon: 68,    region: "CIS",   campaigns: "210+"  },
  { name: "Kyrgyzstan", lat: 41,   lon: 74.5,  region: "CIS",   campaigns: "85+"   },
  { name: "Uzbekistan", lat: 41.4, lon: 64.6,  region: "CIS",   campaigns: "120+"  },
  { name: "Cyprus",     lat: 35,   lon: 33,    region: "EU",    campaigns: "95+"   },
  { name: "UAE",        lat: 24,   lon: 54,    region: "MENA",  campaigns: "310+"  },
  { name: "Portugal",   lat: 39.4, lon: -8,    region: "EU",    campaigns: "140+"  },
  { name: "Mexico",     lat: 23,   lon: -102,  region: "LATAM", campaigns: "175+"  },
  { name: "Malaysia",   lat: 3.1,  lon: 101.7, region: "SEA",   campaigns: "280+"  },
  { name: "Indonesia",  lat: -2.5, lon: 118,   region: "SEA",   campaigns: "620+"  },
];

// The map PNG is ~1.754:1 (not a perfect 2:1 equirectangular).
// We shift V-offset slightly so the equator lands at the right place.
const MAP_ASPECT = 2048 / 1168; // ~1.754

function latLon(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * Math.PI / 180;
  const th  = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(th),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(th),
  );
}

export function GlobeCard() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const SIZE = container.clientWidth || 420;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(SIZE, SIZE);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 2.8;

    const R = 1.0;

    // ── Earth with real map texture ────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/assets/map.png");
    // Offset V so the non-2:1 map wraps the sphere with the equator centred.
    // (equirectangular expects height = width/2; our map is slightly taller)
    const vScale  = (1 / MAP_ASPECT) * 2; // how much of the V range the image covers
    const vOffset = (1 - vScale) / 2;     // centre it vertically
    tex.repeat.set(1, vScale);
    tex.offset.set(0, vOffset);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;

    const earthMat = new THREE.MeshPhongMaterial({
      map: tex,
      specular: new THREE.Color(0x111111),
      shininess: 4,
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), earthMat);

    // ── Grid lines ─────────────────────────────────────────────────────────────
    const gridGroup = new THREE.Group();
    const rg = R + 0.003;
    function sph(lat: number, lon: number) { return latLon(lat, lon, rg); }
    function mkLine(pts: THREE.Vector3[]) {
      return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.12 }),
      );
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lo = 0; lo <= 362; lo += 3) pts.push(sph(lat, lo));
      gridGroup.add(mkLine(pts));
    }
    for (let lo = 0; lo < 360; lo += 30) {
      const pts: THREE.Vector3[] = [];
      for (let la = -88; la <= 88; la += 3) pts.push(sph(la, lo));
      gridGroup.add(mkLine(pts));
    }

    // ── Atmosphere ─────────────────────────────────────────────────────────────
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.06, 48, 48),
      new THREE.ShaderMaterial({
        vertexShader:   `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `varying vec3 vN; void main(){ float i=pow(.65-dot(vN,vec3(0,0,1)),3.); gl_FragColor=vec4(.91,.36,.12,1.)*i*.5; }`,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true,
      }),
    );

    // ── Markers ─────────────────────────────────────────────────────────────────
    const markerGroup = new THREE.Group();
    const markerData: {
      dot: THREE.Mesh; pulse: THREE.Mesh; pulseMat: THREE.MeshBasicMaterial;
      pos: THREE.Vector3; data: Market; phase: number;
    }[] = [];

    MARKETS.forEach(m => {
      const pos = latLon(m.lat, m.lon, R + 0.018);

      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.022, 14),
        new THREE.MeshBasicMaterial({ color: 0xe85d20, transparent: true, opacity: 0.95, side: THREE.DoubleSide }),
      );
      dot.position.copy(pos); dot.lookAt(0, 0, 0); dot.rotateX(Math.PI / 2);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.028, 0.042, 18),
        new THREE.MeshBasicMaterial({ color: 0xe85d20, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
      );
      ring.position.copy(pos); ring.lookAt(0, 0, 0); ring.rotateX(Math.PI / 2);

      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xe85d20, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      const pulse = new THREE.Mesh(new THREE.RingGeometry(0.022, 0.028, 18), pulseMat);
      pulse.position.copy(pos); pulse.lookAt(0, 0, 0); pulse.rotateX(Math.PI / 2);

      markerGroup.add(dot, ring, pulse);
      markerData.push({ dot, pulse, pulseMat, pos, data: m, phase: Math.random() * Math.PI * 2 });
    });

    // ── Scene assembly ──────────────────────────────────────────────────────────
    const globeGroup = new THREE.Group();
    globeGroup.add(globe, gridGroup, markerGroup);
    scene.add(globeGroup, atmosphere);

    globeGroup.rotation.y = -0.95;
    globeGroup.rotation.x =  0.18;

    // ── Lighting — bright neutral so the map colours read clearly ──────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const sun = new THREE.DirectionalLight(0xfff8f0, 0.7);
    sun.position.set(4, 2, 5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-3, -1, -3);
    scene.add(fill);

    // ── Interaction ─────────────────────────────────────────────────────────────
    let drag = false, prev = { x: 0, y: 0 }, vel = { x: 0, y: 0 }, autoRot = true;

    const onMouseDown = (e: MouseEvent) => {
      drag = true; prev = { x: e.clientX, y: e.clientY }; vel = { x: 0, y: 0 }; autoRot = false;
    };
    const onMouseUp = () => { drag = false; };

    const onMouseMove = (e: MouseEvent) => {
      if (drag) {
        const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
        vel = { x: dx * 0.007, y: dy * 0.007 };
        globeGroup.rotation.y += dx * 0.007;
        globeGroup.rotation.x  = Math.max(-1, Math.min(1, globeGroup.rotation.x + dy * 0.007));
        prev = { x: e.clientX, y: e.clientY };
        setTooltip(null);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width)  *  2 - 1;
      const my = ((e.clientY - rect.top)  / rect.height) * -2 + 1;
      const ray = new THREE.Raycaster();
      ray.setFromCamera(new THREE.Vector2(mx, my), camera);

      let found: { m: typeof markerData[0]; x: number; y: number } | null = null;
      let best = Infinity;
      globeGroup.updateMatrixWorld();
      markerData.forEach(m => {
        const wp = m.pos.clone().applyMatrix4(globeGroup.matrixWorld);
        const d  = ray.ray.distanceToPoint(wp);
        const facing = wp.clone().normalize().dot(new THREE.Vector3(0, 0, 1)) > 0.05;
        if (facing && d < 0.08 && d < best) { best = d; found = { m, x: e.clientX, y: e.clientY }; }
      });

      if (found) {
        const f = found as { m: typeof markerData[0]; x: number; y: number };
        setTooltip({ name: f.m.data.name, region: f.m.data.region, campaigns: f.m.data.campaigns, x: f.x, y: f.y });
      } else {
        setTooltip(null);
      }
    };

    const onMouseLeave = () => setTooltip(null);

    const onTouchStart = (e: TouchEvent) => {
      drag = true; prev = { x: e.touches[0].clientX, y: e.touches[0].clientY }; vel = { x: 0, y: 0 }; autoRot = false;
    };
    const onTouchEnd   = () => { drag = false; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!drag) return;
      const dx = e.touches[0].clientX - prev.x, dy = e.touches[0].clientY - prev.y;
      vel = { x: dx * 0.007, y: dy * 0.007 };
      globeGroup.rotation.y += dx * 0.007;
      globeGroup.rotation.x  = Math.max(-1, Math.min(1, globeGroup.rotation.x + dy * 0.007));
      prev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    canvas.addEventListener("mousedown",  onMouseDown);
    window.addEventListener("mouseup",    onMouseUp);
    window.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd);
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: true });

    // ── Render loop ─────────────────────────────────────────────────────────────
    let rafId: number, t = 0;
    const loop = () => {
      rafId = requestAnimationFrame(loop);
      t += 0.016;

      if (autoRot) {
        globeGroup.rotation.y += 0.002;
      } else if (!drag) {
        vel.x *= 0.92; vel.y *= 0.92;
        globeGroup.rotation.y += vel.x;
        globeGroup.rotation.x  = Math.max(-1, Math.min(1, globeGroup.rotation.x + vel.y));
        if (Math.abs(vel.x) < 0.0002 && Math.abs(vel.y) < 0.0002) autoRot = true;
      }

      markerData.forEach(m => {
        const s = 1 + 0.45 * Math.sin(t * 1.6 + m.phase);
        m.pulse.scale.set(s, s, 1);
        m.pulseMat.opacity = 0.5 * (1 - (s - 1) / 0.45);
      });

      globeGroup.updateMatrixWorld();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousedown",  onMouseDown);
      window.removeEventListener("mouseup",    onMouseUp);
      window.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
      canvas.removeEventListener("touchmove",  onTouchMove);
      tex.dispose();
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* No card styling — bare globe floats in the layout */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ aspectRatio: "1 / 1" }}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {tooltip && (
        <div className="fixed z-[9999] pointer-events-none" style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}>
          <div
            className="rounded-lg px-3 py-2.5 min-w-[130px]"
            style={{ background: "#111", border: "1px solid rgba(232,93,32,0.35)" }}
          >
            <p className="font-bricolage font-bold text-[13px] text-white mb-1">{tooltip.name}</p>
            <div className="flex justify-between gap-4">
              <span className="text-[10px] text-white/40 font-nunitoSans">Region</span>
              <span className="text-[10px] font-semibold" style={{ color: "#e85d20" }}>{tooltip.region}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[10px] text-white/40 font-nunitoSans">Campaigns</span>
              <span className="text-[10px] font-semibold" style={{ color: "#e85d20" }}>{tooltip.campaigns}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
