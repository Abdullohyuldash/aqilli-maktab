import * as THREE from 'three';
import {
  AvatarEmote,
  FloorNumber,
  GymGameSnapshot,
  GymModeKind,
  SubjectId,
} from '../types';
import { SchoolWorldHandle, ColliderBox, ActiveFloorTrash } from './schoolWorld';
import { createRobloxAvatar, RobloxAvatarRig } from './avatar';
import { createSignboardTexture } from './textures';
import { PE_GRADE_1_LESSONS } from '../data/peGrade1';
import { soundEngine } from '../utils/sound';

export interface GymCameraOverride {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export interface GymWorldHandle extends SchoolWorldHandle {
  exitZone: { x: number; z: number; radius: number };
  setLessonIndex: (idx: number) => void;
  handleActionKey: (playerPos: THREE.Vector3) => void;
  handleSpaceInput: (
    isPressed: boolean,
    justPressed: boolean,
    justReleased: boolean,
    playerPos: THREE.Vector3,
    isGrounded: boolean
  ) => {
    handled?: boolean;
    launchJumpVel?: number;
    triggerPlayerEmote?: { emote: AvatarEmote; duration: number };
  } | void;
  handlePointerClick: (raycaster: THREE.Raycaster) => void;
  stepGymGameplay: (
    dt: number,
    elapsed: number,
    playerPos: THREE.Vector3,
    isPlayerMoving: boolean,
    isPlayerAirborne: boolean,
    playerYaw: number,
    onSnapshot: (snap: GymGameSnapshot) => void,
    onTriggerPlayerEmote: (emote: AvatarEmote, dur?: number) => void
  ) => void;
  getSnapshot: () => GymGameSnapshot;
  getCameraOverride: () => GymCameraOverride | null;
}

function createWoodenCourtTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#D99B52';
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 32;
  const plankW = 128;
  for (let row = 0; row < 16; row++) {
    const offset = (row % 2) * (plankW / 2);
    for (let col = -1; col < 5; col++) {
      const shade = ((row * 7 + col * 13) % 5) * 4 - 8;
      const r = Math.min(255, Math.max(0, 217 + shade));
      const g = Math.min(255, Math.max(0, 155 + shade));
      const b = Math.min(255, Math.max(0, 82 + shade));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(col * plankW + offset, row * plankH, plankW - 2, plankH - 2);
      ctx.strokeStyle = 'rgba(120, 65, 20, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(col * plankW + offset, row * plankH, plankW - 2, plankH - 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 5);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createLabelSprite(
  text: string,
  bgColor: string,
  textColor: string,
  textures: THREE.Texture[],
  materials: THREE.Material[],
  scaleW = 3.1,
  scaleH = 0.72
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(12, 16, 488, 96, 28);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.font = '800 42px Outfit, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 66, 456);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textures.push(tex);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  materials.push(mat);
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scaleW, scaleH, 1);
  return sprite;
}

function createPadNumberSprite(
  numText: string,
  textures: THREE.Texture[],
  materials: THREE.Material[]
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(128, 128, 96, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 112px Outfit, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(numText, 128, 134);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  textures.push(tex);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  materials.push(mat);
  const sp = new THREE.Sprite(mat);
  sp.scale.set(1.25, 1.25, 1);
  return sp;
}

export function getModeForLessonIndex(idx: number): GymModeKind {
  const n = idx + 1; // 1..34
  if (n >= 1 && n <= 4) return 'saf_mashqlari';
  if (n === 5 || n === 11 || n === 16) return 'number_reaction';
  if (n === 14 || n === 15) return 'tag_chase';
  if (n >= 7 && n <= 9) return 'urm_warmup';
  if (n === 6 || n === 10 || n === 12 || n === 20 || n === 21 || (n >= 27 && n <= 29)) {
    return 'relay_course';
  }
  if (n === 19) return 'kun_va_tun';
  if (n >= 22 && n <= 26) return 'apparatus_acro';
  if (n === 30 || (n >= 32 && n <= 34)) return 'jump_challenge';
  if (n === 13 || n === 31) return 'ball_throw';
  if (n === 17 || n === 18) return 'shashka_3d';
  return 'saf_mashqlari';
}

export function buildGymWorld(maxAnisotropy: number, castShadow: boolean): GymWorldHandle {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const disposableRigs: RobloxAvatarRig[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  // Gym Room Bounds: 34 x 26 units (X: -17..17, Z: -13..13)
  const W = 34;
  const D = 26;
  const H = 8.0;

  // 1. Polished Wooden Gym Floor + Court Markings
  const woodFloorTex = trackTex(createWoodenCourtTexture(maxAnisotropy));
  const floorMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: woodFloorTex,
      roughness: 0.34,
      metalness: 0.08,
    })
  );
  const floorMesh = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(W, D)), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Court painted lines
  const lineMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const laneLineMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));

  // Outer boundary rectangle
  const borderTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W - 3.6, 0.02, 0.14)), lineMat);
  borderTop.position.set(0, 0.015, -D / 2 + 1.8);
  group.add(borderTop);

  const borderBot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W - 3.6, 0.02, 0.14)), lineMat);
  borderBot.position.set(0, 0.015, D / 2 - 1.8);
  group.add(borderBot);

  const borderL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.02, D - 3.6)), lineMat);
  borderL.position.set(-W / 2 + 1.8, 0.015, 0);
  group.add(borderL);

  const borderR = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.02, D - 3.6)), lineMat);
  borderR.position.set(W / 2 - 1.8, 0.015, 0);
  group.add(borderR);

  // Center court circle & line
  const centerRing = new THREE.Mesh(trackGeo(new THREE.RingGeometry(2.7, 2.9, 40)), lineMat);
  centerRing.rotation.x = -Math.PI / 2;
  centerRing.position.set(0, 0.016, 0);
  group.add(centerRing);

  const centerLine = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.02, D - 3.6)), lineMat);
  centerLine.position.set(0, 0.016, 0);
  group.add(centerLine);

  // Running track lane stripes on South court
  [2.5, 4.2, 5.9].forEach((lz) => {
    const lane = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(18, 0.015, 0.08)), laneLineMat);
    lane.position.set(0, 0.014, lz);
    group.add(lane);
  });

  // 2. Gym Walls, Windows & Ceiling Beams
  const wallMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf0f9ff, roughness: 0.72 }));
  const wainscotMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.58 }));
  const beamMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45, metalness: 0.35 }));

  const northWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W, H, 0.6)), wallMat);
  northWall.position.set(0, H / 2, -D / 2);
  northWall.receiveShadow = true;
  group.add(northWall);

  const northWainscot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W - 0.6, 1.5, 0.66)), wainscotMat);
  northWainscot.position.set(0, 0.75, -D / 2);
  group.add(northWainscot);

  const southWallL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W / 2 - 2.1, H, 0.6)), wallMat);
  southWallL.position.set(-(W / 4 + 1.05), H / 2, D / 2);
  group.add(southWallL);

  const southWallR = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W / 2 - 2.1, H, 0.6)), wallMat);
  southWallR.position.set(W / 4 + 1.05, H / 2, D / 2);
  group.add(southWallR);

  const southHeader = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.4, H - 4.8, 0.6)), wallMat);
  southHeader.position.set(0, 4.8 + (H - 4.8) / 2, D / 2);
  group.add(southHeader);

  const westWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.6, H, D)), wallMat);
  westWall.position.set(-W / 2, H / 2, 0);
  group.add(westWall);

  const eastWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.6, H, D)), wallMat);
  eastWall.position.set(W / 2, H / 2, 0);
  group.add(eastWall);

  // Overhead gym ceiling trusses for realistic indoor scale
  [-9, -3, 3, 9].forEach((bx) => {
    const beam = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.4, 0.45, D - 0.8)), beamMat);
    beam.position.set(bx, H - 0.35, 0);
    group.add(beam);
  });

  // High wall windows
  const windowGlassMat = trackMat(
    new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.72 })
  );
  [-10, -4, 4, 10].forEach((wx) => {
    const win = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.4, 1.8, 0.14)), windowGlassMat);
    win.position.set(wx, 5.8, -D / 2 + 0.35);
    group.add(win);
  });

  // Wall Banner: SPORT ZALI
  const gymBannerTex = trackTex(
    createSignboardTexture('🏃 SPORT ZALI', 'JISMONIY TARBIYA VA CHINIQISH', '#0284C7', maxAnisotropy)
  );
  const gymBanner = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.2, 1.75, 0.2)),
    trackMat(new THREE.MeshStandardMaterial({ map: gymBannerTex, roughness: 0.35 }))
  );
  gymBanner.position.set(2.5, 4.4, -D / 2 + 0.38);
  group.add(gymBanner);

  // Glowing Exit Door Portal at South Center (x: 0, z: 12.2)
  const exitPortalMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.55,
      roughness: 0.25,
    })
  );
  const exitPortal = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.8, 4.6, 0.32)), exitPortalMat);
  exitPortal.position.set(0, 2.3, D / 2 - 0.15);
  group.add(exitPortal);

  const exitSignTex = trackTex(
    createSignboardTexture('🚪 MAKTABGA CHIQISH', '2-QAVAT KORIDORIGA QAYTISH', '#0369A1', maxAnisotropy)
  );
  const exitSignMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.4, 1.05, 0.22)),
    trackMat(new THREE.MeshStandardMaterial({ map: exitSignTex, roughness: 0.35 }))
  );
  exitSignMesh.position.set(0, 5.45, D / 2 - 0.32);
  exitSignMesh.rotation.y = Math.PI;
  group.add(exitSignMesh);

  const exitRing = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(1.4, 1.7, 32)),
    trackMat(new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide }))
  );
  exitRing.rotation.x = -Math.PI / 2;
  exitRing.position.set(0, 0.03, D / 2 - 1.6);
  group.add(exitRing);

  // =========================================================================
  // 3. 3D SPORTS APPARATUS & PROPS
  // =========================================================================
  const matBlueMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.48 }));
  const matTrimMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.4 }));
  const metalPoleMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.22 }));
  const woodMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.52 }));
  const coneMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.32 }));
  const hurdleBarMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 }));

  // A) Main Blue Gymnastics Mat (Left side: -10, -3.5) for URM / Acrobatics / Long Jump
  const leftMat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.2, 0.22, 6.8)), matBlueMat);
  leftMat.position.set(-10.0, 0.11, -3.5);
  leftMat.receiveShadow = true;
  group.add(leftMat);
  const leftMatBorder = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.36, 0.12, 6.96)), matTrimMat);
  leftMatBorder.position.set(-10.0, 0.06, -3.5);
  group.add(leftMatBorder);

  // B) Jump Mat (Center-Right: 6.0, -2.0) under Hanging Bell/Star
  const rightMat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.4, 0.2, 4.4)), matBlueMat);
  rightMat.position.set(6.0, 0.1, -2.0);
  rightMat.receiveShadow = true;
  group.add(rightMat);

  // C) Horizontal Bar (Turnik) at Left-South (-13.0, 4.5)
  const turnikBar = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 3.8, 12)), metalPoleMat);
  turnikBar.position.set(-13.0, 2.35, 4.5);
  turnikBar.rotation.x = Math.PI / 2;
  turnikBar.castShadow = castShadow;
  group.add(turnikBar);
  [-2.6, 6.4].forEach((tz) => {
    const post = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 2.5, 12)), metalPoleMat);
    post.position.set(-13.0, 1.25, tz === -2.6 ? 2.6 : 6.4);
    post.castShadow = castShadow;
    group.add(post);
  });

  // D) Swedish Wall Ladder (Gimnastik narvon) against North Wall (-6.5, -12.3)
  [-8.0, -5.0].forEach((lx) => {
    const sideRail = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 5.4, 0.28)), woodMat);
    sideRail.position.set(lx, 2.7, -D / 2 + 0.5);
    sideRail.castShadow = castShadow;
    group.add(sideRail);
  });
  for (let hy = 0.7; hy <= 5.0; hy += 0.68) {
    const rung = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 3.0, 10)), woodMat);
    rung.rotation.z = Math.PI / 2;
    rung.position.set(-6.5, hy, -D / 2 + 0.5);
    group.add(rung);
  }

  // E) Orange Running Cones & Low Hurdles (dynamically toggled/highlighted for Relay)
  const relayPropsGroup = new THREE.Group();
  group.add(relayPropsGroup);
  const conePositions = [
    { x: -7.5, z: 3.8 },
    { x: -2.5, z: 3.8 },
    { x: 2.5, z: 3.8 },
    { x: 7.5, z: 3.8 },
  ];
  conePositions.forEach((cp) => {
    const cone = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.32, 0.85, 16)), coneMat);
    cone.position.set(cp.x, 0.425, cp.z);
    cone.castShadow = castShadow;
    relayPropsGroup.add(cone);
  });

  // Low hurdles along Z=1.6
  const hurdleXs = [-5.0, 0.0, 5.0];
  hurdleXs.forEach((hx) => {
    const hurdle = new THREE.Group();
    hurdle.position.set(hx, 0, 1.6);
    [-0.65, 0.65].forEach((ox) => {
      const leg = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.09, 0.62, 0.45)), metalPoleMat);
      leg.position.set(ox, 0.31, 0);
      hurdle.add(leg);
    });
    const crossbar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.5, 0.12, 0.1)), hurdleBarMat);
    crossbar.position.set(0, 0.62, 0);
    crossbar.castShadow = castShadow;
    hurdle.add(crossbar);
    relayPropsGroup.add(hurdle);
  });

  // Relay Baton / Ball pickup mesh (at far turnaround cone)
  const batonMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.72, 12)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.5 }))
  );
  batonMesh.rotation.z = Math.PI / 2;
  batonMesh.position.set(9.5, 0.85, 3.8);
  batonMesh.visible = false;
  group.add(batonMesh);

  // F) Hanging Overhead Ball / Bell above Jump Mat (6.0, 3.35, -2.0)
  const hangingPivot = new THREE.Group();
  hangingPivot.position.set(6.0, H - 0.5, -2.0);
  group.add(hangingPivot);

  const ropeCord = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.03, 0.03, 4.1, 8)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }))
  );
  ropeCord.position.set(0, -2.05, 0);
  hangingPivot.add(ropeCord);

  const bellMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      metalness: 0.75,
      roughness: 0.2,
    })
  );
  const hangingBell = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.42, 18, 18)), bellMat);
  hangingBell.position.set(0, -4.15, 0); // World Y = 7.5 - 4.15 = 3.35!
  hangingPivot.add(hangingBell);

  // G) Throwing Target Rings & Basketball Hoop on East Court (Lessons 13 & 31)
  const throwTargetGroup = new THREE.Group();
  group.add(throwTargetGroup);

  const ringColors = [0xef4444, 0xf59e0b, 0x10b981];
  [1.9, 1.25, 0.62].forEach((rad, i) => {
    const tr = new THREE.Mesh(
      trackGeo(new THREE.RingGeometry(rad - 0.14, rad, 32)),
      trackMat(new THREE.MeshBasicMaterial({ color: ringColors[i], side: THREE.DoubleSide }))
    );
    tr.rotation.x = -Math.PI / 2;
    tr.position.set(10.5, 0.025 + i * 0.002, 2.0);
    throwTargetGroup.add(tr);
  });

  // Basketball Hoop at East Wall (15.6, 0, 2.0)
  const hoopStand = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.25, 3.6, 0.25)), metalPoleMat);
  hoopStand.position.set(15.6, 1.8, 2.0);
  throwTargetGroup.add(hoopStand);
  const backboard = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.14, 1.4, 2.1)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 }))
  );
  backboard.position.set(15.2, 3.3, 2.0);
  throwTargetGroup.add(backboard);
  const hoopRim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.58, 0.06, 10, 24)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.25, metalness: 0.5 }))
  );
  hoopRim.rotation.x = Math.PI / 2;
  hoopRim.position.set(14.5, 2.9, 2.0);
  throwTargetGroup.add(hoopRim);

  // Real 3D Thrown Tennis/Basketball Mesh
  const thrownBallMesh = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.28, 16, 16)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xeab308, emissive: 0xca8a04, emissiveIntensity: 0.2, roughness: 0.45 }))
  );
  thrownBallMesh.visible = false;
  thrownBallMesh.castShadow = castShadow;
  group.add(thrownBallMesh);

  // Dodgeballs for Lesson 15 (To'pga tegma)
  const dodgeBalls: { mesh: THREE.Mesh; x: number; z: number; vx: number; vz: number }[] = [];
  for (let b = 0; b < 3; b++) {
    const db = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.42, 16, 16)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 }))
    );
    db.position.set(-4 + b * 4, 0.42, -2 + b * 2);
    db.visible = false;
    db.castShadow = castShadow;
    group.add(db);
    dodgeBalls.push({
      mesh: db,
      x: -4 + b * 4,
      z: -2 + b * 2,
      vx: (b % 2 === 0 ? 1 : -1) * (4.4 + b * 0.7),
      vz: (b % 2 === 1 ? 1 : -1) * (3.8 + b * 0.6),
    });
  }

  // H) 3D Shashka Table & Interactive 8x8 3D Board (11.8, 0, -8.5)
  const SHASHKA_X = 11.8;
  const SHASHKA_Z = -8.5;
  const tableTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.2, 0.16, 3.2)), woodMat);
  tableTop.position.set(SHASHKA_X, 1.15, SHASHKA_Z);
  tableTop.castShadow = castShadow;
  group.add(tableTop);

  const tableLeg = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.14, 0.22, 1.15, 12)), metalPoleMat);
  tableLeg.position.set(SHASHKA_X, 0.575, SHASHKA_Z);
  group.add(tableLeg);

  [-1.9, 1.9].forEach((sz) => {
    const stool = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.65, 14)), woodMat);
    stool.position.set(SHASHKA_X, 0.325, SHASHKA_Z + sz);
    group.add(stool);
  });

  // 8x8 3D Shashka Board on top of table (y = 1.24)
  const shashkaBoardGroup = new THREE.Group();
  shashkaBoardGroup.position.set(SHASHKA_X, 1.24, SHASHKA_Z);
  group.add(shashkaBoardGroup);

  const tileLightMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 }));
  const tileDarkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.55 }));
  const tileHighlightMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x16a34a, emissiveIntensity: 0.75 })
  );
  const whitePieceMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
  const selectedPieceMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6 })
  );
  const blackPieceMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 }));

  const TILE_SIZE = 0.32;
  const shashkaTiles: THREE.Mesh[][] = [];
  for (let r = 0; r < 8; r++) {
    const rowArr: THREE.Mesh[] = [];
    for (let c = 0; c < 8; c++) {
      const isDark = (r + c) % 2 === 1;
      const tile = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(TILE_SIZE, 0.04, TILE_SIZE)),
        isDark ? tileDarkMat : tileLightMat
      );
      tile.position.set((c - 3.5) * TILE_SIZE, 0.02, (r - 3.5) * TILE_SIZE);
      tile.userData = { shashkaRow: r, shashkaCol: c, isDark };
      shashkaBoardGroup.add(tile);
      rowArr.push(tile);
    }
    shashkaTiles.push(rowArr);
  }

  interface ShashkaPiece {
    id: number;
    color: 'white' | 'black';
    row: number;
    col: number;
    mesh: THREE.Mesh;
  }
  const shashkaPieces: ShashkaPiece[] = [];
  const createShashkaPiece = (id: number, color: 'white' | 'black', r: number, c: number) => {
    const m = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.115, 0.125, 0.065, 16)),
      color === 'white' ? whitePieceMat : blackPieceMat
    );
    m.position.set((c - 3.5) * TILE_SIZE, 0.072, (r - 3.5) * TILE_SIZE);
    m.userData = { shashkaPieceId: id };
    shashkaBoardGroup.add(m);
    shashkaPieces.push({ id, color, row: r, col: c, mesh: m });
  };

  // =========================================================================
  // 4. DYNAMIC 3D GAMEPLAY FLOOR MARKERS (Glowing Spots, Number Pads, Beacons)
  // =========================================================================
  const markerGroup = new THREE.Group();
  group.add(markerGroup);

  const playerBeaconMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.75,
      roughness: 0.25,
    })
  );
  const playerBeaconRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.95, 0.1, 10, 32)), playerBeaconMat);
  playerBeaconRing.rotation.x = Math.PI / 2;
  playerBeaconRing.position.set(0, 0.06, 0);
  markerGroup.add(playerBeaconRing);

  const playerBeaconDisc = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.9, 28)),
    trackMat(new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.35, side: THREE.DoubleSide }))
  );
  playerBeaconDisc.rotation.x = -Math.PI / 2;
  playerBeaconDisc.position.set(0, 0.03, 0);
  markerGroup.add(playerBeaconDisc);

  // Floating arrow/beam above active beacon
  const beaconBeam = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.32, 0.7, 12)),
    trackMat(new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.85 }))
  );
  beaconBeam.rotation.x = Math.PI;
  beaconBeam.position.set(0, 2.2, 0);
  markerGroup.add(beaconBeam);

  // 4 Numbered Floor Pads (for Lesson 5, 11, 16 & 4-direction jump Lesson 32)
  const PAD_COORDS = [
    { x: -5.0, z: -1.5, label: '1' },
    { x: 5.0, z: -1.5, label: '2' },
    { x: -5.0, z: 4.5, label: '3' },
    { x: 5.0, z: 4.5, label: '4' },
  ];
  const numberPads = PAD_COORDS.map((pc, idx) => {
    const ringMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.4 })
    );
    const mesh = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(1.15, 1.25, 0.08, 24)), ringMat);
    mesh.position.set(pc.x, 0.04, pc.z);
    mesh.visible = false;
    group.add(mesh);

    const sprite = createPadNumberSprite(`${idx + 1}`, textures, materials);
    sprite.position.set(pc.x, 1.25, pc.z);
    sprite.visible = false;
    group.add(sprite);
    return { x: pc.x, z: pc.z, mesh, ringMat, sprite };
  });

  // =========================================================================
  // 5. VISIBLE 3D PE TEACHER ("👨‍🏫 Ustoz Rustam") & 5 GYM CLASSMATE NPCs
  // =========================================================================
  const coachRig = createRobloxAvatar('#0284C7', {}, castShadow, {
    gender: 'boy',
    variant: 'teacher',
    hairColor: '#1E293B',
    coachTracksuit: true,
  });
  disposableRigs.push(coachRig);
  coachRig.root.position.set(0, 0, -6.2);
  coachRig.root.rotation.y = 0;
  group.add(coachRig.root);

  const coachTag = createLabelSprite('👨‍🏫 Ustoz Rustam', '#0284C7', '#FFFFFF', textures, materials, 3.2, 0.72);
  coachTag.position.set(0, 3.15, 0);
  coachRig.root.add(coachTag);

  interface GymNpc {
    name: string;
    rig: RobloxAvatarRig;
    x: number;
    z: number;
    yaw: number;
    targetX: number;
    targetZ: number;
    speed: number;
    tag: THREE.Sprite;
    highlightRing: THREE.Mesh;
  }

  const classmateDefs: { name: string; gender: 'boy' | 'girl'; shirt: string; hair: string; x: number; z: number }[] = [
    { name: 'Aziz', gender: 'boy', shirt: '#0284C7', hair: '#1E293B', x: -6.0, z: -2.0 },
    { name: 'Madina', gender: 'girl', shirt: '#EC4899', hair: '#3B2314', x: -3.0, z: -2.0 },
    { name: 'Jasur', gender: 'boy', shirt: '#16A34A', hair: '#2C221E', x: 3.0, z: -2.0 },
    { name: 'Zilola', gender: 'girl', shirt: '#8B5CF6', hair: '#1E1612', x: 6.0, z: -2.0 },
    { name: 'Bekzod', gender: 'boy', shirt: '#F97316', hair: '#1E293B', x: -8.5, z: 1.5 },
  ];

  const gymNpcs: GymNpc[] = classmateDefs.map((cd, i) => {
    const rig = createRobloxAvatar(cd.shirt, { outfit: 'sport_uniform' }, castShadow, {
      gender: cd.gender,
      hairColor: cd.hair,
    });
    rig.setGymWear(true);
    disposableRigs.push(rig);
    rig.root.position.set(cd.x, 0, cd.z);
    group.add(rig.root);

    const tag = createLabelSprite(cd.name, cd.shirt, '#FFFFFF', textures, materials, 2.2, 0.56);
    tag.position.set(0, 3.0, 0);
    rig.root.add(tag);

    const highlightRing = new THREE.Mesh(
      trackGeo(new THREE.RingGeometry(0.75, 1.0, 24)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide }))
    );
    highlightRing.rotation.x = -Math.PI / 2;
    highlightRing.position.set(0, 0.04, 0);
    highlightRing.visible = false;
    rig.root.add(highlightRing);

    return {
      name: cd.name,
      rig,
      x: cd.x,
      z: cd.z,
      yaw: 0,
      targetX: cd.x,
      targetZ: cd.z,
      speed: 4.2 + (i % 3) * 0.45,
      tag,
      highlightRing,
    };
  });

  // Bounds & Wall Colliders (strictly keep everyone inside gym walls)
  const bounds = {
    minX: -W / 2 + 1.15,
    maxX: W / 2 - 1.15,
    minZ: -D / 2 + 1.15,
    maxZ: D / 2 - 1.15,
  };

  const colliders: ColliderBox[] = [
    // Shashka table collider (players walk up to edge, don't walk inside table!)
    { minX: SHASHKA_X - 1.65, maxX: SHASHKA_X + 1.65, minZ: SHASHKA_Z - 1.65, maxZ: SHASHKA_Z + 1.65 },
  ];

  // =========================================================================
  // 6. REAL-TIME 3D GAMEPLAY STATE MACHINE (ALL 34 LESSONS)
  // =========================================================================
  let lessonIndex = 0;
  let mode: GymModeKind = getModeForLessonIndex(0);
  let step = 0;
  let totalSteps = 3;
  let score = 0;
  let completed = false;
  let commandText = '';
  let subHintText = '';
  let timerSec: number | null = null;
  let actionPrompt: string | null = null;

  // Mode-specific runtime state
  let beaconPos = new THREE.Vector3(-4, 0, 1);
  let beaconVisible = false;
  let holdStationaryTimer = 0;

  // Number reaction
  let targetPadIdx = 0;
  let padTimer = 10;

  // Tag / Dodge
  let chaseTargetIdx = 0;
  let dodgeSurvivalTimer = 14;

  // Kun va tun
  let dayNightPhase: 'kun' | 'tun' = 'kun';
  let dayNightSwitchTimer = 3.5;
  let freezeGraceTimer = 0;

  // Apparatus & Timing Bar
  let activeStation: 'mat' | 'turnik' | 'ladder' | 'long_jump' | 'throw' = 'mat';
  let engagedInApparatus = false;
  let timingValue = 0;
  let timingDir = 1;
  let timingSweetMin = 35;
  let timingSweetMax = 65;

  // Jump power charge
  let chargingJump = false;
  let bellSwingVel = 0;
  let bellSwingAngle = 0;
  let bellCooldown = 0;

  // 4-direction jump pad
  let dirJumpTarget = 0; // 0: Oldinga, 1: Ortga, 2: Chapga, 3: O'ngga

  // Ball Throw (3D parabolic flight)
  let ballInFlight = false;
  let ballPos = new THREE.Vector3();
  let ballVel = new THREE.Vector3();
  let aimAngleDeg = 0;
  let aimOscDir = 1;

  // Relay
  let hasBaton = false;
  let relayStage: 'out' | 'pickup' | 'back' = 'out';

  // Shashka 3D board state
  let shashkaActive = false;
  let shashkaSelectedPieceId: number | null = null;
  let shashkaValidMoves: { r: number; c: number; captureId?: number }[] = [];

  let coachActionTimer = 0;
  let coachActionKind: AvatarEmote | null = null;
  let pendingApparatusAdvanceTimer = 0;
  let pendingUrmAdvanceTimer = 0;
  let urmCooldown = 0;
  let longJumpSuccessPending = false;
  let pendingPlayerEmote: { emote: AvatarEmote; duration: number } | null = null;
  let lastSnapshotSig = '';

  const setupShashkaPuzzle = (puzzleIdx: number) => {
    shashkaPieces.forEach((p) => shashkaBoardGroup.remove(p.mesh));
    shashkaPieces.length = 0;
    shashkaSelectedPieceId = null;
    shashkaValidMoves = [];

    const isCaptureLesson = lessonIndex === 17; // 18-dars: urib olish
    if (!isCaptureLesson) {
      // 17-dars: Diagonal step forward puzzles
      const whitePositions = [
        { r: 5, c: 2 },
        { r: 5, c: 4 },
        { r: 6, c: 3 },
      ];
      const pos = whitePositions[puzzleIdx % whitePositions.length];
      createShashkaPiece(1, 'white', pos.r, pos.c);
      createShashkaPiece(2, 'black', 1, 2);
      createShashkaPiece(3, 'black', 2, 5);
    } else {
      // 18-dars: Jump-capture puzzles!
      const setups = [
        { wr: 5, wc: 2, br: 4, bc: 3 },
        { wr: 5, wc: 4, br: 4, bc: 3 },
        { wr: 4, wc: 3, br: 3, bc: 4 },
      ];
      const s = setups[puzzleIdx % setups.length];
      createShashkaPiece(1, 'white', s.wr, s.wc);
      createShashkaPiece(2, 'black', s.br, s.bc);
    }
  };

  const refreshShashkaBoardVisuals = () => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const isDark = (r + c) % 2 === 1;
        const isHighlighted = shashkaValidMoves.some((m) => m.r === r && m.c === c);
        shashkaTiles[r][c].material = isHighlighted ? tileHighlightMat : isDark ? tileDarkMat : tileLightMat;
      }
    }
    shashkaPieces.forEach((p) => {
      if (p.color === 'white') {
        p.mesh.material = p.id === shashkaSelectedPieceId ? selectedPieceMat : whitePieceMat;
      } else {
        p.mesh.material = blackPieceMat;
      }
    });
  };

  const computeShashkaMovesForPiece = (piece: ShashkaPiece) => {
    shashkaValidMoves = [];
    const dirs = [
      { dr: -1, dc: -1 },
      { dr: -1, dc: 1 },
    ];
    const occupied = (r: number, c: number) => shashkaPieces.find((p) => p.row === r && p.col === c);

    // Check captures first (all 4 diagonals)
    const capDirs = [
      { dr: -1, dc: -1 },
      { dr: -1, dc: 1 },
      { dr: 1, dc: -1 },
      { dr: 1, dc: 1 },
    ];
    for (const d of capDirs) {
      const mr = piece.row + d.dr;
      const mc = piece.col + d.dc;
      const jr = piece.row + d.dr * 2;
      const jc = piece.col + d.dc * 2;
      if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8) {
        const mid = occupied(mr, mc);
        if (mid && mid.color === 'black' && !occupied(jr, jc)) {
          shashkaValidMoves.push({ r: jr, c: jc, captureId: mid.id });
        }
      }
    }
    if (shashkaValidMoves.length === 0) {
      for (const d of dirs) {
        const nr = piece.row + d.dr;
        const nc = piece.col + d.dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && !occupied(nr, nc)) {
          shashkaValidMoves.push({ r: nr, c: nc });
        }
      }
    }
  };

  const configureLessonStep = (newLessonIdx: number, newStep: number, resetScore = false) => {
    lessonIndex = Math.max(0, Math.min(PE_GRADE_1_LESSONS.length - 1, newLessonIdx));
    mode = getModeForLessonIndex(lessonIndex);
    step = newStep;
    if (resetScore) {
      score = 0;
      completed = false;
    }

    const plan = PE_GRADE_1_LESSONS[lessonIndex];
    engagedInApparatus = false;
    chargingJump = false;
    ballInFlight = false;
    thrownBallMesh.visible = false;
    shashkaActive = false;
    pendingApparatusAdvanceTimer = 0;
    pendingUrmAdvanceTimer = 0;
    urmCooldown = 0;
    longJumpSuccessPending = false;
    actionPrompt = null;
    timerSec = null;
    beaconVisible = false;
    batonMesh.visible = false;
    numberPads.forEach((p) => {
      p.mesh.visible = false;
      p.sprite.visible = false;
    });
    dodgeBalls.forEach((d) => {
      d.mesh.visible = false;
    });
    gymNpcs.forEach((n) => {
      n.highlightRing.visible = false;
    });

    const n = lessonIndex + 1;
    relayPropsGroup.visible = mode === 'relay_course' || mode === 'kun_va_tun' || mode === 'saf_mashqlari';
    throwTargetGroup.visible = mode === 'ball_throw';

    if (mode === 'saf_mashqlari') {
      totalSteps = 3;
      beaconVisible = true;
      if (step === 0) {
        beaconPos.set(0, 0, 1.5);
        commandText = '📣 Safga turing! Yashil doira ichiga boring';
        subHintText = 'Sinfdoshlaringiz bilan bir chiziqda turing';
      } else if (step === 1) {
        beaconPos.set(n === 3 ? 4.5 : 0, 0, n === 4 ? -1.5 : 5.0);
        commandText = n === 3 ? "📣 O'ngga burilib, yashil belgiga yuring!" : '📣 Qadam bos! Oldinga yuring!';
        subHintText = 'Yashil maydonchagacha tartib bilan yuring';
      } else {
        beaconPos.set(0, 0, 1.5);
        holdStationaryTimer = 2.2;
        timerSec = 2.2;
        commandText = '📣 Rostlan! To‘xtang va 2 soniya qimirlamang!';
        subHintText = "Belgi ustida tik turing — qimirlamang";
      }
    } else if (mode === 'number_reaction') {
      totalSteps = 3;
      targetPadIdx = (step * 2 + lessonIndex) % 4;
      padTimer = 11.0;
      timerSec = padTimer;
      numberPads.forEach((p, idx) => {
        p.mesh.visible = true;
        p.sprite.visible = true;
        const isTarget = idx === targetPadIdx;
        p.ringMat.color.setHex(isTarget ? 0x10b981 : 0x3b82f6);
        p.ringMat.emissive.setHex(isTarget ? 0x059669 : 0x1e40af);
        p.ringMat.emissiveIntensity = isTarget ? 0.85 : 0.25;
      });
      beaconVisible = true;
      beaconPos.set(numberPads[targetPadIdx].x, 0, numberPads[targetPadIdx].z);
      commandText = `📣 ${targetPadIdx + 1}-raqamli doiraga yuguring!`;
      subHintText = `Sinfdoshlaringizdan oldin ${targetPadIdx + 1}-raqamga yetib oling`;
    } else if (mode === 'tag_chase') {
      if (n === 14) {
        totalSteps = 3;
        chaseTargetIdx = step % gymNpcs.length;
        gymNpcs[chaseTargetIdx].highlightRing.visible = true;
        commandText = `📣 Quvlashmachoq! ${gymNpcs[chaseTargetIdx].name}ga yeting!`;
        subHintText = 'Sariq halqali do‘stingizni quvib tuting';
      } else {
        totalSteps = 1;
        dodgeSurvivalTimer = 12.0;
        timerSec = dodgeSurvivalTimer;
        dodgeBalls.forEach((d) => {
          d.mesh.visible = true;
        });
        commandText = "📣 To'pga tegma! Qizil to'plardan qoching!";
        subHintText = '12 soniya davomida to‘plarga tegmasdan chaqqon harakatlaning';
      }
    } else if (mode === 'urm_warmup') {
      totalSteps = 3;
      beaconVisible = true;
      beaconPos.set(-10.0, 0, -3.5);
      commandText = `📣 Badantarbiya (${step + 1}/3): Ko‘k matga chiqib E bosing!`;
      subHintText = plan.ruleTitle;
    } else if (mode === 'relay_course') {
      totalSteps = 2;
      relayStage = 'out';
      hasBaton = false;
      batonMesh.visible = true;
      batonMesh.position.set(9.5, 0.85, 3.8);
      beaconVisible = true;
      beaconPos.set(9.5, 0, 3.8);
      commandText =
        n === 21
          ? "📣 To'siqlardan Space bilan sakrab o'tib tayoqchani oling!"
          : '📣 Estafeta: Tayoqchani olish uchun o‘ng marraga yuguring!';
      subHintText = 'Konuslar yonidan o‘tib sariq tayoqchaga yetib boring';
    } else if (mode === 'kun_va_tun') {
      totalSteps = 1;
      dayNightPhase = 'kun';
      dayNightSwitchTimer = 3.6;
      freezeGraceTimer = 0;
      beaconVisible = true;
      beaconPos.set(0, 0, -3.8);
      commandText = '☀️ KUN! Yashil marraga tez yuguring!';
      subHintText = '🌙 TUN bo‘lganda Ustoz ortiga qaraydi — darhol to‘xtang!';
    } else if (mode === 'apparatus_acro') {
      totalSteps = 3;
      if (n === 22 || n === 24) activeStation = 'mat';
      else if (n === 23 || n === 25) activeStation = 'turnik';
      else activeStation = 'ladder';

      beaconVisible = true;
      if (activeStation === 'mat') {
        beaconPos.set(-10.0, 0, -3.5);
        commandText = '📣 Ko‘k matga boring va E bosib umbaloq / muvozanat bajaring!';
      } else if (activeStation === 'turnik') {
        beaconPos.set(-12.2, 0, 4.5);
        commandText = '📣 Turnik yoniga boring va E bosib osilish mashqini bajaring!';
      } else {
        beaconPos.set(-6.5, 0, -10.5);
        commandText = '📣 Gimnastik narvonga boring va E bosib tirmashishni bajaring!';
      }
      subHintText = 'Mashq oynasida Space tugmasini yashil zonada bosing';
      timingSweetMin = 34;
      timingSweetMax = 66;
    } else if (mode === 'jump_challenge') {
      totalSteps = 3;
      if (n === 30) {
        beaconVisible = true;
        beaconPos.set(-10.0, 0, -3.5);
        timingSweetMin = 45;
        timingSweetMax = 80;
        commandText = '📣 Uzunlikka sakrash! Ko‘k matga chiqib Space bosib turing!';
        subHintText = 'Yashil zonaga yetganda Space ni qo‘yib yuboring';
      } else if (n === 32) {
        dirJumpTarget = (step + 1) % 4;
        const dirLabels = ['Oldinga ⬆️', 'Ortga ⬇️', 'Chapga ⬅️', "O'ngga ➡️"];
        numberPads.forEach((p, idx) => {
          p.mesh.visible = true;
          const isT = idx === dirJumpTarget;
          p.ringMat.color.setHex(isT ? 0x10b981 : 0x64748b);
          p.ringMat.emissive.setHex(isT ? 0x059669 : 0x1e293b);
          p.ringMat.emissiveIntensity = isT ? 0.9 : 0.2;
        });
        beaconVisible = true;
        beaconPos.set(numberPads[dirJumpTarget].x, 0, numberPads[dirJumpTarget].z);
        commandText = `📣 ${dirLabels[dirJumpTarget]} doiraga sakrab tushing!`;
        subHintText = 'Yashil doira ustiga Space bilan sakrang';
      } else {
        beaconVisible = true;
        beaconPos.set(6.0, 0, -2.0);
        commandText = `📣 Balandga sakrash (${step + 1}/3): Osilgan qo‘ng‘iroqni chaling!`;
        subHintText = 'Ko‘k mat markaziga turib Space bilan baland sakrang';
      }
    } else if (mode === 'ball_throw') {
      totalSteps = 3;
      beaconVisible = true;
      beaconPos.set(3.2, 0, 2.0);
      commandText =
        n === 31
          ? `📣 Savatga tashlash (${step + 1}/3): Chiziqqa turib Space bosing!`
          : `📣 Nishonga uloqtirish (${step + 1}/3): Chiziqqa turib Space bosing!`;
      subHintText = 'Nishon ko‘rsatkichi markazga kelganda Space bosing';
    } else if (mode === 'shashka_3d') {
      totalSteps = 3;
      setupShashkaPuzzle(step);
      refreshShashkaBoardVisuals();
      beaconVisible = true;
      beaconPos.set(SHASHKA_X - 2.3, 0, SHASHKA_Z);
      commandText =
        n === 18
          ? `📣 Shashka (${step + 1}/3): Stolda raqib donasini urib oling!`
          : `📣 Shashka (${step + 1}/3): Stolda oq donani oldinga yuring!`;
      subHintText = 'Shashka stoli yoniga borib E bosing va 3D doskada donani bosing';
    }

    playerBeaconRing.visible = beaconVisible;
    playerBeaconDisc.visible = beaconVisible;
    beaconBeam.visible = beaconVisible;
    playerBeaconRing.position.set(beaconPos.x, 0.06, beaconPos.z);
    playerBeaconDisc.position.set(beaconPos.x, 0.03, beaconPos.z);
    beaconBeam.position.set(beaconPos.x, 2.1, beaconPos.z);
  };

  configureLessonStep(0, 0, true);

  const advanceStepOrComplete = (
    onTriggerPlayerEmote: (emote: AvatarEmote, dur?: number) => void
  ) => {
    score += 100;
    soundEngine.playCorrect();
    coachActionKind = 'qarsak';
    coachActionTimer = 2.0;

    if (step + 1 >= totalSteps) {
      completed = true;
      shashkaActive = false;
      engagedInApparatus = false;
      beaconVisible = false;
      playerBeaconRing.visible = false;
      playerBeaconDisc.visible = false;
      beaconBeam.visible = false;
      commandText = '🏆 Barakalla! Dars muvaffaqiyatli yakunlandi!';
      subHintText = 'Keyingi darsni tanlashingiz yoki zaldan chiqishingiz mumkin';
      coachActionKind = 'quvonch';
      coachActionTimer = 3.0;
      soundEngine.playLessonComplete();
      onTriggerPlayerEmote('quvonch', 2.8);
    } else {
      configureLessonStep(lessonIndex, step + 1, false);
    }
  };

  const getSnapshot = (): GymGameSnapshot => ({
    lessonIndex,
    mode,
    step,
    totalSteps,
    score,
    completed,
    commandText,
    subHintText,
    timerSec,
    actionPrompt,
    dayNightPhase: mode === 'kun_va_tun' ? dayNightPhase : undefined,
    timingActive:
      (mode === 'apparatus_acro' && engagedInApparatus) ||
      (mode === 'jump_challenge' && lessonIndex === 29 && chargingJump) ||
      mode === 'ball_throw',
    timingValue:
      mode === 'ball_throw'
        ? Math.round(((aimAngleDeg + 35) / 70) * 100)
        : Math.round(timingValue),
    timingSweetMin: mode === 'ball_throw' ? 35 : timingSweetMin,
    timingSweetMax: mode === 'ball_throw' ? 65 : timingSweetMax,
    timingLabel:
      mode === 'ball_throw'
        ? "Space — Nishon markazida to'pni oting!"
        : mode === 'jump_challenge'
        ? "Sakrash kuchi — Yashil zonada qo'yib yuboring!"
        : 'Space — Yashil zonada bosing!',
    aimAngleDeg: mode === 'ball_throw' ? aimAngleDeg : undefined,
    shashkaActive,
    shashkaTurnHint: shashkaActive
      ? shashkaSelectedPieceId === null
        ? 'Oq donani bosing'
        : 'Yashil katakka bosing'
      : undefined,
  });

  return {
    floor: 2 as FloorNumber,
    group,
    bounds,
    colliders,
    trashBins: [],
    exitZone: { x: 0, z: D / 2 - 1.5, radius: 2.3 },
    getActiveTrash: () => null,
    spawnRandomTrash: (): ActiveFloorTrash => ({
      id: 'gym-none',
      kind: 'paper',
      label: '',
      x: 0,
      z: 0,
      lifetimeRemaining: 0,
      totalLifetime: 1,
    }),
    clearActiveTrash: () => {},
    updateWorld: () => {},
    setLessonIndex: (idx: number) => {
      configureLessonStep(idx, 0, true);
    },
    handleActionKey: (playerPos: THREE.Vector3) => {
      if (completed) return;
      const distToBeacon = Math.hypot(playerPos.x - beaconPos.x, playerPos.z - beaconPos.z);

      if (mode === 'urm_warmup' && distToBeacon <= 3.2 && urmCooldown <= 0) {
        urmCooldown = 0.9;
        pendingUrmAdvanceTimer = 0.85;
        pendingPlayerEmote = { emote: 'urm_warmup', duration: 1.6 };
        soundEngine.playEquip();
        return;
      }
      if (mode === 'apparatus_acro' && distToBeacon <= 2.9 && pendingApparatusAdvanceTimer <= 0) {
        engagedInApparatus = !engagedInApparatus;
        timingValue = 15;
        timingDir = 1;
        soundEngine.playEquip();
        return;
      }
      if (mode === 'shashka_3d') {
        const distToTable = Math.hypot(playerPos.x - SHASHKA_X, playerPos.z - SHASHKA_Z);
        if (distToTable <= 3.8) {
          shashkaActive = !shashkaActive;
          if (shashkaActive) {
            const firstWhite = shashkaPieces.find((p) => p.color === 'white');
            if (firstWhite) {
              shashkaSelectedPieceId = firstWhite.id;
              computeShashkaMovesForPiece(firstWhite);
              refreshShashkaBoardVisuals();
            }
          }
          soundEngine.playEquip();
        }
      }
    },
    handleSpaceInput: (isPressed, justPressed, justReleased, playerPos, isGrounded) => {
      if (completed) return;
      const distToBeacon = Math.hypot(playerPos.x - beaconPos.x, playerPos.z - beaconPos.z);

      // URM quick rhythmic trigger via E or Space on mat
      if (mode === 'urm_warmup' && justPressed && distToBeacon <= 3.2 && urmCooldown <= 0) {
        urmCooldown = 0.9;
        pendingUrmAdvanceTimer = 0.85;
        soundEngine.playEquip();
        return { handled: true, triggerPlayerEmote: { emote: 'urm_warmup', duration: 1.6 } };
      }

      // Apparatus timing bar hit
      if (mode === 'apparatus_acro' && engagedInApparatus) {
        if (justPressed) {
          if (timingValue >= timingSweetMin && timingValue <= timingSweetMax) {
            const emote: AvatarEmote =
              activeStation === 'mat'
                ? 'somersault'
                : activeStation === 'turnik'
                ? 'bar_hang'
                : 'ladder_climb';
            engagedInApparatus = false;
            pendingApparatusAdvanceTimer = 1.15;
            soundEngine.playCorrect();
            return { handled: true, triggerPlayerEmote: { emote, duration: 2.0 } };
          } else {
            soundEngine.playWrong();
          }
        }
        return { handled: true };
      }

      // Long jump power charge (Lesson 30)
      if (mode === 'jump_challenge' && lessonIndex === 29) {
        if (distToBeacon <= 3.2 && isGrounded) {
          if (isPressed && !chargingJump) {
            chargingJump = true;
            timingValue = 10;
            timingDir = 1;
            return { handled: true };
          } else if (chargingJump && !justReleased) {
            return { handled: true };
          } else if (justReleased && chargingJump) {
            chargingJump = false;
            const inSweet = timingValue >= timingSweetMin && timingValue <= timingSweetMax;
            const boost = inSweet ? 13.5 : 9.4;
            soundEngine.playJump(inSweet);
            if (inSweet) {
              longJumpSuccessPending = true;
            }
            return { handled: true, launchJumpVel: boost };
          }
        } else {
          chargingJump = false;
        }
      }

      // Ball Throw (Lessons 13, 31)
      if (mode === 'ball_throw' && justPressed && !ballInFlight && distToBeacon <= 3.2) {
        ballInFlight = true;
        thrownBallMesh.visible = true;
        ballPos.set(playerPos.x + 0.4, 1.8, playerPos.z);
        const angleRad = THREE.MathUtils.degToRad(aimAngleDeg);
        const targetX = lessonIndex === 30 ? 14.5 : 10.5;
        const targetY = lessonIndex === 30 ? 2.95 : 0.25;
        const targetZ = 2.0 + Math.sin(angleRad) * 4.5;
        const flightTime = 0.88;
        ballVel.set(
          (targetX - ballPos.x) / flightTime,
          (targetY - ballPos.y - 0.5 * -16.0 * flightTime * flightTime) / flightTime,
          (targetZ - ballPos.z) / flightTime
        );
        soundEngine.playWindWhoosh();
        return { handled: true, triggerPlayerEmote: { emote: 'throw_ball', duration: 1.0 } };
      }

      // Shashka keyboard shortcut: Space executes highlighted valid move if seated
      if (mode === 'shashka_3d' && shashkaActive && justPressed && shashkaValidMoves.length > 0) {
        const move = shashkaValidMoves[0];
        const piece = shashkaPieces.find((p) => p.id === shashkaSelectedPieceId);
        if (piece) {
          if (move.captureId !== undefined) {
            const capIdx = shashkaPieces.findIndex((p) => p.id === move.captureId);
            if (capIdx >= 0) {
              shashkaBoardGroup.remove(shashkaPieces[capIdx].mesh);
              shashkaPieces.splice(capIdx, 1);
            }
          }
          piece.row = move.r;
          piece.col = move.c;
          piece.mesh.position.set((move.c - 3.5) * TILE_SIZE, 0.072, (move.r - 3.5) * TILE_SIZE);
          shashkaValidMoves = [];
          refreshShashkaBoardVisuals();
          soundEngine.playEquip();
          // Advance step next tick via marker
          engagedInApparatus = true;
        }
        return { handled: true };
      }
    },
    handlePointerClick: (raycaster: THREE.Raycaster) => {
      if (!shashkaActive || mode !== 'shashka_3d' || completed) return;
      const hits = raycaster.intersectObjects(shashkaBoardGroup.children, false);
      if (hits.length === 0) return;

      const hitData = hits[0].object.userData;
      if (hitData.shashkaPieceId !== undefined) {
        const piece = shashkaPieces.find((p) => p.id === hitData.shashkaPieceId);
        if (piece && piece.color === 'white') {
          shashkaSelectedPieceId = piece.id;
          computeShashkaMovesForPiece(piece);
          refreshShashkaBoardVisuals();
          soundEngine.playEquip();
        }
        return;
      }

      if (hitData.shashkaRow !== undefined && shashkaSelectedPieceId !== null) {
        const r = hitData.shashkaRow as number;
        const c = hitData.shashkaCol as number;
        const valid = shashkaValidMoves.find((m) => m.r === r && m.c === c);
        const piece = shashkaPieces.find((p) => p.id === shashkaSelectedPieceId);
        if (valid && piece) {
          if (valid.captureId !== undefined) {
            const capIdx = shashkaPieces.findIndex((p) => p.id === valid.captureId);
            if (capIdx >= 0) {
              shashkaBoardGroup.remove(shashkaPieces[capIdx].mesh);
              shashkaPieces.splice(capIdx, 1);
            }
          }
          piece.row = valid.r;
          piece.col = valid.c;
          piece.mesh.position.set((valid.c - 3.5) * TILE_SIZE, 0.072, (valid.r - 3.5) * TILE_SIZE);
          shashkaValidMoves = [];
          refreshShashkaBoardVisuals();
          engagedInApparatus = true;
        }
      }
    },
    stepGymGameplay: (
      dt,
      elapsed,
      playerPos,
      isPlayerMoving,
      isPlayerAirborne,
      playerYaw,
      onSnapshot,
      onTriggerPlayerEmote
    ) => {
      if (pendingPlayerEmote) {
        onTriggerPlayerEmote(pendingPlayerEmote.emote, pendingPlayerEmote.duration);
        pendingPlayerEmote = null;
      }
      if (urmCooldown > 0) urmCooldown = Math.max(0, urmCooldown - dt);

      // Animate beacon pulse
      if (beaconVisible) {
        const pulse = 1 + Math.sin(elapsed * 5.0) * 0.08;
        playerBeaconRing.scale.set(pulse, pulse, 1);
        beaconBeam.position.y = 2.0 + Math.sin(elapsed * 4.0) * 0.25;
      }

      // Bell swing decay
      if (bellCooldown > 0) bellCooldown = Math.max(0, bellCooldown - dt);
      bellSwingVel += -18.0 * bellSwingAngle * dt;
      bellSwingVel *= Math.exp(-2.2 * dt);
      bellSwingAngle += bellSwingVel * dt;
      hangingPivot.rotation.z = bellSwingAngle;

      // Coach Ustoz Rustam animation & facing
      if (coachActionTimer > 0) {
        coachActionTimer -= dt;
        if (coachActionKind && !coachRig.isEmoteActive()) {
          coachRig.triggerEmote(coachActionKind, coachActionTimer);
        }
        if (coachActionTimer <= 0) coachActionKind = null;
      }

      if (mode === 'kun_va_tun' && !completed && dayNightPhase === 'tun') {
        coachRig.root.rotation.y = THREE.MathUtils.damp(coachRig.root.rotation.y, Math.PI, 10, dt);
      } else {
        const targetCoachYaw = Math.atan2(playerPos.x - coachRig.root.position.x, playerPos.z - coachRig.root.position.z);
        coachRig.root.rotation.y = THREE.MathUtils.damp(coachRig.root.rotation.y, targetCoachYaw, 6, dt);
      }

      if (mode === 'urm_warmup' && !completed && !coachRig.isEmoteActive()) {
        coachRig.triggerEmote('urm_warmup', 2.5);
      }
      coachRig.updateAnimation(dt, 0, false, 0);

      // Update 5 Classmate NPCs strictly within gym floor bounds!
      gymNpcs.forEach((npc, i) => {
        if (mode === 'saf_mashqlari') {
          // Form a crisp line behind/beside player beacon
          const slotX = -5.5 + i * 2.75;
          const slotZ = step === 1 ? 4.2 : 1.5;
          npc.targetX = slotX;
          npc.targetZ = slotZ;
        } else if (mode === 'urm_warmup') {
          npc.targetX = -10.0 + (i - 2) * 1.1;
          npc.targetZ = -1.2 - (i % 2) * 2.2;
          if (!npc.rig.isEmoteActive()) {
            npc.rig.triggerEmote('urm_warmup', 2.4);
          }
        } else if (mode === 'number_reaction' && !completed) {
          const pad = numberPads[(targetPadIdx + (i === 0 ? 0 : i)) % 4];
          npc.targetX = pad.x + (i - 2) * 0.6;
          npc.targetZ = pad.z + (i % 2 === 0 ? 0.6 : -0.6);
        } else if (mode === 'tag_chase' && lessonIndex === 13 && i === chaseTargetIdx && !completed) {
          // Target classmate flees player smoothly inside court bounds
          const awayX = npc.x - playerPos.x;
          const awayZ = npc.z - playerPos.z;
          const awayLen = Math.hypot(awayX, awayZ) || 1;
          npc.targetX = THREE.MathUtils.clamp(npc.x + (awayX / awayLen) * 5.0, -13.5, 13.5);
          npc.targetZ = THREE.MathUtils.clamp(npc.z + (awayZ / awayLen) * 5.0, -10.5, 10.5);
        } else if (mode === 'kun_va_tun' && !completed) {
          if (dayNightPhase === 'kun') {
            npc.targetX = -6.0 + i * 3.0;
            npc.targetZ = -3.5;
          } else {
            npc.targetX = npc.x;
            npc.targetZ = npc.z;
          }
        } else {
          // Gentle sideline patrol / cheer
          const angle = elapsed * 0.45 + i * 1.3;
          npc.targetX = THREE.MathUtils.clamp(-9.0 + i * 4.5 + Math.cos(angle) * 1.5, bounds.minX + 1, bounds.maxX - 1);
          npc.targetZ = THREE.MathUtils.clamp(-8.5 + Math.sin(angle) * 1.5, bounds.minZ + 1, bounds.maxZ - 1);
        }

        const dx = npc.targetX - npc.x;
        const dz = npc.targetZ - npc.z;
        const dist = Math.hypot(dx, dz);
        const isMovingNpc = dist > 0.35;
        if (isMovingNpc) {
          const moveStep = Math.min(dist, npc.speed * dt);
          npc.x = THREE.MathUtils.clamp(npc.x + (dx / dist) * moveStep, bounds.minX + 0.8, bounds.maxX - 0.8);
          npc.z = THREE.MathUtils.clamp(npc.z + (dz / dist) * moveStep, bounds.minZ + 0.8, bounds.maxZ - 0.8);
          npc.yaw = Math.atan2(dx, dz);
        } else {
          npc.yaw = Math.atan2(coachRig.root.position.x - npc.x, coachRig.root.position.z - npc.z);
        }
        npc.rig.root.position.set(npc.x, 0, npc.z);
        npc.rig.root.rotation.y = npc.yaw;
        npc.rig.updateAnimation(dt, isMovingNpc ? 0.72 : 0, false, 0);
      });

      if (!completed) {
        const distToBeacon = Math.hypot(playerPos.x - beaconPos.x, playerPos.z - beaconPos.z);

        // Mode-by-mode 3D evaluation:
        if (mode === 'saf_mashqlari') {
          if (step < 2) {
            if (distToBeacon <= 1.25) {
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          } else {
            if (distToBeacon <= 1.5 && !isPlayerMoving && !isPlayerAirborne) {
              holdStationaryTimer -= dt;
              timerSec = Math.max(0, holdStationaryTimer);
              if (holdStationaryTimer <= 0) {
                advanceStepOrComplete(onTriggerPlayerEmote);
              }
            } else {
              holdStationaryTimer = 2.2;
              timerSec = 2.2;
            }
          }
        } else if (mode === 'number_reaction') {
          padTimer -= dt;
          timerSec = Math.max(0, padTimer);
          if (distToBeacon <= 1.45) {
            advanceStepOrComplete(onTriggerPlayerEmote);
          } else if (padTimer <= 0) {
            soundEngine.playWrong();
            padTimer = 10.0;
          }
        } else if (mode === 'tag_chase') {
          if (lessonIndex === 13) {
            const targetNpc = gymNpcs[chaseTargetIdx];
            const distTag = Math.hypot(playerPos.x - targetNpc.x, playerPos.z - targetNpc.z);
            if (distTag <= 1.45) {
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          } else {
            // Dodge balls!
            dodgeSurvivalTimer -= dt;
            timerSec = Math.max(0, dodgeSurvivalTimer);
            let hit = false;
            dodgeBalls.forEach((db) => {
              db.x += db.vx * dt;
              db.z += db.vz * dt;
              if (db.x < -14 || db.x > 14) db.vx *= -1;
              if (db.z < -10 || db.z > 10) db.vz *= -1;
              db.mesh.position.set(db.x, 0.42 + Math.abs(Math.sin(elapsed * 6)) * 0.25, db.z);
              if (Math.hypot(playerPos.x - db.x, playerPos.z - db.z) < 1.0 && playerPos.y < 0.7) {
                hit = true;
              }
            });
            if (hit) {
              soundEngine.playTrainWhistle();
              dodgeSurvivalTimer = 12.0;
            } else if (dodgeSurvivalTimer <= 0) {
              dodgeBalls.forEach((d) => (d.mesh.visible = false));
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          }
        } else if (mode === 'urm_warmup') {
          actionPrompt =
            distToBeacon <= 3.2 && pendingUrmAdvanceTimer <= 0
              ? 'E yoki Space — Badantarbiya mashqini bajaring!'
              : null;
          if (pendingUrmAdvanceTimer > 0) {
            pendingUrmAdvanceTimer -= dt;
            if (pendingUrmAdvanceTimer <= 0) {
              pendingUrmAdvanceTimer = 0;
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          }
        } else if (mode === 'relay_course') {
          batonMesh.rotation.y += dt * 2.5;
          if (relayStage === 'out') {
            if (Math.hypot(playerPos.x - 9.5, playerPos.z - 3.8) <= 1.65) {
              hasBaton = true;
              batonMesh.visible = false;
              relayStage = 'back';
              beaconPos.set(-9.5, 0, 3.8);
              playerBeaconRing.position.set(beaconPos.x, 0.06, beaconPos.z);
              playerBeaconDisc.position.set(beaconPos.x, 0.03, beaconPos.z);
              beaconBeam.position.set(beaconPos.x, 2.1, beaconPos.z);
              commandText = '📣 Tayoqcha olindi! Chap marraga tez qayting!';
              soundEngine.playCoin();
            }
          } else if (relayStage === 'back') {
            if (hasBaton && Math.hypot(playerPos.x - -9.5, playerPos.z - 3.8) <= 1.65) {
              hasBaton = false;
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          }
        } else if (mode === 'kun_va_tun') {
          dayNightSwitchTimer -= dt;
          if (dayNightSwitchTimer <= 0) {
            dayNightPhase = dayNightPhase === 'kun' ? 'tun' : 'kun';
            dayNightSwitchTimer = dayNightPhase === 'kun' ? 3.5 : 2.4;
            freezeGraceTimer = 0.45; // brief reaction grace
            if (dayNightPhase === 'tun') {
              soundEngine.playTrainWhistle();
              commandText = '🌙 TUN! Qimirlamang!';
              subHintText = 'Ustoz qarab turibdi — joyingizda qotib turing!';
            } else {
              soundEngine.playEquip();
              commandText = '☀️ KUN! Yashil marraga tez yuguring!';
              subHintText = 'TUN bo‘lishidan oldin iloji boricha oldinga yuring';
            }
          }
          if (freezeGraceTimer > 0) freezeGraceTimer -= dt;
          if (dayNightPhase === 'tun' && freezeGraceTimer <= 0 && isPlayerMoving) {
            soundEngine.playGreetingWarning();
            playerPos.z = Math.min(bounds.maxZ - 1, playerPos.z + 2.6);
            freezeGraceTimer = 0.6;
          }
          if (distToBeacon <= 1.65) {
            advanceStepOrComplete(onTriggerPlayerEmote);
          }
        } else if (mode === 'apparatus_acro') {
          if (pendingApparatusAdvanceTimer > 0) {
            actionPrompt = null;
            pendingApparatusAdvanceTimer -= dt;
            if (pendingApparatusAdvanceTimer <= 0) {
              pendingApparatusAdvanceTimer = 0;
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          } else if (engagedInApparatus) {
            actionPrompt = 'Space — Yashil zonada bosing!';
            timingValue += timingDir * 78 * dt;
            if (timingValue >= 100) {
              timingValue = 100;
              timingDir = -1;
            } else if (timingValue <= 0) {
              timingValue = 0;
              timingDir = 1;
            }
          } else {
            actionPrompt = distToBeacon <= 2.9 ? 'E — Sport anjomida mashqni boshlash' : null;
          }
        } else if (mode === 'jump_challenge') {
          if (lessonIndex === 29) {
            actionPrompt =
              distToBeacon <= 3.2
                ? chargingJump
                  ? "Space ni yashil zonada qo'yib yuboring!"
                  : 'Space bosib turing — Sakrash kuchini to‘plang!'
                : null;
            if (chargingJump) {
              timingValue += timingDir * 85 * dt;
              if (timingValue >= 100) {
                timingValue = 100;
                timingDir = -1;
              } else if (timingValue <= 0) {
                timingValue = 0;
                timingDir = 1;
              }
            }
            if (longJumpSuccessPending && !isPlayerAirborne) {
              longJumpSuccessPending = false;
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          } else if (lessonIndex === 31) {
            if (distToBeacon <= 1.45 && isPlayerAirborne) {
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          } else {
            // Hanging bell ring!
            const distBellXZ = Math.hypot(playerPos.x - 6.0, playerPos.z - -2.0);
            if (distBellXZ <= 1.7 && playerPos.y >= 1.15 && bellCooldown <= 0) {
              bellCooldown = 0.9;
              bellSwingVel = 6.5;
              soundEngine.playElevatorDing();
              advanceStepOrComplete(onTriggerPlayerEmote);
            }
          }
        } else if (mode === 'ball_throw') {
          actionPrompt = distToBeacon <= 3.2 && !ballInFlight ? "Space — To'pni nishonga oting!" : null;
          aimAngleDeg += aimOscDir * 52 * dt;
          if (aimAngleDeg >= 32) {
            aimAngleDeg = 32;
            aimOscDir = -1;
          } else if (aimAngleDeg <= -32) {
            aimAngleDeg = -32;
            aimOscDir = 1;
          }
          if (ballInFlight) {
            ballVel.y += -16.0 * dt;
            ballPos.addScaledVector(ballVel, dt);
            thrownBallMesh.position.copy(ballPos);
            const targetX = lessonIndex === 30 ? 14.5 : 10.5;
            const hitFloor = ballPos.y <= 0.28;
            const hitHoop = lessonIndex === 30 && Math.hypot(ballPos.x - 14.5, ballPos.z - 2.0) < 1.2 && Math.abs(ballPos.y - 2.9) < 0.7;
            if (hitHoop || (hitFloor && Math.hypot(ballPos.x - targetX, ballPos.z - 2.0) < 2.2)) {
              ballInFlight = false;
              thrownBallMesh.visible = false;
              advanceStepOrComplete(onTriggerPlayerEmote);
            } else if (hitFloor || ballPos.x > 16.5) {
              ballInFlight = false;
              thrownBallMesh.visible = false;
              soundEngine.playWrong();
            }
          }
        } else if (mode === 'shashka_3d') {
          const distToTable = Math.hypot(playerPos.x - SHASHKA_X, playerPos.z - SHASHKA_Z);
          actionPrompt =
            shashkaActive
              ? '3D Doskadagi donani bosing (yoki E — Turish)'
              : distToTable <= 3.8
              ? "E — Shashka stoliga o'tirish"
              : null;
          if (engagedInApparatus) {
            engagedInApparatus = false;
            advanceStepOrComplete(onTriggerPlayerEmote);
          }
        }
      }

      // Emit snapshot only when visible HUD values change (or timer ticks)
      const sig = `${lessonIndex}|${step}|${score}|${completed}|${commandText}|${actionPrompt}|${dayNightPhase}|${shashkaActive}|${engagedInApparatus}|${chargingJump}|${Math.round(timingValue)}|${Math.round(aimAngleDeg)}|${timerSec !== null ? Math.ceil(timerSec * 10) : -1}`;
      if (sig !== lastSnapshotSig) {
        lastSnapshotSig = sig;
        onSnapshot(getSnapshot());
      }

      // Unused param keep-clean
      void playerYaw;
    },
    getSnapshot,
    getCameraOverride: () => {
      if (!shashkaActive || mode !== 'shashka_3d') return null;
      return {
        position: new THREE.Vector3(SHASHKA_X, 4.15, SHASHKA_Z + 2.35),
        target: new THREE.Vector3(SHASHKA_X, 1.25, SHASHKA_Z),
      };
    },
    dispose: () => {
      disposableRigs.forEach((r) => r.dispose());
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
