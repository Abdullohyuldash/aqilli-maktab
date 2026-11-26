import * as THREE from 'three';
import { FloorNumber, SubjectId, TrashKind } from '../types';
import { SchoolWorldHandle, ColliderBox, TrashBinHandle, ActiveFloorTrash } from './schoolWorld';

export interface GymWorldHandle extends SchoolWorldHandle {
  exitZone: { x: number; z: number; radius: number };
}

export function buildGymWorld(
  maxAnisotropy: number,
  castShadow: boolean
): GymWorldHandle {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // Gym Room Bounds: 34 x 26 units (X: -17 to 17, Z: -13 to 13)
  const W = 34;
  const D = 26;
  const H = 7.5;

  // Floor: Polished wooden gym floor (warm amber wood tone 0xD99B52)
  const floorMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xD99B52,
      roughness: 0.28,
      metalness: 0.1,
    })
  );
  const floorMesh = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(W, D)), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = castShadow;
  group.add(floorMesh);

  // Painted basketball court lines & center circle
  const lineMat = trackMat(
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
  );
  // Center circle
  const ringGeo = trackGeo(new THREE.RingGeometry(2.8, 3.0, 32));
  const ringMesh = new THREE.Mesh(ringGeo, lineMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.01;
  group.add(ringMesh);

  // Center line
  const centerLine = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.15, 0.02, D - 2)), lineMat);
  centerLine.position.set(0, 0.01, 0);
  group.add(centerLine);

  // Walls (Light sky blue / gym wall 0xF0F9FF)
  const wallMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xE0F2FE, roughness: 0.6 })
  );
  // North wall
  const northWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W, H, 0.6)), wallMat);
  northWall.position.set(0, H / 2, -D / 2);
  northWall.castShadow = castShadow;
  group.add(northWall);

  // South wall with exit door opening at center (X=0, Z=D/2)
  const southWallLeft = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W / 2 - 2, H, 0.6)), wallMat);
  southWallLeft.position.set(-(W / 4 + 1), H / 2, D / 2);
  southWallLeft.castShadow = castShadow;
  group.add(southWallLeft);

  const southWallRight = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(W / 2 - 2, H, 0.6)), wallMat);
  southWallRight.position.set(W / 4 + 1, H / 2, D / 2);
  southWallRight.castShadow = castShadow;
  group.add(southWallRight);

  // East and West walls
  const westWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.6, H, D)), wallMat);
  westWall.position.set(-W / 2, H / 2, 0);
  westWall.castShadow = castShadow;
  group.add(westWall);

  const eastWall = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.6, H, D)), wallMat);
  eastWall.position.set(W / 2, H / 2, 0);
  eastWall.castShadow = castShadow;
  group.add(eastWall);

  // Glowing Exit Door Portal at South Center (x: 0, z: 12.0)
  const doorMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x0284C7, emissive: 0x0284C7, emissiveIntensity: 0.6, roughness: 0.2 })
  );
  const exitDoor = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.2, 5.0, 0.4)), doorMat);
  exitDoor.position.set(0, 2.5, D / 2 - 0.2);
  group.add(exitDoor);

  // Sign above exit door: "MAKTABGA CHIQISH"
  const signMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3 })
  );
  const exitSign = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.0, 0.9, 0.2)), signMat);
  exitSign.position.set(0, 5.4, D / 2 - 0.3);
  group.add(exitSign);

  // 3D Sports Props:
  // 1. Blue gymnastics mats
  const matMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x1D4ED8, roughness: 0.4 })
  );
  [-10, 10].forEach((mx) => {
    const gymMat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5, 0.2, 7)), matMat);
    gymMat.position.set(mx, 0.1, -4);
    gymMat.receiveShadow = castShadow;
    group.add(gymMat);
  });

  // 2. Horizontal bar (turnik) at left
  const poleMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 }));
  const barMesh = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 4.2)), poleMat);
  barMesh.position.set(-13, 2.1, 4);
  barMesh.rotation.z = Math.PI / 2;
  group.add(barMesh);

  const leftPost = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 4.2)), poleMat);
  leftPost.position.set(-15, 2.1, 4);
  group.add(leftPost);

  const rightPost = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 4.2)), poleMat);
  rightPost.position.set(-11, 2.1, 4);
  group.add(rightPost);

  // 3. Swedish wall ladder against North wall
  const woodMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x92400E, roughness: 0.5 }));
  for (let lx = -6; lx <= -2; lx += 2) {
    const ladder = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.3, 5.5, 0.3)), woodMat);
    ladder.position.set(lx, 2.75, -D / 2 + 0.4);
    group.add(ladder);
  }
  for (let hy = 1; hy <= 5; hy += 0.9) {
    const rung = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.2, 0.15, 0.15)), woodMat);
    rung.position.set(-4, hy, -D / 2 + 0.4);
    group.add(rung);
  }

  // 4. Orange running cones & low hurdles
  const coneMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xF97316, roughness: 0.3 }));
  [-6, -2, 2, 6].forEach((cx) => {
    const cone = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.35, 1.1, 16)), coneMat);
    cone.position.set(cx, 0.55, 1);
    group.add(cone);
  });

  // 5. 3D Shashka table in corner
  const tableTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.2, 0.15, 2.2)), woodMat);
  tableTop.position.set(12, 1.1, -9);
  group.add(tableTop);

  const tableLeg = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.1, 0.1, 1.1)), poleMat);
  tableLeg.position.set(12, 0.55, -9);
  group.add(tableLeg);

  // 3D Ustoz Rustam & Classmates inside gym
  const teacherMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.5 }));
  const teacherBody = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 1.8)), teacherMat);
  teacherBody.position.set(-4, 0.9, -1);
  group.add(teacherBody);

  const teacherHead = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.32, 16, 16)), trackMat(new THREE.MeshStandardMaterial({ color: 0xFCE7F3 })));
  teacherHead.position.set(-4, 2.1, -1);
  group.add(teacherHead);

  const colliders: ColliderBox[] = [
    { minX: -W / 2, maxX: W / 2, minZ: -D / 2 - 0.5, maxZ: -D / 2 + 0.5 },
    { minX: -W / 2, maxX: -W / 2 + 0.5, minZ: -D / 2, maxZ: D / 2 },
    { minX: W / 2 - 0.5, maxX: W / 2, minZ: -D / 2, maxZ: D / 2 },
    { minX: -W / 2, maxX: -2, minZ: D / 2 - 0.5, maxZ: D / 2 + 0.5 },
    { minX: 2, maxX: W / 2, minZ: D / 2 - 0.5, maxZ: D / 2 + 0.5 },
  ];

  const bounds = {
    minX: -W / 2 + 1.2,
    maxX: W / 2 - 1.2,
    minZ: -D / 2 + 1.2,
    maxZ: D / 2 - 1.2,
  };

  return {
    floor: 2,
    group,
    bounds,
    colliders,
    trashBins: [],
    exitZone: { x: 0, z: D / 2 - 1.5, radius: 2.5 },
    getActiveTrash: () => null,
    spawnRandomTrash: () => ({ id: 't1', kind: 'paper', label: 'Chiqindi', x: 0, z: 0, lifetimeRemaining: 20, totalLifetime: 20 }),
    clearActiveTrash: () => {},
    updateWorld: () => {},
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
