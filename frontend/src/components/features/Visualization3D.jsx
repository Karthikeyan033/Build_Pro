


// import React, { useState, useRef, useEffect, useMemo } from 'react';

// const CTHEME = {
//   basic:   { roof: '#9CA3AF', wallA: '#CBD5E1', wallB: '#94A3B8', edge: '#1F2937', glass: '#60A5FA', frame: '#1D4ED8', door: '#8B5E34' },
//   standard:{ roof: '#667EEA', wallA: '#E5E7EB', wallB: '#CBD5E1', edge: '#111827', glass: '#38BDF8', frame: '#0EA5E9', door: '#6B7280' },
//   premium: { roof: '#7C3AED', wallA: '#F3F4F6', wallB: '#D1D5DB', edge: '#0F172A', glass: '#22D3EE', frame: '#06B6D4', door: '#4B5563' },
//   luxury:  { roof: '#A21CAF', wallA: '#F8FAFC', wallB: '#E2E8F0', edge: '#0B1220', glass: '#67E8F9', frame: '#0891B2', door: '#3F3F46' }
// };

// const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// {/* Add this small banner below your header area if desired */}
// <div style={{background: '#ecfeff', border: '1px solid #cffafe', padding: 10, borderRadius: 8, color: '#155e75', marginBottom: 12}}>
//   Tip: Use Isometric view for a balanced perspective and enable Interactive mode to rotate the model.
// </div>

// const Visualization3D = ({ projectData }) => {
//   const [viewMode, setViewMode] = useState('front');
//   const [isRendering, setIsRendering] = useState(false);
//   const [rotation, setRotation] = useState({ x: -15, y: 25 }); // nicer default
//   const [isInteractive, setIsInteractive] = useState(false);
//   const canvasRef = useRef(null);
//   const dragRef = useRef(null);

//   // Normalize inputs
//   const dims = useMemo(() => {
//     const floors = Number(projectData.floors || 1);
//     const constructionType = projectData.constructionType || 'basic';

//     let length = Number(projectData.length || 0);
//     let width  = Number(projectData.width  || 0);
//     const totalArea = Number(projectData.totalArea || 0);

//     // Infer length/width from area if not provided
//     if ((!length || !width) && totalArea > 0) {
//       // Prefer roughly rectangular footprint
//       const ar = clamp(Number(projectData.aspectRatio || length / (width || 1)) || 1.4, 0.6, 2.0);
//       const perFloorArea = totalArea / floors;
//       width = Math.sqrt(perFloorArea / ar);
//       length = perFloorArea / width;
//     }

//     // Reasonable defaults if still missing
//     if (!length || !width) {
//       length = 30;
//       width = 22;
//     }

//     // Cap extremes for drawing scale
//     const L = clamp(length, 10, 300);
//     const W = clamp(width, 8, 300);
//     const F = clamp(floors, 1, 12);

//     return { length: L, width: W, floors: F, type: constructionType };
//   }, [projectData]);

//   const views = useMemo(() => ([
//     { id: 'front',    name: 'Front View',    icon: '🏠', rotation: { x: -10, y: 0   } },
//     { id: 'side',     name: 'Side View',     icon: '🏗️', rotation: { x: -10, y: 90  } },
//     { id: 'top',      name: 'Top View',      icon: '📐', rotation: { x: -80, y: 0   } },
//     { id: 'isometric',name: 'Isometric',     icon: '📦', rotation: { x: -25, y: 35  } },
//     { id: 'interior', name: 'Interior',      icon: '🪑', rotation: { x: -5,  y: 20  } }
//   ]), []);

//   // Re-render when relevant state changes
//   useEffect(() => {
//     if ((projectData.totalArea || projectData.length || projectData.width) && canvasRef.current) {
//       renderBuilding();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dims, viewMode, rotation]);

//   // Reset default rotation when view changes
//   useEffect(() => {
//     const preset = views.find(v => v.id === viewMode)?.rotation || { x: -15, y: 25 };
//     setRotation(preset);
//   }, [viewMode, views]);

//   const project = (x, y, z, rx, ry) => {
//     const toRad = (deg) => (deg * Math.PI) / 180;
//     const cos = Math.cos, sin = Math.sin;
//     const radX = toRad(rx), radY = toRad(ry);

//     // rotate Y, then X
//     const x1 = x * cos(radY) - z * sin(radY);
//     const z1 = x * sin(radY) + z * cos(radY);
//     const y1 = y * cos(radX) - z1 * sin(radX);
//     const z2 = y * sin(radX) + z1 * cos(radX);

//     const perspective = 600;
//     const s = perspective / (perspective + z2);
//     return { x: x1 * s, y: y1 * s, z: z2, s };
//   };

//   const renderBuilding = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const w = canvas.width  = Math.floor(canvas.clientWidth  || 480);
//     const h = canvas.height = Math.floor(canvas.clientHeight || 320);

//     ctx.clearRect(0, 0, w, h);
//     ctx.save();
//     ctx.translate(w / 2, h / 2);

//     // Compute visual scale based on footprint
//     const maxFoot = Math.max(dims.length, dims.width);
//     const scale = clamp((Math.min(w, h) * 0.6) / maxFoot, 1, 10);

//     const footprintW = dims.length * scale;
//     const footprintD = dims.width  * scale;
//     const floorH = clamp(28 + dims.floors * 0.5, 28, 42); // taller with more floors
//     const totalH = dims.floors * floorH;

//     const theme = CTHEME[dims.type] || CTHEME.basic;

//     // Draw ground shadow
//     drawShadow(ctx, footprintW, footprintD);

