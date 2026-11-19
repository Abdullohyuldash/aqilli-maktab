import * as THREE from 'three';
import { EquippedAccessories, PlayerGender } from '../types';
import { createContactShadowTexture } from './textures';

export interface RobloxAvatarRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  headGroup: THREE.Group;
  leftArmPivot: THREE.Group;
  rightArmPivot: THREE.Group;
  leftLegPivot: THREE.Group;
  rightLegPivot: THREE.Group;
  shadowDisc: THREE.Mesh;
  shirtMaterials: THREE.MeshStandardMaterial[];
  accessories: {
    whiteShirtTie: THREE.Group;
    schoolVest: THREE.Group;
    formalBlazer: THREE.Group;
    girlBlouseSkirt: THREE.Group;
    girlVestSkirt: THREE.Group;
    girlApronUniform: THREE.Group;
    chustDoppi: THREE.Group;
    girlWhiteBows: THREE.Group;
    iroqiDoppi: THREE.Group;
    scholarCap: THREE.Group;
    basicBackpack: THREE.Group;
    classicSatchel: THREE.Group;
    goldBackpack: THREE.Group;
    schoolWatch: THREE.Group;
    honorMedal: THREE.Group;
    scholarBook: THREE.Group;
  };
  setShirtColor: (hex: string) => void;
  setGender: (gender: PlayerGender) => void;
  applyAccessories: (equipped: EquippedAccessories) => void;
  updateAnimation: (dt: number, speedRatio: number, isAirborne: boolean, yHeight: number) => void;
  dispose: () => void;
}

export interface AvatarStyleOptions {
  gender?: PlayerGender;
  variant?: 'student' | 'teacher';
  hairColor?: string;
  ribbonColor?: string;
}

