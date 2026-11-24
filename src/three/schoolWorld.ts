import * as THREE from 'three';
import { FloorNumber, SubjectId, TrashKind, WorldZone } from '../types';
import { ELEVATOR_TRIGGER, FLOOR_META, getZonesForFloor, SUBJECT_META } from '../data/curriculum';
import {
  createAwningTexture,
  createChalkboardTexture,
  createCheckerboardFloorTexture,
  createElevatorLedTexture,
  createHallMedallionTexture,
  createScheduleBoardTexture,
  createSignboardTexture,
  createWallPosterTexture,
} from './textures';

export interface ColliderBox {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface TrashBinHandle {
  id: string;
  x: number;
  z: number;
}

export interface ActiveFloorTrash {
  id: string;
  kind: TrashKind;
  label: string;
  x: number;
  z: number;
  lifetimeRemaining: number;
  totalLifetime: number;
}

export interface SchoolWorldHandle {
  floor: FloorNumber;
  group: THREE.Group;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  colliders: ColliderBox[];
  trashBins: TrashBinHandle[];
  getActiveTrash: () => ActiveFloorTrash | null;
  spawnRandomTrash: (playerPos?: { x: number; z: number }) => ActiveFloorTrash;
  clearActiveTrash: () => void;
  updateWorld: (
    dt: number,
    elapsed: number,
    activeSubject: SubjectId,
    playerPos: THREE.Vector3,
    npcDoorRequests?: Partial<Record<SubjectId, number>>,
    isHoldingTrash?: boolean
  ) => void;
  dispose: () => void;
}

const _activeColor = new THREE.Color();
const _elevatorDefaultColor = new THREE.Color();

interface ClassroomVisualMeta {
  subtitle: string;
  formula: string;
  boardLabel: string;
  boardOffsetX: number;
}

const CLASSROOM_VISUALS: Record<string, ClassroomVisualMeta> = {
  alifbe: {
    subtitle: '1-SINF • HARFLAR, OVOZ VA SO‘ZLAR',
    formula: 'A · O · I · U',
    boardLabel: 'ALIFBE',
    boardOffsetX: -3.4,
  },
  math: {
    subtitle: '1–11-SINF • HISOBLASH VA MANTIQLAR',
    formula: 'a² + b² = c²',
    boardLabel: 'MATEMATIKA',
    boardOffsetX: 3.4,
  },
  english: {
    subtitle: '1–11-SINF • LUG‘AT VA GRAMMATIKA',
    formula: 'Hello, World!',
    boardLabel: 'ENGLISH CLASS',
    boardOffsetX: -3.4,
  },
  cs: {
    subtitle: '1–11-SINF • ALGORITM VA KODLASH',
    formula: '0101 → CODE',
    boardLabel: 'INFORMATIKA',
    boardOffsetX: -3.3,
  },
  science: {
    subtitle: '1–11-SINF • FIZIKA, KIMYO, TABIAT',
    formula: 'H₂O + O₂ ☀',
    boardLabel: 'TABIIY FANLAR',
    boardOffsetX: 3.3,
  },
  ona_tili: {
    subtitle: 'TEZ KUNDA OCHILADI',
    formula: 'Ona tili va adabiyot',
    boardLabel: 'TEZ KUNDA',
    boardOffsetX: 3.3,
  },
  tarix: {
    subtitle: 'TEZ KUNDA OCHILADI',
    formula: 'Buyuk Ipak Yo‘li',
    boardLabel: 'TEZ KUNDA',
    boardOffsetX: -3.3,
  },
  fizika: {
    subtitle: 'TEZ KUNDA OCHILADI',
    formula: 'F = m · a ⚡',
    boardLabel: 'TEZ KUNDA',
    boardOffsetX: 3.3,
  },
};

export function buildSchoolWorld(
  floor: FloorNumber,
  maxAnisotropy: number,
  castShadow: boolean
): SchoolWorldHandle {
  const floorMeta = FLOOR_META[floor];
  const floorZones = getZonesForFloor(floor);

  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

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

  const colliders: ColliderBox[] = [];

  // Hall interior dimensions: X from -15 to +15 (width 30), Z from -13 to +13 (depth 26)
  const HALL_W = 30;
  const HALL_D = 26;
  const WALL_H = 6.8;

  // --- FLOOR (Floor-themed Checkerboard polished tile) ---
  const floorTex = trackTex(
    createCheckerboardFloorTexture(maxAnisotropy, floorMeta.floorLightHex, floorMeta.floorDarkHex)
  );
  const floorMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.42,
      metalness: 0.05,
    })
  );
  const floorMesh = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(HALL_W, HALL_D)), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Exterior horizon apron visible over the south balcony parapet
  const exteriorColor = floor === 1 ? 0x86efac : floor === 2 ? 0xbae6fd : 0xc7d2fe;
  const exteriorMat = trackMat(
    new THREE.MeshStandardMaterial({ color: exteriorColor, roughness: 0.9, metalness: 0.0 })
  );
  const exteriorGround = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(140, 140)), exteriorMat);
  exteriorGround.rotation.x = -Math.PI / 2;
  exteriorGround.position.y = -0.15;
  group.add(exteriorGround);

  // Central school hall floor medallion showing current floor
  const medallionTex = trackTex(
    createHallMedallionTexture(
      maxAnisotropy,
      floorMeta.medallionBgHex,
      floorMeta.medallionRingHex,
      floorMeta.medallionSubLabel
    )
  );
  const medallionMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: medallionTex,
      transparent: true,
      roughness: 0.5,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );
  const medallion = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(6.2, 6.2)), medallionMat);
  medallion.rotation.x = -Math.PI / 2;
  medallion.position.set(0, 0.02, 1.8);
  medallion.receiveShadow = true;
  group.add(medallion);

  // --- WALLS & FLOOR-THEMED TRIM ---
  const wallCreamMat = trackMat(
    new THREE.MeshStandardMaterial({ color: floorMeta.wallColorNum, roughness: 0.72, metalness: 0.02 })
  );
  const wainscotMat = trackMat(
    new THREE.MeshStandardMaterial({ color: floorMeta.wainscotColorNum, roughness: 0.62, metalness: 0.04 })
  );
  const woodTrimMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.58, metalness: 0.05 })
  );
  const accentStripMat = trackMat(
    new THREE.MeshStandardMaterial({ color: floorMeta.accentHexNum, roughness: 0.4, metalness: 0.12 })
  );
  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    })
  );

  const addWallSegment = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material = wallCreamMat
  ) => {
    const mesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(w, h, d)), mat);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = castShadow;
    group.add(mesh);
    return mesh;
  };

  // West, East, North walls & low panoramic South wall (keeps third-person camera unobstructed)
  addWallSegment(0.6, WALL_H, HALL_D + 0.6, -HALL_W / 2 - 0.3, WALL_H / 2, 0);
  addWallSegment(0.6, WALL_H, HALL_D + 0.6, HALL_W / 2 + 0.3, WALL_H / 2, 0);
  addWallSegment(HALL_W + 1.2, WALL_H, 0.6, 0, WALL_H / 2, -HALL_D / 2 - 0.3);
  addWallSegment(HALL_W + 1.2, 2.2, 0.6, 0, 1.1, HALL_D / 2 + 0.3, wainscotMat);
  addWallSegment(HALL_W + 1.2, 0.22, 0.72, 0, 2.25, HALL_D / 2 + 0.3, woodTrimMat);

  // Perimeter top wood cornice
  addWallSegment(0.42, 0.32, HALL_D + 0.6, -HALL_W / 2 - 0.1, WALL_H, 0, woodTrimMat);
  addWallSegment(0.42, 0.32, HALL_D + 0.6, HALL_W / 2 + 0.1, WALL_H, 0, woodTrimMat);
  addWallSegment(HALL_W + 1.2, 0.32, 0.42, 0, WALL_H, -HALL_D / 2 - 0.1, woodTrimMat);

  // Wainscot & distinctive floor-colored accent line
  addWallSegment(0.14, 1.4, HALL_D, -HALL_W / 2 + 0.05, 0.7, 0, wainscotMat);
  addWallSegment(0.14, 1.4, HALL_D, HALL_W / 2 - 0.05, 0.7, 0, wainscotMat);
  addWallSegment(HALL_W, 1.4, 0.14, 0, 0.7, -HALL_D / 2 + 0.05, wainscotMat);

  addWallSegment(0.18, 0.2, HALL_D, -HALL_W / 2 + 0.06, 1.46, 0, accentStripMat);
  addWallSegment(0.18, 0.2, HALL_D, HALL_W / 2 - 0.06, 1.46, 0, accentStripMat);
  addWallSegment(HALL_W, 0.2, 0.18, 0, 1.46, -HALL_D / 2 + 0.06, accentStripMat);

  // =========================================================================
  // 3D COMPOSITE ELEVATOR ("🛗 LIFT • X-QAVAT") — SAME (x, z) ON ALL FLOORS
  // =========================================================================
  const elevatorGroup = new THREE.Group();
  elevatorGroup.position.set(ELEVATOR_TRIGGER.x, 0, -HALL_D / 2);
  group.add(elevatorGroup);

  const brushedSteelMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.22, metalness: 0.84 })
  );
  const darkSteelMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.32, metalness: 0.78 })
  );
  const doorSilverMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.18, metalness: 0.88 })
  );
  const chromeTrimMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.12, metalness: 0.94 })
  );
  const elevatorShaftMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, metalness: 0.15 })
  );
  const elevatorCallGlowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.3,
    })
  );

  // Outer brushed-steel elevator surround frame (grounded at y = 0)
  const liftLeftPost = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.55, 4.1, 0.62)), brushedSteelMat);
  liftLeftPost.position.set(-1.82, 2.05, 0.22);
  liftLeftPost.castShadow = castShadow;
  elevatorGroup.add(liftLeftPost);

  const liftRightPost = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.55, 4.1, 0.62)), brushedSteelMat);
  liftRightPost.position.set(1.82, 2.05, 0.22);
  liftRightPost.castShadow = castShadow;
  elevatorGroup.add(liftRightPost);

  const liftTransom = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 0.62, 0.68)), darkSteelMat);
  liftTransom.position.set(0, 4.15, 0.24);
  liftTransom.castShadow = castShadow;
  elevatorGroup.add(liftTransom);

  // Threshold sill flush with corridor floor
  const liftSill = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.4, 0.08, 0.6)), darkSteelMat);
  liftSill.position.set(0, 0.04, 0.22);
  elevatorGroup.add(liftSill);

  // Recessed interior cabin preview backing
  const liftBacking = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(3.12, 3.8)), elevatorShaftMat);
  liftBacking.position.set(0, 1.92, 0.06);
  elevatorGroup.add(liftBacking);

  // Twin sliding metallic elevator doors
  const liftLeftDoor = new THREE.Group();
  liftLeftDoor.position.set(-0.77, 1.92, 0.18);
  const leftLeafMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.5, 3.74, 0.14)), doorSilverMat);
  leftLeafMesh.castShadow = castShadow;
  liftLeftDoor.add(leftLeafMesh);
  const leftStripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 3.6, 0.17)), chromeTrimMat);
  leftStripe.position.x = 0.66;
  liftLeftDoor.add(leftStripe);
  elevatorGroup.add(liftLeftDoor);

  const liftRightDoor = new THREE.Group();
  liftRightDoor.position.set(0.77, 1.92, 0.18);
  const rightLeafMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.5, 3.74, 0.14)), doorSilverMat);
  rightLeafMesh.castShadow = castShadow;
  liftRightDoor.add(rightLeafMesh);
  const rightStripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 3.6, 0.17)), chromeTrimMat);
  rightStripe.position.x = -0.66;
  liftRightDoor.add(rightStripe);
  elevatorGroup.add(liftRightDoor);

  // Digital floor indicator LED display on the transom
  const liftLedTex = trackTex(createElevatorLedTexture(floor, floorMeta.accentColor, maxAnisotropy));
  const liftLedMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.9, 0.44, 0.12)),
    trackMat(new THREE.MeshStandardMaterial({ map: liftLedTex, roughness: 0.25, metalness: 0.2 }))
  );
  liftLedMesh.position.set(0, 4.15, 0.56);
  elevatorGroup.add(liftLedMesh);

  // Wall call-button console to the right of the elevator door
  const callPanel = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.42, 0.92, 0.16)), darkSteelMat);
  callPanel.position.set(2.38, 1.85, 0.16);
  elevatorGroup.add(callPanel);

  [2.05, 1.68].forEach((by) => {
    const btn = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 0.08, 12)),
      elevatorCallGlowMat
    );
    btn.rotation.x = Math.PI / 2;
    btn.position.set(2.38, by, 0.25);
    elevatorGroup.add(btn);
  });

  // Large bright overhead elevator signboard: "🛗 LIFT • X-QAVAT"
  const liftSignTex = trackTex(
    createSignboardTexture(
      `🛗 LIFT • ${floor}-QAVAT`,
      'QAVATLAR ARO HARAKAT',
      floorMeta.accentColor,
      maxAnisotropy
    )
  );
  const liftSign = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.9, 1.18, 0.24)),
    trackMat(new THREE.MeshStandardMaterial({ map: liftSignTex, roughness: 0.3, metalness: 0.08 }))
  );
  liftSign.position.set(0, 5.18, 0.34);
  liftSign.castShadow = castShadow;
  elevatorGroup.add(liftSign);

  // Elevator floor trigger ring & glowing disc
  const elevatorRingMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(floorMeta.accentColor),
      emissive: new THREE.Color(floorMeta.accentColor),
      emissiveIntensity: 0.4,
      roughness: 0.24,
      metalness: 0.35,
    })
  );
  const elevatorRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.75, 0.13, 12, 42)),
    elevatorRingMat
  );
  elevatorRing.rotation.x = Math.PI / 2;
  elevatorRing.position.set(ELEVATOR_TRIGGER.triggerX, 0.09, ELEVATOR_TRIGGER.triggerZ);
  group.add(elevatorRing);

  const elevatorDiscMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(floorMeta.accentColor),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    })
  );
  const elevatorDisc = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(1.68, 36)), elevatorDiscMat);
  elevatorDisc.rotation.x = -Math.PI / 2;
  elevatorDisc.position.set(ELEVATOR_TRIGGER.triggerX, 0.03, ELEVATOR_TRIGGER.triggerZ);
  group.add(elevatorDisc);

  // Subtle collider for elevator side posts so player doesn't clip into metal frame
  colliders.push({ minX: -2.25, maxX: 2.25, minZ: -13.0, maxZ: -12.35 });

  // =========================================================================
  // FLOOR 1 SPECIAL FEATURES: DARS JADVALI STAND + MAKTAB DO'KONI
  // =========================================================================
  let scheduleRing: THREE.Mesh | null = null;
  let scheduleDisc: THREE.Mesh | null = null;
  let shopRing: THREE.Mesh | null = null;
  let shopDisplayProp: THREE.Mesh | null = null;
  let npcWaveArm: THREE.Group | null = null;

  const scheduleZone = floorZones.find((z) => z.id === 'schedule');
  if (scheduleZone) {
    const scheduleGroup = new THREE.Group();
    scheduleGroup.position.set(scheduleZone.x, 0, -HALL_D / 2);
    group.add(scheduleGroup);

    const scheduleTealMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.34, metalness: 0.18 })
    );
    const scheduleBrassMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.22, metalness: 0.85 })
    );
    const scheduleDarkMetalMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.36, metalness: 0.62 })
    );

    [-1.55, 1.55].forEach((lx) => {
      const leg = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.18, 1.32, 0.28)), scheduleDarkMetalMat);
      leg.position.set(lx, 0.66, 0.16);
      leg.castShadow = castShadow;
      scheduleGroup.add(leg);

      const foot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.08, 0.44)), scheduleBrassMat);
      foot.position.set(lx, 0.04, 0.18);
      scheduleGroup.add(foot);
    });

    const scheduleShelf = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.45, 0.14, 0.42)), woodTrimMat);
    scheduleShelf.position.set(0, 1.28, 0.22);
    scheduleShelf.castShadow = castShadow;
    scheduleGroup.add(scheduleShelf);

    const scheduleFrame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.52, 2.38, 0.2)), woodTrimMat);
    scheduleFrame.position.set(0, 2.48, 0.12);
    scheduleFrame.castShadow = castShadow;
    scheduleGroup.add(scheduleFrame);

    const scheduleInnerTrim = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.32, 2.18, 0.14)),
      scheduleTealMat
    );
    scheduleInnerTrim.position.set(0, 2.48, 0.18);
    scheduleGroup.add(scheduleInnerTrim);

    const scheduleBoardTex = trackTex(createScheduleBoardTexture(maxAnisotropy));
    const scheduleBoardMesh = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.16, 2.02, 0.06)),
      trackMat(new THREE.MeshStandardMaterial({ map: scheduleBoardTex, roughness: 0.42, metalness: 0.03 }))
    );
    scheduleBoardMesh.position.set(0, 2.48, 0.24);
    scheduleGroup.add(scheduleBoardMesh);

    [
      [-1.48, 3.38],
      [1.48, 3.38],
      [-1.48, 1.58],
      [1.48, 1.58],
    ].forEach(([px, py]) => {
      const pin = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.08, 10)), scheduleBrassMat);
      pin.rotation.x = Math.PI / 2;
      pin.position.set(px, py, 0.28);
      scheduleGroup.add(pin);
    });

    const lampBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.1, 0.1, 0.16)), scheduleBrassMat);
    lampBar.position.set(0, 3.74, 0.34);
    scheduleGroup.add(lampBar);

    const scheduleSignTex = trackTex(
      createSignboardTexture('📅 DARS JADVALI', 'FANLAR VA QAVATLAR TARTIBI', '#0D9488', maxAnisotropy)
    );
    const scheduleSign = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.85, 0.96, 0.24)),
      trackMat(new THREE.MeshStandardMaterial({ map: scheduleSignTex, roughness: 0.32, metalness: 0.06 }))
    );
    scheduleSign.position.set(0, 4.38, 0.24);
    scheduleSign.castShadow = castShadow;
    scheduleGroup.add(scheduleSign);

    scheduleRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.62, 0.11, 12, 42)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x0ea5e9,
          emissiveIntensity: 0.55,
          roughness: 0.25,
          metalness: 0.3,
        })
      )
    );
    scheduleRing.rotation.x = Math.PI / 2;
    scheduleRing.position.set(scheduleZone.triggerX, 0.09, scheduleZone.triggerZ);
    group.add(scheduleRing);

    scheduleDisc = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(1.56, 36)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x14b8a6,
          transparent: true,
          opacity: 0.17,
          depthWrite: false,
        })
      )
    );
    scheduleDisc.rotation.x = -Math.PI / 2;
    scheduleDisc.position.set(scheduleZone.triggerX, 0.03, scheduleZone.triggerZ);
    group.add(scheduleDisc);

    colliders.push({
      minX: scheduleZone.x - 1.85,
      maxX: scheduleZone.x + 1.85,
      minZ: -13.0,
      maxZ: -12.15,
    });
  }

  const shopZone = floorZones.find((z) => z.id === 'shop');
  if (shopZone) {
    const shopGroup = new THREE.Group();
    shopGroup.position.set(shopZone.x, 0, shopZone.z);
    group.add(shopGroup);

    const goldMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.24, metalness: 0.78 })
    );
    const shopCounterMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45, metalness: 0.08 })
    );
    const shopTrimMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.38, metalness: 0.35 })
    );

    const counterBase = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.6, 1.35, 1.7)), shopCounterMat);
    counterBase.position.set(0, 0.68, 0.6);
    counterBase.castShadow = castShadow;
    counterBase.receiveShadow = true;
    shopGroup.add(counterBase);

    const counterTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.9, 0.18, 1.95)), goldMat);
    counterTop.position.set(0, 1.42, 0.6);
    counterTop.castShadow = castShadow;
    shopGroup.add(counterTop);

    [-2.7, 2.7].forEach((px) => {
      const pillar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.36, 4.4, 0.36)), shopTrimMat);
      pillar.position.set(px, 2.2, 1.3);
      pillar.castShadow = castShadow;
      shopGroup.add(pillar);
    });

    const awningTex = trackTex(createAwningTexture(maxAnisotropy));
    const awning = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(6.2, 0.28, 2.8)),
      trackMat(new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.55, metalness: 0.04 }))
    );
    awning.position.set(0, 4.3, 0.85);
    awning.rotation.x = 0.2;
    awning.castShadow = castShadow;
    shopGroup.add(awning);

    const shopSignTex = trackTex(
      createSignboardTexture("MAKTAB DO'KONI", "KIYIM • DO‘PPI • SUMKA • MEDAL", '#D97706', maxAnisotropy)
    );
    const shopSign = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(5.1, 1.22, 0.24)),
      trackMat(new THREE.MeshStandardMaterial({ map: shopSignTex, roughness: 0.32, metalness: 0.08 }))
    );
    shopSign.position.set(0, 5.05, 0.9);
    shopGroup.add(shopSign);

    const shopkeeper = new THREE.Group();
    shopkeeper.position.set(0, 0.25, -0.45);
    const npcSkin = trackMat(new THREE.MeshStandardMaterial({ color: 0xfcd2a2, roughness: 0.55 }));
    const npcVest = trackMat(new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.5 }));
    const npcTorso = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.84, 0.96, 0.48)), npcVest);
    npcTorso.position.y = 1.4;
    shopkeeper.add(npcTorso);
    const npcHead = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.66, 0.64, 0.64)), npcSkin);
    npcHead.position.y = 2.24;
    shopkeeper.add(npcHead);
    const npcCap = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.72, 0.22, 0.7)), goldMat);
    npcCap.position.y = 2.62;
    shopkeeper.add(npcCap);
    npcWaveArm = new THREE.Group();
    npcWaveArm.position.set(0.58, 1.78, 0);
    const npcArmMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.28, 0.78, 0.28)), npcVest);
    npcArmMesh.position.y = -0.34;
    npcWaveArm.add(npcArmMesh);
    shopkeeper.add(npcWaveArm);
    shopGroup.add(shopkeeper);

    shopDisplayProp = new THREE.Mesh(
      trackGeo(new THREE.OctahedronGeometry(0.36, 0)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xfbbf24,
          emissive: 0xd97706,
          emissiveIntensity: 0.35,
          roughness: 0.16,
          metalness: 0.9,
        })
      )
    );
    shopDisplayProp.position.set(-2.1, 2.05, 0.75);
    shopGroup.add(shopDisplayProp);

    shopRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.85, 0.12, 12, 42)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.5,
          roughness: 0.25,
          metalness: 0.4,
        })
      )
    );
    shopRing.rotation.x = Math.PI / 2;
    shopRing.position.set(shopZone.triggerX, 0.09, shopZone.triggerZ);
    group.add(shopRing);

    const shopDisc = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(1.78, 36)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.16,
          depthWrite: false,
        })
      )
    );
    shopDisc.rotation.x = -Math.PI / 2;
    shopDisc.position.set(shopZone.triggerX, 0.03, shopZone.triggerZ);
    group.add(shopDisc);

    colliders.push({
      minX: shopZone.x - 3.3,
      maxX: shopZone.x + 3.3,
      minZ: -13.0,
      maxZ: -9.5,
    });
  }

  // Floor 2 & 3 North Wall thematic showcase panels flanking the Lift
  if (floor === 2 || floor === 3) {
    const posters =
      floor === 2
        ? [
            { x: -8.0, title: 'TILLAR VA MADANIYAT', sub: 'Ingliz tili • Ona tili', accent: '#059669', bg: '#ECFDF5' },
            { x: 8.0, title: 'TARIX VA MEROS', sub: 'Vatanimiz tarixi • Tez kunda', accent: '#B45309', bg: '#FFFBEB' },
          ]
        : [
            { x: -8.0, title: 'RAQAMLI KELAJAK', sub: 'Informatika va Dasturlash', accent: '#7C3AED', bg: '#F5F3FF' },
            { x: 8.0, title: 'FAN VA TABIAT', sub: 'Tabiiy fanlar • Fizika', accent: '#0284C7', bg: '#F0F9FF' },
          ];

    posters.forEach((p) => {
      const frame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.8, 2.5, 0.16)), woodTrimMat);
      frame.position.set(p.x, 3.05, -HALL_D / 2 + 0.12);
      frame.castShadow = castShadow;
      group.add(frame);

      const tex = trackTex(createWallPosterTexture(p.title, p.sub, p.accent, p.bg, maxAnisotropy));
      const face = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(3.52, 2.24, 0.06)),
        trackMat(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.42, metalness: 0.04 }))
      );
      face.position.set(p.x, 3.05, -HALL_D / 2 + 0.2);
      group.add(face);
    });
  }

  // =========================================================================
  // CLASSROOM DOORS ON CURRENT FLOOR (Active hinged + Decorative "Tez kunda")
  // =========================================================================
  const doorFloorPads: Partial<
    Record<SubjectId, { ring: THREE.Mesh; glowDisc: THREE.Mesh; color: string; zone: WorldZone }>
  > = {};

  const doorHinges: Partial<
    Record<
      SubjectId,
      {
        leftPivot: THREE.Group;
        rightPivot: THREE.Group;
        openAmount: number;
        triggerX: number;
        triggerZ: number;
      }
    >
  > = {};

  const interiorPortalMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, metalness: 0.0 })
  );
  const interiorGlowMat = trackMat(new THREE.MeshBasicMaterial({ color: 0x334155 }));
  const deskWoodMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.55, metalness: 0.04 })
  );
  const metalLegMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.35, metalness: 0.6 })
  );
  const doorKnobMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.88 })
  );
  const comingSoonLockMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.38, metalness: 0.65 })
  );

  const classroomZones = floorZones.filter(
    (z) => z.id !== 'elevator' && z.id !== 'shop' && z.id !== 'schedule'
  );

  classroomZones.forEach((zone) => {
    const visual = CLASSROOM_VISUALS[zone.id] ?? {
      subtitle: 'DARS XONASI',
      formula: zone.shortTitle,
      boardLabel: zone.shortTitle.toUpperCase(),
      boardOffsetX: 3.3,
    };

    const isWest = zone.x < 0;
    const doorGroup = new THREE.Group();
    if (isWest) {
      doorGroup.position.set(-HALL_W / 2, 0, zone.z);
      doorGroup.rotation.y = Math.PI / 2;
    } else {
      doorGroup.position.set(HALL_W / 2, 0, zone.z);
      doorGroup.rotation.y = -Math.PI / 2;
    }
    group.add(doorGroup);

    const accentMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(zone.color),
        roughness: zone.comingSoon ? 0.58 : 0.38,
        metalness: 0.12,
      })
    );
    const doorLeafColor = zone.comingSoon
      ? new THREE.Color('#94A3B8').lerp(new THREE.Color(zone.color), 0.25)
      : new THREE.Color(zone.color).lerp(new THREE.Color('#ffffff'), 0.22);
    const doorLeafMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: doorLeafColor,
        roughness: 0.45,
        metalness: 0.08,
      })
    );

    // Door surround frame
    const leftPost = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.45, 3.8, 0.55)), accentMat);
    leftPost.position.set(-1.55, 1.9, 0.2);
    leftPost.castShadow = castShadow;
    doorGroup.add(leftPost);

    const rightPost = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.45, 3.8, 0.55)), accentMat);
    rightPost.position.set(1.55, 1.9, 0.2);
    rightPost.castShadow = castShadow;
    doorGroup.add(rightPost);

    const topLintel = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.55, 0.45, 0.62)), accentMat);
    topLintel.position.set(0, 3.9, 0.22);
    topLintel.castShadow = castShadow;
    doorGroup.add(topLintel);

    if (zone.comingSoon) {
      // Closed decorative door with centered metallic lock emblem
      const closedLeft = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.24, 3.55, 0.16)), doorLeafMat);
      closedLeft.position.set(-0.65, 1.78, 0.18);
      closedLeft.castShadow = castShadow;
      doorGroup.add(closedLeft);

      const closedRight = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.24, 3.55, 0.16)), doorLeafMat);
      closedRight.position.set(0.65, 1.78, 0.18);
      closedRight.castShadow = castShadow;
      doorGroup.add(closedRight);

      // Decorative cross-bar lock plate across closed doors
      const lockPlate = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.92, 0.42, 0.12)),
        comingSoonLockMat
      );
      lockPlate.position.set(0, 1.72, 0.3);
      doorGroup.add(lockPlate);

      const lockStud = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.24, 0.14)), doorKnobMat);
      lockStud.position.set(0, 1.72, 0.34);
      doorGroup.add(lockStud);

      // Overhead signboard: "Ona tili • Tez kunda" / "Tarix • Tez kunda" / "Fizika • Tez kunda"
      const signTex = trackTex(
        createSignboardTexture(`${zone.shortTitle} • Tez kunda`, 'BU XONA TEZ ORADA OCHILADI', zone.color, maxAnisotropy)
      );
      const signBoard = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(5.0, 1.25, 0.22)),
        trackMat(new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.38, metalness: 0.05 }))
      );
      signBoard.position.set(0, 4.78, 0.32);
      signBoard.castShadow = castShadow;
      doorGroup.add(signBoard);

      // Subtle muted floor ring for decorative door
      const mutedRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(1.55, 0.09, 10, 36)),
        trackMat(
          new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            emissive: 0x64748b,
            emissiveIntensity: 0.15,
            roughness: 0.45,
          })
        )
      );
      mutedRing.rotation.x = Math.PI / 2;
      mutedRing.position.set(zone.triggerX, 0.07, zone.triggerZ);
      group.add(mutedRing);
    } else {
      const subjId = zone.id as SubjectId;

      // Dark recessed doorway interior
      const recessBacking = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(2.68, 3.62)),
        interiorPortalMat
      );
      recessBacking.position.set(0, 1.81, 0.04);
      doorGroup.add(recessBacking);

      const interiorFloorHint = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(2.62, 1.1)),
        interiorGlowMat
      );
      interiorFloorHint.position.set(0, 0.55, 0.055);
      doorGroup.add(interiorFloorHint);

      // Hinged Double Doors
      const leftPivot = new THREE.Group();
      leftPivot.position.set(-1.3, 0, 0.18);
      doorGroup.add(leftPivot);

      const rightPivot = new THREE.Group();
      rightPivot.position.set(1.3, 0, 0.18);
      doorGroup.add(rightPivot);

      (
        [
          { pivot: leftPivot, offsetX: 0.64, handleX: 1.06 },
          { pivot: rightPivot, offsetX: -0.64, handleX: -1.06 },
        ] as const
      ).forEach(({ pivot, offsetX, handleX }) => {
        const leaf = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.24, 3.55, 0.16)), doorLeafMat);
        leaf.position.set(offsetX, 1.78, 0);
        leaf.castShadow = castShadow;
        pivot.add(leaf);

        const pane = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.76, 1.1, 0.2)), glassMat);
        pane.position.set(offsetX, 2.45, 0);
        pivot.add(pane);

        const handle = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.09, 10, 10)), doorKnobMat);
        handle.position.set(handleX, 1.6, 0.13);
        pivot.add(handle);
      });

      doorHinges[subjId] = {
        leftPivot,
        rightPivot,
        openAmount: 0,
        triggerX: zone.triggerX,
        triggerZ: zone.triggerZ,
      };

      const signTex = trackTex(
        createSignboardTexture(zone.title.toUpperCase(), visual.subtitle, zone.color, maxAnisotropy)
      );
      const signBoard = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(5.0, 1.25, 0.22)),
        trackMat(new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.35, metalness: 0.05 }))
      );
      signBoard.position.set(0, 4.78, 0.32);
      signBoard.castShadow = castShadow;
      doorGroup.add(signBoard);

      // Glowing floor trigger ring & disc
      const ring = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(1.75, 0.13, 12, 42)),
        trackMat(
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(zone.color),
            emissive: new THREE.Color(zone.color),
            emissiveIntensity: 0.35,
            roughness: 0.25,
            metalness: 0.2,
          })
        )
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(zone.triggerX, 0.09, zone.triggerZ);
      group.add(ring);

      const glowDisc = new THREE.Mesh(
        trackGeo(new THREE.CircleGeometry(1.68, 36)),
        trackMat(
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(zone.color),
            transparent: true,
            opacity: 0.14,
            depthWrite: false,
          })
        )
      );
      glowDisc.rotation.x = -Math.PI / 2;
      glowDisc.position.set(zone.triggerX, 0.03, zone.triggerZ);
      group.add(glowDisc);

      doorFloorPads[subjId] = { ring, glowDisc, color: zone.color, zone };
    }

    // Side chalkboard & mini desk display beside each doorway
    const boardTex = trackTex(createChalkboardTexture(visual.formula, visual.boardLabel, maxAnisotropy));
    const boardMesh = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(2.4, 1.32, 0.12)),
      trackMat(new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.8, metalness: 0.02 }))
    );
    boardMesh.position.set(visual.boardOffsetX, 2.65, 0.16);
    doorGroup.add(boardMesh);

    const boardFrame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.58, 1.48, 0.08)), woodTrimMat);
    boardFrame.position.set(visual.boardOffsetX, 2.65, 0.1);
    doorGroup.add(boardFrame);

    const deskTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.35, 0.1, 0.7)), deskWoodMat);
    deskTop.position.set(visual.boardOffsetX, 1.05, 0.65);
    deskTop.castShadow = castShadow;
    doorGroup.add(deskTop);
    [-0.54, 0.54].forEach((lx) => {
      const leg = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 1.02, 0.54)), metalLegMat);
      leg.position.set(visual.boardOffsetX + lx, 0.51, 0.65);
      doorGroup.add(leg);
    });
  });

  // =========================================================================
  // HALLWAY DECORATIONS: Potted Plants, Floor-Themed Lockers, Benches
  // =========================================================================
  const potMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 }));
  const soilMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 }));
  const trunkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.82 }));
  const leafLightMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65 }));
  const leafDarkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.72 }));

  const addPottedPlant = (x: number, z: number) => {
    const p = new THREE.Group();
    p.position.set(x, 0, z);

    const pot = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.62, 0.46, 0.78, 8)), potMat);
    pot.position.y = 0.39;
    pot.castShadow = castShadow;
    p.add(pot);

    const soil = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.56, 0.56, 0.06, 8)), soilMat);
    soil.position.y = 0.77;
    p.add(soil);

    const trunk = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 1.0, 0.24)), trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = castShadow;
    p.add(trunk);

    const bush1 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.15, 0.82, 1.15)), leafDarkMat);
    bush1.position.y = 1.95;
    bush1.castShadow = castShadow;
    p.add(bush1);

    const bush2 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.84, 0.62, 0.84)), leafLightMat);
    bush2.position.set(0.05, 2.52, -0.05);
    bush2.castShadow = castShadow;
    p.add(bush2);

    group.add(p);
    colliders.push({ minX: x - 0.85, maxX: x + 0.85, minZ: z - 0.85, maxZ: z + 0.85 });
  };

  addPottedPlant(-12.8, -11.2);
  addPottedPlant(12.8, -11.2);
  addPottedPlant(-12.8, 11.2);
  addPottedPlant(12.8, 11.2);

  // Floor-themed lockers placed cleanly on open wall bays with zero doorway overlap
  const lockerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: floorMeta.lockerColorNum,
      roughness: 0.38,
      metalness: 0.35,
    })
  );
  const lockerVentMat = trackMat(
    new THREE.MeshStandardMaterial({ color: floorMeta.lockerVentColorNum, roughness: 0.5 })
  );

  const lockerBays: { side: -1 | 1; centerZ: number }[] =
    floor === 1
      ? [
          { side: -1, centerZ: 6.2 },
          { side: 1, centerZ: 6.2 },
        ]
      : floor === 2
      ? [{ side: -1, centerZ: 6.2 }]
      : [{ side: 1, centerZ: 5.4 }];

  lockerBays.forEach(({ side, centerZ }) => {
    for (let i = -1; i <= 1; i++) {
      const lx = side * (HALL_W / 2 - 0.45);
      const lz = centerZ + i * 1.15;
      const locker = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.75, 2.4, 1.05)), lockerMat);
      locker.position.set(lx, 1.2, lz);
      locker.castShadow = castShadow;
      group.add(locker);

      const vent = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.25, 0.65)), lockerVentMat);
      vent.position.set(lx - side * 0.38, 2.0, lz);
      group.add(vent);
    }
    colliders.push({
      minX: side === -1 ? -15 : 13.7,
      maxX: side === -1 ? -13.7 : 15,
      minZ: centerZ - 2.0,
      maxZ: centerZ + 2.0,
    });
  });

  // Two welcoming wooden benches near South wall
  [-6.2, 6.2].forEach((bx) => {
    const bench = new THREE.Group();
    bench.position.set(bx, 0, 11.1);
    const seat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.2, 0.16, 0.9)), deskWoodMat);
    seat.position.y = 0.68;
    seat.castShadow = castShadow;
    bench.add(seat);
    [-1.25, 1.25].forEach((lx) => {
      const leg = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.18, 0.68, 0.78)), metalLegMat);
      leg.position.set(lx, 0.34, 0);
      bench.add(leg);
    });
    group.add(bench);
    colliders.push({ minX: bx - 1.75, maxX: bx + 1.75, minZ: 10.4, maxZ: 11.8 });
  });

  // =========================================================================
  // 3D CORRIDOR TRASH BINS (Axlat qutilari — present on EVERY floor!)
  // =========================================================================
  const binBodyMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.42, metalness: 0.25 })
  );
  const binSteelMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.25, metalness: 0.72 })
  );
  const binInnerMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9, metalness: 0.05 })
  );
  const binBadgeMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xecfdf5, roughness: 0.4, metalness: 0.05 })
  );
  const binEcoStripeMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35, metalness: 0.1 })
  );

  interface TrashBinVisual {
    handle: TrashBinHandle;
    beaconGroup: THREE.Group;
    beamMat: THREE.MeshBasicMaterial;
    arrowMesh: THREE.Mesh;
    haloRing: THREE.Mesh;
    haloMat: THREE.MeshBasicMaterial;
  }

  const trashBins: TrashBinHandle[] = [];
  const trashBinVisuals: TrashBinVisual[] = [];

  const binArrowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.95,
      roughness: 0.18,
      metalness: 0.2,
    })
  );

  const addTrashBin = (id: string, x: number, z: number, facingYaw = 0) => {
    const bin = new THREE.Group();
    bin.position.set(x, 0, z);
    bin.rotation.y = facingYaw;

    // 1. Grounded metallic foot ring
    const foot = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.4, 0.44, 0.1, 14)), binSteelMat);
    foot.position.y = 0.05;
    bin.add(foot);

    // 2. Tapered emerald bin body
    const body = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.46, 0.38, 1.02, 14)), binBodyMat);
    body.position.y = 0.6;
    body.castShadow = castShadow;
    body.receiveShadow = true;
    bin.add(body);

    // 3. Brushed steel top rim
    const rim = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.45, 0.055, 8, 18)), binSteelMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.12;
    bin.add(rim);

    // 4. Dark interior opening
    const cavity = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.39, 0.39, 0.04, 14)), binInnerMat);
    cavity.position.y = 1.1;
    bin.add(cavity);

    // 5. Front cleanliness emblem plate
    const plate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.36, 0.32, 0.05)), binBadgeMat);
    plate.position.set(0, 0.66, 0.43);
    bin.add(plate);

    const stripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.22, 0.14, 0.06)), binEcoStripeMat);
    stripe.position.set(0, 0.66, 0.44);
    bin.add(stripe);

    // 6. Nearest-bin guiding light beam + downward arrow marker (visible when player holds trash)
    const beaconGroup = new THREE.Group();
    beaconGroup.visible = false;

    const beamMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    const beamMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.52, 3.6, 16, 1, true)),
      beamMat
    );
    beamMesh.position.y = 2.05;
    beaconGroup.add(beamMesh);

    const arrowMesh = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.34, 0.64, 4)), binArrowMat);
    arrowMesh.rotation.x = Math.PI;
    arrowMesh.position.y = 2.15;
    beaconGroup.add(arrowMesh);

    const haloMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const haloRing = new THREE.Mesh(trackGeo(new THREE.RingGeometry(0.56, 0.82, 24)), haloMat);
    haloRing.rotation.x = -Math.PI / 2;
    haloRing.position.y = 0.032;
    beaconGroup.add(haloRing);

    bin.add(beaconGroup);

    group.add(bin);
    colliders.push({ minX: x - 0.62, maxX: x + 0.62, minZ: z - 0.62, maxZ: z + 0.62 });

    const handle: TrashBinHandle = { id, x, z };
    trashBins.push(handle);
    trashBinVisuals.push({ handle, beaconGroup, beamMat, arrowMesh, haloRing, haloMat });
  };

  addTrashBin(`floor${floor}_bin_sw`, -9.6, 11.0, Math.PI);
  addTrashBin(`floor${floor}_bin_se`, 9.6, 11.0, Math.PI);
  addTrashBin(`floor${floor}_bin_n`, -3.6, -12.1, 0);

  // =========================================================================
  // SINGLE POOLED 3D INTERACTIVE FLOOR LITTER (1 active item at a time!)
  // =========================================================================
  const paperLightMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.92, metalness: 0.02 })
  );
  const paperShadeMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.88, metalness: 0.02 })
  );
  const juiceBodyMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.48, metalness: 0.04 })
  );
  const juiceBandMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.55, metalness: 0.02 })
  );
  const strawMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 })
  );
  const bottleBodyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.18,
      metalness: 0.1,
      transparent: true,
      opacity: 0.86,
    })
  );
  const bottleCapMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.32, metalness: 0.15 })
  );
  const bottleLabelMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.45, metalness: 0.05 })
  );

  const trashSpawnSpotsByFloor: Record<FloorNumber, { x: number; z: number }[]> = {
    1: [
      { x: -5.4, z: 5.0 },
      { x: 5.2, z: 4.5 },
      { x: -4.6, z: -4.6 },
      { x: 4.4, z: -3.2 },
      { x: 0.6, z: 2.2 },
      { x: -2.2, z: 6.4 },
    ],
    2: [
      { x: -5.0, z: 4.8 },
      { x: 5.4, z: 4.2 },
      { x: -4.4, z: -4.8 },
      { x: 4.8, z: -3.4 },
      { x: -0.6, z: 2.0 },
      { x: 2.4, z: 6.2 },
    ],
    3: [
      { x: -5.2, z: 4.4 },
      { x: 5.0, z: 4.6 },
      { x: -4.6, z: -2.0 },
      { x: 4.6, z: -2.0 },
      { x: 0.5, z: 2.4 },
      { x: -2.4, z: 6.0 },
    ],
  };

  const TRASH_KINDS: TrashKind[] = ['paper', 'bottle', 'juice'];
  const TRASH_LABELS: Record<TrashKind, string> = {
    paper: "G'ijimlangan qog'oz",
    juice: "Bo'sh sharbat qutisi",
    bottle: 'Plastik shisha',
  };

  const activeTrashRoot = new THREE.Group();
  activeTrashRoot.visible = false;
  const activeTrashPropGroup = new THREE.Group();
  activeTrashRoot.add(activeTrashPropGroup);

  const paperModel = new THREE.Group();
  {
    const wad1 = new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(0.21, 0)), paperLightMat);
    wad1.position.set(0, 0.18, 0);
    wad1.scale.set(1.1, 0.82, 0.95);
    wad1.castShadow = castShadow;
    paperModel.add(wad1);

    const wad2 = new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(0.14, 0)), paperShadeMat);
    wad2.position.set(0.11, 0.12, 0.08);
    wad2.rotation.set(0.5, 0.9, 0.3);
    wad2.castShadow = castShadow;
    paperModel.add(wad2);

    const wad3 = new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(0.11, 0)), paperLightMat);
    wad3.position.set(-0.12, 0.11, -0.06);
    wad3.rotation.set(0.8, 0.2, 0.6);
    paperModel.add(wad3);
  }
  activeTrashPropGroup.add(paperModel);

  const juiceModel = new THREE.Group();
  {
    const carton = new THREE.Group();
    carton.position.set(0, 0.13, 0);
    carton.rotation.set(0.22, 0.15, Math.PI / 2 - 0.18);

    const box = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.38, 0.16)), juiceBodyMat);
    box.castShadow = castShadow;
    carton.add(box);

    const labelBand = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.25, 0.14, 0.17)), juiceBandMat);
    labelBand.position.y = 0.02;
    carton.add(labelBand);

    const strawBase = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 6)), strawMat);
    strawBase.position.set(0.05, 0.25, 0);
    carton.add(strawBase);

    const strawTip = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 6)), strawMat);
    strawTip.position.set(0.09, 0.32, 0);
    strawTip.rotation.z = -0.85;
    carton.add(strawTip);

    juiceModel.add(carton);
  }
  activeTrashPropGroup.add(juiceModel);

  const bottleModel = new THREE.Group();
  {
    const bottle = new THREE.Group();
    bottle.position.set(0, 0.12, 0);
    bottle.rotation.z = Math.PI / 2 - 0.08;

    const body = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.42, 10)), bottleBodyMat);
    body.castShadow = castShadow;
    bottle.add(body);

    const label = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.115, 0.115, 0.15, 10)), bottleLabelMat);
    bottle.add(label);

    const neck = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.05, 0.11, 0.12, 10)), bottleBodyMat);
    neck.position.y = 0.27;
    bottle.add(neck);

    const cap = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.06, 10)), bottleCapMat);
    cap.position.y = 0.35;
    bottle.add(cap);

    bottleModel.add(bottle);
  }
  activeTrashPropGroup.add(bottleModel);

  const activeTrashRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    })
  );
  const activeTrashRing = new THREE.Mesh(trackGeo(new THREE.RingGeometry(0.38, 0.52, 24)), activeTrashRingMat);
  activeTrashRing.rotation.x = -Math.PI / 2;
  activeTrashRing.position.y = 0.028;
  activeTrashRoot.add(activeTrashRing);
  group.add(activeTrashRoot);

  let activeTrash: ActiveFloorTrash | null = null;
  let lastTrashSpotIdx = -1;
  let trashSpawnSeq = 0;

  const spawnRandomTrash = (playerPos?: { x: number; z: number }): ActiveFloorTrash => {
    const spots = trashSpawnSpotsByFloor[floor];
    const candidateIndices: number[] = [];
    for (let i = 0; i < spots.length; i++) {
      if (i === lastTrashSpotIdx && spots.length > 1) continue;
      if (playerPos) {
        const d = Math.hypot(spots[i].x - playerPos.x, spots[i].z - playerPos.z);
        if (d < 2.4) continue;
      }
      candidateIndices.push(i);
    }
    const chosenIdx =
      candidateIndices.length > 0
        ? candidateIndices[Math.floor(Math.random() * candidateIndices.length)]
        : Math.floor(Math.random() * spots.length);
    lastTrashSpotIdx = chosenIdx;

    const spot = spots[chosenIdx];
    const kind = TRASH_KINDS[Math.floor(Math.random() * TRASH_KINDS.length)];
    trashSpawnSeq += 1;

    activeTrash = {
      id: `floor${floor}_trash_${trashSpawnSeq}`,
      kind,
      label: TRASH_LABELS[kind],
      x: spot.x,
      z: spot.z,
      lifetimeRemaining: 20,
      totalLifetime: 20,
    };

    activeTrashRoot.position.set(spot.x, 0, spot.z);
    activeTrashPropGroup.rotation.y = Math.random() * Math.PI * 2;
    paperModel.visible = kind === 'paper';
    juiceModel.visible = kind === 'juice';
    bottleModel.visible = kind === 'bottle';
    activeTrashRingMat.color.setHex(0xf59e0b);
    activeTrashRoot.visible = true;

    return activeTrash;
  };

  const clearActiveTrash = () => {
    activeTrash = null;
    activeTrashRoot.visible = false;
  };

  const getActiveTrash = () => activeTrash;

  // =========================================================================
  // GUIDANCE ARROW BEACON (Points to Active Lesson Room OR to Lift!)
  // =========================================================================
  const guideArrowGroup = new THREE.Group();
  const arrowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x2563eb,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.3,
    })
  );
  const arrowShaft = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.18, 0.12, 0.56)), arrowMat);
  arrowShaft.position.z = -0.18;
  guideArrowGroup.add(arrowShaft);

  const arrowHead = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.28, 0.48, 4)), arrowMat);
  arrowHead.rotation.x = Math.PI / 2;
  arrowHead.rotation.y = Math.PI / 4;
  arrowHead.position.z = 0.3;
  guideArrowGroup.add(arrowHead);
  group.add(guideArrowGroup);

  const targetBeacon = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.45, 0.85, 4)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        emissive: 0x2563eb,
        emissiveIntensity: 0.75,
        roughness: 0.2,
      })
    )
  );
  targetBeacon.rotation.x = Math.PI;
  group.add(targetBeacon);

  let elevatorSlideAmount = 0;

  const updateWorld = (
    dt: number,
    elapsed: number,
    activeSubject: SubjectId,
    playerPos: THREE.Vector3,
    npcDoorRequests?: Partial<Record<SubjectId, number>>,
    isHoldingTrash = false
  ) => {
    // Floor 1 shopkeeper & schedule animations (if present on this floor)
    if (npcWaveArm) {
      npcWaveArm.rotation.z = -2.2 + Math.sin(elapsed * 5.2) * 0.38;
    }
    if (shopDisplayProp) {
      shopDisplayProp.rotation.y += dt * 1.4;
      shopDisplayProp.position.y = 2.02 + Math.sin(elapsed * 2.6) * 0.12;
    }
    if (shopRing) {
      shopRing.rotation.z = elapsed * 0.7;
    }
    if (scheduleRing && scheduleDisc) {
      scheduleRing.rotation.z = -elapsed * 0.65;
      const schedulePulse = 1 + Math.sin(elapsed * 3.1) * 0.05;
      scheduleRing.scale.set(schedulePulse, schedulePulse, 1);
      (scheduleDisc.material as THREE.MeshBasicMaterial).opacity =
        0.16 + Math.sin(elapsed * 3.1) * 0.05;
    }

    // Smooth sliding elevator doors when player approaches the lift
    const liftPlayerDist = Math.hypot(
      playerPos.x - ELEVATOR_TRIGGER.triggerX,
      playerPos.z - ELEVATOR_TRIGGER.triggerZ
    );
    const targetSlide =
      liftPlayerDist < 4.5 ? THREE.MathUtils.clamp((4.5 - liftPlayerDist) / 2.2, 0, 0.72) : 0;
    elevatorSlideAmount = THREE.MathUtils.lerp(
      elevatorSlideAmount,
      targetSlide,
      Math.min(1, dt * 6.5)
    );
    liftLeftDoor.position.x = -0.77 - elevatorSlideAmount * 0.65;
    liftRightDoor.position.x = 0.77 + elevatorSlideAmount * 0.65;

    // Determine whether active lesson is on THIS floor or ANOTHER floor (guide to Lift!)
    const activeMeta = SUBJECT_META[activeSubject];
    const isLessonOnThisFloor = activeMeta.floor === floor;
    _activeColor.set(activeMeta.color);
    _elevatorDefaultColor.set(floorMeta.accentColor);

    // Update elevator glowing ring (brightly pulses when lesson is on another floor!)
    if (!isLessonOnThisFloor) {
      const pulse = 1 + Math.sin(elapsed * 4.8) * 0.11;
      elevatorRing.scale.set(pulse, pulse, 1);
      elevatorRing.rotation.z = elapsed * 1.5;
      elevatorRingMat.color.copy(_activeColor);
      elevatorRingMat.emissive.copy(_activeColor);
      elevatorRingMat.emissiveIntensity = 1.05 + Math.sin(elapsed * 5.2) * 0.35;
      elevatorDiscMat.color.copy(_activeColor);
      elevatorDiscMat.opacity = 0.28 + Math.sin(elapsed * 4.8) * 0.1;
    } else {
      elevatorRing.scale.set(0.96, 0.96, 1);
      elevatorRing.rotation.z = elapsed * 0.55;
      elevatorRingMat.color.copy(_elevatorDefaultColor);
      elevatorRingMat.emissive.copy(_elevatorDefaultColor);
      elevatorRingMat.emissiveIntensity = 0.35;
      elevatorDiscMat.color.copy(_elevatorDefaultColor);
      elevatorDiscMat.opacity = 0.14;
    }

    // Update active classroom floor rings & hinged doors on THIS floor
    (Object.keys(doorFloorPads) as SubjectId[]).forEach((subj) => {
      const pad = doorFloorPads[subj];
      if (!pad) return;
      const ringMat = pad.ring.material as THREE.MeshStandardMaterial;
      const discMat = pad.glowDisc.material as THREE.MeshBasicMaterial;

      if (isLessonOnThisFloor && subj === activeSubject) {
        const pulse = 1 + Math.sin(elapsed * 4.5) * 0.1;
        pad.ring.scale.set(pulse, pulse, 1);
        pad.ring.rotation.z = elapsed * 1.4;
        ringMat.emissiveIntensity = 0.95 + Math.sin(elapsed * 5) * 0.35;
        discMat.opacity = 0.26 + Math.sin(elapsed * 4.5) * 0.1;
      } else {
        pad.ring.scale.set(0.92, 0.92, 1);
        ringMat.emissiveIntensity = 0.14;
        discMat.opacity = 0.08;
      }

      const hinge = doorHinges[subj];
      if (hinge) {
        const playerDist = Math.hypot(playerPos.x - hinge.triggerX, playerPos.z - hinge.triggerZ);
        const playerOpen =
          playerDist < 4.5 ? THREE.MathUtils.clamp((4.5 - playerDist) / 2.2, 0, 0.85) : 0;
        const npcOpen = npcDoorRequests?.[subj] ?? 0;
        const targetOpen = Math.max(playerOpen, npcOpen);

        hinge.openAmount = THREE.MathUtils.lerp(
          hinge.openAmount,
          targetOpen,
          Math.min(1, dt * 6.5)
        );
        const swingRad = hinge.openAmount * (Math.PI * 0.49);
        hinge.leftPivot.rotation.y = -swingRad;
        hinge.rightPivot.rotation.y = swingRad;
      }
    });

    // Target coordinates for floating downward beacon & overhead player arrow
    const activePad = isLessonOnThisFloor ? doorFloorPads[activeSubject] : undefined;
    const targetX = activePad ? activePad.zone.triggerX : ELEVATOR_TRIGGER.triggerX;
    const targetZ = activePad ? activePad.zone.triggerZ : ELEVATOR_TRIGGER.triggerZ;

    targetBeacon.position.set(targetX, 2.65 + Math.sin(elapsed * 4.0) * 0.3, targetZ);
    targetBeacon.rotation.y = elapsed * 2.1;
    const beaconMat = targetBeacon.material as THREE.MeshStandardMaterial;
    beaconMat.color.copy(_activeColor);
    beaconMat.emissive.copy(_activeColor);

    const dx = targetX - playerPos.x;
    const dz = targetZ - playerPos.z;
    const dist = Math.hypot(dx, dz);

    // Hide lesson guidance arrow when player carries trash (prevents overlap with overhead carry sprite)
    guideArrowGroup.visible = !isHoldingTrash && dist > 2.4;
    guideArrowGroup.position.set(
      playerPos.x,
      playerPos.y + 3.25 + Math.sin(elapsed * 4.2) * 0.12,
      playerPos.z
    );
    guideArrowGroup.rotation.y = Math.atan2(dx, dz);
    arrowMat.color.copy(_activeColor);
    arrowMat.emissive.copy(_activeColor);

    // Animate the single active floor trash highlight ring
    if (activeTrash && activeTrashRoot.visible) {
      const urgent = activeTrash.lifetimeRemaining <= 5;
      const pulseSpeed = urgent ? 7.5 : 3.4;
      const pulse = 1 + Math.sin(elapsed * pulseSpeed) * 0.1;
      activeTrashRing.scale.set(pulse, pulse, 1);
      activeTrashRingMat.color.setHex(urgent ? 0xf43f5e : 0xf59e0b);
      activeTrashRingMat.opacity = 0.42 + Math.sin(elapsed * pulseSpeed) * 0.22;
    }

    // Illuminate ONLY the nearest trash bin beacon when the student is carrying trash
    if (isHoldingTrash && trashBinVisuals.length > 0) {
      let nearestIdx = 0;
      let nearestDistSq = Infinity;
      for (let i = 0; i < trashBinVisuals.length; i++) {
        const b = trashBinVisuals[i].handle;
        const bx = b.x - playerPos.x;
        const bz = b.z - playerPos.z;
        const dSq = bx * bx + bz * bz;
        if (dSq < nearestDistSq) {
          nearestDistSq = dSq;
          nearestIdx = i;
        }
      }

      for (let i = 0; i < trashBinVisuals.length; i++) {
        const bv = trashBinVisuals[i];
        const isNearest = i === nearestIdx;
        bv.beaconGroup.visible = isNearest;
        if (isNearest) {
          bv.arrowMesh.position.y = 2.15 + Math.sin(elapsed * 4.6) * 0.22;
          bv.arrowMesh.rotation.y = elapsed * 2.4;
          bv.beamMat.opacity = 0.18 + Math.sin(elapsed * 3.8) * 0.08;
          const ringScale = 1 + Math.sin(elapsed * 4.2) * 0.1;
          bv.haloRing.scale.set(ringScale, ringScale, 1);
          bv.haloMat.opacity = 0.52 + Math.sin(elapsed * 4.2) * 0.22;
        }
      }
    } else {
      for (let i = 0; i < trashBinVisuals.length; i++) {
        trashBinVisuals[i].beaconGroup.visible = false;
      }
    }
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  };

  return {
    floor,
    group,
    bounds: {
      minX: -HALL_W / 2 + 1.0,
      maxX: HALL_W / 2 - 1.0,
      minZ: -HALL_D / 2 + 1.0,
      maxZ: HALL_D / 2 - 1.0,
    },
    colliders,
    trashBins,
    getActiveTrash,
    spawnRandomTrash,
    clearActiveTrash,
    updateWorld,
    dispose,
  };
}
