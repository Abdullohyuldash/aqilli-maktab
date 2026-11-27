import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EquippedAccessories, FloorNumber, SubjectId, TeacherGreetingPrompt } from '../types';
import { SUBJECT_META } from '../data/curriculum';
import { createRobloxAvatar, RobloxAvatarRig } from '../three/avatar';

export type NpcDoorRequests = Partial<Record<SubjectId, number>>;

export type NpcUpdateFn = (
  dt: number,
  elapsed: number,
  activeSubject: SubjectId,
  playerPos: THREE.Vector3,
  doorRequestsOut: NpcDoorRequests
) => void;

export interface TeacherGreetingOutcome {
  kind: 'reward' | 'penalty';
  teacherId: string;
  teacherName: string;
  teacherX: number;
  teacherZ: number;
}

export interface SchoolNPCsProps {
  scene: THREE.Scene | null;
  castShadow: boolean;
  currentFloor: FloorNumber;
  inGym: boolean;
  npcUpdateRef: React.MutableRefObject<NpcUpdateFn | null>;
  greetTriggerToken: number;
  onTeacherGreetingPromptChange: (prompt: TeacherGreetingPrompt | null) => void;
  onTeacherGreetingOutcome: (outcome: TeacherGreetingOutcome) => void;
}

type Gender = 'boy' | 'girl';

interface DoorWaypoint {
  x: number;
  z: number;
  subjectId: SubjectId;
  doorYaw: number;
  insideX: number;
  insideZ: number;
}

interface Point2D {
  x: number;
  z: number;
}

const BOY_SHIRT_PALETTE = [
  '#2563EB', // Ko'k
  '#16A34A', // Yashil
  '#EA580C', // To'q sariq
  '#0891B2', // Moviy
  '#4F46E5', // Indigo
  '#0D9488', // Zumrad
];

const GIRL_DRESS_PALETTE: { dress: string; ribbon: string; hair: string }[] = [
  { dress: '#EC4899', ribbon: '#FDE047', hair: '#3B2314' }, // Pushti + sariq bantik
  { dress: '#8B5CF6', ribbon: '#F472B6', hair: '#1E1612' }, // Binafsha + pushti bantik
  { dress: '#38BDF8', ribbon: '#FB7185', hair: '#4A2C16' }, // Och ko'k + marjon bantik
  { dress: '#F59E0B', ribbon: '#EC4899', hair: '#2C1B12' }, // Sariq + pushti bantik
];

// Floor-specific openable classroom doorways (NPCs ONLY enter active doors on currentFloor!)
const FLOOR_DOOR_WAYPOINTS: Record<FloorNumber, DoorWaypoint[]> = {
  1: [
    { x: -11.4, z: -2.2, subjectId: 'alifbe', doorYaw: -Math.PI / 2, insideX: -14.1, insideZ: -2.2 },
    { x: 11.4, z: -2.2, subjectId: 'math', doorYaw: Math.PI / 2, insideX: 14.1, insideZ: -2.2 },
  ],
  2: [
    { x: -11.4, z: -2.2, subjectId: 'english', doorYaw: -Math.PI / 2, insideX: -14.1, insideZ: -2.2 },
    { x: -11.4, z: 5.4, subjectId: 'pe', doorYaw: -Math.PI / 2, insideX: -14.1, insideZ: 5.4 },
  ],
  3: [
    { x: -11.4, z: -5.4, subjectId: 'cs', doorYaw: -Math.PI / 2, insideX: -14.1, insideZ: -5.4 },
    { x: 11.4, z: -5.4, subjectId: 'science', doorYaw: Math.PI / 2, insideX: 14.1, insideZ: -5.4 },
  ],
};

const DOOR_BY_SUBJECT: Record<SubjectId, DoorWaypoint> = {
  alifbe: FLOOR_DOOR_WAYPOINTS[1][0],
  math: FLOOR_DOOR_WAYPOINTS[1][1],
  english: FLOOR_DOOR_WAYPOINTS[2][0],
  pe: FLOOR_DOOR_WAYPOINTS[2][1],
  cs: FLOOR_DOOR_WAYPOINTS[3][0],
  science: FLOOR_DOOR_WAYPOINTS[3][1],
};

// Open hallway stroll points (strictly clear of Lift, Shop, Schedule stand, plants, benches & lockers)
const HALL_WAYPOINTS: Point2D[] = [
  { x: -5.2, z: -3.2 },
  { x: 4.8, z: -3.2 },
  { x: -5.4, z: 3.4 },
  { x: 5.0, z: 3.2 },
  { x: -1.8, z: -1.6 },
  { x: 1.8, z: 1.8 },
  { x: -7.0, z: 0.4 },
  { x: 6.8, z: 0.2 },
  { x: -0.4, z: 6.6 },
];

// Brief shop browsing spots flanking the Floor 1 shop counter (x = 8.0)
const FLOOR1_SHOP_SPOTS: { x: number; z: number; yaw: number }[] = [
  { x: 5.8, z: -8.65, yaw: Math.PI - 0.24 },
  { x: 10.1, z: -8.65, yaw: Math.PI + 0.26 },
];

// Teacher greeting positions right beside each active classroom door
const TEACHER_ROOM_SPOTS: Record<SubjectId, { x: number; z: number; greetYaw: number }> = {
  alifbe: { x: -10.3, z: 0.3, greetYaw: Math.PI / 2 - 0.25 },
  math: { x: 10.3, z: 0.3, greetYaw: -Math.PI / 2 + 0.25 },
  english: { x: -10.3, z: 0.3, greetYaw: Math.PI / 2 - 0.25 },
  pe: { x: -10.3, z: 7.9, greetYaw: Math.PI / 2 - 0.25 },
  cs: { x: -10.3, z: -2.9, greetYaw: Math.PI / 2 - 0.25 },
  science: { x: 10.3, z: -2.9, greetYaw: -Math.PI / 2 + 0.25 },
};

// Same-gender 3-line coherent Uzbek Q&A conversations (Savol -> Javob -> Xulosa)
const BOY_DIALOGUES: string[][] = [
  [
    'Jasur, hozir qaysi darsga kiramiz?',
    'Hozir 3-qavatda Informatika darsi, Bekzod!',
    'Yur tezroq, ustozdan oldin xonaga kiraylik!',
  ],
  [
    "Qara, yerga qog'oz tushib qolibdi.",
    'Yur, uni olib axlat qutisiga tashlaylik!',
    "To'g'ri, maktabimiz doim toza bo'lishi kerak!",
  ],
  [
    "Matematika darsi qiyin bo'lmadimi?",
    "Yo'q, qoidasini tushunsang juda oson ekan!",
    "Tanaffusda menga ham o'rgatib qo'yasanmi?",
  ],
];

const GIRL_DIALOGUES: string[][] = [
  [
    "Zilola, yangi medalni qo'lga kiritdingmi?",
    "Ha, barcha savollarga to'g'ri javob berdim! ⭐",
    'Voy, tabriklayman! Men ham intilaman!',
  ],
  [
    "Qo'lingdagi kitob juda qiziq ko'rinyapti.",
    'Ha, kutubxonadan allomalar haqida kitob oldim.',
    "O'qib bo'lgach, menga ham berib turasanmi?",
  ],
  [
    "Qo'ng'iroq chalindi, sinfga kiramizmi?",
    'Ha, tartib bilan, shoshilmasdan boraylik.',
    "Kettik, yangi bilimlarni o'rganamiz!",
  ],
];