//     // Draw floors bottom -> top for depth
//     for (let f = 0; f < dims.floors; f++) {
//       const yBase = (totalH / 2) - (f + 1) * floorH + floorH / 2;
//       drawPrism(ctx, {
//         w: footprintW,
//         d: footprintD,
//         h: floorH,
//         y: yBase,
//         rx: rotation.x,
//         ry: rotation.y,
//         colors: { top: theme.roof, front: theme.wallA, side: theme.wallB, edge: theme.edge }
//       });

//       // Facade details per floor
//       drawFacade(ctx, {
//         w: footprintW, d: footprintD, h: floorH, y: yBase,
//         rx: rotation.x, ry: rotation.y,
//         floorIndex: f, floors: dims.floors, theme
//       });
//     }

//     // Roof parapet
//     drawRoof(ctx, { w: footprintW, d: footprintD, yTop: -totalH / 2, rx: rotation.x, ry: rotation.y, theme });

//     ctx.restore();
//   };

//   const drawShadow = (ctx, w, d) => {
//     ctx.save();
//     ctx.scale(1, 0.2);
//     ctx.fillStyle = 'rgba(0,0,0,0.08)';
//     ctx.beginPath();
//     ctx.ellipse(0, (d + w) * 0.15, (w + d) * 0.45, (w + d) * 0.25, 0, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.restore();
//   };

//   const drawPrism = (ctx, { w, d, h, y, rx, ry, colors }) => {
//     // 8 corners of a box centered at (0, y, 0)
//     const halfH = h / 2;
//     const v = [
//       // bottom
//       { x: -w/2, y: y + halfH, z: -d/2 },
//       { x:  w/2, y: y + halfH, z: -d/2 },
//       { x:  w/2, y: y + halfH, z:  d/2 },
//       { x: -w/2, y: y + halfH, z:  d/2 },
//       // top
//       { x: -w/2, y: y - halfH, z: -d/2 },
//       { x:  w/2, y: y - halfH, z: -d/2 },
//       { x:  w/2, y: y - halfH, z:  d/2 },
//       { x: -w/2, y: y - halfH, z:  d/2 },
//     ].map(p => project(p.x, p.y, p.z, rx, ry));

//     const faces = [
//       { idx: [4,5,6,7], color: colors.top   }, // top
//       { idx: [0,1,5,4], color: colors.front }, // front
//       { idx: [1,2,6,5], color: colors.side  }, // right
//       { idx: [2,3,7,6], color: colors.front }, // back
//       { idx: [3,0,4,7], color: colors.side  }  // left
//     ];

//     const withDepth = faces.map(f => ({
//       ...f, z: f.idx.reduce((s, i) => s + v[i].z, 0) / f.idx.length
//     })).sort((a, b) => a.z - b.z);

//     withDepth.forEach(f => {
//       ctx.beginPath();
//       f.idx.forEach((i, k) => k === 0 ? ctx.moveTo(v[i].x, v[i].y) : ctx.lineTo(v[i].x, v[i].y));
//       ctx.closePath();
//       ctx.fillStyle = f.color;
//       ctx.fill();
//       ctx.strokeStyle = colors.edge;
//       ctx.lineWidth = 1.2;
//       ctx.stroke();
//     });
//   };

//   const drawFacade = (ctx, { w, d, h, y, rx, ry, floorIndex, floors, theme }) => {
//     // Decide which faces are visible by sampling normals via small offset
//     // We’ll draw windows on the front and side that are facing the viewer.
//     const frontFacing = isFrontFacing(rx, ry);
//     const rightFacing = isRightFacing(rx, ry);

//     const rows = 1; // per floor row
//     const colsFront = Math.max(2, Math.floor(w / 80));  // more width => more windows
//     const colsSide  = Math.max(1, Math.floor(d / 80));

//     const winW = clamp(w / (colsFront * 3), 16, 34);
//     const winH = clamp(h * 0.45, 14, 34);
//     const padX = (w - colsFront * winW) / (colsFront + 1);
//     const padZ = (d - colsSide  * winW) / (colsSide  + 1);

//     // Front windows
//     if (frontFacing) {
//       for (let c = 0; c < colsFront; c++) {
//         const x = -w / 2 + padX * (c + 1) + winW * (c + 0.5);
//         const z = -d / 2; // front face (negative z)
//         drawWindowQuad(ctx, { x, y, z, w: winW, h: winH, rx, ry, theme });
//       }
//       // Main door only on ground floor
//       if (floorIndex === floors - 1) {
//         const dw = clamp(w * 0.14, 20, 40);
//         const dh = clamp(h * 0.7, 28, 56);
//         const x = -w / 2 + dw * 1.2;
//         const z = -d / 2 + 0.01;
//         drawDoorQuad(ctx, { x, y, z, w: dw, h: dh, rx, ry, theme });
//       }
//     }

//     // Right-side windows
//     if (rightFacing) {
//       for (let c = 0; c < colsSide; c++) {
//         const z = d / 2 - padZ * (c + 1) - winW * (c + 0.5); // move along +Z to -Z
//         const x =  w / 2; // right face (positive x)
//         drawWindowQuad(ctx, { x, y, z, w: winW, h: winH, rx, ry, theme, face: 'right' });
//       }
//     }
//   };

//   const isFrontFacing = (rx, ry) => {
//     // If rotated such that -Z face is visible
//     // Approx: when |ry| < 135 deg, front shows somewhere
//     const n = ((ry % 360) + 360) % 360;
//     return (n > 315 || n < 45) || (n > 0 && n < 135);
//   };
//   const isRightFacing = (rx, ry) => {
//     const n = ((ry % 360) + 360) % 360;
//     return n > 45 && n < 225;
//   };

//   const drawWindowQuad = (ctx, { x, y, z, w, h, rx, ry, theme, face }) => {
//     // Position quad slightly offset from wall
//     const inset = 2;
//     const halfH = h / 2;
//     let p1, p2, p3, p4;