export function createRobloxAvatar(
  initialShirtColor: string,
  initialEquipped: EquippedAccessories,
  castShadow = true,
  options: AvatarStyleOptions = {}
): RobloxAvatarRig {
  let currentGender: PlayerGender = options.gender ?? 'boy';
  const variant = options.variant ?? 'student';
  const isTeacher = variant === 'teacher';

  let baseShirtHex = initialShirtColor;
  let currentEquipped: EquippedAccessories = { ...initialEquipped };

  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  // Teacher stands 18% taller than students for clear visual hierarchy
  if (isTeacher) {
    root.scale.set(1.14, 1.18, 1.14);
  }

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

  // Shared PBR Materials with varied roughness/metalness for tactile Roblox brick feel
  const skinMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xfcd2a2, roughness: 0.55, metalness: 0.02 })
  );
  const hairMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(options.hairColor ?? (currentGender === 'girl' ? '#3B2314' : '#2C221E')),
      roughness: 0.78,
      metalness: 0.05,
    })
  );
  const shirtMat = trackMat(
    new THREE.MeshStandardMaterial({ color: new THREE.Color(initialShirtColor), roughness: 0.48, metalness: 0.06 })
  );
  const sleeveMat = trackMat(
    new THREE.MeshStandardMaterial({ color: new THREE.Color(initialShirtColor), roughness: 0.52, metalness: 0.04 })
  );
  const collarMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0.04 })
  );
  const pantsMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: isTeacher ? 0x0f172a : currentGender === 'girl' ? 0xf8fafc : 0x1e3a5f,
      roughness: 0.72,
      metalness: 0.04,
    })
  );
  const skirtMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialShirtColor).lerp(new THREE.Color('#0F172A'), 0.14),
      roughness: 0.52,
      metalness: 0.04,
    })
  );
  const waistTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(options.ribbonColor ?? '#FDE047'),
      roughness: 0.4,
      metalness: 0.08,
    })
  );
  const shoeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: currentGender === 'girl' ? 0x334155 : 0x1e293b,
      roughness: 0.4,
      metalness: 0.1,
    })
  );
  const soleMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6, metalness: 0.02 })
  );
  const eyeWhiteMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 })
  );
  const darkFeatureMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.1 })
  );
  const smileMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.4, metalness: 0.02 })
  );

  // Reusable accent PBR materials for national & school accessories
  const goldMetalMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.18, metalness: 0.88 })
  );
  const goldDeepMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.28, metalness: 0.8 })
  );
  const silverMetalMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.22, metalness: 0.85 })
  );
  const navyClothMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.56, metalness: 0.04 })
  );
  const blazerDarkMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.48, metalness: 0.08 })
  );
  const crimsonClothMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.44, metalness: 0.06 })
  );
  const crispWhiteMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.42, metalness: 0.02 })
  );

  const enableShadows = (mesh: THREE.Mesh) => {
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    return mesh;
  };

  // --- LEGS (Bottom-center grounded at y = 0) ---
  const makeLeg = (xOffset: number): THREE.Group => {
    const pivot = new THREE.Group();
    pivot.position.set(xOffset, 0.92, 0);

    const upperLeg = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.38, 0.74, 0.42)), pantsMat));
    upperLeg.position.y = -0.37;
    pivot.add(upperLeg);

    const shoe = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.4, 0.14, 0.5)), shoeMat));
    shoe.position.set(0, -0.79, 0.04);
    pivot.add(shoe);

    const sole = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.42, 0.06, 0.52)), soleMat));
    sole.position.set(0, -0.89, 0.04);
    pivot.add(sole);

    bodyGroup.add(pivot);
    return pivot;
  };

  const leftLegPivot = makeLeg(-0.22);
  const rightLegPivot = makeLeg(0.22);

  // --- TORSO (y from 0.92 to 1.88, center at 1.40) ---
  const torso = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.86, 0.96, 0.48)), shirtMat));
  torso.position.y = 1.4;
  bodyGroup.add(torso);

  const collar = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.48, 0.1, 0.51)), collarMat));
  collar.position.set(0, 1.84, 0.01);
  bodyGroup.add(collar);

  // Dynamic Gender Waist/Lower-Body Groups (allows live boy <-> girl switching!)
  const boyLowerGroup = new THREE.Group();
  {
    const belt = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.88, 0.11, 0.5)), darkFeatureMat));
    belt.position.set(0, 0.97, 0);
    boyLowerGroup.add(belt);

    const beltBuckle = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.18, 0.12, 0.06)), goldMetalMat));
    beltBuckle.position.set(0, 0.97, 0.25);
    boyLowerGroup.add(beltBuckle);
  }
  bodyGroup.add(boyLowerGroup);

  const girlLowerGroup = new THREE.Group();
  {
    const waistRibbon = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.9, 0.11, 0.52)), waistTrimMat));
    waistRibbon.position.set(0, 0.98, 0);
    girlLowerGroup.add(waistRibbon);

    // 4-sided blocky flared trapezoid school skirt
    const skirtGeo = trackGeo(new THREE.CylinderGeometry(0.56, 0.76, 0.5, 4));
    const skirt = enableShadows(new THREE.Mesh(skirtGeo, skirtMat));
    skirt.rotation.y = Math.PI / 4;
    skirt.scale.set(1.06, 1, 0.68);
    skirt.position.set(0, 0.73, 0);
    girlLowerGroup.add(skirt);
  }
  bodyGroup.add(girlLowerGroup);

  // Formal Teacher white shirt V-front & crimson tie
  if (isTeacher) {
    const whiteShirtFront = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.72, 0.04)), collarMat);
    whiteShirtFront.position.set(0, 1.46, 0.245);
    bodyGroup.add(whiteShirtFront);

    const tieKnot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.12, 0.11, 0.06)), crimsonClothMat);
    tieKnot.position.set(0, 1.74, 0.26);
    bodyGroup.add(tieKnot);

    const tieBlade = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.5, 0.055)), crimsonClothMat);
    tieBlade.position.set(0, 1.44, 0.26);
    bodyGroup.add(tieBlade);
  }

  // --- ARMS (Shoulder pivot at y = 1.80) ---
  const makeArm = (xOffset: number): { pivot: THREE.Group; cuff: THREE.Mesh } => {
    const pivot = new THREE.Group();
    pivot.position.set(xOffset, 1.8, 0);

    const sleeve = enableShadows(
      new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, isTeacher ? 0.62 : 0.46, 0.36)), sleeveMat)
    );
    sleeve.position.y = isTeacher ? -0.3 : -0.22;
    pivot.add(sleeve);

    // Optional long-sleeve extension for formal outfits
    const cuff = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.31, 0.22, 0.35)), sleeveMat));
    cuff.position.y = -0.54;
    cuff.visible = false;
    pivot.add(cuff);

    const forearm = enableShadows(
      new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.28, isTeacher ? 0.28 : 0.42, 0.32)), skinMat)
    );
    forearm.position.y = isTeacher ? -0.71 : -0.64;
    pivot.add(forearm);

    bodyGroup.add(pivot);
    return { pivot, cuff };
  };

  const leftArm = makeArm(-0.61);
  const rightArm = makeArm(0.61);
  const leftArmPivot = leftArm.pivot;
  const rightArmPivot = rightArm.pivot;

  // Small 3D Teacher Journal / Book carried in the right hand
  if (isTeacher) {
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0.02, -0.84, 0.24);
    bookGroup.rotation.x = 0.25;
    bookGroup.rotation.z = -0.1;

    const coverMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.55, metalness: 0.08 }));
    const pagesMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xfefce8, roughness: 0.85, metalness: 0.0 }));

    const cover = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.44, 0.36)), coverMat));
    bookGroup.add(cover);

    const pages = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 0.4, 0.32)), pagesMat);
    pages.position.set(0, 0, 0.025);
    bookGroup.add(pages);

    const spineStripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.15, 0.06, 0.37)), goldMetalMat);
    spineStripe.position.set(0, 0.14, 0);
    bookGroup.add(spineStripe);

    rightArmPivot.add(bookGroup);
  }

  // --- HEAD (Center at y = 2.24) ---
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.9, 0);
  bodyGroup.add(headGroup);

  const neck = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.16, 0.18, 0.12, 12)), skinMat));
  neck.position.y = 0.04;
  headGroup.add(neck);

  const headCube = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.68, 0.66, 0.66)), skinMat));
  headCube.position.y = 0.39;
  headGroup.add(headCube);

  const hairTop = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.72, 0.18, 0.7)), hairMat));
  hairTop.position.set(0, 0.72, -0.01);
  headGroup.add(hairTop);

  // Boy hair group (short neat hair)
  const boyHairGroup = new THREE.Group();
  {
    const boyBack = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.72, 0.42, 0.18)), hairMat));
    boyBack.position.set(0, 0.5, -0.3);
    boyHairGroup.add(boyBack);

    const boyBangs = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.58, 0.12, 0.1)), hairMat));
    boyBangs.position.set(0.06, 0.64, 0.33);
    boyHairGroup.add(boyBangs);
  }
  headGroup.add(boyHairGroup);

  // Girl hair group (shoulder-length back hair, side framing locks, twin ponytails & default ribbons)
  const girlHairGroup = new THREE.Group();
  const girlDefaultBowsGroup = new THREE.Group();
  {
    const girlBack = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.72, 0.78, 0.18)), hairMat));
    girlBack.position.set(0, 0.34, -0.3);
    girlHairGroup.add(girlBack);

    const girlBangs = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.6, 0.12, 0.1)), hairMat));
    girlBangs.position.set(0, 0.64, 0.33);
    girlHairGroup.add(girlBangs);

    const defaultBowMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(options.ribbonColor ?? '#F43F5E'),
        roughness: 0.38,
        metalness: 0.08,
      })
    );

    [-1, 1].forEach((side) => {
      const sideLock = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.12, 0.64, 0.28)), hairMat));
      sideLock.position.set(side * 0.36, 0.34, -0.06);
      girlHairGroup.add(sideLock);

      const ponytail = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.16, 0.48, 0.16)), hairMat));
      ponytail.position.set(side * 0.44, 0.35, -0.18);
      ponytail.rotation.z = side * 0.16;
      girlHairGroup.add(ponytail);

      const smallBow = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.15, 0.09, 0.13)), defaultBowMat));
      smallBow.position.set(side * 0.42, 0.58, -0.16);
      girlDefaultBowsGroup.add(smallBow);
    });
    girlHairGroup.add(girlDefaultBowsGroup);
  }
  headGroup.add(girlHairGroup);

  const makeEye = (xOffset: number) => {
    const white = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.13, 0.14, 0.04)), eyeWhiteMat);
    white.position.set(xOffset, 0.44, 0.33);
    headGroup.add(white);

    const pupil = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.075, 0.09, 0.05)), darkFeatureMat);
    pupil.position.set(xOffset, 0.43, 0.34);
    headGroup.add(pupil);
  };
  makeEye(-0.15);
  makeEye(0.15);

  const smile = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.22, 0.055, 0.04)), smileMat);
  smile.position.set(0, 0.24, 0.33);
  headGroup.add(smile);

  if (isTeacher) {
    const rimMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.65 }));
    const clearLensMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xe0f2fe,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
      })
    );
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.44, 0.36);

    [-0.16, 0.16].forEach((gx) => {
      const lens = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.2, 0.14, 0.025)), clearLensMat);
      lens.position.set(gx, 0, 0);
      glassesGroup.add(lens);

      const topRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.23, 0.03, 0.035)), rimMat);
      topRim.position.set(gx, 0.07, 0);
      glassesGroup.add(topRim);

      const botRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.23, 0.025, 0.035)), rimMat);
      botRim.position.set(gx, -0.07, 0);
      glassesGroup.add(botRim);
    });

    const bridge = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.12, 0.03, 0.035)), rimMat);
    bridge.position.set(0, 0.02, 0);
    glassesGroup.add(bridge);

    headGroup.add(glassesGroup);
  }

  // =========================================================================
  // 16 GENDER-AWARE NATIONAL & SCHOOL-CULTURE 3D ACCESSORIES
  // =========================================================================

  // --- A1) BOY OUTFITS (outfit, gender === 'boy') ---

  // 1. Oq Ko'ylak va Galstuk (Boy)
  const whiteShirtTie = new THREE.Group();
  {
    [-0.14, 0.14].forEach((cx) => {
      const wing = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.22, 0.11, 0.06)), crispWhiteMat));
      wing.position.set(cx, 1.81, 0.25);
      wing.rotation.z = cx < 0 ? -0.22 : 0.22;
      whiteShirtTie.add(wing);
    });

    const tieKnot = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.13, 0.11, 0.06)), navyClothMat));
    tieKnot.position.set(0, 1.75, 0.26);
    whiteShirtTie.add(tieKnot);

    const tieBlade = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 0.48, 0.045)), navyClothMat));
    tieBlade.position.set(0, 1.47, 0.258);
    whiteShirtTie.add(tieBlade);

    const tieStripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.115, 0.055, 0.05)), crimsonClothMat);
    tieStripe.position.set(0, 1.54, 0.26);
    whiteShirtTie.add(tieStripe);

    const tieTip = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.075, 0.12, 4)), navyClothMat);
    tieTip.rotation.z = Math.PI;
    tieTip.rotation.y = Math.PI / 4;
    tieTip.scale.set(1, 1, 0.45);
    tieTip.position.set(0, 1.18, 0.258);
    whiteShirtTie.add(tieTip);

    const pocket = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.18, 0.18, 0.03)), silverMetalMat);
    pocket.position.set(0.24, 1.56, 0.245);
    whiteShirtTie.add(pocket);
  }
  bodyGroup.add(whiteShirtTie);

  // 2. Klassik Maktab Nimchasi (Boy)
  const schoolVest = new THREE.Group();
  {
    const vestLower = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.9, 0.5, 0.515)), navyClothMat));
    vestLower.position.set(0, 1.24, 0);
    schoolVest.add(vestLower);

    [-0.28, 0.28].forEach((vx) => {
      const panel = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 0.4, 0.515)), navyClothMat));
      panel.position.set(vx, 1.66, 0);
      schoolVest.add(panel);
    });

    const vestBack = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.9, 0.42, 0.24)), navyClothMat));
    vestBack.position.set(0, 1.66, -0.14);
    schoolVest.add(vestBack);

    const hemTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.91, 0.06, 0.525)), crispWhiteMat);
    hemTrim.position.set(0, 1.03, 0);
    schoolVest.add(hemTrim);

    const tieKnot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.12, 0.1, 0.055)), crimsonClothMat);
    tieKnot.position.set(0, 1.75, 0.255);
    schoolVest.add(tieKnot);

    const tieBlade = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.34, 0.045)), crimsonClothMat);
    tieBlade.position.set(0, 1.56, 0.253);
    schoolVest.add(tieBlade);

    const crest = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 12)), goldMetalMat);
    crest.rotation.x = Math.PI / 2;
    crest.position.set(0.26, 1.62, 0.265);
    schoolVest.add(crest);
  }
  bodyGroup.add(schoolVest);

  // 3. Bayramona Maktab Kostyumi (Boy)
  const formalBlazer = new THREE.Group();
  {
    const blazerShell = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.92, 0.88, 0.525)), blazerDarkMat));
    blazerShell.position.set(0, 1.4, -0.005);
    formalBlazer.add(blazerShell);

    const shirtFront = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.28, 0.54, 0.04)), crispWhiteMat);
    shirtFront.position.set(0, 1.58, 0.252);
    formalBlazer.add(shirtFront);

    const tieKnot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 0.1, 0.055)), crimsonClothMat);
    tieKnot.position.set(0, 1.76, 0.265);
    formalBlazer.add(tieKnot);

    const tieBlade = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.095, 0.36, 0.045)), crimsonClothMat);
    tieBlade.position.set(0, 1.55, 0.262);
    formalBlazer.add(tieBlade);

    [-0.18, 0.18].forEach((lx) => {
      const lapel = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.44, 0.05)), navyClothMat));
      lapel.position.set(lx, 1.62, 0.258);
      lapel.rotation.z = lx < 0 ? 0.16 : -0.16;
      formalBlazer.add(lapel);
    });

    [
      [-0.11, 1.28],
      [0.11, 1.28],
      [-0.11, 1.12],
      [0.11, 1.12],
    ].forEach(([bx, by]) => {
      const btn = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 0.035, 12)), goldMetalMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(bx, by, 0.265);
      formalBlazer.add(btn);
    });

    const pocketSq = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.15, 0.07, 0.03)), crispWhiteMat);
    pocketSq.position.set(0.28, 1.63, 0.265);
    formalBlazer.add(pocketSq);
  }
  bodyGroup.add(formalBlazer);

  // --- A2) GIRL OUTFITS (outfit, gender === 'girl') ---

  // 4. Oq Bluzka va Yubka (Girl)
  const girlBlouseSkirt = new THREE.Group();
  {
    // Rounded Peter-Pan white blouse collar + neat navy neck bow ribbon
    [-0.15, 0.15].forEach((cx) => {
      const lapel = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.11, 0.06)), crispWhiteMat));
      lapel.position.set(cx, 1.81, 0.25);
      lapel.rotation.z = cx < 0 ? -0.18 : 0.18;
      girlBlouseSkirt.add(lapel);
    });

    // Neat small school bow at collar (no boy necktie!)
    const neckBowL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.12, 0.08, 0.05)), navyClothMat);
    neckBowL.position.set(-0.07, 1.73, 0.255);
    neckBowL.rotation.z = 0.25;
    girlBlouseSkirt.add(neckBowL);

    const neckBowR = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.12, 0.08, 0.05)), navyClothMat);
    neckBowR.position.set(0.07, 1.73, 0.255);
    neckBowR.rotation.z = -0.25;
    girlBlouseSkirt.add(neckBowR);

    const neckKnot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.06, 0.06, 0.06)), navyClothMat);
    neckKnot.position.set(0, 1.73, 0.26);
    girlBlouseSkirt.add(neckKnot);

    // Subtle pearl blouse buttons
    [1.56, 1.38, 1.2].forEach((by) => {
      const btn = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.028, 0.028, 0.025, 10)), silverMetalMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0, by, 0.25);
      girlBlouseSkirt.add(btn);
    });
  }
  bodyGroup.add(girlBlouseSkirt);

  // 5. Maktab Nimchasi va Yubka (Girl)
  const girlVestSkirt = new THREE.Group();
  {
    const vestLower = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.9, 0.5, 0.515)), navyClothMat));
    vestLower.position.set(0, 1.24, 0);
    girlVestSkirt.add(vestLower);

    [-0.28, 0.28].forEach((vx) => {
      const panel = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 0.4, 0.515)), navyClothMat));
      panel.position.set(vx, 1.66, 0);
      girlVestSkirt.add(panel);
    });

    const vestBack = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.9, 0.42, 0.24)), navyClothMat));
    vestBack.position.set(0, 1.66, -0.14);
    girlVestSkirt.add(vestBack);

    const hemTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.91, 0.06, 0.525)), crispWhiteMat);
    hemTrim.position.set(0, 1.03, 0);
    girlVestSkirt.add(hemTrim);

    // White Peter-Pan collar flaps resting neatly over vest shoulders
    [-0.16, 0.16].forEach((cx) => {
      const colWing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.1, 0.06)), crispWhiteMat);
      colWing.position.set(cx, 1.81, 0.26);
      colWing.rotation.z = cx < 0 ? -0.18 : 0.18;
      girlVestSkirt.add(colWing);
    });

    // Gold honor emblem on vest chest
    const crest = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 12)), goldMetalMat);
    crest.rotation.x = Math.PI / 2;
    crest.position.set(0.26, 1.62, 0.265);
    girlVestSkirt.add(crest);
  }
  bodyGroup.add(girlVestSkirt);

  // 6. Bayramona Oq Fartukli Forma (Girl — Dark School Dress + Festive White Lace Apron!)
  const girlApronUniform = new THREE.Group();
  {
    const laceWhiteMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.02 }));

    // White pinafore bib on front chest
    const apronBib = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.56, 0.56, 0.05)), laceWhiteMat));
    apronBib.position.set(0, 1.38, 0.245);
    girlApronUniform.add(apronBib);

    // Festive ruffled shoulder straps (front + top + back)
    [-0.25, 0.25].forEach((sx) => {
      const strapFront = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.52, 0.06)), laceWhiteMat));
      strapFront.position.set(sx, 1.62, 0.248);
      girlApronUniform.add(strapFront);

      const strapTop = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.16, 0.06, 0.54)), laceWhiteMat));
      strapTop.position.set(sx, 1.88, 0);
      girlApronUniform.add(strapTop);

      const strapBack = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.13, 0.86, 0.055)), laceWhiteMat));
      strapBack.position.set(sx, 1.44, -0.25);
      girlApronUniform.add(strapBack);
    });

    // Crisp white apron waist sash + bow in back
    const apronWaist = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.92, 0.13, 0.54)), laceWhiteMat));
    apronWaist.position.set(0, 1.0, 0);
    girlApronUniform.add(apronWaist);

    // White apron front skirt panel cascading over the dark flared skirt
    const apronSkirt = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.68, 0.44, 0.06)), laceWhiteMat));
    apronSkirt.position.set(0, 0.76, 0.32);
    apronSkirt.rotation.x = -0.18;
    girlApronUniform.add(apronSkirt);

    // Cute white bow tied at the back of the waist
    const backBow = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.16, 0.08)), laceWhiteMat));
    backBow.position.set(0, 1.0, -0.29);
    girlApronUniform.add(backBow);
  }
  bodyGroup.add(girlApronUniform);

  // --- B) BOSH KIYIMLAR (hat — mounted on headGroup) ---

  // 7. Milliy Chust Do'ppisi (Boy only)
  const chustDoppi = new THREE.Group();
  chustDoppi.position.set(0, 0.75, 0);
  {
    const velvetBlackMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.72, metalness: 0.05 })
    );

    const baseBand = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.74, 0.13, 0.72)), velvetBlackMat));
    baseBand.position.y = 0.05;
    chustDoppi.add(baseBand);

    const crown = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.32, 0.51, 0.18, 4)), velvetBlackMat));
    crown.rotation.y = Math.PI / 4;
    crown.position.y = 0.19;
    chustDoppi.add(crown);

    const rimPipe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.755, 0.025, 0.735)), crispWhiteMat);
    rimPipe.position.y = 0.01;
    chustDoppi.add(rimPipe);

    [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((rotY) => {
      const sideGroup = new THREE.Group();
      sideGroup.rotation.y = rotY;

      const lowerBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.46, 0.024, 0.024)), crispWhiteMat);
      lowerBar.position.set(0, 0.06, 0.365);
      sideGroup.add(lowerBar);

      const bodomArc = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.068, 0.016, 8, 16, Math.PI * 1.35)), crispWhiteMat);
      bodomArc.position.set(0, 0.175, 0.31);
      bodomArc.rotation.x = -0.45;
      bodomArc.rotation.z = 0.35;
      sideGroup.add(bodomArc);

      const dotL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.04, 0.04, 0.025)), crispWhiteMat);
      dotL.position.set(-0.18, 0.095, 0.365);
      sideGroup.add(dotL);

      const dotR = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.04, 0.04, 0.025)), crispWhiteMat);
      dotR.position.set(0.18, 0.095, 0.365);
      sideGroup.add(dotR);

      chustDoppi.add(sideGroup);
    });
  }
  headGroup.add(chustDoppi);

  // 8. Oq Maktab Bantigi (Girl only — twin festive 3D white school bows on both ponytails!)
  const girlWhiteBows = new THREE.Group();
  {
    const bowSnowMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32, metalness: 0.04 }));
    [-1, 1].forEach((side) => {
      const sideBow = new THREE.Group();
      sideBow.position.set(side * 0.44, 0.62, -0.15);
      sideBow.rotation.z = side * -0.18;

      // Fluffy sculpted white ribbon wings + center knot + hanging tails
      const centerKnot = enableShadows(new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.075, 10, 10)), bowSnowMat));
      sideBow.add(centerKnot);

      const topWing = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.16, 0.24)), bowSnowMat));
      topWing.position.set(side * 0.06, 0.08, 0);
      topWing.rotation.z = side * -0.32;
      sideBow.add(topWing);

      const botWing = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.16, 0.24)), bowSnowMat));
      botWing.position.set(side * 0.06, -0.07, 0);
      botWing.rotation.z = side * 0.32;
      sideBow.add(botWing);

      const tail = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.05, 0.2, 0.09)), bowSnowMat));
      tail.position.set(side * 0.04, -0.16, -0.04);
      tail.rotation.z = side * 0.15;
      sideBow.add(tail);

      girlWhiteBows.add(sideBow);
    });
  }
  headGroup.add(girlWhiteBows);

  // 9. Bayramona Iroqi Do'ppi (Girl only — seated cleanly atop hair crown at y = 0.80 with zero clipping!)
  const iroqiDoppi = new THREE.Group();
  iroqiDoppi.position.set(0, 0.8, -0.01);
  {
    const iroqiBlueMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.52, metalness: 0.08 }));
    const iroqiTealMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.42, metalness: 0.15 }));
    const iroqiRoseMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.38, metalness: 0.15 }));
    const iroqiEmeraldMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4, metalness: 0.12 }));

    const baseBand = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.68, 0.13, 0.66)), iroqiBlueMat));
    baseBand.position.y = 0.065;
    iroqiDoppi.add(baseBand);

    const crown = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.33, 0.47, 0.15, 4)), iroqiTealMat));
    crown.rotation.y = Math.PI / 4;
    crown.position.y = 0.19;
    iroqiDoppi.add(crown);

    const goldRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.7, 0.034, 0.68)), goldMetalMat);
    goldRim.position.y = 0.02;
    iroqiDoppi.add(goldRim);

    const topRosette = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.095, 0.11, 0.04, 8)), goldMetalMat);
    topRosette.position.y = 0.28;
    iroqiDoppi.add(topRosette);

    [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((rotY) => {
      const sideGroup = new THREE.Group();
      sideGroup.rotation.y = rotY;

      const centerGem = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.052, 0)), iroqiRoseMat);
      centerGem.scale.set(1, 1, 0.45);
      centerGem.position.set(0, 0.085, 0.34);
      sideGroup.add(centerGem);

      [-0.16, 0.16].forEach((gx) => {
        const leaf = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, 0.042, 0.03)), iroqiEmeraldMat);
        leaf.position.set(gx, 0.085, 0.338);
        sideGroup.add(leaf);

        const goldDot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.038, 0.038, 0.035)), goldMetalMat);
        goldDot.position.set(gx, 0.18, 0.285);
        sideGroup.add(goldDot);
      });

      const topGoldLine = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.024, 0.03)), goldMetalMat);
      topGoldLine.position.set(0, 0.22, 0.265);
      sideGroup.add(topGoldLine);

      iroqiDoppi.add(sideGroup);
    });
  }
  headGroup.add(iroqiDoppi);

  // 10. Bilimdon Qalpoqchasi (Both genders — seated cleanly above hair crown!)
  const scholarCap = new THREE.Group();
  scholarCap.position.set(0, 0.78, 0);
  const tasselPivot = new THREE.Group();
  {
    const capDarkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.5, metalness: 0.1 }));

    const skull = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.36, 0.39, 0.15, 16)), capDarkMat));
    skull.position.y = 0.06;
    scholarCap.add(skull);

    const board = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.96, 0.055, 0.96)), capDarkMat));
    board.position.set(0, 0.17, 0);
    board.rotation.y = Math.PI / 4;
    scholarCap.add(board);

    const btn = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 12)), goldMetalMat);
    btn.position.set(0, 0.21, 0);
    scholarCap.add(btn);

    const cordTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.5, 0.024, 0.024)), goldMetalMat);
    cordTop.position.set(0.24, 0.21, 0.04);
    scholarCap.add(cordTop);

    tasselPivot.position.set(0.49, 0.2, 0.04);
    const tasselCord = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.016, 0.016, 0.26, 8)), goldMetalMat);
    tasselCord.position.y = -0.13;
    tasselPivot.add(tasselCord);

    const tasselFringe = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.025, 0.06, 0.14, 10)), goldMetalMat));
    tasselFringe.position.y = -0.29;
    tasselPivot.add(tasselFringe);

    scholarCap.add(tasselPivot);
  }
  headGroup.add(scholarCap);

  // --- C) SUMKALAR (bag — both genders) ---

  // 11. Oddiy Maktab Sumkasi
  const basicBackpack = new THREE.Group();
  basicBackpack.position.set(0, 1.42, -0.37);
  {
    const bpBlueMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.62, metalness: 0.05 }));
    const bpRedMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.55, metalness: 0.08 }));
    const strapMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75, metalness: 0.05 }));

    const mainPack = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.7, 0.78, 0.3)), bpBlueMat));
    basicBackpack.add(mainPack);

    const frontPocket = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.56, 0.36, 0.14)), bpRedMat));
    frontPocket.position.set(0, -0.14, -0.19);
    basicBackpack.add(frontPocket);

    const zipper = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.52, 0.045, 0.04)), silverMetalMat);
    zipper.position.set(0, 0.04, -0.25);
    basicBackpack.add(zipper);

    const handle = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.24, 0.08, 0.08)), strapMat));
    handle.position.set(0, 0.43, 0);
    basicBackpack.add(handle);

    [-0.26, 0.26].forEach((sx) => {
      const strapTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 0.06, 0.54)), strapMat);
      strapTop.position.set(sx, 0.46, 0.36);
      basicBackpack.add(strapTop);

      const strapFront = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 0.72, 0.05)), strapMat);
      strapFront.position.set(sx, 0.1, 0.62);
      basicBackpack.add(strapFront);
    });
  }
  bodyGroup.add(basicBackpack);

  // 12. Zamonaviy Maktab Portfeli
  const classicSatchel = new THREE.Group();
  classicSatchel.position.set(0, 1.4, -0.37);
  {
    const leatherMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.58, metalness: 0.08 }));
    const leatherDarkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.62, metalness: 0.06 }));

    const body = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.76, 0.66, 0.28)), leatherMat));
    classicSatchel.add(body);

    const flap = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.78, 0.32, 0.31)), leatherDarkMat));
    flap.position.set(0, 0.18, -0.02);
    classicSatchel.add(flap);

    const navyTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.79, 0.055, 0.32)), navyClothMat);
    navyTrim.position.set(0, 0.03, -0.02);
    classicSatchel.add(navyTrim);

    [-0.22, 0.22].forEach((bx) => {
      const buckleStrap = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.09, 0.56, 0.04)), leatherDarkMat);
      buckleStrap.position.set(bx, 0.02, -0.17);
      classicSatchel.add(buckleStrap);

      const clasp = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 0.09, 0.055)), goldMetalMat);
      clasp.position.set(bx, -0.04, -0.18);
      classicSatchel.add(clasp);

      const strapTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.055, 0.52)), leatherDarkMat);
      strapTop.position.set(bx, 0.44, 0.36);
      classicSatchel.add(strapTop);
    });

    const handle = enableShadows(new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.12, 0.028, 8, 16, Math.PI)), leatherDarkMat));
    handle.position.set(0, 0.34, -0.02);
    classicSatchel.add(handle);
  }
  bodyGroup.add(classicSatchel);

  // 13. Oltin Bilimdon Sumkasi
  const goldBackpack = new THREE.Group();
  goldBackpack.position.set(0, 1.44, -0.39);
  {
    const neonTrimMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.75,
        roughness: 0.2,
        metalness: 0.35,
      })
    );

    const body = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.76, 0.84, 0.34)), goldMetalMat));
    goldBackpack.add(body);

    const topCap = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.72, 0.12, 0.36)), goldDeepMat));
    topCap.position.set(0, 0.44, 0);
    goldBackpack.add(topCap);

    const skyStripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.78, 0.08, 0.36)), neonTrimMat);
    skyStripe.position.set(0, 0.14, -0.02);
    goldBackpack.add(skyStripe);

    const diamondEmblem = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.14, 0)), neonTrimMat);
    diamondEmblem.position.set(0, -0.14, -0.2);
    diamondEmblem.scale.set(1, 1.2, 0.45);
    goldBackpack.add(diamondEmblem);

    [-0.42, 0.42].forEach((px) => {
      const pod = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.44, 10)), goldDeepMat));
      pod.position.set(px, -0.08, -0.02);
      goldBackpack.add(pod);
    });
  }
  bodyGroup.add(goldBackpack);

  // --- D) AKSESSUARLAR (both genders, multi-equip) ---

  // 14. Maktab Qo'l Soati
  const schoolWatch = new THREE.Group();
  schoolWatch.position.set(0, -0.73, 0);
  {
    const watchStrapMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.52, metalness: 0.1 }));

    const strap = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.085, 0.36)), watchStrapMat));
    schoolWatch.add(strap);

    const casing = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.095, 0.095, 0.045, 16)), silverMetalMat));
    casing.rotation.z = Math.PI / 2;
    casing.position.set(-0.165, 0, 0.02);
    schoolWatch.add(casing);

    const dial = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 16)), crispWhiteMat);
    dial.rotation.z = Math.PI / 2;
    dial.position.set(-0.17, 0, 0.02);
    schoolWatch.add(dial);

    const handH = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.015, 0.045, 0.014)), darkFeatureMat);
    handH.position.set(-0.198, 0.016, 0.02);
    schoolWatch.add(handH);

    const handM = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.015, 0.014, 0.052)), crimsonClothMat);
    handM.position.set(-0.198, 0, 0.04);
    schoolWatch.add(handM);
  }
  leftArmPivot.add(schoolWatch);

  // 15. A'lochi Oltin Medali
  const honorMedal = new THREE.Group();
  honorMedal.position.set(0, 1.56, 0.285);
  {
    const ribbonL = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, 0.32, 0.025)), crimsonClothMat));
    ribbonL.position.set(-0.085, 0.14, -0.008);
    ribbonL.rotation.z = 0.38;
    honorMedal.add(ribbonL);

    const ribbonR = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, 0.32, 0.025)), navyClothMat));
    ribbonR.position.set(0.085, 0.14, -0.008);
    ribbonR.rotation.z = -0.38;
    honorMedal.add(ribbonR);

    const disc = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.115, 0.115, 0.036, 20)), goldMetalMat));
    disc.rotation.x = Math.PI / 2;
    disc.position.set(0, -0.04, 0.012);
    honorMedal.add(disc);

    const bezel = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.115, 0.018, 8, 22)), goldDeepMat);
    bezel.position.set(0, -0.04, 0.022);
    honorMedal.add(bezel);

    const starGem = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.055, 0)), crispWhiteMat);
    starGem.scale.set(1, 1, 0.4);
    starGem.position.set(0, -0.04, 0.035);
    honorMedal.add(starGem);
  }
  bodyGroup.add(honorMedal);

  // 16. Yosh Olim Kitobi
  const scholarBook = new THREE.Group();
  scholarBook.position.set(0.03, -0.84, 0.22);
  scholarBook.rotation.x = 0.28;
  scholarBook.rotation.z = -0.12;
  {
    const bookCoverMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.45, metalness: 0.1 }));
    const bookPagesMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xfefce8, roughness: 0.85, metalness: 0.0 }));

    const cover = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.13, 0.42, 0.34)), bookCoverMat));
    scholarBook.add(cover);

    const pages = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.38, 0.3)), bookPagesMat);
    pages.position.set(0, 0, 0.024);
    scholarBook.add(pages);

    const goldBandTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.14, 0.045, 0.35)), goldMetalMat);
    goldBandTop.position.set(0, 0.13, 0);
    scholarBook.add(goldBandTop);

    const goldEmblem = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.145, 0.1, 0.1)), goldMetalMat);
    goldEmblem.position.set(0, -0.02, 0);
    scholarBook.add(goldEmblem);
  }
  rightArmPivot.add(scholarBook);

  // Ground contact shadow disc
  const shadowTex = createContactShadowTexture();
  textures.push(shadowTex);
  const shadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    })
  );
  const shadowDisc = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.55, 1.55)), shadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = 0.025;
  root.add(shadowDisc);

  const syncAppearance = () => {
    const isGirl = currentGender === 'girl' && !isTeacher;

    // 1. Toggle base boy/girl 3D hair & skirt/pants silhouettes
    boyLowerGroup.visible = !isGirl;
    girlLowerGroup.visible = isGirl;
    boyHairGroup.visible = !isGirl;
    girlHairGroup.visible = isGirl;

    if (!isTeacher) {
      pantsMat.color.set(isGirl ? '#F8FAFC' : '#1E3A5F');
      shoeMat.color.set(isGirl ? '#334155' : '#1E293B');
      if (!options.hairColor) {
        hairMat.color.set(isGirl ? '#3B2314' : '#2C221E');
      }
    }

    // 2. Strict 3D Gender Safety Guard: NEVER render an item that belongs to the opposite gender!
    const eq = currentEquipped;
    const isBoy = currentGender === 'boy' && !isTeacher;

    whiteShirtTie.visible = isBoy && eq.outfit === 'white_shirt_tie';
    schoolVest.visible = isBoy && eq.outfit === 'school_vest';
    formalBlazer.visible = isBoy && eq.outfit === 'formal_blazer';

    girlBlouseSkirt.visible = isGirl && eq.outfit === 'girl_blouse_skirt';
    girlVestSkirt.visible = isGirl && eq.outfit === 'girl_vest_skirt';
    girlApronUniform.visible = isGirl && eq.outfit === 'girl_apron_uniform';

    chustDoppi.visible = isBoy && eq.hat === 'chust_doppi';
    girlWhiteBows.visible = isGirl && eq.hat === 'girl_white_bows';
    iroqiDoppi.visible = isGirl && eq.hat === 'iroqi_doppi';
    scholarCap.visible = !isTeacher && eq.hat === 'scholar_cap';

    // Hide tiny default colorful ponytail bows when big 3D Oq Maktab Bantigi is equipped
    girlDefaultBowsGroup.visible = isGirl && !girlWhiteBows.visible;

    basicBackpack.visible = eq.bag === 'basic_backpack';
    classicSatchel.visible = eq.bag === 'classic_satchel';
    goldBackpack.visible = eq.bag === 'gold_backpack';

    schoolWatch.visible = eq.watch === 'school_watch';
    honorMedal.visible = eq.medal === 'honor_medal';
    scholarBook.visible = eq.book === 'scholar_book';

    // Keep medal cleanly in front of thicker blazer/vest/apron layers
    honorMedal.position.z =
      formalBlazer.visible || schoolVest.visible || girlVestSkirt.visible || girlApronUniform.visible
        ? 0.305
        : 0.275;

    // 3. Synchronize shirt, sleeve, and skirt colors with active gender-valid outfit
    if (!isTeacher) {
      if (whiteShirtTie.visible || schoolVest.visible) {
        shirtMat.color.set('#F8FAFC');
        sleeveMat.color.set('#F8FAFC');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else if (formalBlazer.visible) {
        shirtMat.color.set('#172554');
        sleeveMat.color.set('#172554');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else if (girlBlouseSkirt.visible || girlVestSkirt.visible) {
        shirtMat.color.set('#F8FAFC');
        sleeveMat.color.set('#F8FAFC');
        skirtMat.color.set('#1E3A8A');
        waistTrimMat.color.set('#1E3A8A');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else if (girlApronUniform.visible) {
        shirtMat.color.set('#172554');
        sleeveMat.color.set('#172554');
        skirtMat.color.set('#172554');
        waistTrimMat.color.set('#FFFFFF');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else {
        shirtMat.color.set(baseShirtHex);
        sleeveMat.color.set(baseShirtHex);
        skirtMat.color.copy(new THREE.Color(baseShirtHex).lerp(new THREE.Color('#0F172A'), 0.14));
        waistTrimMat.color.set(options.ribbonColor ?? '#FDE047');
        leftArm.cuff.visible = false;
        rightArm.cuff.visible = false;
      }
    }
  };

  syncAppearance();

  let walkPhase = 0;
  let idlePhase = 0;

  const updateAnimation = (dt: number, speedRatio: number, isAirborne: boolean, yHeight: number) => {
    idlePhase += dt * 3.2;

    if (isAirborne) {
      leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, -2.1, 10, dt);
      rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, scholarBook.visible ? -0.9 : -2.1, 10, dt);
      leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0.38, 10, dt);
      rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, -0.35, 10, dt);
      bodyGroup.position.y = THREE.MathUtils.damp(bodyGroup.position.y, 0, 12, dt);
    } else if (speedRatio > 0.05) {
      walkPhase += dt * (8.5 + speedRatio * 4.5);
      const swing = Math.sin(walkPhase) * 0.72 * Math.min(1, speedRatio);
      leftLegPivot.rotation.x = swing;
      rightLegPivot.rotation.x = -swing;
      leftArmPivot.rotation.x = -swing * 0.82;
      rightArmPivot.rotation.x = scholarBook.visible ? -0.32 + swing * 0.28 : swing * 0.82;
      bodyGroup.position.y = Math.abs(Math.sin(walkPhase)) * 0.075 * Math.min(1, speedRatio);
      headGroup.rotation.z = Math.sin(walkPhase) * 0.04;
    } else {
      leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0, 10, dt);
      rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, 0, 10, dt);
      leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, 0, 10, dt);
      rightArmPivot.rotation.x = THREE.MathUtils.damp(
        rightArmPivot.rotation.x,
        scholarBook.visible ? -0.28 : 0,
        10,
        dt
      );
      bodyGroup.position.y = THREE.MathUtils.damp(
        bodyGroup.position.y,
        Math.sin(idlePhase * 0.65) * 0.025,
        8,
        dt
      );
      headGroup.rotation.z = THREE.MathUtils.damp(headGroup.rotation.z, 0, 8, dt);
    }

    if (scholarCap.visible) {
      tasselPivot.rotation.z = Math.sin(idlePhase * 1.1) * 0.08 + (speedRatio > 0.05 ? 0.14 : 0);
    }

    shadowDisc.position.y = -yHeight + 0.025;
    const shadowScale = Math.max(0.45, 1 - yHeight * 0.14);
    shadowDisc.scale.set(shadowScale, shadowScale, 1);
    shadowMat.opacity = Math.max(0.18, 0.62 - yHeight * 0.1);
  };

  const setShirtColor = (hex: string) => {
    baseShirtHex = hex;
    syncAppearance();
  };

  const setGender = (nextGender: PlayerGender) => {
    currentGender = nextGender;
    syncAppearance();
  };

  const applyAccessories = (eq: EquippedAccessories) => {
    currentEquipped = { ...eq };
    syncAppearance();
  };

  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  };

  return {
    root,
    bodyGroup,
    headGroup,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot,
    shadowDisc,
    shirtMaterials: [shirtMat, sleeveMat],
    accessories: {
      whiteShirtTie,
      schoolVest,
      formalBlazer,
      girlBlouseSkirt,
      girlVestSkirt,
      girlApronUniform,
      chustDoppi,
      girlWhiteBows,
      iroqiDoppi,
      scholarCap,
      basicBackpack,
      classicSatchel,
      goldBackpack,
      schoolWatch,
      honorMedal,
      scholarBook,
    },
    setShirtColor,
    setGender,
    applyAccessories,
    updateAnimation,
    dispose,
  };
}
