import * as THREE from 'three';

export function createCheckerboardFloorTexture(
  maxAnisotropy: number,
  lightHex = '#F8FAFC',
  darkHex = '#CBD5E1'
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const tile = size / 4;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const isLight = (x + y) % 2 === 0;
      ctx.fillStyle = isLight ? lightHex : darkHex;
      ctx.fillRect(x * tile, y * tile, tile, tile);

      // Subtle grout seam
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.32)';
      ctx.lineWidth = 3;
      ctx.strokeRect(x * tile + 1.5, y * tile + 1.5, tile - 3, tile - 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(9, 7.5);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createSignboardTexture(
  title: string,
  subtitle: string,
  accentColor: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Rounded plaque body
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, 1024, 256);

  // Colored top & bottom border accent
  ctx.fillStyle = accentColor;
  ctx.fillRect(14, 14, 996, 228);

  // Crisp inner card
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(28, 28, 968, 200);

  // Left color block bar
  ctx.fillStyle = accentColor;
  ctx.fillRect(28, 28, 36, 200);

  // Title text
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 64px Outfit, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 528, 104, 880);

  // Subtitle text
  ctx.fillStyle = accentColor;
  ctx.font = '700 32px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(subtitle, 528, 178, 880);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createElevatorLedTexture(
  floor: number,
  accentColor: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0B1220';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 120);

  // Glowing floor indicators (1 · 2 · 3)
  [1, 2, 3].forEach((f, idx) => {
    const cx = 116 + idx * 140;
    const isActive = f === floor;

    ctx.beginPath();
    ctx.arc(cx, 64, 38, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? accentColor : '#1E293B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = isActive ? '#FEF08A' : '#334155';
    ctx.stroke();

    ctx.fillStyle = isActive ? '#FFFFFF' : '#64748B';
    ctx.font = '800 44px Outfit, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${f}`, cx, 66);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createChalkboardTexture(
  formula: string,
  label: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1E4635';
  ctx.fillRect(0, 0, 512, 256);

  // Subtle chalk smudge texture
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, 15 + Math.random() * 35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#E2F5EA';
  ctx.font = '700 38px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formula, 256, 106, 460);

  ctx.fillStyle = '#FDE68A';
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(label, 256, 176, 460);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createAwningTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const stripes = 8;
  const stripeWidth = 512 / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#F59E0B' : '#FFFBEB';
    ctx.fillRect(i * stripeWidth, 0, stripeWidth, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 6, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.42)');
  grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.16)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createHallMedallionTexture(
  maxAnisotropy: number,
  bgHex = '#EFF6FF',
  ringHex = '#3B82F6',
  subLabel = '1-QAVAT • ASOSIY'
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Outer ring
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.fillStyle = bgHex;
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = ringHex;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(256, 256, 188, 0, Math.PI * 2);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Center text
  ctx.fillStyle = '#0F172A';
  ctx.font = '800 38px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BILIMLAR MAKTABI', 256, 224, 320);

  ctx.fillStyle = ringHex;
  ctx.font = '800 34px Outfit, sans-serif';
  ctx.fillText(subLabel, 256, 286, 320);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createScheduleBoardTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  // Clean cork/ivory school display backing
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 1024, 680);

  // Inner subtle border
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 10;
  ctx.strokeRect(18, 18, 988, 644);

  // Header band
  ctx.fillStyle = '#0F766E';
  ctx.fillRect(28, 28, 968, 96);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 44px Outfit, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BUGUNGI DARS JADVALI', 512, 78);

  // 5 colorful schedule strips showing each subject's floor
  const rows = [
    { num: '1-soat', label: 'Alifbe (1-sinf)', floor: '1-qavat', color: '#E11D48', bg: '#FFF1F2' },
    { num: '2-soat', label: 'Matematika', floor: '1-qavat', color: '#2563EB', bg: '#EFF6FF' },
    { num: '3-soat', label: 'Ingliz tili', floor: '2-qavat', color: '#16A34A', bg: '#F0FDF4' },
    { num: '4-soat', label: 'Informatika', floor: '3-qavat', color: '#7C3AED', bg: '#F5F3FF' },
    { num: '5-soat', label: 'Tabiiy fanlar', floor: '3-qavat', color: '#EA580C', bg: '#FFF7ED' },
  ];

  rows.forEach((row, idx) => {
    const y = 148 + idx * 98;
    ctx.fillStyle = row.bg;
    ctx.fillRect(46, y, 932, 82);

    ctx.fillStyle = row.color;
    ctx.fillRect(46, y, 22, 82);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 3;
    ctx.strokeRect(46, y, 932, 82);

    ctx.fillStyle = row.color;
    ctx.fillRect(92, y + 16, 152, 50);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 28px Outfit, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(row.num, 168, y + 42);

    ctx.fillStyle = '#0F172A';
    ctx.font = '800 34px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(row.label, 274, y + 42);

    ctx.fillStyle = '#0D9488';
    ctx.font = '700 26px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(row.floor, 944, y + 42);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export function createWallPosterTexture(
  title: string,
  subtitle: string,
  accentHex: string,
  bgHex: string,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 512, 340);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 14;
  ctx.strokeRect(10, 10, 492, 320);

  ctx.fillStyle = accentHex;
  ctx.fillRect(28, 28, 456, 72);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 32px Outfit, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 256, 65, 420);

  ctx.fillStyle = '#1E293B';
  ctx.font = '700 26px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(subtitle, 256, 200, 420);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  return texture;
}

