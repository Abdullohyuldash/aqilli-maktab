import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  EmoteRequest,
  EquippedAccessories,
  FloorNumber,
  PlayerGender,
  SubjectId,
  TeacherGreetingPrompt,
  TrashKind,
  TrashPickupPrompt,
  VirtualControlsState,
  WorldZone,
  ZoneId,
} from '../types';
import { ELEVATOR_TRIGGER, getZonesForFloor } from '../data/curriculum';
import { createRobloxAvatar, RobloxAvatarRig } from '../three/avatar';
import { buildSchoolWorld, SchoolWorldHandle } from '../three/schoolWorld';
import { buildGymWorld, GymWorldHandle } from '../three/gymWorld';
import { soundEngine } from '../utils/sound';
import {
  NpcDoorRequests,
  NpcUpdateFn,
  SchoolNPCs,
  TeacherGreetingOutcome,
} from './SchoolNPCs';

export interface TrashOutcome {
  kind: 'deposited' | 'expired';
  trashId: string;
  trashLabel: string;
}

interface SchoolCanvas3DProps {
  currentFloor: FloorNumber;
  gender: PlayerGender;
  shirtColor: string;
  equipped: EquippedAccessories;
  activeSubject: SubjectId;
  inGym: boolean;
  isPaused: boolean;
  nudgeToken: number;
  elevatorTeleportToken: number;
  emoteRequest: EmoteRequest | null;
  greetTriggerToken: number;
  trashPickupToken: number;
  virtualControlsRef: React.MutableRefObject<VirtualControlsState>;
  onEnterZone: (zone: ZoneId) => void;
  onNearbyInactiveZone: (zone: ZoneId | null) => void;
  onNearbyComingSoon: (zone: WorldZone | null) => void;
  onTeacherGreetingPromptChange: (prompt: TeacherGreetingPrompt | null) => void;
  onTeacherGreetingOutcome: (outcome: TeacherGreetingOutcome) => void;
  onTrashPromptChange: (prompt: TrashPickupPrompt | null) => void;
  onTrashOutcome: (outcome: TrashOutcome) => void;
  onEmoteEnded?: () => void;
}

const _moveVec = new THREE.Vector3();
const _camForward = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _upAxis = new THREE.Vector3(0, 1, 0);
const _camLookAt = new THREE.Vector3();
const _prevLookAt = new THREE.Vector3();
const _deltaLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.85, 5.5);