//     if (face === 'right') {
//       // On right face, normal +X, vary along Z
//       p1 = project(x, y - halfH, z - w/2, rx, ry);
//       p2 = project(x, y - halfH, z + w/2, rx, ry);
//       p3 = project(x, y + halfH, z + w/2, rx, ry);
//       p4 = project(x, y + halfH, z - w/2, rx, ry);
//     } else {
//       // Front face, normal -Z, vary along X
//       p1 = project(x - w/2, y - halfH, z, rx, ry);
//       p2 = project(x + w/2, y - halfH, z, rx, ry);
//       p3 = project(x + w/2, y + halfH, z, rx, ry);
//       p4 = project(x - w/2, y + halfH, z, rx, ry);
//     }

//     ctx.beginPath();
//     ctx.moveTo(p1.x, p1.y);
//     ctx.lineTo(p2.x, p2.y);
//     ctx.lineTo(p3.x, p3.y);
//     ctx.lineTo(p4.x, p4.y);
//     ctx.closePath();
//     ctx.fillStyle = theme.glass;
//     ctx.globalAlpha = 0.9;
//     ctx.fill();
//     ctx.globalAlpha = 1;
//     ctx.strokeStyle = theme.frame;
//     ctx.lineWidth = 1;
//     ctx.stroke();

//     // mullions
//     ctx.beginPath();
//     ctx.moveTo((p1.x + p2.x)/2, (p1.y + p2.y)/2);
//     ctx.lineTo((p4.x + p3.x)/2, (p4.y + p3.y)/2);
//     ctx.moveTo((p1.x + p4.x)/2, (p1.y + p4.y)/2);
//     ctx.lineTo((p2.x + p3.x)/2, (p2.y + p3.y)/2);
//     ctx.strokeStyle = theme.frame;
//     ctx.globalAlpha = 0.8;
//     ctx.stroke();
//     ctx.globalAlpha = 1;
//   };

//   const drawDoorQuad = (ctx, { x, y, z, w, h, rx, ry, theme }) => {
//     const halfH = h / 2;
//     const p1 = project(x - w/2, y - halfH, z, rx, ry);
//     const p2 = project(x + w/2, y - halfH, z, rx, ry);
//     const p3 = project(x + w/2, y + halfH, z, rx, ry);
//     const p4 = project(x - w/2, y + halfH, z, rx, ry);

//     ctx.beginPath();
//     ctx.moveTo(p1.x, p1.y);
//     ctx.lineTo(p2.x, p2.y);
//     ctx.lineTo(p3.x, p3.y);
//     ctx.lineTo(p4.x, p4.y);
//     ctx.closePath();
//     ctx.fillStyle = theme.door;
//     ctx.fill();
//     ctx.strokeStyle = '#2A2A2A';
//     ctx.lineWidth = 1.6;
//     ctx.stroke();

//     // handle
//     const hx = (p2.x + p3.x) / 2 - 6;
//     const hy = (p2.y + p3.y) / 2;
//     ctx.beginPath();
//     ctx.arc(hx, hy, 2.2, 0, Math.PI * 2);
//     ctx.fillStyle = '#FBBF24';
//     ctx.fill();
//   };

//   const drawRoof = (ctx, { w, d, yTop, rx, ry, theme }) => {
//     const lip = 6;
//     const p = [
//       project(-w/2 - lip, yTop - 2, -d/2 - lip, rx, ry),
//       project( w/2 + lip, yTop - 2, -d/2 - lip, rx, ry),
//       project( w/2 + lip, yTop - 2,  d/2 + lip, rx, ry),
//       project(-w/2 - lip, yTop - 2,  d/2 + lip, rx, ry),
//     ];
//     ctx.beginPath();
//     ctx.moveTo(p[0].x, p[0].y);
//     for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
//     ctx.closePath();
//     ctx.fillStyle = theme.roof;
//     ctx.globalAlpha = 0.85;
//     ctx.fill();
//     ctx.globalAlpha = 1;
//     ctx.strokeStyle = theme.edge;
//     ctx.lineWidth = 1.2;
//     ctx.stroke();
//   };

//   // Drag rotate
//   const onMouseDown = (e) => {
//     if (!isInteractive) return;
//     dragRef.current = { x: e.clientX, y: e.clientY, rot: { ...rotation } };
//     document.addEventListener('mousemove', onMouseMove);
//     document.addEventListener('mouseup', onMouseUp);
//   };
//   const onMouseMove = (e) => {
//     const d = dragRef.current;
//     if (!d) return;
//     const dx = e.clientX - d.x;
//     const dy = e.clientY - d.y;
//     setRotation({ x: clamp(d.rot.x + dy * 0.4, -85, 85), y: (d.rot.y + dx * 0.5) % 360 });
//   };
//   const onMouseUp = () => {
//     dragRef.current = null;
//     document.removeEventListener('mousemove', onMouseMove);
//     document.removeEventListener('mouseup', onMouseUp);
//   };

//   const resetView = () => setRotation(views.find(v => v.id === viewMode)?.rotation || { x: -15, y: 25 });
//   const toggleInteractive = () => setIsInteractive(v => !v);

//   const ready = Boolean(projectData.totalArea || (projectData.length && projectData.width));

//   return (
//     <div className="visualization-container">
//       <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
//         <span style={{fontSize: '2.0em'}}>🏠</span>
//         <h3 style={{fontSize: '1.4em', fontWeight: '700', color: '#2d3748'}}>3D Visualization</h3>
//       </div>

//       <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 8, marginBottom: 12}}>
//         {views.map(v => (
//           <button key={v.id} onClick={() => setViewMode(v.id)} style={{
//             background: viewMode === v.id ? '#667eea' : '#e2e8f0',
//             border: '1px solid #cbd5e0',
//             color: viewMode === v.id ? 'white' : '#4a5568',
//             padding: '8px',
//             borderRadius: 8,
//             cursor: 'pointer',
//             fontSize: '0.9em',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 6,
//             justifyContent: 'center'
//           }}>
//             <span>{v.icon}</span><span>{v.name}</span>
//           </button>
//         ))}
//       </div>

