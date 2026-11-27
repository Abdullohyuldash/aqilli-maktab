import * as THREE from 'three';
import { AvatarEmote, EquippedAccessories, PlayerGender, TrashKind } from '../types';
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
    sportUniform: THREE.Group;
    ceremonialUniform: THREE.Group;
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
  setHeldTrash: (kind: TrashKind | null) => void;
  setGymWear: (enabled: boolean) => void;
  triggerEmote: (emote: AvatarEmote, durationSec?: number) => void;
  isEmoteActive: () => boolean;
  updateAnimation: (dt: number, speedRatio: number, isAirborne: boolean, yHeight: number) => void;
  dispose: () => void;
}

export interface AvatarStyleOptions {
  gender?: PlayerGender;
  variant?: 'student' | 'teacher';
  hairColor?: string;
  ribbonColor?: string;
  coachTracksuit?: boolean;
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
  const isCoach = Boolean(options.coachTracksuit);

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
      roughness: 0.56,
      metalness: 0.04,
    })
  );
  const skirtPleatMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialShirtColor).lerp(new THREE.Color('#0F172A'), 0.3),
      roughness: 0.62,
      metalness: 0.04,
    })
  );
  const skirtHemMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(initialShirtColor).lerp(new THREE.Color('#0F172A'), 0.24),
      roughness: 0.52,
      metalness: 0.06,
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

  const createRectFrustumGeo = (
    topW: number,
    topD: number,
    botW: number,
    botD: number,
    height: number
  ): THREE.BufferGeometry => {
    const h = height / 2;
    const tx = topW / 2;
    const tz = topD / 2;
    const bx = botW / 2;
    const bz = botD / 2;

    const p: number[] = [];
    const tri = (
      ax: number,
      ay: number,
      az: number,
      bxx: number,
      byy: number,
      bzz: number,
      cx: number,
      cy: number,
      cz: number
    ) => {
      p.push(ax, ay, az, bxx, byy, bzz, cx, cy, cz);
    };

    // Front (+Z)
    tri(-tx, h, tz, -bx, -h, bz, bx, -h, bz);
    tri(-tx, h, tz, bx, -h, bz, tx, h, tz);
    // Back (-Z)
    tri(tx, h, -tz, bx, -h, -bz, -bx, -h, -bz);
    tri(tx, h, -tz, -bx, -h, -bz, -tx, h, -tz);
    // Left (-X)
    tri(-tx, h, -tz, -bx, -h, -bz, -bx, -h, bz);
    tri(-tx, h, -tz, -bx, -h, bz, -tx, h, tz);
    // Right (+X)
    tri(tx, h, tz, bx, -h, bz, bx, -h, -bz);
    tri(tx, h, tz, bx, -h, -bz, tx, h, -tz);
    // Top (+Y)
    tri(-tx, h, -tz, -tx, h, tz, tx, h, tz);
    tri(-tx, h, -tz, tx, h, tz, tx, h, -tz);
    // Bottom (-Y)
    tri(-bx, -h, bz, -bx, -h, -bz, bx, -h, -bz);
    tri(-bx, -h, bz, bx, -h, -bz, bx, -h, bz);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    geo.computeVertexNormals();
    return trackGeo(geo);
  };

  // --- LEGS (Bottom-center grounded at y = 0) ---
  const makeLeg = (xOffset: number): { pivot: THREE.Group; sportStripe: THREE.Mesh } => {
    const pivot = new THREE.Group();
    pivot.position.set(xOffset, 0.92, 0);

    const upperLeg = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.38, 0.74, 0.42)), pantsMat));
    upperLeg.position.y = -0.37;
    pivot.add(upperLeg);

    // Sport tracksuit crisp white side stripe
    const sportStripe = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.03, 0.72, 0.085)),
      crispWhiteMat
    );
    sportStripe.position.set(xOffset < 0 ? -0.192 : 0.192, -0.37, 0);
    sportStripe.visible = false;
    pivot.add(sportStripe);

    const shoe = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.4, 0.14, 0.5)), shoeMat));
    shoe.position.set(0, -0.79, 0.04);
    pivot.add(shoe);

    const sole = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.42, 0.06, 0.52)), soleMat));
    sole.position.set(0, -0.89, 0.04);
    pivot.add(sole);

    bodyGroup.add(pivot);
    return { pivot, sportStripe };
  };

  const leftLeg = makeLeg(-0.22);
  const rightLeg = makeLeg(0.22);
  const leftLegPivot = leftLeg.pivot;
  const rightLegPivot = rightLeg.pivot;

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
  const girlWaistRibbon = enableShadows(
    new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.91, 0.09, 0.525)), waistTrimMat)
  );
  girlWaistRibbon.position.set(0, 0.955, 0);
  girlLowerGroup.add(girlWaistRibbon);

  const girlSkirtGroup = new THREE.Group();
  {
    // Crisp flat-faceted A-line rectangular frustum skirt (zero smooth-shading artifacts, flush waist fit!)
    const skirtBody = enableShadows(
      new THREE.Mesh(createRectFrustumGeo(0.9, 0.51, 1.12, 0.74, 0.4), skirtMat)
    );
    skirtBody.position.set(0, 0.745, 0);
    girlSkirtGroup.add(skirtBody);

    // Tailored hem border band
    const skirtHem = new THREE.Mesh(
      createRectFrustumGeo(1.1, 0.715, 1.132, 0.748, 0.042),
      skirtHemMat
    );
    skirtHem.position.set(0, 0.558, 0);
    girlSkirtGroup.add(skirtHem);

    // Front & back box-pleat vertical ribs angled cleanly along the frustum slope
    const fbAngle = Math.atan2(0.115, 0.4); // 0.2798 rad
    [-0.27, 0, 0.27].forEach((px) => {
      const frontPleat = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.052, 0.375, 0.024)),
        skirtPleatMat
      );
      frontPleat.position.set(px, 0.745, 0.312);
      frontPleat.rotation.x = -fbAngle;
      girlSkirtGroup.add(frontPleat);

      const backPleat = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.052, 0.375, 0.024)),
        skirtPleatMat
      );
      backPleat.position.set(px, 0.745, -0.312);
      backPleat.rotation.x = fbAngle;
      girlSkirtGroup.add(backPleat);
    });

    // Left & right side pleat accents
    const sideAngle = Math.atan2(0.11, 0.4); // 0.268 rad
    [-1, 1].forEach((side) => {
      const sidePleat = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.024, 0.375, 0.065)),
        skirtPleatMat
      );
      sidePleat.position.set(side * 0.505, 0.745, 0);
      sidePleat.rotation.z = side * sideAngle;
      girlSkirtGroup.add(sidePleat);
    });
  }
  girlLowerGroup.add(girlSkirtGroup);
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
  const makeArm = (
    xOffset: number
  ): { pivot: THREE.Group; cuff: THREE.Mesh; sportStripe: THREE.Mesh; ceremonialCuff: THREE.Mesh } => {
    const pivot = new THREE.Group();
    pivot.position.set(xOffset, 1.8, 0);

    const sleeve = enableShadows(
      new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, isTeacher ? 0.62 : 0.46, 0.36)), sleeveMat)
    );
    sleeve.position.y = isTeacher ? -0.3 : -0.22;
    pivot.add(sleeve);

    // Optional long-sleeve extension for formal / sport outfits
    const cuff = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.31, 0.22, 0.35)), sleeveMat));
    cuff.position.y = -0.54;
    cuff.visible = false;
    pivot.add(cuff);

    // Sport tracksuit crisp white outer sleeve stripe
    const sportStripe = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.03, 0.62, 0.085)),
      crispWhiteMat
    );
    sportStripe.position.set(xOffset < 0 ? -0.162 : 0.162, -0.32, 0);
    sportStripe.visible = false;
    pivot.add(sportStripe);

    // Ceremonial gold sleeve cuff braid
    const ceremonialCuff = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.325, 0.055, 0.365)),
      goldMetalMat
    );
    ceremonialCuff.position.y = -0.6;
    ceremonialCuff.visible = false;
    pivot.add(ceremonialCuff);

    const forearm = enableShadows(
      new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.28, isTeacher ? 0.28 : 0.42, 0.32)), skinMat)
    );
    forearm.position.y = isTeacher ? -0.71 : -0.64;
    pivot.add(forearm);

    bodyGroup.add(pivot);
    return { pivot, cuff, sportStripe, ceremonialCuff };
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
    const apronWaist = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.93, 0.11, 0.54)), laceWhiteMat));
    apronWaist.position.set(0, 0.96, 0);
    girlApronUniform.add(apronWaist);

    // White apron front skirt panel aligned cleanly along the pleated skirt slope (zero clipping!)
    const apronSkirt = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.64, 0.38, 0.036)), laceWhiteMat));
    apronSkirt.position.set(0, 0.745, 0.335);
    apronSkirt.rotation.x = -0.28;
    girlApronUniform.add(apronSkirt);

    // Delicate lace hem border at bottom of apron front panel
    const apronHem = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.67, 0.045, 0.042)), crispWhiteMat);
    apronHem.position.set(0, 0.57, 0.386);
    apronHem.rotation.x = -0.28;
    girlApronUniform.add(apronHem);

    // Cute white bow tied at the back of the waist
    const backBow = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.32, 0.16, 0.08)), laceWhiteMat));
    backBow.position.set(0, 0.96, -0.295);
    girlApronUniform.add(backBow);
  }
  bodyGroup.add(girlApronUniform);

  // --- A3) UNIVERSAL STUDENT OUTFITS (both genders: sport_uniform & ceremonial_uniform) ---

  // 6b. Sport Maktab Formasi (Sportivka + oq chiziqli shim)
  const sportUniform = new THREE.Group();
  {
    const sportCobaltMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.52, metalness: 0.06 }));
    const sportNavyMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.62, metalness: 0.04 }));

    const jacketUpper = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.9, 0.56, 0.515)), sportCobaltMat));
    jacketUpper.position.set(0, 1.58, 0);
    sportUniform.add(jacketUpper);

    const jacketLowerBand = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.905, 0.34, 0.518)), sportNavyMat));
    jacketLowerBand.position.set(0, 1.15, 0);
    sportUniform.add(jacketLowerBand);

    // Crisp white athletic chest stripe wrap
    const chestStripe = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.916, 0.065, 0.528)), crispWhiteMat);
    chestStripe.position.set(0, 1.35, 0);
    sportUniform.add(chestStripe);

    // Stand-up athletic collar + white rim
    const standCollar = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.52, 0.12, 0.53)), sportNavyMat));
    standCollar.position.set(0, 1.855, 0.005);
    sportUniform.add(standCollar);

    const collarRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.53, 0.032, 0.54)), crispWhiteMat);
    collarRim.position.set(0, 1.905, 0.005);
    sportUniform.add(collarRim);

    // Front white zipper placket & silver zipper pull
    const zipLine = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.052, 0.84, 0.03)), crispWhiteMat);
    zipLine.position.set(0, 1.4, 0.262);
    sportUniform.add(zipLine);

    const zipPull = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.075, 0.06, 0.04)), silverMetalMat);
    zipPull.position.set(0, 1.79, 0.27);
    sportUniform.add(zipPull);

    // Sporty shield crest on chest
    const sportShield = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.062, 0.062, 0.03, 6)), goldMetalMat);
    sportShield.rotation.x = Math.PI / 2;
    sportShield.position.set(0.24, 1.62, 0.266);
    sportUniform.add(sportShield);

    // Coach lanyard & silver whistle (only visible when isCoach)
    if (isCoach) {
      const lanyardMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 }));
      const lanyardL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.035, 0.36, 0.025)), lanyardMat);
      lanyardL.position.set(-0.07, 1.72, 0.268);
      lanyardL.rotation.z = 0.22;
      sportUniform.add(lanyardL);

      const lanyardR = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.035, 0.36, 0.025)), lanyardMat);
      lanyardR.position.set(0.07, 1.72, 0.268);
      lanyardR.rotation.z = -0.22;
      sportUniform.add(lanyardR);

      const whistleBody = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.09, 12)), silverMetalMat);
      whistleBody.rotation.z = Math.PI / 2;
      whistleBody.position.set(0, 1.54, 0.285);
      sportUniform.add(whistleBody);

      const whistleTip = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, 0.04, 0.045)), silverMetalMat);
      whistleTip.position.set(0.05, 1.55, 0.285);
      sportUniform.add(whistleTip);
    }
  }
  bodyGroup.add(sportUniform);

  // 6c. Tantanali Maktab Formasi (Oq parad libosi + oltin epalet + uch rangli lenta)
  const ceremonialUniform = new THREE.Group();
  {
    const uzSkyMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.38, metalness: 0.1 }));
    const uzGreenMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.38, metalness: 0.1 }));

    const paradeShell = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.92, 0.88, 0.525)), crispWhiteMat));
    paradeShell.position.set(0, 1.4, -0.005);
    ceremonialUniform.add(paradeShell);

    // Navy parade stand collar with gold piping
    const paradeCollar = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.5, 0.115, 0.525)), navyClothMat));
    paradeCollar.position.set(0, 1.855, 0.005);
    ceremonialUniform.add(paradeCollar);

    const collarGoldPiping = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.515, 0.03, 0.535)), goldMetalMat);
    collarGoldPiping.position.set(0, 1.895, 0.005);
    ceremonialUniform.add(collarGoldPiping);

    // Gold shoulder epaulettes with crimson center stripe
    [-0.31, 0.31].forEach((ex) => {
      const epaulette = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.25, 0.055, 0.52)), goldMetalMat));
      epaulette.position.set(ex, 1.865, 0);
      ceremonialUniform.add(epaulette);

      const epInner = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.11, 0.062, 0.53)), crimsonClothMat);
      epInner.position.set(ex, 1.865, 0);
      ceremonialUniform.add(epInner);
    });

    // Diagonal Uzbekistan tricolor honor sash across chest (sky blue -> white/crimson -> emerald)
    const sashGroup = new THREE.Group();
    sashGroup.position.set(0, 1.4, 0.268);
    sashGroup.rotation.z = -0.62;

    const sashSky = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.052, 0.92, 0.028)), uzSkyMat);
    sashSky.position.x = -0.054;
    sashGroup.add(sashSky);

    const sashWhite = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.05, 0.92, 0.028)), crispWhiteMat);
    sashWhite.position.x = 0;
    sashGroup.add(sashWhite);

    const sashRedLineL = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.014, 0.92, 0.032)), crimsonClothMat);
    sashRedLineL.position.x = -0.026;
    sashGroup.add(sashRedLineL);

    const sashRedLineR = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.014, 0.92, 0.032)), crimsonClothMat);
    sashRedLineR.position.x = 0.026;
    sashGroup.add(sashRedLineR);

    const sashGreen = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.052, 0.92, 0.028)), uzGreenMat);
    sashGreen.position.x = 0.054;
    sashGroup.add(sashGreen);

    ceremonialUniform.add(sashGroup);

    // Gold rosette clasp at lower left hip of sash
    const sashRosette = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.072, 0.072, 0.032, 12)), goldMetalMat);
    sashRosette.rotation.x = Math.PI / 2;
    sashRosette.position.set(-0.27, 1.07, 0.275);
    ceremonialUniform.add(sashRosette);

    // Golden ceremonial parade buttons & bottom hem piping
    [1.64, 1.46, 1.28, 1.12].forEach((by) => {
      const btn = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 0.032, 12)), goldMetalMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0.14, by, 0.264);
      ceremonialUniform.add(btn);
    });

    const bottomGoldTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.93, 0.045, 0.535)), goldMetalMat);
    bottomGoldTrim.position.set(0, 0.985, -0.005);
    ceremonialUniform.add(bottomGoldTrim);
  }
  bodyGroup.add(ceremonialUniform);

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

  // =========================================================================
  // CARRIED 3D TRASH IN RIGHT HAND + OVERHEAD CARRY INDICATOR SPRITE
  // =========================================================================
  const heldTrashGroup = new THREE.Group();
  heldTrashGroup.position.set(0.02, -0.86, 0.24);
  heldTrashGroup.visible = false;

  const heldPaperGroup = new THREE.Group();
  {
    const pLight = trackMat(new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9, metalness: 0.02 }));
    const pShade = trackMat(new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.86, metalness: 0.02 }));
    const w1 = enableShadows(new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(0.16, 0)), pLight));
    w1.scale.set(1.08, 0.85, 0.95);
    heldPaperGroup.add(w1);
    const w2 = new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(0.11, 0)), pShade);
    w2.position.set(0.09, 0.04, 0.06);
    heldPaperGroup.add(w2);
    const w3 = new THREE.Mesh(trackGeo(new THREE.DodecahedronGeometry(0.09, 0)), pLight);
    w3.position.set(-0.08, -0.04, -0.05);
    heldPaperGroup.add(w3);
  }
  heldTrashGroup.add(heldPaperGroup);

  const heldJuiceGroup = new THREE.Group();
  {
    const jBody = trackMat(new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45, metalness: 0.04 }));
    const jBand = trackMat(new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.55, metalness: 0.02 }));
    const box = enableShadows(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.2, 0.3, 0.14)), jBody));
    heldJuiceGroup.add(box);
    const band = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.21, 0.11, 0.15)), jBand);
    heldJuiceGroup.add(band);
    const straw = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.016, 0.016, 0.14, 6)), crispWhiteMat);
    straw.position.set(0.04, 0.2, 0);
    heldJuiceGroup.add(straw);
  }
  heldTrashGroup.add(heldJuiceGroup);

  const heldBottleGroup = new THREE.Group();
  {
    const bBody = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        roughness: 0.18,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
      })
    );
    const bCap = trackMat(new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.15 }));
    const bLabel = trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.42, metalness: 0.05 }));
    const cyl = enableShadows(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.34, 10)), bBody));
    heldBottleGroup.add(cyl);
    const lbl = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.094, 0.094, 0.12, 10)), bLabel);
    heldBottleGroup.add(lbl);
    const neck = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.042, 0.09, 0.1, 10)), bBody);
    neck.position.y = 0.22;
    heldBottleGroup.add(neck);
    const cap = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.046, 0.046, 0.05, 10)), bCap);
    cap.position.y = 0.29;
    heldBottleGroup.add(cap);
  }
  heldTrashGroup.add(heldBottleGroup);

  rightArmPivot.add(heldTrashGroup);

  // Floating 3D overhead indicator badge when carrying trash: "🗑️ Axlat qutisiga olib boring"
  let carryBadgeSprite: THREE.Sprite | null = null;
  if (!isTeacher) {
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 512;
    badgeCanvas.height = 112;
    const bctx = badgeCanvas.getContext('2d');
    if (bctx) {
      bctx.clearRect(0, 0, 512, 112);
      const r = 42;
      bctx.fillStyle = 'rgba(6, 78, 59, 0.92)';
      bctx.beginPath();
      bctx.roundRect(12, 14, 488, 84, r);
      bctx.fill();
      bctx.lineWidth = 4;
      bctx.strokeStyle = '#34D399';
      bctx.stroke();

      bctx.font = 'bold 28px "Plus Jakarta Sans", system-ui, sans-serif';
      bctx.fillStyle = '#ECFDF5';
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.fillText('🗑️ Axlat qutisiga olib boring', 256, 57);
    }
    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    badgeTex.colorSpace = THREE.SRGBColorSpace;
    textures.push(badgeTex);

    const badgeMat = trackMat(
      new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthTest: false,
      })
    );
    carryBadgeSprite = new THREE.Sprite(badgeMat);
    carryBadgeSprite.scale.set(2.55, 0.56, 1);
    carryBadgeSprite.position.set(0, 3.25, 0);
    carryBadgeSprite.visible = false;
    carryBadgeSprite.renderOrder = 25;
    root.add(carryBadgeSprite);
  }

  let heldTrashKind: TrashKind | null = null;

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
    const isBoy = currentGender === 'boy' && !isTeacher;
    const eq = currentEquipped;

    // 1. Strict 3D Gender Safety Guard + Gym Sportswear override
    const isSportActive = gymWearActive || isCoach || (!isTeacher && eq.outfit === 'sport_uniform');

    whiteShirtTie.visible = !gymWearActive && isBoy && eq.outfit === 'white_shirt_tie';
    schoolVest.visible = !gymWearActive && isBoy && eq.outfit === 'school_vest';
    formalBlazer.visible = !gymWearActive && isBoy && eq.outfit === 'formal_blazer';

    girlBlouseSkirt.visible = !gymWearActive && isGirl && eq.outfit === 'girl_blouse_skirt';
    girlVestSkirt.visible = !gymWearActive && isGirl && eq.outfit === 'girl_vest_skirt';
    girlApronUniform.visible = !gymWearActive && isGirl && eq.outfit === 'girl_apron_uniform';

    sportUniform.visible = isSportActive;
    ceremonialUniform.visible = !gymWearActive && !isTeacher && eq.outfit === 'ceremonial_uniform';

    // 2. Toggle base boy/girl 3D hair & skirt/pants silhouettes
    const girlWearsSkirt = isGirl && !sportUniform.visible;
    boyLowerGroup.visible = isBoy && !sportUniform.visible;
    girlLowerGroup.visible = girlWearsSkirt;
    girlSkirtGroup.visible = girlWearsSkirt;
    girlWaistRibbon.visible = girlWearsSkirt && !girlApronUniform.visible;

    boyHairGroup.visible = !isGirl;
    girlHairGroup.visible = isGirl;

    // Hide base shirt collar when custom stand-collar outfits are worn
    collar.visible = (isTeacher && !isCoach) || (!sportUniform.visible && !ceremonialUniform.visible);

    // Sport stripes & ceremonial gold cuffs
    leftLeg.sportStripe.visible = sportUniform.visible;
    rightLeg.sportStripe.visible = sportUniform.visible;
    leftArm.sportStripe.visible = sportUniform.visible;
    rightArm.sportStripe.visible = sportUniform.visible;
    leftArm.ceremonialCuff.visible = ceremonialUniform.visible;
    rightArm.ceremonialCuff.visible = ceremonialUniform.visible;

    if (!isTeacher) {
      pantsMat.color.set(isGirl ? '#F8FAFC' : '#1E3A5F');
      shoeMat.color.set(isGirl ? '#334155' : '#1E293B');
      if (!options.hairColor) {
        hairMat.color.set(isGirl ? '#3B2314' : '#2C221E');
      }
    } else if (isCoach) {
      shirtMat.color.set('#0284C7');
      sleeveMat.color.set('#0284C7');
      pantsMat.color.set('#0F172A');
      shoeMat.color.set('#F8FAFC');
    }

    chustDoppi.visible = !gymWearActive && isBoy && eq.hat === 'chust_doppi';
    girlWhiteBows.visible = isGirl && eq.hat === 'girl_white_bows';
    iroqiDoppi.visible = !gymWearActive && isGirl && eq.hat === 'iroqi_doppi';
    scholarCap.visible = !gymWearActive && !isTeacher && eq.hat === 'scholar_cap';

    // Hide tiny default colorful ponytail bows when big 3D Oq Maktab Bantigi is equipped
    girlDefaultBowsGroup.visible = isGirl && !girlWhiteBows.visible;

    basicBackpack.visible = !gymWearActive && eq.bag === 'basic_backpack';
    classicSatchel.visible = !gymWearActive && eq.bag === 'classic_satchel';
    goldBackpack.visible = !gymWearActive && eq.bag === 'gold_backpack';

    schoolWatch.visible = eq.watch === 'school_watch';
    honorMedal.visible = eq.medal === 'honor_medal';
    scholarBook.visible = !gymWearActive && eq.book === 'scholar_book' && heldTrashKind === null;

    // Keep medal cleanly in front of thicker blazer/vest/apron/parade layers
    honorMedal.position.z =
      ceremonialUniform.visible ||
      sportUniform.visible ||
      formalBlazer.visible ||
      schoolVest.visible ||
      girlVestSkirt.visible ||
      girlApronUniform.visible
        ? 0.308
        : 0.275;

    // 3. Synchronize shirt, sleeve, skirt, pants, and shoe colors with active gender-valid outfit
    if (!isTeacher) {
      if (sportUniform.visible) {
        shirtMat.color.set('#0284C7');
        sleeveMat.color.set('#0284C7');
        pantsMat.color.set('#0F172A');
        shoeMat.color.set('#F8FAFC');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else if (ceremonialUniform.visible) {
        shirtMat.color.set('#F8FAFC');
        sleeveMat.color.set('#F8FAFC');
        pantsMat.color.set(isGirl ? '#F8FAFC' : '#0F172A');
        shoeMat.color.set('#0F172A');
        skirtMat.color.set('#0F172A');
        skirtPleatMat.color.set('#1E293B');
        skirtHemMat.color.set('#F59E0B');
        waistTrimMat.color.set('#F59E0B');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else if (whiteShirtTie.visible || schoolVest.visible) {
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
        skirtPleatMat.color.set('#172554');
        skirtHemMat.color.set('#172554');
        waistTrimMat.color.set('#1E3A8A');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else if (girlApronUniform.visible) {
        shirtMat.color.set('#172554');
        sleeveMat.color.set('#172554');
        skirtMat.color.set('#172554');
        skirtPleatMat.color.set('#0F172A');
        skirtHemMat.color.set('#0F172A');
        waistTrimMat.color.set('#FFFFFF');
        leftArm.cuff.visible = true;
        rightArm.cuff.visible = true;
      } else {
        shirtMat.color.set(baseShirtHex);
        sleeveMat.color.set(baseShirtHex);
        const baseSkirt = new THREE.Color(baseShirtHex).lerp(new THREE.Color('#0F172A'), 0.14);
        const pleatTone = new THREE.Color(baseShirtHex).lerp(new THREE.Color('#0F172A'), 0.32);
        skirtMat.color.copy(baseSkirt);
        skirtPleatMat.color.copy(pleatTone);
        skirtHemMat.color.copy(pleatTone);
        waistTrimMat.color.set(options.ribbonColor ?? '#FDE047');
        leftArm.cuff.visible = false;
        rightArm.cuff.visible = false;
      }
    }
  };

  let gymWearActive = false;
  const setGymWear = (enabled: boolean) => {
    gymWearActive = enabled;
    syncAppearance();
  };

  syncAppearance();

  let walkPhase = 0;
  let idlePhase = 0;

  let activeEmote: AvatarEmote | null = null;
  let emoteElapsed = 0;
  let emoteDuration = 2.8;

  const DEFAULT_EMOTE_DURATIONS: Record<AvatarEmote, number> = {
    salom: 2.75,
    qarsak: 2.8,
    quvonch: 2.85,
    milliy_raqs: 3.0,
    urm_warmup: 3.2,
    somersault: 2.2,
    bar_hang: 3.0,
    ladder_climb: 3.0,
    throw_ball: 2.0,
  };

  const triggerEmote = (emote: AvatarEmote, durationSec?: number) => {
    activeEmote = emote;
    emoteElapsed = 0;
    emoteDuration = Math.max(1.2, durationSec ?? DEFAULT_EMOTE_DURATIONS[emote]);
  };

  const isEmoteActive = () => activeEmote !== null;

  const dampSecondaryAxesToNeutral = (dt: number, speed = 11) => {
    leftArmPivot.rotation.y = THREE.MathUtils.damp(leftArmPivot.rotation.y, 0, speed, dt);
    leftArmPivot.rotation.z = THREE.MathUtils.damp(leftArmPivot.rotation.z, 0, speed, dt);
    rightArmPivot.rotation.y = THREE.MathUtils.damp(rightArmPivot.rotation.y, 0, speed, dt);
    rightArmPivot.rotation.z = THREE.MathUtils.damp(rightArmPivot.rotation.z, 0, speed, dt);
    headGroup.rotation.x = THREE.MathUtils.damp(headGroup.rotation.x, 0, speed, dt);
    headGroup.rotation.y = THREE.MathUtils.damp(headGroup.rotation.y, 0, speed, dt);
    bodyGroup.rotation.x = THREE.MathUtils.damp(bodyGroup.rotation.x, 0, speed, dt);
    bodyGroup.rotation.y = THREE.MathUtils.damp(bodyGroup.rotation.y, 0, speed, dt);
    bodyGroup.rotation.z = THREE.MathUtils.damp(bodyGroup.rotation.z, 0, speed, dt);
  };

  const updateAnimation = (dt: number, speedRatio: number, isAirborne: boolean, yHeight: number) => {
    idlePhase += dt * 3.2;

    // Immediately cancel any active emote when player walks, runs, or jumps
    if ((speedRatio > 0.05 || isAirborne) && activeEmote !== null) {
      activeEmote = null;
      emoteElapsed = 0;
    }

    const isCarryingTrash = heldTrashKind !== null;
    const restRightArmX = isCarryingTrash ? -0.62 : scholarBook.visible ? -0.28 : 0;
    const legSwingScale = girlSkirtGroup.visible ? 0.65 : 1.0;

    if (isAirborne) {
      leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, -2.1, 10, dt);
      rightArmPivot.rotation.x = THREE.MathUtils.damp(
        rightArmPivot.rotation.x,
        isCarryingTrash ? -0.82 : scholarBook.visible ? -0.9 : -2.1,
        10,
        dt
      );
      leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0.38 * legSwingScale, 10, dt);
      rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, -0.35 * legSwingScale, 10, dt);
      bodyGroup.position.y = THREE.MathUtils.damp(bodyGroup.position.y, 0, 12, dt);
      headGroup.rotation.z = THREE.MathUtils.damp(headGroup.rotation.z, 0, 10, dt);
      dampSecondaryAxesToNeutral(dt, 11);
    } else if (speedRatio > 0.05) {
      walkPhase += dt * (8.5 + speedRatio * 4.5);
      const swing = Math.sin(walkPhase) * 0.72 * Math.min(1, speedRatio);
      leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, swing * legSwingScale, 16, dt);
      rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, -swing * legSwingScale, 16, dt);
      leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, -swing * 0.82, 16, dt);
      rightArmPivot.rotation.x = THREE.MathUtils.damp(
        rightArmPivot.rotation.x,
        isCarryingTrash
          ? -0.64 + swing * 0.22
          : scholarBook.visible
          ? -0.32 + swing * 0.28
          : swing * 0.82,
        16,
        dt
      );
      bodyGroup.position.y = THREE.MathUtils.damp(
        bodyGroup.position.y,
        Math.abs(Math.sin(walkPhase)) * 0.075 * Math.min(1, speedRatio),
        16,
        dt
      );
      headGroup.rotation.z = THREE.MathUtils.damp(headGroup.rotation.z, Math.sin(walkPhase) * 0.04, 14, dt);
      dampSecondaryAxesToNeutral(dt, 12);
    } else if (activeEmote !== null) {
      emoteElapsed += dt;
      const t = emoteElapsed;
      const remaining = emoteDuration - emoteElapsed;

      if (remaining <= 0) {
        activeEmote = null;
        emoteElapsed = 0;
      } else if (activeEmote === 'salom') {
        // Polite Uzbek "Assalomu alaykum": right hand over heart, gentle respectful bow (~2s hold), smooth return
        const isReturning = remaining < 0.5;
        const tRightArmX = isReturning ? restRightArmX : -0.96;
        const tRightArmY = isReturning ? 0 : 0.24;
        const tRightArmZ = isReturning ? 0 : -0.68;
        const tLeftArmX = isReturning ? 0 : 0.05;
        const tLeftArmZ = isReturning ? 0 : 0.06;
        const tHeadX = isReturning ? 0 : 0.3 + Math.sin(t * 2.2) * 0.02;
        const tBodyX = isReturning ? 0 : 0.1;
        const speed = isReturning ? 7.5 : 8.5;

        rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, tRightArmX, speed, dt);
        rightArmPivot.rotation.y = THREE.MathUtils.damp(rightArmPivot.rotation.y, tRightArmY, speed, dt);
        rightArmPivot.rotation.z = THREE.MathUtils.damp(rightArmPivot.rotation.z, tRightArmZ, speed, dt);
        leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, tLeftArmX, speed, dt);
        leftArmPivot.rotation.y = THREE.MathUtils.damp(leftArmPivot.rotation.y, 0, speed, dt);
        leftArmPivot.rotation.z = THREE.MathUtils.damp(leftArmPivot.rotation.z, tLeftArmZ, speed, dt);
        headGroup.rotation.x = THREE.MathUtils.damp(headGroup.rotation.x, tHeadX, speed, dt);
        headGroup.rotation.y = THREE.MathUtils.damp(headGroup.rotation.y, 0, speed, dt);
        headGroup.rotation.z = THREE.MathUtils.damp(headGroup.rotation.z, 0, speed, dt);
        bodyGroup.rotation.x = THREE.MathUtils.damp(bodyGroup.rotation.x, tBodyX, speed, dt);
        bodyGroup.rotation.y = THREE.MathUtils.damp(bodyGroup.rotation.y, 0, speed, dt);
        bodyGroup.rotation.z = THREE.MathUtils.damp(bodyGroup.rotation.z, 0, speed, dt);
        bodyGroup.position.y = THREE.MathUtils.damp(bodyGroup.position.y, 0, speed, dt);
        leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0, speed, dt);
        rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, 0, speed, dt);
      } else if (activeEmote === 'qarsak') {
        // Polite, rhythmic applause in front of chest with sinusoidal oscillation
        const isReturning = remaining < 0.38;
        const clapWave = (Math.sin(t * 13.5) + 1) * 0.5;
        const clapIn = 0.2 + clapWave * 0.44;
        const speed = isReturning ? 9 : 16;

        leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, isReturning ? 0 : -1.24, speed, dt);
        leftArmPivot.rotation.y = THREE.MathUtils.damp(leftArmPivot.rotation.y, isReturning ? 0 : -0.25, speed, dt);
        leftArmPivot.rotation.z = THREE.MathUtils.damp(leftArmPivot.rotation.z, isReturning ? 0 : clapIn, speed, dt);

        rightArmPivot.rotation.x = THREE.MathUtils.damp(
          rightArmPivot.rotation.x,
          isReturning ? restRightArmX : -1.24,
          speed,
          dt
        );
        rightArmPivot.rotation.y = THREE.MathUtils.damp(rightArmPivot.rotation.y, isReturning ? 0 : 0.25, speed, dt);
        rightArmPivot.rotation.z = THREE.MathUtils.damp(rightArmPivot.rotation.z, isReturning ? 0 : -clapIn, speed, dt);

        headGroup.rotation.x = THREE.MathUtils.damp(
          headGroup.rotation.x,
          isReturning ? 0 : Math.sin(t * 6.75) * 0.08,
          10,
          dt
        );
        headGroup.rotation.y = THREE.MathUtils.damp(headGroup.rotation.y, 0, 10, dt);
        headGroup.rotation.z = THREE.MathUtils.damp(
          headGroup.rotation.z,
          isReturning ? 0 : Math.sin(t * 3.4) * 0.04,
          10,
          dt
        );
        bodyGroup.position.y = THREE.MathUtils.damp(
          bodyGroup.position.y,
          isReturning ? 0 : Math.abs(Math.sin(t * 6.75)) * 0.04,
          12,
          dt
        );
        bodyGroup.rotation.x = THREE.MathUtils.damp(bodyGroup.rotation.x, 0, 10, dt);
        bodyGroup.rotation.y = THREE.MathUtils.damp(bodyGroup.rotation.y, 0, 10, dt);
        bodyGroup.rotation.z = THREE.MathUtils.damp(bodyGroup.rotation.z, 0, 10, dt);
        leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0, 10, dt);
        rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, 0, 10, dt);
      } else if (activeEmote === 'quvonch') {
        // Joyful success celebration: arms raised high in V, light celebratory hops, affirming nod
        const isReturning = remaining < 0.4;
        const hop = isReturning ? 0 : Math.pow(Math.max(0, Math.sin(t * 6.4)), 1.45) * 0.34;
        const armPulse = Math.sin(t * 9.5) * 0.14;
        const speed = isReturning ? 9 : 13;

        leftArmPivot.rotation.x = THREE.MathUtils.damp(
          leftArmPivot.rotation.x,
          isReturning ? 0 : -2.72 + armPulse,
          speed,
          dt
        );
        leftArmPivot.rotation.y = THREE.MathUtils.damp(leftArmPivot.rotation.y, 0, speed, dt);
        leftArmPivot.rotation.z = THREE.MathUtils.damp(
          leftArmPivot.rotation.z,
          isReturning ? 0 : -0.26 - Math.abs(armPulse) * 0.4,
          speed,
          dt
        );

        rightArmPivot.rotation.x = THREE.MathUtils.damp(
          rightArmPivot.rotation.x,
          isReturning ? restRightArmX : -2.72 - armPulse,
          speed,
          dt
        );
        rightArmPivot.rotation.y = THREE.MathUtils.damp(rightArmPivot.rotation.y, 0, speed, dt);
        rightArmPivot.rotation.z = THREE.MathUtils.damp(
          rightArmPivot.rotation.z,
          isReturning ? 0 : 0.26 + Math.abs(armPulse) * 0.4,
          speed,
          dt
        );

        bodyGroup.position.y = THREE.MathUtils.damp(bodyGroup.position.y, hop, 15, dt);
        leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, hop * 0.55, 14, dt);
        rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, -hop * 0.45, 14, dt);

        headGroup.rotation.x = THREE.MathUtils.damp(
          headGroup.rotation.x,
          isReturning ? 0 : Math.sin(t * 12.8) * 0.13,
          12,
          dt
        );
        headGroup.rotation.y = THREE.MathUtils.damp(headGroup.rotation.y, 0, 10, dt);
        headGroup.rotation.z = THREE.MathUtils.damp(
          headGroup.rotation.z,
          isReturning ? 0 : Math.sin(t * 6.4) * 0.06,
          10,
          dt
        );
        bodyGroup.rotation.x = THREE.MathUtils.damp(bodyGroup.rotation.x, 0, 10, dt);
        bodyGroup.rotation.y = THREE.MathUtils.damp(bodyGroup.rotation.y, 0, 10, dt);
        bodyGroup.rotation.z = THREE.MathUtils.damp(bodyGroup.rotation.z, 0, 10, dt);
      } else if (activeEmote === 'milliy_raqs') {
        // Dignified Uzbek national dance: graceful arched arms, rhythmic wrist/shoulder flutter, gentle torso sway
        const isReturning = remaining < 0.42;
        const beat = Math.sin(t * 5.2);
        const wristFlutter = Math.sin(t * 10.4);
        const slowSway = Math.sin(t * 2.6);
        const speed = isReturning ? 8.5 : 11;

        leftArmPivot.rotation.x = THREE.MathUtils.damp(
          leftArmPivot.rotation.x,
          isReturning ? 0 : -2.52 + beat * 0.24,
          speed,
          dt
        );
        leftArmPivot.rotation.y = THREE.MathUtils.damp(
          leftArmPivot.rotation.y,
          isReturning ? 0 : wristFlutter * 0.52,
          speed,
          dt
        );
        leftArmPivot.rotation.z = THREE.MathUtils.damp(
          leftArmPivot.rotation.z,
          isReturning ? 0 : -0.5 + beat * 0.15,
          speed,
          dt
        );

        rightArmPivot.rotation.x = THREE.MathUtils.damp(
          rightArmPivot.rotation.x,
          isReturning ? restRightArmX : -2.52 - beat * 0.24,
          speed,
          dt
        );
        rightArmPivot.rotation.y = THREE.MathUtils.damp(
          rightArmPivot.rotation.y,
          isReturning ? 0 : -wristFlutter * 0.52,
          speed,
          dt
        );
        rightArmPivot.rotation.z = THREE.MathUtils.damp(
          rightArmPivot.rotation.z,
          isReturning ? 0 : 0.5 + beat * 0.15,
          speed,
          dt
        );

        bodyGroup.rotation.x = THREE.MathUtils.damp(bodyGroup.rotation.x, 0, 10, dt);
        bodyGroup.rotation.y = THREE.MathUtils.damp(
          bodyGroup.rotation.y,
          isReturning ? 0 : slowSway * 0.18,
          9,
          dt
        );
        bodyGroup.rotation.z = THREE.MathUtils.damp(
          bodyGroup.rotation.z,
          isReturning ? 0 : beat * 0.09,
          9,
          dt
        );
        bodyGroup.position.y = THREE.MathUtils.damp(
          bodyGroup.position.y,
          isReturning ? 0 : Math.abs(beat) * 0.08,
          12,
          dt
        );

        leftLegPivot.rotation.x = THREE.MathUtils.damp(
          leftLegPivot.rotation.x,
          isReturning ? 0 : beat * 0.18,
          11,
          dt
        );
        rightLegPivot.rotation.x = THREE.MathUtils.damp(
          rightLegPivot.rotation.x,
          isReturning ? 0 : -beat * 0.18,
          11,
          dt
        );

        headGroup.rotation.x = THREE.MathUtils.damp(
          headGroup.rotation.x,
          isReturning ? 0 : Math.abs(beat) * 0.05,
          10,
          dt
        );
        headGroup.rotation.y = THREE.MathUtils.damp(
          headGroup.rotation.y,
          isReturning ? 0 : slowSway * 0.14,
          9,
          dt
        );
        headGroup.rotation.z = THREE.MathUtils.damp(
          headGroup.rotation.z,
          isReturning ? 0 : -beat * 0.1,
          9,
          dt
        );
      } else if (activeEmote === 'urm_warmup') {
        const isReturning = remaining < 0.35;
        const wave = Math.sin(t * 7.2);
        const squat = (Math.sin(t * 3.6) + 1) * 0.5;
        leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, isReturning ? 0 : -1.8 + wave * 0.75, 14, dt);
        rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, isReturning ? restRightArmX : -1.8 - wave * 0.75, 14, dt);
        leftArmPivot.rotation.z = THREE.MathUtils.damp(leftArmPivot.rotation.z, isReturning ? 0 : -0.45 - Math.abs(wave) * 0.35, 12, dt);
        rightArmPivot.rotation.z = THREE.MathUtils.damp(rightArmPivot.rotation.z, isReturning ? 0 : 0.45 + Math.abs(wave) * 0.35, 12, dt);
        leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, isReturning ? 0 : -squat * 0.42, 12, dt);
        rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, isReturning ? 0 : -squat * 0.42, 12, dt);
        bodyGroup.position.y = THREE.MathUtils.damp(bodyGroup.position.y, isReturning ? 0 : -squat * 0.16 + 0.08, 12, dt);
        headGroup.rotation.x = THREE.MathUtils.damp(headGroup.rotation.x, isReturning ? 0 : wave * 0.14, 10, dt);
      } else if (activeEmote === 'somersault') {
        const p = Math.min(1, t / emoteDuration);
        bodyGroup.rotation.x = p * Math.PI * 2;
        bodyGroup.position.y = 0.35 + Math.sin(p * Math.PI) * 0.65;
        leftArmPivot.rotation.x = -1.6;
        rightArmPivot.rotation.x = -1.6;
        leftLegPivot.rotation.x = -0.9;
        rightLegPivot.rotation.x = -0.9;
      } else if (activeEmote === 'bar_hang') {
        const kneeRaise = (Math.sin(t * 5.2) + 1) * 0.5;
        leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, -2.95, 14, dt);
        rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, -2.95, 14, dt);
        leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, -0.2 - kneeRaise * 1.15, 14, dt);
        rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, -0.2 - kneeRaise * 1.15, 14, dt);
        bodyGroup.position.y = THREE.MathUtils.damp(bodyGroup.position.y, 0.55 + Math.sin(t * 2.6) * 0.08, 12, dt);
      } else if (activeEmote === 'ladder_climb') {
        const climb = Math.sin(t * 10.5);
        leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, -2.1 + climb * 0.72, 16, dt);
        rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, -2.1 - climb * 0.72, 16, dt);
        leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, -0.35 - climb * 0.55, 16, dt);
        rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, -0.35 + climb * 0.55, 16, dt);
        bodyGroup.position.y = THREE.MathUtils.damp(bodyGroup.position.y, 0.25 + Math.abs(climb) * 0.35, 12, dt);
      } else if (activeEmote === 'throw_ball') {
        const p = Math.min(1, t / emoteDuration);
        const armAngle = p < 0.35 ? THREE.MathUtils.lerp(-0.3, -2.75, p / 0.35) : THREE.MathUtils.lerp(-2.75, -0.35, (p - 0.35) / 0.65);
        rightArmPivot.rotation.x = armAngle;
        leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, -0.6, 12, dt);
        bodyGroup.rotation.y = Math.sin(p * Math.PI) * -0.45;
      }
    } else {
      leftLegPivot.rotation.x = THREE.MathUtils.damp(leftLegPivot.rotation.x, 0, 10, dt);
      rightLegPivot.rotation.x = THREE.MathUtils.damp(rightLegPivot.rotation.x, 0, 10, dt);
      leftArmPivot.rotation.x = THREE.MathUtils.damp(leftArmPivot.rotation.x, 0, 10, dt);
      rightArmPivot.rotation.x = THREE.MathUtils.damp(rightArmPivot.rotation.x, restRightArmX, 10, dt);
      bodyGroup.position.y = THREE.MathUtils.damp(
        bodyGroup.position.y,
        Math.sin(idlePhase * 0.65) * 0.025,
        8,
        dt
      );
      headGroup.rotation.z = THREE.MathUtils.damp(headGroup.rotation.z, 0, 8, dt);
      dampSecondaryAxesToNeutral(dt, 9);
    }

    if (scholarCap.visible) {
      tasselPivot.rotation.z = Math.sin(idlePhase * 1.1) * 0.08 + (speedRatio > 0.05 ? 0.14 : 0);
    }

    if (carryBadgeSprite && carryBadgeSprite.visible) {
      carryBadgeSprite.position.y = 3.22 + Math.sin(idlePhase * 1.4) * 0.08;
    }

    const effectiveHeight = Math.max(0, yHeight + Math.max(0, bodyGroup.position.y));
    shadowDisc.position.y = -yHeight + 0.025;
    const shadowScale = Math.max(0.45, 1 - effectiveHeight * 0.14);
    shadowDisc.scale.set(shadowScale, shadowScale, 1);
    shadowMat.opacity = Math.max(0.18, 0.62 - effectiveHeight * 0.1);
  };

  const setHeldTrash = (kind: TrashKind | null) => {
    heldTrashKind = kind;
    heldTrashGroup.visible = kind !== null;
    heldPaperGroup.visible = kind === 'paper';
    heldJuiceGroup.visible = kind === 'juice';
    heldBottleGroup.visible = kind === 'bottle';
    if (carryBadgeSprite) {
      carryBadgeSprite.visible = kind !== null;
    }
    syncAppearance();
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
      sportUniform,
      ceremonialUniform,
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
    setHeldTrash,
    setGymWear,
    triggerEmote,
    isEmoteActive,
    updateAnimation,
    dispose,
  };
}