const MIN_POLAR_ANGLE = THREE.MathUtils.degToRad(15);
const MAX_POLAR_ANGLE = THREE.MathUtils.degToRad(75);
const DEFAULT_PITCH = THREE.MathUtils.degToRad(29);
const MIN_ZOOM_DIST = 6;
const MAX_ZOOM_DIST = 16;
const DEFAULT_ZOOM_DIST = 10.8;

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const SchoolCanvas3D: React.FC<SchoolCanvas3DProps> = ({
  currentFloor,
  gender,
  shirtColor,
  equipped,
  activeSubject,
  inGym,
  isPaused,
  nudgeToken,
  elevatorTeleportToken,
  emoteRequest,
  greetTriggerToken,
  trashPickupToken,
  virtualControlsRef,
  onEnterZone,
  onNearbyInactiveZone,
  onNearbyComingSoon,
  onTeacherGreetingPromptChange,
  onTeacherGreetingOutcome,
  onTrashPromptChange,
  onTrashOutcome,
  onEmoteEnded,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [sceneHandle, setSceneHandle] = useState<{
    scene: THREE.Scene;
    castShadow: boolean;
    maxAnisotropy: number;
  } | null>(null);
  const npcUpdateRef = useRef<NpcUpdateFn | null>(null);

  // Refs synced with React props so WebGL canvas NEVER tears down on state or floor changes
  const currentFloorRef = useRef<FloorNumber>(currentFloor);
  const activeSubjectRef = useRef<SubjectId>(activeSubject);
  const isPausedRef = useRef<boolean>(isPaused);
  const genderRef = useRef<PlayerGender>(gender);
  const equippedRef = useRef<EquippedAccessories>(equipped);
  const trashPickupTokenRef = useRef<number>(trashPickupToken);
  const onEnterZoneRef = useRef(onEnterZone);
  const onNearbyRef = useRef(onNearbyInactiveZone);
  const onComingSoonRef = useRef(onNearbyComingSoon);
  const onTrashPromptChangeRef = useRef(onTrashPromptChange);
  const onTrashOutcomeRef = useRef(onTrashOutcome);
  const onEmoteEndedRef = useRef(onEmoteEnded);
  const avatarRef = useRef<RobloxAvatarRig | null>(null);
  const worldRef = useRef<SchoolWorldHandle | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 5.5));
  const facingYawRef = useRef<number>(Math.PI);
  const greetTargetPosRef = useRef<{ x: number; z: number } | null>(null);
  const zoneCooldownRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    currentFloorRef.current = currentFloor;
  }, [currentFloor]);

  useEffect(() => {
    activeSubjectRef.current = activeSubject;
  }, [activeSubject]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (controlsRef.current) {
      controlsRef.current.enabled = !isPaused;
    }
    if (isPaused) {
      keysRef.current = {};
    }
  }, [isPaused]);

  useEffect(() => {
    genderRef.current = gender;
    avatarRef.current?.setGender(gender);
  }, [gender]);

  useEffect(() => {
    equippedRef.current = equipped;
    avatarRef.current?.applyAccessories(equipped);
  }, [equipped]);

  useEffect(() => {
    avatarRef.current?.setShirtColor(shirtColor);
  }, [shirtColor]);

  useEffect(() => {
    trashPickupTokenRef.current = trashPickupToken;
  }, [trashPickupToken]);

  useEffect(() => {
    onEnterZoneRef.current = onEnterZone;
  }, [onEnterZone]);

  useEffect(() => {
    onNearbyRef.current = onNearbyInactiveZone;
  }, [onNearbyInactiveZone]);

  useEffect(() => {
    onComingSoonRef.current = onNearbyComingSoon;
  }, [onNearbyComingSoon]);

  useEffect(() => {
    onTrashPromptChangeRef.current = onTrashPromptChange;
  }, [onTrashPromptChange]);

  useEffect(() => {
    onTrashOutcomeRef.current = onTrashOutcome;
  }, [onTrashOutcome]);

  useEffect(() => {
    onEmoteEndedRef.current = onEmoteEnded;
  }, [onEmoteEnded]);

  useEffect(() => {
    if (!emoteRequest) return;
    avatarRef.current?.triggerEmote(emoteRequest.emote, emoteRequest.durationSec);
  }, [emoteRequest]);

  const inGymRef = useRef<boolean>(inGym);
  const gymHandleRef = useRef<GymWorldHandle | null>(null);

  useEffect(() => {
    inGymRef.current = inGym;
  }, [inGym]);

  // Swap active world (school floor vs gymnasium)
  useEffect(() => {
    if (!sceneHandle) return;
    const { scene, castShadow, maxAnisotropy } = sceneHandle;

    if (worldRef.current) {
      scene.remove(worldRef.current.group);
      worldRef.current.dispose();
      worldRef.current = null;
      gymHandleRef.current = null;
    }

    if (inGym) {
      const gym = buildGymWorld(maxAnisotropy, castShadow);
      scene.add(gym.group);
      worldRef.current = gym;
      gymHandleRef.current = gym;

      const pos = playerPosRef.current;
      pos.set(0, 0, 8.0);
      facingYawRef.current = Math.PI;
      if (avatarRef.current) {
        avatarRef.current.root.position.copy(pos);
        avatarRef.current.root.rotation.y = facingYawRef.current;
      }
    } else {
      const nextWorld = buildSchoolWorld(currentFloor, maxAnisotropy, castShadow);
      scene.add(nextWorld.group);
      worldRef.current = nextWorld;

      const pos = playerPosRef.current;
      pos.set(-12.0, 0, 5.4);
      facingYawRef.current = -Math.PI / 2;
      if (avatarRef.current) {
        avatarRef.current.root.position.copy(pos);
        avatarRef.current.root.rotation.y = facingYawRef.current;
      }
    }
  }, [sceneHandle, inGym, currentFloor]);

  // Teleport player right in front of the Lift facing into the corridor when switching floors
  useEffect(() => {
    if (elevatorTeleportToken === 0) return;
    const pos = playerPosRef.current;
    pos.set(ELEVATOR_TRIGGER.spawnX, 0, ELEVATOR_TRIGGER.spawnZ);
    facingYawRef.current = 0; // Facing South (+Z) into the new floor corridor
    zoneCooldownRef.current = 1.25;

    if (avatarRef.current) {
      avatarRef.current.root.position.copy(pos);
      avatarRef.current.root.rotation.y = 0;
    }

    // Place OrbitControls behind the player (inside north wall) looking South (+Z) into the new floor corridor
    // so pressing W immediately walks forward out of the lift
    if (cameraRef.current) {
      _currentLookAt.set(pos.x, pos.y + 1.85, pos.z);
      const exitZoomDist = 6.6;
      const exitHoriz = exitZoomDist * Math.cos(DEFAULT_PITCH);
      cameraRef.current.position.set(
        _currentLookAt.x,
        _currentLookAt.y + exitZoomDist * Math.sin(DEFAULT_PITCH),
        _currentLookAt.z - exitHoriz
      );
      if (controlsRef.current) {
        controlsRef.current.target.copy(_currentLookAt);
        controlsRef.current.update();
      } else {
        cameraRef.current.lookAt(_currentLookAt);
      }
    }
  }, [elevatorTeleportToken]);

  // Nudge player gently back toward hall center when a modal closes so they don't re-trigger instantly
  useEffect(() => {
    if (nudgeToken === 0) return;
    const pos = playerPosRef.current;
    const toCenterX = 0 - pos.x;
    const toCenterZ = 1.5 - pos.z;
    const len = Math.hypot(toCenterX, toCenterZ);
    if (len > 0.1) {
      pos.x += (toCenterX / len) * 2.4;
      pos.z += (toCenterZ / len) * 2.4;
    }
    zoneCooldownRef.current = 1.15;
  }, [nudgeToken]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);

    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcbe5ff);
    scene.fog = new THREE.Fog(0xcbe5ff, 38, 78);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.42;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      54,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.1,
      140
    );
    const initPos = playerPosRef.current;
    _currentLookAt.set(initPos.x, initPos.y + 1.85, initPos.z);
    const initHoriz = DEFAULT_ZOOM_DIST * Math.cos(DEFAULT_PITCH);
    camera.position.set(
      _currentLookAt.x,
      _currentLookAt.y + DEFAULT_ZOOM_DIST * Math.sin(DEFAULT_PITCH),
      _currentLookAt.z + initHoriz
    );
    camera.lookAt(_currentLookAt);
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xfef3c7, 0.55);
    hemiLight.position.set(0, 24, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.05);
    sunLight.position.set(14, 24, 16);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 65;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.32);
    fillLight.position.set(-14, 12, -10);
    scene.add(fillLight);

    // Build initial active floor & player avatar
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const initialWorld = buildSchoolWorld(currentFloorRef.current, maxAnisotropy, !isSoftwareGl);
    scene.add(initialWorld.group);
    worldRef.current = initialWorld;

    const avatar = createRobloxAvatar(shirtColor, equippedRef.current, !isSoftwareGl, {
      gender: genderRef.current,
    });
    avatar.root.position.copy(playerPosRef.current);
    avatar.root.rotation.y = facingYawRef.current;
    scene.add(avatar.root);
    avatarRef.current = avatar;
    setSceneHandle({ scene, castShadow: !isSoftwareGl, maxAnisotropy });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isPausedRef.current) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const code = e.code;
      if (
        code === 'KeyW' ||
        code === 'KeyA' ||
        code === 'KeyS' ||
        code === 'KeyD' ||
        code === 'ArrowUp' ||
        code === 'ArrowDown' ||
        code === 'ArrowLeft' ||
        code === 'ArrowRight' ||
        code === 'Space'
      ) {
        e.preventDefault();
        keysRef.current[code] = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    const onBlur = () => {
      keysRef.current = {};
      renderer.domElement.style.cursor = 'grab';
    };

    // Official Three.js OrbitControls configured for Roblox-style 360° mouse/touch orbit & wheel zoom
    const canvasEl = renderer.domElement;
    const controls = new OrbitControls(camera, canvasEl);
    controls.target.copy(_currentLookAt);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 1.0;
    controls.minDistance = MIN_ZOOM_DIST;
    controls.maxDistance = MAX_ZOOM_DIST;
    controls.minPolarAngle = MIN_POLAR_ANGLE;
    controls.maxPolarAngle = MAX_POLAR_ANGLE;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_ROTATE,
    };
    controls.enabled = !isPausedRef.current;
    controls.update();
    controlsRef.current = controls;

    const onControlStart = () => {
      canvasEl.style.cursor = 'grabbing';
    };
    const onControlEnd = () => {
      canvasEl.style.cursor = 'grab';
    };
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    controls.addEventListener('start', onControlStart);
    controls.addEventListener('end', onControlEnd);
    canvasEl.addEventListener('contextmenu', onContextMenu);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let verticalVel = 0;
    let isGrounded = true;
    let stepSoundTimer = 0;
    let lastNearbyInactive: ZoneId | null = null;
    let lastComingSoonId: ZoneId | null = null;
    let jumpLatch = false;
    let wasEmoteActive = false;

    const MOVE_SPEED = 8.4;
    const GRAVITY = -26.0;
    const PLAYER_RADIUS = 0.55;

    let lastTime = performance.now();
    let elapsed = 0;
    let frameId = 0;
    let disposed = false;
    const npcDoorRequests: NpcDoorRequests = {};

    // 2-Stage Single-Trash Cleanliness Cycle (Spawn 1 -> 20s lifetime -> Pick up -> Carry to Bin 1.8m -> 35-45s respawn)
    const TRASH_PICKUP_DIST = 2.0;
    const TRASH_BIN_DROP_DIST = 1.8;
    const TRASH_LIFETIME_SEC = 20.0;
    const TRASH_INITIAL_DELAY_SEC = 4.0;
    const TRASH_RESPAWN_MIN_SEC = 35.0;
    const TRASH_RESPAWN_MAX_SEC = 45.0;

    const trashCycle: {
      phase: 'cooldown' | 'on_floor' | 'holding';
      activeFloor: FloorNumber;
      respawnTimer: number;
      heldTrash: { id: string; kind: TrashKind; label: string } | null;
      lastHandledToken: number;
      lastPromptSig: string;
    } = {
      phase: 'cooldown',
      activeFloor: currentFloorRef.current,
      respawnTimer: TRASH_INITIAL_DELAY_SEC,
      heldTrash: null,
      lastHandledToken: trashPickupTokenRef.current,
      lastPromptSig: '',
    };

    const emitTrashPrompt = (next: TrashPickupPrompt | null) => {
      const sig = next
        ? `${next.mode}:${next.trashId}:${Math.ceil(next.timeRemainingSec * 5)}`
        : 'none';
      if (sig !== trashCycle.lastPromptSig) {
        trashCycle.lastPromptSig = sig;
        onTrashPromptChangeRef.current(next);
      }
    };

    const clearTrashPrompt = () => {
      emitTrashPrompt(null);
    };

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    const tick = () => {
      if (disposed) return;

      const now = performance.now();
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.08);
      elapsed += dt;

      const pos = playerPosRef.current;
      const activeWorld = worldRef.current;

      // Apply OrbitControls rotation/zoom/damping FIRST so camera-relative WASD uses the exact current frame's orientation
      if (!isPausedRef.current) {
        controls.update();
      }

      if (!isPausedRef.current && activeWorld) {
        if (zoneCooldownRef.current > 0) {
          zoneCooldownRef.current = Math.max(0, zoneCooldownRef.current - dt);
        }

        const keys = keysRef.current;
        const vCtrl = virtualControlsRef.current;

        const moveForward =
          (keys['KeyW'] || keys['ArrowUp'] || vCtrl.up ? 1 : 0) -
          (keys['KeyS'] || keys['ArrowDown'] || vCtrl.down ? 1 : 0);
        const moveRight =
          (keys['KeyD'] || keys['ArrowRight'] || vCtrl.right ? 1 : 0) -
          (keys['KeyA'] || keys['ArrowLeft'] || vCtrl.left ? 1 : 0);

        // Camera-relative horizontal basis vectors:
        // W always moves forward along the camera's gaze projected onto the XZ floor plane,
        // D moves to the camera's right (forward × up), A to the left, S backward.
        camera.getWorldDirection(_camForward);
        _camForward.y = 0;
        if (_camForward.lengthSq() > 0.0001) {
          _camForward.normalize();
        } else {
          _camForward.set(0, 0, -1);
        }
        _camRight.crossVectors(_camForward, _upAxis).normalize();

        _moveVec
          .set(0, 0, 0)
          .addScaledVector(_camForward, moveForward)
          .addScaledVector(_camRight, moveRight);
        const moving = _moveVec.lengthSq() > 0.001;

        if (moving) {
          _moveVec.normalize();
          pos.x += _moveVec.x * MOVE_SPEED * dt;
          pos.z += _moveVec.z * MOVE_SPEED * dt;

          const targetYaw = Math.atan2(_moveVec.x, _moveVec.z);
          let angleDiff = targetYaw - facingYawRef.current;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          facingYawRef.current += angleDiff * (1 - Math.exp(-14 * dt));

          if (isGrounded) {
            stepSoundTimer -= dt;
            if (stepSoundTimer <= 0) {
              soundEngine.playStep();
              stepSoundTimer = 0.34;
            }
          }
        } else {
          stepSoundTimer = 0.08;
          // Gently orient avatar toward Ustoz when greeting them, otherwise toward camera during polite emotes
          if (isGrounded && avatar.isEmoteActive()) {
            const greetTarget = greetTargetPosRef.current;
            const desiredYaw = greetTarget
              ? Math.atan2(greetTarget.x - pos.x, greetTarget.z - pos.z)
              : Math.atan2(-_camForward.x, -_camForward.z);
            let angleDiff = desiredYaw - facingYawRef.current;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            facingYawRef.current += angleDiff * (1 - Math.exp(-9 * dt));
          }
        }

        const wantJump = Boolean(keys['Space'] || vCtrl.jump);
        if (wantJump && isGrounded && !jumpLatch) {
          verticalVel = 9.4;
          isGrounded = false;
          jumpLatch = true;
          soundEngine.playJump(false);
        } else if (!wantJump) {
          jumpLatch = false;
        }

        if (!isGrounded || pos.y > 0) {
          verticalVel += GRAVITY * dt;
          pos.y += verticalVel * dt;
          if (pos.y <= 0) {
            pos.y = 0;
            verticalVel = 0;
            isGrounded = true;
          }
        }

        // Clamp within current floor walls
        pos.x = THREE.MathUtils.clamp(pos.x, activeWorld.bounds.minX, activeWorld.bounds.maxX);
        pos.z = THREE.MathUtils.clamp(pos.z, activeWorld.bounds.minZ, activeWorld.bounds.maxZ);

        // Push out from current floor AABB colliders
        for (let i = 0; i < activeWorld.colliders.length; i++) {
          const box = activeWorld.colliders[i];
          const closestX = THREE.MathUtils.clamp(pos.x, box.minX, box.maxX);
          const closestZ = THREE.MathUtils.clamp(pos.z, box.minZ, box.maxZ);
          const dx = pos.x - closestX;
          const dz = pos.z - closestZ;
          const distSq = dx * dx + dz * dz;
          if (distSq < PLAYER_RADIUS * PLAYER_RADIUS) {
            const dist = Math.sqrt(distSq);
            if (dist > 0.0001) {
              const overlap = PLAYER_RADIUS - dist;
              pos.x += (dx / dist) * overlap;
              pos.z += (dz / dist) * overlap;
            } else {
              pos.z = box.maxZ + PLAYER_RADIUS;
            }
          }
        }

        avatar.root.position.copy(pos);
        avatar.root.rotation.y = facingYawRef.current;
        avatar.updateAnimation(dt, moving ? 1 : 0, !isGrounded, pos.y);

        // Check interactive zones on CURRENT FLOOR ONLY
        if (inGymRef.current && gymHandleRef.current) {
          const ez = gymHandleRef.current.exitZone;
          const dist = Math.hypot(pos.x - ez.x, pos.z - ez.z);
          if (dist <= ez.radius && zoneCooldownRef.current <= 0) {
            zoneCooldownRef.current = 1.4;
            onEnterZoneRef.current('exit_gym');
          }
        }

        const floorZones = getZonesForFloor(currentFloorRef.current);
        let foundComingSoon: WorldZone | null = null;

        if (zoneCooldownRef.current <= 0) {
          let foundInactive: ZoneId | null = null;
          for (let i = 0; i < floorZones.length; i++) {
            const z = floorZones[i];
            const dist = Math.hypot(pos.x - z.triggerX, pos.z - z.triggerZ);
            if (dist <= z.triggerRadius) {
              if (z.comingSoon) {
                foundComingSoon = z;
              } else if (
                z.id === 'elevator' ||
                z.id === 'shop' ||
                z.id === 'schedule' ||
                z.id === activeSubjectRef.current
              ) {
                zoneCooldownRef.current = 1.4;
                if (lastNearbyInactive !== null) {
                  lastNearbyInactive = null;
                  onNearbyRef.current(null);
                }
                if (lastComingSoonId !== null) {
                  lastComingSoonId = null;
                  onComingSoonRef.current(null);
                }
                onEnterZoneRef.current(z.id);
                foundInactive = null;
                foundComingSoon = null;
                break;
              } else {
                foundInactive = z.id;
              }
            }
          }

          if (foundInactive !== lastNearbyInactive) {
            lastNearbyInactive = foundInactive;
            onNearbyRef.current(foundInactive);
          }
          const nextCsId = foundComingSoon?.id ?? null;
          if (nextCsId !== lastComingSoonId) {
            lastComingSoonId = nextCsId;
            onComingSoonRef.current(foundComingSoon);
          }
        }

        // 2-Stage Single-Trash Cleanliness Cycle
        if (trashCycle.activeFloor !== activeWorld.floor) {
          trashCycle.activeFloor = activeWorld.floor;
          if (trashCycle.phase === 'on_floor') {
            trashCycle.phase = 'cooldown';
            trashCycle.respawnTimer = 4.0;
            clearTrashPrompt();
          }
          trashCycle.lastHandledToken = trashPickupTokenRef.current;
        }

        if (trashCycle.phase === 'cooldown') {
          trashCycle.lastHandledToken = trashPickupTokenRef.current;
          clearTrashPrompt();
          trashCycle.respawnTimer -= dt;
          if (trashCycle.respawnTimer <= 0) {
            activeWorld.spawnRandomTrash(pos);
            trashCycle.phase = 'on_floor';
          }
        } else if (trashCycle.phase === 'on_floor') {
          const activeTrash = activeWorld.getActiveTrash();
          if (!activeTrash) {
            trashCycle.phase = 'cooldown';
            trashCycle.respawnTimer =
              TRASH_RESPAWN_MIN_SEC +
              Math.random() * (TRASH_RESPAWN_MAX_SEC - TRASH_RESPAWN_MIN_SEC);
            clearTrashPrompt();
          } else {
            activeTrash.lifetimeRemaining -= dt;
            const distToTrash = Math.hypot(pos.x - activeTrash.x, pos.z - activeTrash.z);
            const pickupTriggered = trashPickupTokenRef.current !== trashCycle.lastHandledToken;

            if (pickupTriggered) {
              trashCycle.lastHandledToken = trashPickupTokenRef.current;
              if (distToTrash <= TRASH_PICKUP_DIST + 0.35) {
                const picked = {
                  id: activeTrash.id,
                  kind: activeTrash.kind,
                  label: activeTrash.label,
                };
                activeWorld.clearActiveTrash();
                trashCycle.phase = 'holding';
                trashCycle.heldTrash = picked;
                avatar.setHeldTrash(picked.kind);
                soundEngine.playEquip();
                emitTrashPrompt({
                  mode: 'carrying',
                  trashId: picked.id,
                  trashKind: picked.kind,
                  trashLabel: picked.label,
                  timeRemainingSec: 0,
                  totalTimeSec: TRASH_LIFETIME_SEC,
                });
              }
            } else if (activeTrash.lifetimeRemaining <= 0) {
              const expiredId = activeTrash.id;
              const expiredLabel = activeTrash.label;
              activeWorld.clearActiveTrash();
              trashCycle.phase = 'cooldown';
              trashCycle.respawnTimer =
                TRASH_RESPAWN_MIN_SEC +
                Math.random() * (TRASH_RESPAWN_MAX_SEC - TRASH_RESPAWN_MIN_SEC);
              clearTrashPrompt();
              onTrashOutcomeRef.current({
                kind: 'expired',
                trashId: expiredId,
                trashLabel: expiredLabel,
              });
            } else if (distToTrash <= TRASH_PICKUP_DIST) {
              emitTrashPrompt({
                mode: 'pickup',
                trashId: activeTrash.id,
                trashKind: activeTrash.kind,
                trashLabel: activeTrash.label,
                timeRemainingSec: Math.max(0, activeTrash.lifetimeRemaining),
                totalTimeSec: activeTrash.totalLifetime,
              });
            } else {
              clearTrashPrompt();
            }
          }
        } else if (trashCycle.phase === 'holding') {
          const held = trashCycle.heldTrash;
          if (!held) {
            trashCycle.phase = 'cooldown';
            trashCycle.respawnTimer =
              TRASH_RESPAWN_MIN_SEC +
              Math.random() * (TRASH_RESPAWN_MAX_SEC - TRASH_RESPAWN_MIN_SEC);
            avatar.setHeldTrash(null);
            clearTrashPrompt();
          } else {
            let minBinDist = Infinity;
            for (let i = 0; i < activeWorld.trashBins.length; i++) {
              const bin = activeWorld.trashBins[i];
              const d = Math.hypot(pos.x - bin.x, pos.z - bin.z);
              if (d < minBinDist) minBinDist = d;
            }
            const nearBin = minBinDist <= TRASH_BIN_DROP_DIST;
            const dropTriggered = trashPickupTokenRef.current !== trashCycle.lastHandledToken;

            if (dropTriggered) {
              trashCycle.lastHandledToken = trashPickupTokenRef.current;
              if (nearBin) {
                trashCycle.heldTrash = null;
                trashCycle.phase = 'cooldown';
                trashCycle.respawnTimer =
                  TRASH_RESPAWN_MIN_SEC +
                  Math.random() * (TRASH_RESPAWN_MAX_SEC - TRASH_RESPAWN_MIN_SEC);
                avatar.setHeldTrash(null);
                clearTrashPrompt();
                onTrashOutcomeRef.current({
                  kind: 'deposited',
                  trashId: held.id,
                  trashLabel: held.label,
                });
              }
            } else {
              emitTrashPrompt({
                mode: nearBin ? 'dropoff' : 'carrying',
                trashId: held.id,
                trashKind: held.kind,
                trashLabel: held.label,
                timeRemainingSec: 0,
                totalTimeSec: TRASH_LIFETIME_SEC,
              });
            }
          }
        }

        npcUpdateRef.current?.(dt, elapsed, activeSubjectRef.current, pos, npcDoorRequests);
      } else {
        avatar.updateAnimation(dt, 0, false, pos.y);
      }

      const nowEmoteActive = avatar.isEmoteActive();
      if (wasEmoteActive && !nowEmoteActive) {
        greetTargetPosRef.current = null;
        onEmoteEndedRef.current?.();
      }
      wasEmoteActive = nowEmoteActive;

      if (activeWorld) {
        activeWorld.updateWorld(
          dt,
          elapsed,
          activeSubjectRef.current,
          pos,
          npcDoorRequests,
          trashCycle.phase === 'holding'
        );
      }

      // Smoothly follow moving player avatar by translating camera + OrbitControls target together
      _prevLookAt.copy(_currentLookAt);
      _camLookAt.set(pos.x, pos.y + 1.85, pos.z);
      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _camLookAt.x, 10, dt);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _camLookAt.y, 10, dt);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _camLookAt.z, 10, dt);
      _deltaLookAt.subVectors(_currentLookAt, _prevLookAt);

      camera.position.add(_deltaLookAt);
      controls.target.copy(_currentLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      clearTrashPrompt();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('end', onControlEnd);
      controls.dispose();
      controlsRef.current = null;
      canvasEl.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      avatar.dispose();
      if (worldRef.current) {
        scene.remove(worldRef.current.group);
        worldRef.current.dispose();
        worldRef.current = null;
      }
      envTarget.dispose();
      renderer.dispose();
      avatarRef.current = null;
      cameraRef.current = null;
      setSceneHandle(null);
    };
  }, [virtualControlsRef]);

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-sky-100 text-slate-800 p-6">
        <div className="max-w-md bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
          <h2 className="text-xl font-bold mb-2">3D Grafika yuklanmadi</h2>
          <p className="text-sm text-slate-600">
            Brauzeringizda WebGL qo‘llab-quvvatlanmayapti. Iltimos, zamonaviy brauzerda qayta urinib ko‘ring.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-sky-100" />
      <SchoolNPCs
        scene={sceneHandle?.scene ?? null}
        castShadow={sceneHandle?.castShadow ?? false}
        currentFloor={currentFloor}
        npcUpdateRef={npcUpdateRef}
        greetTriggerToken={greetTriggerToken}
        onTeacherGreetingPromptChange={onTeacherGreetingPromptChange}
        onTeacherGreetingOutcome={(outcome) => {
          if (outcome.kind === 'reward') {
            greetTargetPosRef.current = { x: outcome.teacherX, z: outcome.teacherZ };
          }
          onTeacherGreetingOutcome(outcome);
        }}
      />
    </>
  );
};
