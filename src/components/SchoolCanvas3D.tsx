import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  EquippedAccessories,
  FloorNumber,
  PlayerGender,
  SubjectId,
  VirtualControlsState,
  WorldZone,
  ZoneId,
} from '../types';
import { ELEVATOR_TRIGGER, getZonesForFloor } from '../data/curriculum';
import { createRobloxAvatar, RobloxAvatarRig } from '../three/avatar';
import { buildSchoolWorld, SchoolWorldHandle } from '../three/schoolWorld';
import { soundEngine } from '../utils/sound';
import { NpcDoorRequests, NpcUpdateFn, SchoolNPCs } from './SchoolNPCs';

interface SchoolCanvas3DProps {
  currentFloor: FloorNumber;
  gender: PlayerGender;
  shirtColor: string;
  equipped: EquippedAccessories;
  activeSubject: SubjectId;
  isPaused: boolean;
  nudgeToken: number;
  elevatorTeleportToken: number;
  virtualControlsRef: React.MutableRefObject<VirtualControlsState>;
  onEnterZone: (zone: ZoneId) => void;
  onNearbyInactiveZone: (zone: ZoneId | null) => void;
  onNearbyComingSoon: (zone: WorldZone | null) => void;
}

const _moveVec = new THREE.Vector3();
const _camTargetPos = new THREE.Vector3();
const _camLookAt = new THREE.Vector3();
const _currentLookAt = new THREE.Vector3(0, 1.5, 4);

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
  isPaused,
  nudgeToken,
  elevatorTeleportToken,
  virtualControlsRef,
  onEnterZone,
  onNearbyInactiveZone,
  onNearbyComingSoon,
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
  const onEnterZoneRef = useRef(onEnterZone);
  const onNearbyRef = useRef(onNearbyInactiveZone);
  const onComingSoonRef = useRef(onNearbyComingSoon);
  const avatarRef = useRef<RobloxAvatarRig | null>(null);
  const worldRef = useRef<SchoolWorldHandle | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 5.5));
  const facingYawRef = useRef<number>(Math.PI);
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
    onEnterZoneRef.current = onEnterZone;
  }, [onEnterZone]);

  useEffect(() => {
    onNearbyRef.current = onNearbyInactiveZone;
  }, [onNearbyInactiveZone]);

  useEffect(() => {
    onComingSoonRef.current = onNearbyComingSoon;
  }, [onNearbyComingSoon]);

  // Swap ONLY the single active floor mesh group in Three.js for maximum FPS!
  useEffect(() => {
    if (!sceneHandle) return;
    const { scene, castShadow, maxAnisotropy } = sceneHandle;

    if (worldRef.current && worldRef.current.floor === currentFloor) {
      return;
    }

    if (worldRef.current) {
      scene.remove(worldRef.current.group);
      worldRef.current.dispose();
    }

    const nextWorld = buildSchoolWorld(currentFloor, maxAnisotropy, castShadow);
    scene.add(nextWorld.group);
    worldRef.current = nextWorld;
  }, [sceneHandle, currentFloor]);

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
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 6.9, pos.z + 9.6);
      _currentLookAt.set(0, 1.85, pos.z - 2.4);
      cameraRef.current.lookAt(_currentLookAt);
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
    camera.position.set(0, 7.2, 15.2);
    _currentLookAt.set(0, 1.8, 3.5);
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
    };

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

    const MOVE_SPEED = 8.4;
    const GRAVITY = -26.0;
    const PLAYER_RADIUS = 0.55;

    let lastTime = performance.now();
    let elapsed = 0;
    let frameId = 0;
    let disposed = false;
    const npcDoorRequests: NpcDoorRequests = {};

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

        _moveVec.set(moveRight, 0, -moveForward);
        const moving = _moveVec.lengthSq() > 0.001;

        if (moving) {
          _moveVec.normalize();
          pos.x += _moveVec.x * MOVE_SPEED * dt;
          pos.z += _moveVec.z * MOVE_SPEED * dt;

          const targetYaw = Math.atan2(_moveVec.x, _moveVec.z);
          let angleDiff = targetYaw - facingYawRef.current;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          facingYawRef.current += angleDiff * (1 - Math.exp(-13 * dt));

          if (isGrounded) {
            stepSoundTimer -= dt;
            if (stepSoundTimer <= 0) {
              soundEngine.playStep();
              stepSoundTimer = 0.34;
            }
          }
        } else {
          stepSoundTimer = 0.08;
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

        npcUpdateRef.current?.(dt, elapsed, activeSubjectRef.current, npcDoorRequests);
      } else {
        avatar.updateAnimation(dt, 0, false, pos.y);
      }

      if (activeWorld) {
        activeWorld.updateWorld(dt, elapsed, activeSubjectRef.current, pos, npcDoorRequests);
      }

      _camTargetPos.set(
        THREE.MathUtils.clamp(pos.x * 0.85, -11.2, 11.2),
        6.9 + pos.y * 0.35,
        THREE.MathUtils.clamp(pos.z + 9.6, -2.5, 20.5)
      );
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, 5.5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, 5.5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, 5.5, dt);

      _camLookAt.set(pos.x, 1.85 + pos.y * 0.45, pos.z - 2.4);
      _currentLookAt.x = THREE.MathUtils.damp(_currentLookAt.x, _camLookAt.x, 7.5, dt);
      _currentLookAt.y = THREE.MathUtils.damp(_currentLookAt.y, _camLookAt.y, 7.5, dt);
      _currentLookAt.z = THREE.MathUtils.damp(_currentLookAt.z, _camLookAt.z, 7.5, dt);
      camera.lookAt(_currentLookAt);

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
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
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
      />
    </>
  );
};