//       <div className="canvas-container" style={{
//         width: '100%',
//         height: 320,
//         background: 'linear-gradient(135deg, #eef2ff 0%, #e9d5ff 100%)',
//         borderRadius: 12,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 16,
//         border: '1px solid #cbd5e0',
//         position: 'relative',
//         overflow: 'hidden'
//       }}>
//         {ready ? (
//           <canvas
//             ref={canvasRef}
//             style={{ width: '100%', height: '100%', cursor: isInteractive ? 'grab' : 'default' }}
//             onMouseDown={onMouseDown}
//           />
//         ) : (
//           <div style={{textAlign: 'center', color: '#334155'}}>
//             <div style={{fontSize: '2.4em', marginBottom: 6}}>🏗️</div>
//             <div>Generate Building Visualization</div>
//             <div style={{fontSize: '0.9em', opacity: 0.8, marginTop: 4}}>
//               Enter length and width or calculate estimate first
//             </div>
//           </div>
//         )}

//         {isRendering && (
//           <div style={{
//             position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
//           }}>
//             <div style={{textAlign: 'center'}}>
//               <div style={{fontSize: '1.6em', marginBottom: 6}}>⏳</div>
//               <div>Rendering 3D Model...</div>
//             </div>
//           </div>
//         )}
//       </div>

//       {ready && (
//         <div style={{display: 'flex', gap: 10, marginBottom: 12}}>
//           <button onClick={toggleInteractive} style={{
//             flex: 1, background: isInteractive ? '#48bb78' : '#e2e8f0', color: isInteractive ? 'white' : '#4a5568',
//             border: '1px solid #cbd5e0', padding: 10, borderRadius: 8, cursor: 'pointer'
//           }}>
//             {isInteractive ? '🔄 Interactive ON' : '🔄 Enable Interactive'}
//           </button>
//           <button onClick={resetView} style={{
//             flex: 1, background: '#e2e8f0', color: '#4a5568',
//             border: '1px solid #cbd5e0', padding: 10, borderRadius: 8, cursor: 'pointer'
//           }}>
//             🔄 Reset View
//           </button>
//         </div>
//       )}

//       {ready && (
//         <div style={{background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12, color: '#334155'}}>
//           <div style={{fontWeight: 700, marginBottom: 6}}>Building Specs</div>
//           <div style={{fontSize: '0.92em'}}>
//             <div>📐 Length × Width: {dims.length.toFixed(1)} ft × {dims.width.toFixed(1)} ft</div>
//             <div>🏢 Floors: {dims.floors}</div>
//             <div>🎨 Type: {dims.type}</div>
//           </div>
//         </div>
//       )}

//       <button
//         className="btn"
//         onClick={() => {
//           if (!ready) return;
//           setIsRendering(true);
//           setTimeout(() => setIsRendering(false), 800);
//         }}
//         disabled={!ready || isRendering}
//         style={{
//           width: '100%',
//           background: !ready || isRendering ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           color: !ready || isRendering ? '#475569' : 'white',
//           border: 'none',
//           padding: 14,
//           borderRadius: 8,
//           fontSize: 16,
//           fontWeight: 600,
//           cursor: !ready || isRendering ? 'not-allowed' : 'pointer',
//           opacity: !ready || isRendering ? 0.7 : 1
//         }}
//       >
//         {isRendering ? 'Rendering…' : `🎨 Render ${viewMode[0].toUpperCase() + viewMode.slice(1)} View`}
//       </button>
//     </div>
//   );
// };

// export default Visualization3D;


import React, { useState, useRef, useEffect, useMemo } from 'react';