const TEACHER_LINES: string[] = [
  'Assalomu alaykum, bilimdonlarim! Darsga tayyormisiz?',
  "Yo'lakda yugurmang, bolalar, bir-biringizga ehtiyot bo'ling!",
  "Qo'ng'iroq chalindi, qani, intizom bilan sinfga marhamat!",
  'Vaqtni qadrlang, ilm — eng katta boylikdir!',
  "Maktabimiz tozaligi va odobi sizlarning qo'lingizda, barakalla!",
];

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function createNameTagTexture(
  name: string,
  accentHex: string,
  isTeacher = false
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 280;
  canvas.height = 76;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(ctx, 14, 10, 252, 56, 24);
  ctx.fillStyle = isTeacher ? 'rgba(30, 41, 59, 0.94)' : 'rgba(15, 23, 42, 0.84)';
  ctx.fill();
  ctx.lineWidth = isTeacher ? 4 : 3;
  ctx.strokeStyle = isTeacher ? '#F59E0B' : 'rgba(255, 255, 255, 0.88)';
  ctx.stroke();

  if (!isTeacher) {
    ctx.beginPath();
    ctx.arc(46, 38, 9, 0, Math.PI * 2);
    ctx.fillStyle = accentHex;
    ctx.fill();
  }

  ctx.fillStyle = isTeacher ? '#FEF3C7' : '#FFFFFF';
  ctx.font = '800 28px Outfit, "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, isTeacher ? 140 : 150, 39);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createSpeechBubbleTexture(
  text: string,
  accentColor = '#38BDF8',
  borderColor = '#334155'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 576;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoundedRect(ctx, 16, 12, 544, 114, 28);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(270, 124);
  ctx.lineTo(288, 150);
  ctx.lineTo(306, 124);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(270, 126);
  ctx.lineTo(288, 150);
  ctx.lineTo(306, 126);
  ctx.lineWidth = 4;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  drawRoundedRect(ctx, 38, 20, 500, 6, 3);
  ctx.fillStyle = accentColor;
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  ctx.font = '700 24px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxLineWidth = 496;
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxLineWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (lines.length <= 1) {
    ctx.fillText(text, 288, 74, maxLineWidth);
  } else {
    const line1 = lines[0];
    const line2 = lines.slice(1).join(' ');
    ctx.fillText(line1, 288, 58, maxLineWidth);
    ctx.fillText(line2, 288, 92, maxLineWidth);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createReactionBadgeTexture(
  symbol: string,
  bgColor: string,
  borderColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(80, 80, 62, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  ctx.font = '700 62px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 80, 84);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function shuffleArray<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createNameSprite(
  name: string,
  accentHex: string,
  textures: THREE.Texture[],
  materials: THREE.Material[],
  isTeacher = false
): THREE.Sprite {
  const tex = createNameTagTexture(name, accentHex, isTeacher);
  textures.push(tex);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  materials.push(mat);
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(isTeacher ? 2.15 : 2.05, isTeacher ? 0.6 : 0.56, 1);
  sprite.position.set(0, 3.06, 0);
  return sprite;
}

type StudentState =
  | 'walking'
  | 'entering'
  | 'inside'
  | 'opening_exit'
  | 'exiting'
  | 'browsing_shop'
  | 'chatting';

type DestinationKind = 'door' | 'hall' | 'shop';

interface DynamicStudentNpc {
  id: number;
  name: string;
  gender: Gender;
  rig: RobloxAvatarRig;
  bubbleSprite: THREE.Sprite;
  x: number;
  z: number;
  yaw: number;
  speed: number;
  phaseOffset: number;
  state: StudentState;
  timer: number;
  destKind: DestinationKind;
  targetX: number;
  targetZ: number;
  doorIdx: number;
  shopSpotIdx: number;
  lastDoorIdx: number;
  chatPartnerId: number | null;
  chatFaceYaw: number;
  chatCooldown: number;
  isChatLeader: boolean;
  chatTextures: THREE.CanvasTexture[];
  chatLineIndex: number;
  chatLineTimer: number;
  chatLineInterval: number;
  isSpeakingNow: boolean;
}

export const SchoolNPCs: React.FC<SchoolNPCsProps> = ({
  scene,
  castShadow,
  currentFloor,
  inGym,
  npcUpdateRef,
  greetTriggerToken,
  onTeacherGreetingPromptChange,
  onTeacherGreetingOutcome,
}) => {
  const currentFloorRef = useRef<FloorNumber>(currentFloor);
  const inGymRef = useRef<boolean>(inGym);
  const npcGroupRef = useRef<THREE.Group | null>(null);
  const greetTriggerTokenRef = useRef<number>(greetTriggerToken);
  const onPromptChangeRef = useRef(onTeacherGreetingPromptChange);
  const onOutcomeRef = useRef(onTeacherGreetingOutcome);

  useEffect(() => {
    currentFloorRef.current = currentFloor;
  }, [currentFloor]);

  useEffect(() => {
    inGymRef.current = inGym;
    if (npcGroupRef.current) {
      npcGroupRef.current.visible = !inGym;
    }
    if (inGym) {
      onPromptChangeRef.current(null);
    }
  }, [inGym]);

  useEffect(() => {
    greetTriggerTokenRef.current = greetTriggerToken;
  }, [greetTriggerToken]);

  useEffect(() => {
    onPromptChangeRef.current = onTeacherGreetingPromptChange;
  }, [onTeacherGreetingPromptChange]);

  useEffect(() => {
    onOutcomeRef.current = onTeacherGreetingOutcome;
  }, [onTeacherGreetingOutcome]);

  useEffect(() => {
    if (!scene) return;

    const npcGroup = new THREE.Group();
    npcGroup.name = 'SchoolAtmosphericNPCs';
    npcGroup.visible = !inGymRef.current;
    npcGroupRef.current = npcGroup;
    scene.add(npcGroup);

    const rigs: RobloxAvatarRig[] = [];
    const extraTextures: THREE.Texture[] = [];
    const extraMaterials: THREE.Material[] = [];

    const boyColors = shuffleArray(BOY_SHIRT_PALETTE);
    const girlStyles = shuffleArray(GIRL_DRESS_PALETTE);
    let boyColorIdx = 0;
    let girlStyleIdx = 0;

    const boyDialogueTextures = BOY_DIALOGUES.map((script) =>
      script.map((line) => {
        const t = createSpeechBubbleTexture(line, '#38BDF8', '#1E3A8A');
        extraTextures.push(t);
        return t;
      })
    );
    const girlDialogueTextures = GIRL_DIALOGUES.map((script) =>
      script.map((line) => {
        const t = createSpeechBubbleTexture(line, '#F472B6', '#9D174D');
        extraTextures.push(t);
        return t;
      })
    );

    const createStudentNpcRig = (gender: Gender, equipped: EquippedAccessories) => {
      if (gender === 'girl') {
        const style = girlStyles[girlStyleIdx % girlStyles.length];
        girlStyleIdx++;
        const rig = createRobloxAvatar(style.dress, equipped, castShadow, {
          gender: 'girl',
          hairColor: style.hair,
          ribbonColor: style.ribbon,
        });
        rigs.push(rig);
        return { rig, accentHex: style.dress };
      } else {
        const hex = boyColors[boyColorIdx % boyColors.length];
        boyColorIdx++;
        const rig = createRobloxAvatar(hex, equipped, castShadow, {
          gender: 'boy',
        });
        rigs.push(rig);
        return { rig, accentHex: hex };
      }
    };

    const studentDefs: {
      name: string;
      gender: Gender;
      speed: number;
      equipped: EquippedAccessories;
      initHallIdx: number;
    }[] = [
      { name: 'Aziz', gender: 'boy', speed: 3.05, equipped: { bag: 'basic_backpack', outfit: 'white_shirt_tie' }, initHallIdx: 0 },
      { name: 'Jasur', gender: 'boy', speed: 3.15, equipped: { hat: 'chust_doppi', watch: 'school_watch' }, initHallIdx: 2 },
      { name: 'Sardor', gender: 'boy', speed: 2.95, equipped: { outfit: 'school_vest', bag: 'classic_satchel' }, initHallIdx: 1 },
      { name: 'Bekzod', gender: 'boy', speed: 3.0, equipped: { outfit: 'sport_uniform', bag: 'basic_backpack' }, initHallIdx: 6 },
      { name: 'Madina', gender: 'girl', speed: 2.9, equipped: { bag: 'basic_backpack', hat: 'iroqi_doppi' }, initHallIdx: 4 },
      { name: 'Malika', gender: 'girl', speed: 2.95, equipped: { outfit: 'ceremonial_uniform', bag: 'gold_backpack', medal: 'honor_medal' }, initHallIdx: 3 },
      { name: 'Zilola', gender: 'girl', speed: 2.85, equipped: { outfit: 'girl_vest_skirt', bag: 'classic_satchel', watch: 'school_watch' }, initHallIdx: 5 },
      { name: 'Dilshoda', gender: 'girl', speed: 2.9, equipped: { outfit: 'girl_blouse_skirt', hat: 'iroqi_doppi', bag: 'basic_backpack' }, initHallIdx: 7 },
    ];

    const students: DynamicStudentNpc[] = studentDefs.map((def, idx) => {
      const { rig, accentHex } = createStudentNpcRig(def.gender, def.equipped);
      const tag = createNameSprite(def.name, accentHex, extraTextures, extraMaterials);
      rig.root.add(tag);

      const defaultBubbleTex =
        def.gender === 'boy' ? boyDialogueTextures[0][0] : girlDialogueTextures[0][0];
      const bubbleMat = new THREE.SpriteMaterial({
        map: defaultBubbleTex,
        transparent: true,
        depthWrite: false,
      });
      extraMaterials.push(bubbleMat);
      const bubbleSprite = new THREE.Sprite(bubbleMat);
      bubbleSprite.scale.set(4.1, 1.15, 1);
      bubbleSprite.position.set(0, 3.92, 0);
      bubbleSprite.visible = false;
      rig.root.add(bubbleSprite);

      npcGroup.add(rig.root);

      const hallStart = HALL_WAYPOINTS[def.initHallIdx];
      return {
        id: idx,
        name: def.name,
        gender: def.gender,
        rig,
        bubbleSprite,
        x: hallStart.x,
        z: hallStart.z,
        yaw: 0,
        speed: def.speed,
        phaseOffset: idx * 1.17,
        state: 'walking',
        timer: 0,
        destKind: 'hall',
        targetX: hallStart.x,
        targetZ: hallStart.z,
        doorIdx: 0,
        shopSpotIdx: -1,
        lastDoorIdx: -1,
        chatPartnerId: null,
        chatFaceYaw: 0,
        chatCooldown: 2 + idx * 0.8,
        isChatLeader: false,
        chatTextures: [],
        chatLineIndex: 0,
        chatLineTimer: 0,
        chatLineInterval: 2.8,
        isSpeakingNow: false,
      };
    });

    const getFloorDoors = (fl: FloorNumber): DoorWaypoint[] => FLOOR_DOOR_WAYPOINTS[fl];

    const assignRandomClassroom = (s: DynamicStudentNpc, fl: FloorNumber) => {
      const doors = getFloorDoors(fl);
      const candidates =
        doors.length > 1
          ? doors.map((_, idx) => idx).filter((idx) => idx !== s.lastDoorIdx)
          : [0];
      const chosen = candidates[Math.floor(Math.random() * candidates.length)] ?? 0;
      const d = doors[chosen];
      s.destKind = 'door';
      s.doorIdx = chosen;
      s.shopSpotIdx = -1;
      s.targetX = d.x;
      s.targetZ = d.z;
      s.state = 'walking';
    };

    const assignShopOrClassroom = (s: DynamicStudentNpc, fl: FloorNumber) => {
      if (fl !== 1) {
        // Shop only exists on Floor 1! On Floors 2-3 stroll or enter floor's classrooms.
        if (Math.random() < 0.5) {
          assignHallStroll(s);
        } else {
          assignRandomClassroom(s, fl);
        }
        return;
      }
      const takenSpots = new Set(
        students
          .filter((other) => other.id !== s.id && other.shopSpotIdx >= 0)
          .map((other) => other.shopSpotIdx)
      );
      const freeSpot = FLOOR1_SHOP_SPOTS.findIndex((_, idx) => !takenSpots.has(idx));
      if (freeSpot >= 0) {
        const sp = FLOOR1_SHOP_SPOTS[freeSpot];
        s.destKind = 'shop';
        s.shopSpotIdx = freeSpot;
        s.targetX = sp.x;
        s.targetZ = sp.z;
        s.state = 'walking';
      } else {
        assignRandomClassroom(s, fl);
      }
    };

    const assignHallStroll = (s: DynamicStudentNpc) => {
      const pt = HALL_WAYPOINTS[Math.floor(Math.random() * HALL_WAYPOINTS.length)];
      s.destKind = 'hall';
      s.shopSpotIdx = -1;
      s.targetX = pt.x + (Math.random() - 0.5) * 1.4;
      s.targetZ = pt.z + (Math.random() - 0.5) * 1.4;
      s.state = 'walking';
    };

    const assignNextActivity = (s: DynamicStudentNpc, fl: FloorNumber, afterChat = false) => {
      if (afterChat) {
        if (Math.random() < 0.78) {
          assignRandomClassroom(s, fl);
        } else {
          assignShopOrClassroom(s, fl);
        }
        return;
      }

      const roll = Math.random();
      if (roll < 0.55) {
        assignHallStroll(s);
      } else if (roll < 0.73 && fl === 1) {
        assignShopOrClassroom(s, fl);
      } else {
        assignRandomClassroom(s, fl);
      }
    };

    const resetStudentsForFloor = (fl: FloorNumber) => {
      const doors = getFloorDoors(fl);
      students.forEach((s, idx) => {
        s.bubbleSprite.visible = false;
        s.isSpeakingNow = false;
        s.chatPartnerId = null;
        s.isChatLeader = false;
        s.shopSpotIdx = -1;
        s.rig.headGroup.rotation.set(0, 0, 0);
        s.lastDoorIdx = -1;
        s.chatCooldown = 1.6 + (idx % 4) * 1.2;

        const doorIdx = idx % doors.length;
        const d = doors[doorIdx];

        // Spread students naturally across walking to doors, strolling, shop (Floor 1), and staggered inside class
        if (idx === 5 || idx === 7) {
          s.x = d.insideX;
          s.z = d.insideZ;
          s.yaw = d.doorYaw;
          s.doorIdx = doorIdx;
          s.destKind = 'door';
          s.targetX = d.x;
          s.targetZ = d.z;
          s.state = 'inside';
          s.timer = idx === 5 ? 9 + Math.random() * 6 : 18 + Math.random() * 8;
          s.rig.root.visible = false;
        } else if (idx === 2 && fl === 1) {
          const sp = FLOOR1_SHOP_SPOTS[0];
          s.x = sp.x;
          s.z = sp.z;
          s.yaw = sp.yaw;
          s.state = 'browsing_shop';
          s.timer = 5.0 + Math.random() * 2.5;
          s.destKind = 'shop';
          s.targetX = sp.x;
          s.targetZ = sp.z;
          s.shopSpotIdx = 0;
          s.rig.root.visible = true;
        } else {
          const wp = HALL_WAYPOINTS[idx % HALL_WAYPOINTS.length];
          s.x = wp.x;
          s.z = wp.z;
          s.rig.root.visible = true;
          if (idx === 0 || idx === 4) {
            s.doorIdx = doorIdx;
            s.destKind = 'door';
            s.targetX = d.x;
            s.targetZ = d.z;
            s.state = 'walking';
          } else {
            const nextWp = HALL_WAYPOINTS[(idx + 3) % HALL_WAYPOINTS.length];
            s.destKind = 'hall';
            s.targetX = nextWp.x;
            s.targetZ = nextWp.z;
            s.state = 'walking';
          }
          s.yaw = Math.atan2(s.targetX - s.x, s.targetZ - s.z);
        }

        s.rig.root.position.set(s.x, 0, s.z);
        s.rig.root.rotation.y = s.yaw;
      });
    };

    const startSameGenderChat = (first: DynamicStudentNpc, second: DynamicStudentNpc) => {
      if (first.gender !== second.gender) return;

      const scriptBank = first.gender === 'boy' ? boyDialogueTextures : girlDialogueTextures;
      const scriptIdx = Math.floor(Math.random() * scriptBank.length);
      const chosenTextures = scriptBank[scriptIdx];

      // Align named speaker/listener naturally when Dialog 1 is picked
      let a = first;
      let b = second;
      if (scriptIdx === 0) {
        if (first.gender === 'boy' && first.name === 'Jasur') {
          a = second;
          b = first;
        } else if (first.gender === 'girl' && first.name === 'Zilola') {
          a = second;
          b = first;
        }
      }

      // Always complete all 3 coherent lines (Savol -> Javob -> Xulosa)
      const lineInterval = 2.9 + Math.random() * 0.45;
      const totalDuration = lineInterval * chosenTextures.length;

      const yawA = Math.atan2(b.x - a.x, b.z - a.z);
      const yawB = Math.atan2(a.x - b.x, a.z - b.z);

      a.state = 'chatting';
      b.state = 'chatting';
      a.shopSpotIdx = -1;
      b.shopSpotIdx = -1;
      a.chatPartnerId = b.id;
      b.chatPartnerId = a.id;
      a.chatFaceYaw = yawA;
      b.chatFaceYaw = yawB;
      a.timer = totalDuration;
      b.timer = totalDuration;

      a.isChatLeader = true;
      b.isChatLeader = false;
      a.chatTextures = chosenTextures;
      b.chatTextures = chosenTextures;
      a.chatLineIndex = 0;
      a.chatLineInterval = lineInterval;
      a.chatLineTimer = lineInterval;

      const matA = a.bubbleSprite.material as THREE.SpriteMaterial;
      matA.map = chosenTextures[0];
      matA.needsUpdate = true;
      a.bubbleSprite.visible = true;
      a.isSpeakingNow = true;

      b.bubbleSprite.visible = false;
      b.isSpeakingNow = false;
    };

    const endChatPair = (a: DynamicStudentNpc, b: DynamicStudentNpc, fl: FloorNumber) => {
      a.bubbleSprite.visible = false;
      b.bubbleSprite.visible = false;
      a.isSpeakingNow = false;
      b.isSpeakingNow = false;
      a.rig.headGroup.rotation.set(0, 0, 0);
      b.rig.headGroup.rotation.set(0, 0, 0);
      a.chatPartnerId = null;
      b.chatPartnerId = null;
      a.isChatLeader = false;
      b.isChatLeader = false;
      a.chatCooldown = 16 + Math.random() * 14;
      b.chatCooldown = 16 + Math.random() * 14;

      assignNextActivity(a, fl, true);
      assignNextActivity(b, fl, true);
    };

    // =========================================================================
    // FORMAL TEACHER NPC ("👨‍🏫 Ustoz") — ONLY VISIBLE ON ACTIVE LESSON'S FLOOR
    // =========================================================================
    const teacherRig = createRobloxAvatar('#1E293B', {}, castShadow, {
      gender: 'boy',
      variant: 'teacher',
      hairColor: '#1E293B',
    });
    rigs.push(teacherRig);

    type TeacherMode =
      | 'walking_to_spot'
      | 'inviting'
      | 'walking_to_door'
      | 'entering'
      | 'inside'
      | 'opening_exit'
      | 'exiting'
      | 'strolling';

    const teacherState: {
      x: number;
      z: number;
      yaw: number;
      speed: number;
      mode: TeacherMode;
      targetSubject: SubjectId | null;
      lastKnownActive: SubjectId | null;
      timer: number;
      strollX: number;
      strollZ: number;
      strollStepsLeft: number;
      rushToNewActive: boolean;
      wasOnFloor: boolean;
    } = {
      x: 0,
      z: -1.6,
      yaw: 0,
      speed: 2.65,
      mode: 'walking_to_spot',
      targetSubject: null,
      lastKnownActive: null,
      timer: 0,
      strollX: 0,
      strollZ: 0,
      strollStepsLeft: 0,
      rushToNewActive: false,
      wasOnFloor: false,
    };
    teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
    teacherRig.root.rotation.y = teacherState.yaw;

    const teacherTag = createNameSprite('👨‍🏫 Ustoz', '#F59E0B', extraTextures, extraMaterials, true);
    teacherRig.root.add(teacherTag);

    const teacherBubbleTextures = TEACHER_LINES.map((text) => {
      const t = createSpeechBubbleTexture(text, '#F59E0B', '#B45309');
      extraTextures.push(t);
      return t;
    });
    const teacherPromptBubbleTex = createSpeechBubbleTexture(
      'Assalomu alaykum, bolajon!',
      '#F59E0B',
      '#B45309'
    );
    const teacherHappyBubbleTex = createSpeechBubbleTexture(
      'Va alaykum assalom, barakalla!',
      '#10B981',
      '#047857'
    );
    const teacherSadBubbleTex = createSpeechBubbleTexture(
      "Ustozga salom qani, o'quvchim?",
      '#F43F5E',
      '#BE123C'
    );
    const teacherHappyBadgeTex = createReactionBadgeTexture('😊⭐', '#FEF3C7', '#10B981');
    const teacherSadBadgeTex = createReactionBadgeTexture('😔', '#FFE4E6', '#E11D48');
    extraTextures.push(
      teacherPromptBubbleTex,
      teacherHappyBubbleTex,
      teacherSadBubbleTex,
      teacherHappyBadgeTex,
      teacherSadBadgeTex
    );

    const teacherBubbleMat = new THREE.SpriteMaterial({
      map: teacherBubbleTextures[0],
      transparent: true,
      depthWrite: false,
    });
    extraMaterials.push(teacherBubbleMat);
    const teacherBubbleSprite = new THREE.Sprite(teacherBubbleMat);
    teacherBubbleSprite.scale.set(3.95, 1.1, 1);
    teacherBubbleSprite.position.set(0, 3.88, 0);
    teacherBubbleSprite.visible = false;
    teacherRig.root.add(teacherBubbleSprite);

    const teacherReactionBadgeMat = new THREE.SpriteMaterial({
      map: teacherHappyBadgeTex,
      transparent: true,
      depthWrite: false,
    });
    extraMaterials.push(teacherReactionBadgeMat);
    const teacherReactionBadge = new THREE.Sprite(teacherReactionBadgeMat);
    teacherReactionBadge.scale.set(1.12, 1.12, 1);
    teacherReactionBadge.position.set(0, 4.92, 0);
    teacherReactionBadge.visible = false;
    teacherRig.root.add(teacherReactionBadge);

    npcGroup.add(teacherRig.root);

    let teacherLineIdx = 0;
    let teacherBubbleTimer = 4.2;

    // Teacher Greeting & Ethics Mechanic state
    const GREETING_TRIGGER_DIST = 3.0;
    const GREETING_LEAVE_DIST = 4.0;
    const GREETING_WINDOW_SEC = 5.0;
    const GREETING_COOLDOWN_SEC = 120.0; // 2-minute cooldown per teacher
    const PENALTY_COOLDOWN_SEC = 20.0;
    const REACTION_DURATION_SEC = 3.8;

    const teacherCooldowns: Record<string, number> = {};
    const ethicsState: {
      phase: 'idle' | 'prompting' | 'greeted_happy' | 'ignored_sad';
      teacherId: string;
      teacherName: string;
      timer: number;
      lastHandledGreetToken: number;
      lastReportedBucket: number;
    } = {
      phase: 'idle',
      teacherId: '',
      teacherName: '',
      timer: 0,
      lastHandledGreetToken: greetTriggerTokenRef.current,
      lastReportedBucket: -1,
    };

    const clearGreetingPrompt = () => {
      if (ethicsState.phase === 'prompting') {
        ethicsState.phase = 'idle';
        ethicsState.timer = 0;
        ethicsState.lastReportedBucket = -1;
        onPromptChangeRef.current(null);
      }
    };

    const setTeacherLine = (idx: number) => {
      teacherLineIdx = idx % teacherBubbleTextures.length;
      teacherBubbleMat.map = teacherBubbleTextures[teacherLineIdx];
      teacherBubbleMat.needsUpdate = true;
    };

    const pickTeacherStrollPoint = () => {
      const wp = HALL_WAYPOINTS[Math.floor(Math.random() * HALL_WAYPOINTS.length)];
      teacherState.strollX = wp.x;
      teacherState.strollZ = wp.z;
    };

    const spawnTeacherAtActiveRoom = (subj: SubjectId) => {
      const spot = TEACHER_ROOM_SPOTS[subj];
      teacherState.targetSubject = subj;
      teacherState.lastKnownActive = subj;
      teacherState.x = spot.x;
      teacherState.z = spot.z;
      teacherState.yaw = spot.greetYaw;
      teacherState.mode = 'inviting';
      teacherState.timer = 6.5 + Math.random() * 1.5;
      teacherState.rushToNewActive = false;
      teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
      teacherRig.root.rotation.y = teacherState.yaw;
      teacherRig.root.visible = true;
      teacherBubbleSprite.visible = true;
      setTeacherLine(0);
      teacherBubbleTimer = 3.6;
    };

    const smoothTurn = (currentYaw: number, targetYaw: number, dt: number, rate = 7.5): number => {
      let diff = targetYaw - currentYaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      return currentYaw + diff * (1 - Math.exp(-rate * dt));
    };

    // Initialize students for initial floor
    let initializedFloor: FloorNumber = currentFloorRef.current;
    resetStudentsForFloor(initializedFloor);

    const updateNpcs: NpcUpdateFn = (dt, elapsed, activeSubject, playerPos, doorRequestsOut) => {
      if (inGymRef.current) {
        npcGroup.visible = false;
        clearGreetingPrompt();
        return;
      }
      npcGroup.visible = true;

      const fl = currentFloorRef.current;

      // Decrement per-teacher greeting cooldowns every unpaused frame
      for (const key in teacherCooldowns) {
        if (teacherCooldowns[key] > 0) {
          teacherCooldowns[key] = Math.max(0, teacherCooldowns[key] - dt);
        }
      }

      // Detect floor change -> cleanly reposition students onto this floor's valid doors/corridor!
      if (fl !== initializedFloor) {
        initializedFloor = fl;
        resetStudentsForFloor(fl);
        teacherState.wasOnFloor = false;
        clearGreetingPrompt();
        teacherReactionBadge.visible = false;
        if (ethicsState.phase !== 'idle') {
          ethicsState.phase = 'idle';
          ethicsState.timer = 0;
        }
      }

      doorRequestsOut.alifbe = 0;
      doorRequestsOut.math = 0;
      doorRequestsOut.english = 0;
      doorRequestsOut.pe = 0;
      doorRequestsOut.cs = 0;
      doorRequestsOut.science = 0;

      const doors = getFloorDoors(fl);

      // --- 1. Check for Dynamic Same-Gender Hallway Encounters ---
      const activeChattersCount = students.filter((s) => s.state === 'chatting').length;
      if (activeChattersCount === 0) {
        let paired = false;
        for (let i = 0; i < students.length && !paired; i++) {
          const a = students[i];
          if (a.state !== 'walking' || a.chatCooldown > 0) continue;
          if (Math.abs(a.x) > 8.6 || a.z < -5.8 || a.z > 7.6) continue;

          for (let j = i + 1; j < students.length; j++) {
            const b = students[j];
            if (b.gender !== a.gender) continue;
            if (b.state !== 'walking' || b.chatCooldown > 0) continue;
            if (Math.abs(b.x) > 8.6 || b.z < -5.8 || b.z > 7.6) continue;

            const dist = Math.hypot(a.x - b.x, a.z - b.z);
            if (dist >= 1.3 && dist <= 3.6) {
              startSameGenderChat(a, b);
              paired = true;
              break;
            }
          }
        }
      }

      // --- 2. Update All 8 Dynamic Student NPCs ---
      for (let i = 0; i < students.length; i++) {
        const s = students[i];

        if (s.chatCooldown > 0 && s.state !== 'chatting') {
          s.chatCooldown = Math.max(0, s.chatCooldown - dt);
        }

        if (s.state === 'walking') {
          const dx = s.targetX - s.x;
          const dz = s.targetZ - s.z;
          const dist = Math.hypot(dx, dz);

          if (s.destKind === 'door' && dist < 3.4) {
            const d = doors[s.doorIdx % doors.length];
            doorRequestsOut[d.subjectId] = 1;
          }

          if (dist < 0.28) {
            s.x = s.targetX;
            s.z = s.targetZ;

            if (s.destKind === 'door') {
              const d = doors[s.doorIdx % doors.length];
              doorRequestsOut[d.subjectId] = 1;
              s.state = 'entering';
            } else if (s.destKind === 'shop' && fl === 1) {
              s.state = 'browsing_shop';
              s.timer = 5.0 + Math.random() * 3.5;
            } else {
              if (Math.random() < 0.78) {
                assignRandomClassroom(s, fl);
              } else {
                assignShopOrClassroom(s, fl);
              }
            }
          } else {
            const step = Math.min(dist, s.speed * dt);
            s.x = THREE.MathUtils.clamp(s.x + (dx / dist) * step, -13.2, 13.2);
            s.z = THREE.MathUtils.clamp(s.z + (dz / dist) * step, -10.8, 10.8);
            s.yaw = smoothTurn(s.yaw, Math.atan2(dx, dz), dt, 8.0);
          }

          s.rig.root.position.set(s.x, 0, s.z);
          s.rig.root.rotation.y = s.yaw;
          s.rig.updateAnimation(dt, 0.72, false, 0);
        } else if (s.state === 'entering') {
          const d = doors[s.doorIdx % doors.length];
          doorRequestsOut[d.subjectId] = 1;

          const dx = d.insideX - s.x;
          const dz = d.insideZ - s.z;
          const dist = Math.hypot(dx, dz);

          if (dist < 0.28) {
            s.x = d.insideX;
            s.z = d.insideZ;
            s.lastDoorIdx = s.doorIdx;
            s.rig.root.visible = false;
            s.state = 'inside';
            s.timer = 20 + Math.random() * 20;
          } else {
            const step = Math.min(dist, s.speed * 0.85 * dt);
            s.x += (dx / dist) * step;
            s.z += (dz / dist) * step;
            s.yaw = smoothTurn(s.yaw, Math.atan2(dx, dz), dt, 9.0);
            s.rig.root.position.set(s.x, 0, s.z);
            s.rig.root.rotation.y = s.yaw;
            s.rig.updateAnimation(dt, 0.68, false, 0);
          }
        } else if (s.state === 'inside') {
          s.timer -= dt;
          if (s.timer <= 0) {
            s.state = 'opening_exit';
            s.timer = 0.55;
          }
        } else if (s.state === 'opening_exit') {
          const d = doors[s.doorIdx % doors.length];
          doorRequestsOut[d.subjectId] = 1;
          s.timer -= dt;
          if (s.timer <= 0) {
            s.rig.root.visible = true;
            s.yaw = Math.atan2(d.x - s.x, d.z - s.z);
            s.rig.root.position.set(s.x, 0, s.z);
            s.rig.root.rotation.y = s.yaw;
            s.state = 'exiting';
          }
        } else if (s.state === 'exiting') {
          const d = doors[s.doorIdx % doors.length];
          doorRequestsOut[d.subjectId] = 1;

          const dx = d.x - s.x;
          const dz = d.z - s.z;
          const dist = Math.hypot(dx, dz);

          if (dist < 0.28) {
            s.x = d.x;
            s.z = d.z;
            s.chatCooldown = Math.min(s.chatCooldown, 1.5);
            assignNextActivity(s, fl, false);
          } else {
            const step = Math.min(dist, s.speed * 0.88 * dt);
            s.x += (dx / dist) * step;
            s.z += (dz / dist) * step;
            s.yaw = smoothTurn(s.yaw, Math.atan2(dx, dz), dt, 9.0);
            s.rig.root.position.set(s.x, 0, s.z);
            s.rig.root.rotation.y = s.yaw;
            s.rig.updateAnimation(dt, 0.68, false, 0);
          }
        } else if (s.state === 'browsing_shop') {
          if (fl !== 1) {
            s.shopSpotIdx = -1;
            assignHallStroll(s);
            continue;
          }
          s.timer -= dt;
          const sp = FLOOR1_SHOP_SPOTS[Math.max(0, s.shopSpotIdx)] ?? FLOOR1_SHOP_SPOTS[0];
          const t = elapsed + s.phaseOffset;
          s.yaw = smoothTurn(s.yaw, sp.yaw + Math.sin(t * 0.65) * 0.08, dt, 6.0);
          s.rig.root.rotation.y = s.yaw;
          s.rig.updateAnimation(dt, 0, false, 0);
          s.rig.headGroup.rotation.y = Math.sin(t * 1.35) * 0.34;
          s.rig.headGroup.rotation.x = Math.sin(t * 2.1) * 0.08 - 0.04;

          if (s.timer <= 0) {
            s.rig.headGroup.rotation.y = 0;
            s.rig.headGroup.rotation.x = 0;
            s.shopSpotIdx = -1;
            assignRandomClassroom(s, fl);
          }
        } else if (s.state === 'chatting') {
          const partner = s.chatPartnerId !== null ? students[s.chatPartnerId] : null;
          if (!partner || partner.state !== 'chatting') {
            s.bubbleSprite.visible = false;
            s.isSpeakingNow = false;
            s.chatPartnerId = null;
            assignRandomClassroom(s, fl);
            continue;
          }

          s.yaw = smoothTurn(s.yaw, s.chatFaceYaw, dt, 7.5);
          s.rig.root.rotation.y = s.yaw;
          s.rig.updateAnimation(dt, 0, false, 0);

          const t = elapsed + s.phaseOffset;
          if (s.isSpeakingNow) {
            s.rig.headGroup.rotation.x = Math.sin(t * 5.2) * 0.09;
            s.rig.headGroup.rotation.y = Math.sin(t * 2.4) * 0.14;
            s.rig.rightArmPivot.rotation.x = -0.35 + Math.sin(t * 5.5) * 0.16;
            s.bubbleSprite.position.y = 3.92 + Math.sin(elapsed * 3.4) * 0.06;
          } else {
            s.rig.headGroup.rotation.x = Math.sin(t * 2.2) * 0.06;
            s.rig.headGroup.rotation.y = Math.sin(t * 1.1) * 0.08;
          }

          if (s.isChatLeader) {
            s.timer -= dt;
            s.chatLineTimer -= dt;

            if (s.timer <= 0) {
              endChatPair(s, partner, fl);
            } else if (s.chatLineTimer <= 0 && s.chatLineIndex + 1 < s.chatTextures.length) {
              s.chatLineIndex += 1;
              s.chatLineTimer = s.chatLineInterval;

              const speakerIsA = s.chatLineIndex % 2 === 0;
              const speaker = speakerIsA ? s : partner;
              const listener = speakerIsA ? partner : s;

              const spMat = speaker.bubbleSprite.material as THREE.SpriteMaterial;
              spMat.map = s.chatTextures[s.chatLineIndex];
              spMat.needsUpdate = true;
              speaker.bubbleSprite.visible = true;
              speaker.isSpeakingNow = true;

              listener.bubbleSprite.visible = false;
              listener.isSpeakingNow = false;
            }
          }
        }
      }

      // --- 3. Formal Teacher NPC ("👨‍🏫 Ustoz"): ONLY present on activeSubject's floor! ---
      const activeLessonFloor = SUBJECT_META[activeSubject].floor;
      const teacherShouldBeHere = activeLessonFloor === fl;

      if (!teacherShouldBeHere) {
        teacherRig.root.visible = false;
        teacherBubbleSprite.visible = false;
        teacherReactionBadge.visible = false;
        teacherState.wasOnFloor = false;
        teacherState.lastKnownActive = activeSubject;
        clearGreetingPrompt();
        if (ethicsState.phase !== 'idle') {
          ethicsState.phase = 'idle';
          ethicsState.timer = 0;
        }
        ethicsState.lastHandledGreetToken = greetTriggerTokenRef.current;
        return;
      }

      // Player just arrived on the active lesson's floor -> Ustoz greets them beside the active room!
      if (!teacherState.wasOnFloor || teacherState.targetSubject === null) {
        teacherState.wasOnFloor = true;
        spawnTeacherAtActiveRoom(activeSubject);
      }

      // Active subject changed while staying on the same floor (e.g., Alifbe -> Matematika on Floor 1)
      if (teacherState.lastKnownActive !== activeSubject) {
        teacherState.lastKnownActive = activeSubject;
        if (teacherState.mode === 'inside') {
          teacherState.mode = 'opening_exit';
          teacherState.timer = 0.55;
          teacherState.rushToNewActive = true;
        } else if (teacherState.mode === 'opening_exit' || teacherState.mode === 'exiting') {
          teacherState.rushToNewActive = true;
        } else {
          teacherState.targetSubject = activeSubject;
          teacherState.mode = 'walking_to_spot';
          teacherState.rushToNewActive = false;
          teacherRig.root.visible = true;
          teacherBubbleSprite.visible = true;
          setTeacherLine(2);
          teacherBubbleTimer = 4.0;
        }
      }

      const activeTeacherSubj = teacherState.targetSubject!;
      const teacherSpot = TEACHER_ROOM_SPOTS[activeTeacherSubj];
      const teacherDoor = DOOR_BY_SUBJECT[activeTeacherSubj];
      const activeTeacherMeta = SUBJECT_META[activeTeacherSubj];
      const activeTeacherId = `teacher_${activeTeacherSubj}`;

      const teacherInteractable =
        teacherRig.root.visible &&
        teacherState.mode !== 'inside' &&
        teacherState.mode !== 'opening_exit' &&
        teacherState.mode !== 'entering';

      const distToPlayer = Math.hypot(playerPos.x - teacherState.x, playerPos.z - teacherState.z);
      const yawToPlayer = Math.atan2(playerPos.x - teacherState.x, playerPos.z - teacherState.z);

      // Update Teacher Greeting & Ethics Mechanic state machine
      if (!teacherInteractable) {
        clearGreetingPrompt();
        ethicsState.lastHandledGreetToken = greetTriggerTokenRef.current;
      } else if (ethicsState.phase === 'idle') {
        ethicsState.lastHandledGreetToken = greetTriggerTokenRef.current;
        if (distToPlayer <= GREETING_TRIGGER_DIST && (teacherCooldowns[activeTeacherId] ?? 0) <= 0) {
          ethicsState.phase = 'prompting';
          ethicsState.teacherId = activeTeacherId;
          ethicsState.teacherName = activeTeacherMeta.teacherName;
          ethicsState.timer = GREETING_WINDOW_SEC;
          ethicsState.lastReportedBucket = Math.ceil(GREETING_WINDOW_SEC * 10);

          teacherBubbleMat.map = teacherPromptBubbleTex;
          teacherBubbleMat.needsUpdate = true;
          teacherBubbleSprite.visible = true;
          teacherReactionBadge.visible = false;

          onPromptChangeRef.current({
            teacherId: activeTeacherId,
            teacherName: activeTeacherMeta.teacherName,
            timeRemainingSec: GREETING_WINDOW_SEC,
            totalTimeSec: GREETING_WINDOW_SEC,
          });
        }
      } else if (ethicsState.phase === 'prompting') {
        const playerGreeted = greetTriggerTokenRef.current !== ethicsState.lastHandledGreetToken;
        if (playerGreeted) {
          ethicsState.lastHandledGreetToken = greetTriggerTokenRef.current;
          ethicsState.phase = 'greeted_happy';
          ethicsState.timer = REACTION_DURATION_SEC;
          ethicsState.lastReportedBucket = -1;
          teacherCooldowns[ethicsState.teacherId] = GREETING_COOLDOWN_SEC;

          teacherBubbleMat.map = teacherHappyBubbleTex;
          teacherBubbleMat.needsUpdate = true;
          teacherBubbleSprite.visible = true;
          teacherReactionBadgeMat.map = teacherHappyBadgeTex;
          teacherReactionBadgeMat.needsUpdate = true;
          teacherReactionBadge.visible = true;

          onPromptChangeRef.current(null);
          onOutcomeRef.current({
            kind: 'reward',
            teacherId: ethicsState.teacherId,
            teacherName: ethicsState.teacherName,
            teacherX: teacherState.x,
            teacherZ: teacherState.z,
          });
        } else {
          ethicsState.timer -= dt;
          if (distToPlayer > GREETING_LEAVE_DIST || ethicsState.timer <= 0) {
            ethicsState.phase = 'ignored_sad';
            ethicsState.timer = REACTION_DURATION_SEC;
            ethicsState.lastReportedBucket = -1;
            teacherCooldowns[ethicsState.teacherId] = PENALTY_COOLDOWN_SEC;

            teacherBubbleMat.map = teacherSadBubbleTex;
            teacherBubbleMat.needsUpdate = true;
            teacherBubbleSprite.visible = true;
            teacherReactionBadgeMat.map = teacherSadBadgeTex;
            teacherReactionBadgeMat.needsUpdate = true;
            teacherReactionBadge.visible = true;

            onPromptChangeRef.current(null);
            onOutcomeRef.current({
              kind: 'penalty',
              teacherId: ethicsState.teacherId,
              teacherName: ethicsState.teacherName,
              teacherX: teacherState.x,
              teacherZ: teacherState.z,
            });
          } else {
            const bucket = Math.max(0, Math.ceil(ethicsState.timer * 10));
            if (bucket !== ethicsState.lastReportedBucket) {
              ethicsState.lastReportedBucket = bucket;
              onPromptChangeRef.current({
                teacherId: ethicsState.teacherId,
                teacherName: ethicsState.teacherName,
                timeRemainingSec: Math.max(0, ethicsState.timer),
                totalTimeSec: GREETING_WINDOW_SEC,
              });
            }
          }
        }
      } else if (ethicsState.phase === 'greeted_happy' || ethicsState.phase === 'ignored_sad') {
        ethicsState.lastHandledGreetToken = greetTriggerTokenRef.current;
        ethicsState.timer -= dt;
        if (ethicsState.timer <= 0) {
          ethicsState.phase = 'idle';
          ethicsState.timer = 0;
          teacherReactionBadge.visible = false;
          teacherRig.headGroup.rotation.set(0, 0, 0);
          setTeacherLine(teacherLineIdx + 1);
          teacherBubbleTimer = 3.6;
        }
      }

      const teacherPausedForGreeting =
        teacherInteractable &&
        (ethicsState.phase === 'prompting' ||
          ethicsState.phase === 'greeted_happy' ||
          ethicsState.phase === 'ignored_sad');

      if (teacherPausedForGreeting) {
        // Teacher pauses politely in place and faces the student during greeting interaction
        teacherState.yaw = smoothTurn(teacherState.yaw, yawToPlayer, dt, 8.5);
        teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
        teacherRig.root.rotation.y = teacherState.yaw;
        teacherRig.updateAnimation(dt, 0, false, 0);

        if (ethicsState.phase === 'prompting') {
          teacherRig.rightArmPivot.rotation.x = -0.35;
          teacherRig.leftArmPivot.rotation.x = -0.45 + Math.sin(elapsed * 3.6) * 0.16;
          teacherRig.headGroup.rotation.x = Math.sin(elapsed * 2.2) * 0.05;
          teacherRig.headGroup.rotation.y = 0;
        } else if (ethicsState.phase === 'greeted_happy') {
          // Warm respectful nod & right hand placed politely toward chest
          const progress = 1 - Math.max(0, ethicsState.timer) / REACTION_DURATION_SEC;
          const nodWave = Math.sin(progress * Math.PI * 3.0);
          teacherRig.headGroup.rotation.x = Math.max(0, nodWave) * 0.24;
          teacherRig.headGroup.rotation.y = Math.sin(progress * Math.PI * 2.0) * 0.08;
          teacherRig.rightArmPivot.rotation.x = -0.82;
          teacherRig.rightArmPivot.rotation.z = -0.34;
          teacherRig.leftArmPivot.rotation.x = -0.22;
        } else {
          // Gentle disappointed head shake
          teacherRig.headGroup.rotation.x = 0.14;
          teacherRig.headGroup.rotation.y = Math.sin(elapsed * 6.5) * 0.26;
          teacherRig.rightArmPivot.rotation.x = -0.1;
          teacherRig.leftArmPivot.rotation.x = -0.1;
        }
      } else if (teacherState.mode === 'walking_to_spot') {
        const tdx = teacherSpot.x - teacherState.x;
        const tdz = teacherSpot.z - teacherState.z;
        const tDist = Math.hypot(tdx, tdz);

        if (tDist < 0.26) {
          teacherState.x = teacherSpot.x;
          teacherState.z = teacherSpot.z;
          teacherState.mode = 'inviting';
          teacherState.timer = 6.0 + Math.random() * 2.0;
          setTeacherLine(Math.random() < 0.5 ? 0 : 2);
          teacherBubbleTimer = 3.6;
          teacherBubbleSprite.visible = true;
        } else if (distToPlayer <= GREETING_TRIGGER_DIST) {
          // Even during cooldown, politely look toward a nearby student
          teacherState.yaw = smoothTurn(teacherState.yaw, yawToPlayer, dt, 7.5);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherRig.updateAnimation(dt, 0, false, 0);
        } else {
          const step = Math.min(tDist, teacherState.speed * dt);
          teacherState.x += (tdx / tDist) * step;
          teacherState.z += (tdz / tDist) * step;
          teacherState.yaw = smoothTurn(teacherState.yaw, Math.atan2(tdx, tdz), dt, 6.8);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherRig.updateAnimation(dt, 0.62, false, 0);
          teacherRig.rightArmPivot.rotation.x = -0.25 + teacherRig.rightArmPivot.rotation.x * 0.35;
        }
      } else if (teacherState.mode === 'inviting') {
        teacherState.timer -= dt;
        // Address nearby player or nearest visible hallway student instead of speaking into empty space
        let targetLookYaw = teacherSpot.greetYaw;
        let lookingAtStudent = false;
        if (distToPlayer <= 6.5) {
          targetLookYaw = yawToPlayer;
          lookingAtStudent = true;
        } else {
          let nearestStudentDist = 6.5;
          for (let i = 0; i < students.length; i++) {
            const st = students[i];
            if (!st.rig.root.visible) continue;
            const d = Math.hypot(st.x - teacherState.x, st.z - teacherState.z);
            if (d < nearestStudentDist) {
              nearestStudentDist = d;
              targetLookYaw = Math.atan2(st.x - teacherState.x, st.z - teacherState.z);
              lookingAtStudent = true;
            }
          }
        }
        teacherState.yaw = smoothTurn(teacherState.yaw, targetLookYaw, dt, 6.5);
        teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
        teacherRig.root.rotation.y = teacherState.yaw;
        teacherRig.updateAnimation(dt, 0, false, 0);
        teacherRig.rightArmPivot.rotation.x = -0.32;
        teacherRig.leftArmPivot.rotation.x = -0.45 + Math.sin(elapsed * 3.2) * 0.22;
        teacherRig.headGroup.rotation.y = lookingAtStudent ? 0 : Math.sin(elapsed * 1.4) * 0.22;

        if (teacherState.timer <= 0) {
          teacherRig.headGroup.rotation.y = 0;
          teacherState.mode = 'walking_to_door';
        }
      } else if (teacherState.mode === 'walking_to_door') {
        const dx = teacherDoor.x - teacherState.x;
        const dz = teacherDoor.z - teacherState.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 3.6) {
          doorRequestsOut[activeTeacherSubj] = 1;
        }

        if (dist < 0.28) {
          teacherState.x = teacherDoor.x;
          teacherState.z = teacherDoor.z;
          doorRequestsOut[activeTeacherSubj] = 1;
          teacherState.mode = 'entering';
        } else {
          const step = Math.min(dist, teacherState.speed * 0.92 * dt);
          teacherState.x += (dx / dist) * step;
          teacherState.z += (dz / dist) * step;
          teacherState.yaw = smoothTurn(teacherState.yaw, Math.atan2(dx, dz), dt, 7.5);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherRig.updateAnimation(dt, 0.58, false, 0);
          teacherRig.rightArmPivot.rotation.x = -0.25 + teacherRig.rightArmPivot.rotation.x * 0.35;
        }
      } else if (teacherState.mode === 'entering') {
        doorRequestsOut[activeTeacherSubj] = 1;
        const dx = teacherDoor.insideX - teacherState.x;
        const dz = teacherDoor.insideZ - teacherState.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.28) {
          teacherState.x = teacherDoor.insideX;
          teacherState.z = teacherDoor.insideZ;
          teacherRig.root.visible = false;
          teacherBubbleSprite.visible = false;
          teacherReactionBadge.visible = false;
          teacherState.mode = 'inside';
          teacherState.timer = 25 + Math.random() * 10;
        } else {
          const step = Math.min(dist, teacherState.speed * 0.82 * dt);
          teacherState.x += (dx / dist) * step;
          teacherState.z += (dz / dist) * step;
          teacherState.yaw = smoothTurn(teacherState.yaw, Math.atan2(dx, dz), dt, 8.5);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherRig.updateAnimation(dt, 0.55, false, 0);
          teacherRig.rightArmPivot.rotation.x = -0.25 + teacherRig.rightArmPivot.rotation.x * 0.35;
        }
      } else if (teacherState.mode === 'inside') {
        teacherState.timer -= dt;
        if (teacherState.timer <= 0) {
          teacherState.mode = 'opening_exit';
          teacherState.timer = 0.55;
        }
      } else if (teacherState.mode === 'opening_exit') {
        doorRequestsOut[activeTeacherSubj] = 1;
        teacherState.timer -= dt;
        if (teacherState.timer <= 0) {
          teacherRig.root.visible = true;
          teacherBubbleSprite.visible = true;
          setTeacherLine(teacherState.rushToNewActive ? 2 : 1);
          teacherBubbleTimer = 4.2;
          teacherState.yaw = Math.atan2(teacherDoor.x - teacherState.x, teacherDoor.z - teacherState.z);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherState.mode = 'exiting';
        }
      } else if (teacherState.mode === 'exiting') {
        doorRequestsOut[activeTeacherSubj] = 1;
        const dx = teacherDoor.x - teacherState.x;
        const dz = teacherDoor.z - teacherState.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.28) {
          teacherState.x = teacherDoor.x;
          teacherState.z = teacherDoor.z;
          if (teacherState.rushToNewActive) {
            teacherState.rushToNewActive = false;
            teacherState.targetSubject = activeSubject;
            teacherState.mode = 'walking_to_spot';
          } else {
            teacherState.strollStepsLeft = 1 + Math.floor(Math.random() * 2);
            pickTeacherStrollPoint();
            teacherState.mode = 'strolling';
          }
        } else {
          const step = Math.min(dist, teacherState.speed * 0.84 * dt);
          teacherState.x += (dx / dist) * step;
          teacherState.z += (dz / dist) * step;
          teacherState.yaw = smoothTurn(teacherState.yaw, Math.atan2(dx, dz), dt, 8.5);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherRig.updateAnimation(dt, 0.56, false, 0);
          teacherRig.rightArmPivot.rotation.x = -0.25 + teacherRig.rightArmPivot.rotation.x * 0.35;
        }
      } else if (teacherState.mode === 'strolling') {
        const dx = teacherState.strollX - teacherState.x;
        const dz = teacherState.strollZ - teacherState.z;
        const dist = Math.hypot(dx, dz);

        if (dist < 0.35) {
          teacherState.strollStepsLeft -= 1;
          if (teacherState.strollStepsLeft > 0) {
            pickTeacherStrollPoint();
          } else {
            teacherState.targetSubject = activeSubject;
            teacherState.mode = 'walking_to_spot';
          }
        } else if (distToPlayer <= GREETING_TRIGGER_DIST) {
          teacherState.yaw = smoothTurn(teacherState.yaw, yawToPlayer, dt, 7.5);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherRig.updateAnimation(dt, 0, false, 0);
        } else {
          const step = Math.min(dist, teacherState.speed * 0.92 * dt);
          teacherState.x += (dx / dist) * step;
          teacherState.z += (dz / dist) * step;
          teacherState.yaw = smoothTurn(teacherState.yaw, Math.atan2(dx, dz), dt, 6.5);
          teacherRig.root.position.set(teacherState.x, 0, teacherState.z);
          teacherRig.root.rotation.y = teacherState.yaw;
          teacherRig.updateAnimation(dt, 0.56, false, 0);
          teacherRig.rightArmPivot.rotation.x = -0.25 + teacherRig.rightArmPivot.rotation.x * 0.35;
        }
      }

      if (teacherRig.root.visible) {
        // Only cycle generic teacher lines when NOT displaying a greeting/reaction bubble
        if (ethicsState.phase === 'idle') {
          teacherBubbleTimer -= dt;
          if (teacherBubbleTimer <= 0) {
            setTeacherLine(teacherLineIdx + 1);
            teacherBubbleTimer = 3.8 + Math.random() * 1.4;
          }
        }
        teacherBubbleSprite.position.y = 3.88 + Math.sin(elapsed * 2.8) * 0.05;
        if (teacherReactionBadge.visible) {
          teacherReactionBadge.position.y = 4.94 + Math.sin(elapsed * 4.8) * 0.09;
        }
      }
    };

    npcUpdateRef.current = updateNpcs;

    return () => {
      clearGreetingPrompt();
      npcUpdateRef.current = null;
      npcGroupRef.current = null;
      scene.remove(npcGroup);
      rigs.forEach((r) => r.dispose());
      extraMaterials.forEach((m) => m.dispose());
      extraTextures.forEach((t) => t.dispose());
    };
  }, [scene, castShadow, npcUpdateRef]);

  return null;
};