// Enhanced color themes with gradients and modern materials
const CTHEME = {
  basic: {
    roof: ['#6B7280', '#4B5563'], // Gradient roof
    wallA: ['#E5E7EB', '#D1D5DB'],
    wallB: ['#CBD5E1', '#B0B8C4'],
    edge: '#1F2937',
    glass: '#60A5FA',
    glassShine: '#93C5FD',
    frame: '#1E40AF',
    door: '#92400E',
    doorHighlight: '#B45309',
    ambient: '#F3F4F6'
  },
  standard: {
    roof: ['#667EEA', '#5A67D8'],
    wallA: ['#F9FAFB', '#F3F4F6'],
    wallB: ['#E5E7EB', '#D1D5DB'],
    edge: '#111827',
    glass: '#38BDF8',
    glassShine: '#7DD3FC',
    frame: '#0369A1',
    door: '#78350F',
    doorHighlight: '#92400E',
    ambient: '#FAFBFC'
  },
  premium: {
    roof: ['#7C3AED', '#6D28D9'],
    wallA: ['#FAFAFA', '#F5F5F5'],
    wallB: ['#E5E5E5', '#D4D4D4'],
    edge: '#0F172A',
    glass: '#22D3EE',
    glassShine: '#67E8F9',
    frame: '#0E7490',
    door: '#713F12',
    doorHighlight: '#854D0E',
    ambient: '#FCFCFC'
  },
  luxury: {
    roof: ['#A21CAF', '#86198F'],
    wallA: ['#FFFFFF', '#FAFAFA'],
    wallB: ['#F5F5F5', '#E5E5E5'],
    edge: '#0B1220',
    glass: '#67E8F9',
    glassShine: '#A5F3FC',
    frame: '#155E75',
    door: '#78350F',
    doorHighlight: '#92400E',
    ambient: '#FFFFFF'
  }
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Visualization3D = ({ projectData }) => {
  const [viewMode, setViewMode] = useState('isometric');
  const [isRendering, setIsRendering] = useState(false);
  const [rotation, setRotation] = useState({ x: -25, y: 35 });
  const [isInteractive, setIsInteractive] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredView, setHoveredView] = useState(null);
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const animFrameRef = useRef(null);

  const dims = useMemo(() => {
    const floors = Number(projectData.floors || 1);
    const constructionType = projectData.constructionType || 'standard';

    let length = Number(projectData.length || 0);
    let width = Number(projectData.width || 0);
    const totalArea = Number(projectData.totalArea || 0);

    if ((!length || !width) && totalArea > 0) {
      const ar = clamp(Number(projectData.aspectRatio || length / (width || 1)) || 1.4, 0.6, 2.0);
      const perFloorArea = totalArea / floors;
      width = Math.sqrt(perFloorArea / ar);
      length = perFloorArea / width;
    }

    if (!length || !width) {
      length = 30;
      width = 22;
    }

    const L = clamp(length, 10, 300);
    const W = clamp(width, 8, 300);
    const F = clamp(floors, 1, 12);

    return { length: L, width: W, floors: F, type: constructionType };
  }, [projectData]);

  const views = useMemo(() => ([
    { id: 'front', name: 'Front', icon: '🏠', rotation: { x: -10, y: 0 } },
    { id: 'side', name: 'Side', icon: '🏗️', rotation: { x: -10, y: 90 } },
    { id: 'top', name: 'Top', icon: '📐', rotation: { x: -80, y: 0 } },
    { id: 'isometric', name: 'Isometric', icon: '📦', rotation: { x: -25, y: 35 } },
    { id: 'interior', name: 'Interior', icon: '🪑', rotation: { x: -5, y: 20 } }
  ]), []);

  // Smooth animation loop for ambient effects
  useEffect(() => {
    const animate = () => {
      setAnimationPhase(prev => (prev + 0.01) % (Math.PI * 2));
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => {
    if ((projectData.totalArea || projectData.length || projectData.width) && canvasRef.current) {
      renderBuilding();
    }
  }, [dims, viewMode, rotation, animationPhase]);

  useEffect(() => {
    const preset = views.find(v => v.id === viewMode)?.rotation || { x: -25, y: 35 };
    setRotation(preset);
  }, [viewMode, views]);

  // Enhanced 3D projection with perspective
  const project = (x, y, z, rx, ry) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const cos = Math.cos, sin = Math.sin;
    const radX = toRad(rx), radY = toRad(ry);

    const x1 = x * cos(radY) - z * sin(radY);
    const z1 = x * sin(radY) + z * cos(radY);
    const y1 = y * cos(radX) - z1 * sin(radX);
    const z2 = y * sin(radX) + z1 * cos(radX);

    const perspective = 700;
    const s = perspective / (perspective + z2);
    return { x: x1 * s, y: y1 * s, z: z2, s };
  };

  // Create gradient fill with lighting simulation
  const createGradient = (ctx, p1, p2, colors, depth = 0) => {
    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    // Lighting based on depth - closer surfaces are brighter
    const brightness = 1 - clamp(depth / 1000, 0, 0.4);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    return grad;
  };

  const renderBuilding = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width = Math.floor(canvas.clientWidth || 600);
    const h = canvas.height = Math.floor(canvas.clientHeight || 400);

    // Enhanced background with atmospheric gradient
    const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h));
    bgGrad.addColorStop(0, '#F0F4FF');
    bgGrad.addColorStop(0.5, '#E5EDFF');
    bgGrad.addColorStop(1, '#D6E4FF');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, h / 2);

    const maxFoot = Math.max(dims.length, dims.width);
    const scale = clamp((Math.min(w, h) * 0.65) / maxFoot, 1, 10);

    const footprintW = dims.length * scale;
    const footprintD = dims.width * scale;
    const floorH = clamp(28 + dims.floors * 0.5, 28, 42);
    const totalH = dims.floors * floorH;

    const theme = CTHEME[dims.type] || CTHEME.standard;

    // Enhanced shadow with soft edges
    drawEnhancedShadow(ctx, footprintW, footprintD, totalH);

    // Draw floors with enhanced materials
    for (let f = 0; f < dims.floors; f++) {
      const yBase = (totalH / 2) - (f + 1) * floorH + floorH / 2;
      drawEnhancedPrism(ctx, {
        w: footprintW,
        d: footprintD,
        h: floorH,
        y: yBase,
        rx: rotation.x,
        ry: rotation.y,
        theme,
        floorIndex: f
      });

      drawEnhancedFacade(ctx, {
        w: footprintW, d: footprintD, h: floorH, y: yBase,
        rx: rotation.x, ry: rotation.y,
        floorIndex: f, floors: dims.floors, theme
      });
    }

    // Enhanced roof with details
    drawEnhancedRoof(ctx, { 
      w: footprintW, d: footprintD, yTop: -totalH / 2, 
      rx: rotation.x, ry: rotation.y, theme 
    });

    // Add ambient light effect
    const pulse = Math.sin(animationPhase) * 0.05 + 0.95;
    ctx.globalAlpha = 0.03 * pulse;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.globalAlpha = 1;

    ctx.restore();
  };

  // Enhanced shadow with multiple layers for depth
  const drawEnhancedShadow = (ctx, w, d, h) => {
    ctx.save();
    // Larger, softer shadow
    for (let i = 3; i > 0; i--) {
      ctx.globalAlpha = 0.04 / i;
      ctx.scale(1, 0.2);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      const size = (w + d) * (0.45 + i * 0.05);
      ctx.ellipse(0, (d + w) * 0.18, size, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.scale(1, 5);
    }
    ctx.restore();
  };

  // Enhanced prism with gradient materials and lighting
  const drawEnhancedPrism = (ctx, { w, d, h, y, rx, ry, theme, floorIndex }) => {
    const halfH = h / 2;
    const v = [
      { x: -w/2, y: y + halfH, z: -d/2 },
      { x: w/2, y: y + halfH, z: -d/2 },
      { x: w/2, y: y + halfH, z: d/2 },
      { x: -w/2, y: y + halfH, z: d/2 },
      { x: -w/2, y: y - halfH, z: -d/2 },
      { x: w/2, y: y - halfH, z: -d/2 },
      { x: w/2, y: y - halfH, z: d/2 },
      { x: -w/2, y: y - halfH, z: d/2 },
    ].map(p => project(p.x, p.y, p.z, rx, ry));

    const faces = [
      { idx: [4,5,6,7], colors: theme.roof, type: 'top' },
      { idx: [0,1,5,4], colors: theme.wallA, type: 'front' },
      { idx: [1,2,6,5], colors: theme.wallB, type: 'side' },
      { idx: [2,3,7,6], colors: theme.wallA, type: 'back' },
      { idx: [3,0,4,7], colors: theme.wallB, type: 'left' }
    ];

    const withDepth = faces.map(f => ({
      ...f, 
      z: f.idx.reduce((s, i) => s + v[i].z, 0) / f.idx.length,
      brightness: f.idx.reduce((s, i) => s + v[i].s, 0) / f.idx.length
    })).sort((a, b) => a.z - b.z);

    withDepth.forEach(f => {
      ctx.beginPath();
      f.idx.forEach((i, k) => k === 0 ? ctx.moveTo(v[i].x, v[i].y) : ctx.lineTo(v[i].x, v[i].y));
      ctx.closePath();

      // Gradient fill
      const p1 = v[f.idx[0]], p2 = v[f.idx[2]];
      ctx.fillStyle = createGradient(ctx, p1, p2, f.colors, f.z);
      ctx.fill();

      // Enhanced edges with depth-based opacity
      ctx.strokeStyle = theme.edge;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.3 + f.brightness * 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Subtle highlight on top edge
      if (f.type === 'top' && floorIndex === 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  const drawEnhancedFacade = (ctx, { w, d, h, y, rx, ry, floorIndex, floors, theme }) => {
    const frontFacing = isFrontFacing(rx, ry);
    const rightFacing = isRightFacing(rx, ry);

    const colsFront = Math.max(2, Math.floor(w / 70));
    const colsSide = Math.max(1, Math.floor(d / 70));

    const winW = clamp(w / (colsFront * 2.8), 18, 38);
    const winH = clamp(h * 0.48, 16, 36);
    const padX = (w - colsFront * winW) / (colsFront + 1);
    const padZ = (d - colsSide * winW) / (colsSide + 1);

    // Front windows with glow effect
    if (frontFacing) {
      for (let c = 0; c < colsFront; c++) {
        const x = -w / 2 + padX * (c + 1) + winW * (c + 0.5);
        const z = -d / 2;
        drawEnhancedWindow(ctx, { x, y, z, w: winW, h: winH, rx, ry, theme, index: c });
      }
      
      // Enhanced door on ground floor
      if (floorIndex === floors - 1) {
        const dw = clamp(w * 0.14, 22, 44);
        const dh = clamp(h * 0.72, 30, 58);
        const x = -w / 2 + dw * 1.3;
        const z = -d / 2 + 0.01;
        drawEnhancedDoor(ctx, { x, y, z, w: dw, h: dh, rx, ry, theme });
      }
    }

    // Right-side windows
    if (rightFacing) {
      for (let c = 0; c < colsSide; c++) {
        const z = d / 2 - padZ * (c + 1) - winW * (c + 0.5);
        const x = w / 2;
        drawEnhancedWindow(ctx, { x, y, z, w: winW, h: winH, rx, ry, theme, face: 'right', index: c });
      }
    }
  };

  const isFrontFacing = (rx, ry) => {
    const n = ((ry % 360) + 360) % 360;
    return (n > 315 || n < 45) || (n > 0 && n < 135);
  };

  const isRightFacing = (rx, ry) => {
    const n = ((ry % 360) + 360) % 360;
    return n > 45 && n < 225;
  };

  // Enhanced window with reflections and glow
  const drawEnhancedWindow = (ctx, { x, y, z, w, h, rx, ry, theme, face, index = 0 }) => {
    const halfH = h / 2;
    let p1, p2, p3, p4;

    if (face === 'right') {
      p1 = project(x, y - halfH, z - w/2, rx, ry);
      p2 = project(x, y - halfH, z + w/2, rx, ry);
      p3 = project(x, y + halfH, z + w/2, rx, ry);
      p4 = project(x, y + halfH, z - w/2, rx, ry);
    } else {
      p1 = project(x - w/2, y - halfH, z, rx, ry);
      p2 = project(x + w/2, y - halfH, z, rx, ry);
      p3 = project(x + w/2, y + halfH, z, rx, ry);
      p4 = project(x - w/2, y + halfH, z, rx, ry);
    }

    // Glow effect behind window
    ctx.save();
    ctx.shadowColor = theme.glass;
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Glass with gradient
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();

    const glassGrad = ctx.createLinearGradient(p1.x, p1.y, p3.x, p3.y);
    glassGrad.addColorStop(0, theme.glass);
    glassGrad.addColorStop(0.5, theme.glassShine);
    glassGrad.addColorStop(1, theme.glass);
    ctx.fillStyle = glassGrad;
    ctx.globalAlpha = 0.85;
    ctx.fill();

    // Reflection highlight
    const reflectGrad = ctx.createLinearGradient(p1.x, p1.y, p4.x, p4.y);
    reflectGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    reflectGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = reflectGrad;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();

    // Frame
    ctx.strokeStyle = theme.frame;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Mullions with depth
    ctx.beginPath();
    ctx.moveTo((p1.x + p2.x)/2, (p1.y + p2.y)/2);
    ctx.lineTo((p4.x + p3.x)/2, (p4.y + p3.y)/2);
    ctx.moveTo((p1.x + p4.x)/2, (p1.y + p4.y)/2);
    ctx.lineTo((p2.x + p3.x)/2, (p2.y + p3.y)/2);
    ctx.strokeStyle = theme.frame;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Animated light flicker (subtle)
    if (index % 3 === 0) {
      const flicker = Math.sin(animationPhase * 2 + index) * 0.1 + 0.9;
      ctx.fillStyle = `rgba(255, 243, 176, ${0.15 * flicker})`;
      ctx.fill();
    }
  };

  // Enhanced door with wood texture simulation
  const drawEnhancedDoor = (ctx, { x, y, z, w, h, rx, ry, theme }) => {
    const halfH = h / 2;
    const p1 = project(x - w/2, y - halfH, z, rx, ry);
    const p2 = project(x + w/2, y - halfH, z, rx, ry);
    const p3 = project(x + w/2, y + halfH, z, rx, ry);
    const p4 = project(x - w/2, y + halfH, z, rx, ry);

    ctx.save();
    
    // Door shadow/depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 6;
    
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();

    // Wood grain gradient
    const doorGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    doorGrad.addColorStop(0, theme.door);
    doorGrad.addColorStop(0.5, theme.doorHighlight);
    doorGrad.addColorStop(1, theme.door);
    ctx.fillStyle = doorGrad;
    ctx.fill();

    ctx.restore();

    // Door panels
    const panelInset = 4;
    const panelH = h * 0.35;
    const panelW = w * 0.85;
    
    for (let i = 0; i < 2; i++) {
      const offsetY = (i - 0.5) * panelH * 1.2;
      const py1 = project(x - panelW/2, y - offsetY - panelH/2, z - 1, rx, ry);
      const py2 = project(x + panelW/2, y - offsetY - panelH/2, z - 1, rx, ry);
      const py3 = project(x + panelW/2, y - offsetY + panelH/2, z - 1, rx, ry);
      const py4 = project(x - panelW/2, y - offsetY + panelH/2, z - 1, rx, ry);
      
      ctx.beginPath();
      ctx.moveTo(py1.x, py1.y);
      ctx.lineTo(py2.x, py2.y);
      ctx.lineTo(py3.x, py3.y);
      ctx.lineTo(py4.x, py4.y);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Enhanced handle with metallic look
    const hx = (p2.x + p3.x) / 2 - 8;
    const hy = (p2.y + p3.y) / 2;
    
    const handleGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 4);
    handleGrad.addColorStop(0, '#FCD34D');
    handleGrad.addColorStop(0.6, '#F59E0B');
    handleGrad.addColorStop(1, '#D97706');
    
    ctx.beginPath();
    ctx.arc(hx, hy, 3, 0, Math.PI * 2);
    ctx.fillStyle = handleGrad;
    ctx.fill();
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Handle shine
    ctx.beginPath();
    ctx.arc(hx - 1, hy - 1, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
  };

  // Enhanced roof with modern details
  const drawEnhancedRoof = (ctx, { w, d, yTop, rx, ry, theme }) => {
    const lip = 8;
    const p = [
      project(-w/2 - lip, yTop - 3, -d/2 - lip, rx, ry),
      project(w/2 + lip, yTop - 3, -d/2 - lip, rx, ry),
      project(w/2 + lip, yTop - 3, d/2 + lip, rx, ry),
      project(-w/2 - lip, yTop - 3, d/2 + lip, rx, ry),
    ];

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 10;
    
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
    ctx.closePath();

    const roofGrad = ctx.createLinearGradient(p[0].x, p[0].y, p[2].x, p[2].y);
    roofGrad.addColorStop(0, theme.roof[0]);
    roofGrad.addColorStop(1, theme.roof[1]);
    ctx.fillStyle = roofGrad;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();

    ctx.strokeStyle = theme.edge;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Roof details - AC units or solar panels (small rectangles)
    if (w > 100) {
      for (let i = 0; i < 2; i++) {
        const offset = (i - 0.5) * w * 0.3;
        const pr = [
          project(offset - 8, yTop - 4, 0, rx, ry),
          project(offset + 8, yTop - 4, 0, rx, ry),
          project(offset + 8, yTop - 4, 12, rx, ry),
          project(offset - 8, yTop - 4, 12, rx, ry),
        ];
        ctx.beginPath();
        pr.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
        ctx.closePath();
        ctx.fillStyle = 'rgba(50, 50, 50, 0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  };

  // Interactive drag controls
  const onMouseDown = (e) => {
    if (!isInteractive) return;
    dragRef.current = { x: e.clientX, y: e.clientY, rot: { ...rotation } };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    setRotation({ 
      x: clamp(d.rot.x + dy * 0.35, -85, 85), 
      y: (d.rot.y + dx * 0.45) % 360 
    });
  };

  const onMouseUp = () => {
    dragRef.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const resetView = () => {
    const preset = views.find(v => v.id === viewMode)?.rotation || { x: -25, y: 35 };
    setRotation(preset);
  };

  const toggleInteractive = () => setIsInteractive(v => !v);

  const ready = Boolean(projectData.totalArea || (projectData.length && projectData.width));

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '100%',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.95)', 
        borderRadius: '12px', 
        padding: '24px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '2.5em' }}>🏠</span>
          <div>
            <h3 style={{ 
              fontSize: '1.8em', 
              fontWeight: '700', 
              color: '#1a202c',
              margin: 0,
              marginBottom: '4px'
            }}>
              3D Building Visualization
            </h3>
            <p style={{ 
              margin: 0, 
              color: '#64748b', 
              fontSize: '0.9em' 
            }}>
              Interactive architectural renderer with real-time lighting
            </p>
          </div>
        </div>

        {/* Tip Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
          border: '2px solid #67e8f9',
          padding: '12px 16px',
          borderRadius: '10px',
          color: '#155e75',
          marginBottom: '16px',
          fontSize: '0.9em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.3em' }}>💡</span>
          <span><strong>Pro Tip:</strong> Enable Interactive mode and drag to explore. Try Isometric view for the best perspective!</span>
        </div>

        {/* View Mode Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '10px',
          marginBottom: '16px'
        }}>
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id)}
              onMouseEnter={() => setHoveredView(v.id)}
              onMouseLeave={() => setHoveredView(null)}
              style={{
                background: viewMode === v.id 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : hoveredView === v.id
                  ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
                  : '#f1f5f9',
                border: viewMode === v.id ? '2px solid #5a67d8' : '2px solid #e2e8f0',
                color: viewMode === v.id ? 'white' : '#334155',
                padding: '12px 8px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.85em',
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                transform: hoveredView === v.id ? 'translateY(-2px)' : 'none',
                boxShadow: viewMode === v.id 
                  ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                  : hoveredView === v.id
                  ? '0 4px 12px rgba(0,0,0,0.1)'
                  : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <span style={{ fontSize: '1.5em' }}>{v.icon}</span>
              <span>{v.name}</span>
            </button>
          ))}
        </div>

        {/* Canvas Container */}
        <div style={{
          width: '100%',
          height: '400px',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e5edff 50%, #d6e4ff 100%)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '18px',
          border: '2px solid #cbd5e1',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {ready ? (
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                cursor: isInteractive ? (dragRef.current ? 'grabbing' : 'grab') : 'default',
                transition: 'cursor 0.2s'
              }}
              onMouseDown={onMouseDown}
            />
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#475569',
              padding: '40px'
            }}>
              <div style={{
                fontSize: '3.5em',
                marginBottom: '12px',
                animation: 'float 3s ease-in-out infinite'
              }}>
                🏗️
              </div>
              <div style={{ fontSize: '1.1em', fontWeight: '600', marginBottom: '8px' }}>
                Ready to Visualize Your Building
              </div>
              <div style={{
                fontSize: '0.9em',
                opacity: 0.7,
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                Enter dimensions or calculate estimate to generate your 3D model
              </div>
            </div>
          )}

          {isRendering && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.5em',
                  marginBottom: '12px',
                  animation: 'spin 2s linear infinite'
                }}>
                  ⚙️
                </div>
                <div style={{ fontSize: '1.2em', fontWeight: '600' }}>
                  Rendering 3D Model...
                </div>
              </div>
            </div>
          )}

          {/* Rotation indicator */}
          {ready && isInteractive && (
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255,255,255,0.9)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.75em',
              color: '#64748b',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontWeight: '500'
            }}>
              🔄 Drag to rotate
            </div>
          )}
        </div>

        {/* Control Buttons */}
        {ready && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <button
              onClick={toggleInteractive}
              style={{
                background: isInteractive
                  ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                  : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                color: isInteractive ? 'white' : '#475569',
                border: isInteractive ? '2px solid #2f855a' : '2px solid #cbd5e1',
                padding: '14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isInteractive
                  ? '0 4px 12px rgba(72, 187, 120, 0.3)'
                  : '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <span style={{ fontSize: '1.2em' }}>🎮</span>
              <span>{isInteractive ? 'Interactive Mode ON' : 'Enable Interactive'}</span>
            </button>
            <button
              onClick={resetView}
              style={{
                background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                color: '#475569',
                border: '2px solid #cbd5e1',
                padding: '14px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <span style={{ fontSize: '1.2em' }}>🔄</span>
              <span>Reset View</span>
            </button>
          </div>
        )}

        {/* Building Specifications */}
        {ready && (
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '18px',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            marginBottom: '16px',
            color: '#334155'
          }}>
            <div style={{
              fontWeight: '700',
              marginBottom: '12px',
              fontSize: '1.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '1.3em' }}>📋</span>
              Building Specifications
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              fontSize: '0.9em'
            }}>
              <div style={{
                background: 'white',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ color: '#64748b', fontSize: '0.85em', marginBottom: '4px' }}>
                  📐 Dimensions
                </div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>
                  {dims.length.toFixed(1)} × {dims.width.toFixed(1)} ft
                </div>
              </div>
              <div style={{
                background: 'white',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ color: '#64748b', fontSize: '0.85em', marginBottom: '4px' }}>
                  🏢 Stories
                </div>
                <div style={{ fontWeight: '600', color: '#1e293b' }}>
                  {dims.floors} {dims.floors === 1 ? 'Floor' : 'Floors'}
                </div>
              </div>
              <div style={{
                background: 'white',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ color: '#64748b', fontSize: '0.85em', marginBottom: '4px' }}>
                  🎨 Style
                </div>
                <div style={{ fontWeight: '600', color: '#1e293b', textTransform: 'capitalize' }}>
                  {dims.type}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render Button */}
        <button
          onClick={() => {
            if (!ready) return;
            setIsRendering(true);
            setTimeout(() => {
              setIsRendering(false);
              renderBuilding();
            }, 1000);
          }}
          disabled={!ready || isRendering}
          style={{
            width: '100%',
            background: !ready || isRendering
              ? 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: !ready || isRendering ? '#64748b' : 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1.05em',
            fontWeight: '700',
            cursor: !ready || isRendering ? 'not-allowed' : 'pointer',
            opacity: !ready || isRendering ? 0.6 : 1,
            transition: 'all 0.3s ease',
            boxShadow: !ready || isRendering
              ? 'none'
              : '0 4px 16px rgba(102, 126, 234, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            if (ready && !isRendering) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (ready && !isRendering) {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          <span style={{ fontSize: '1.3em' }}>
            {isRendering ? '⏳' : '🎨'}
          </span>
          <span>
            {isRendering 
              ? 'Rendering Scene...' 
              : `Generate ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View`}
          </span>
        </button>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Visualization3D;