import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EquippedAccessories, PlayerGender } from '../types';
import { createRobloxAvatar, RobloxAvatarRig } from '../three/avatar';

interface AvatarPreview3DProps {
  gender: PlayerGender;
  shirtColor: string;
  equipped: EquippedAccessories;
}

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

export const AvatarPreview3D: React.FC<AvatarPreview3DProps> = ({
  gender,
  shirtColor,
  equipped,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<RobloxAvatarRig | null>(null);
  const genderRef = useRef<PlayerGender>(gender);

  useEffect(() => {
    genderRef.current = gender;
    avatarRef.current?.setGender(gender);
  }, [gender]);

  useEffect(() => {
    avatarRef.current?.setShirtColor(shirtColor);
  }, [shirtColor]);

  useEffect(() => {
    avatarRef.current?.applyAccessories(equipped);
  }, [equipped]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl, alpha: true });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    const w = container.clientWidth || 320;
    const h = container.clientHeight || 320;
    renderer.setSize(w, h);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 0.42;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 50);
    camera.position.set(0, 2.05, 5.1);
    camera.lookAt(0, 1.32, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    scene.add(new THREE.HemisphereLight(0xe0f2fe, 0xfef3c7, 0.6));
    const dir = new THREE.DirectionalLight(0xfffbeb, 1.05);
    dir.position.set(4, 7, 5);
    scene.add(dir);

    // Pedestal base
    const pedestalGeo = new THREE.CylinderGeometry(1.18, 1.3, 0.24, 24);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.12,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.12;
    scene.add(pedestal);

    const ringGeo = new THREE.TorusGeometry(1.22, 0.04, 10, 36);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.25,
      metalness: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.0;
    scene.add(ring);

    const avatar = createRobloxAvatar(shirtColor, equipped, false, { gender: genderRef.current });
    scene.add(avatar.root);
    avatarRef.current = avatar;

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 320;
      const nh = container.clientHeight || 320;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let lastTime = performance.now();
    let frameId = 0;
    let disposed = false;

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
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.08);
      lastTime = now;
      avatar.root.rotation.y += dt * 0.72;
      avatar.updateAnimation(dt, 0.25, false, 0);
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
      window.removeEventListener('resize', onResize);
      pedestalGeo.dispose();
      pedestalMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      avatar.dispose();
      envTarget.dispose();
      renderer.dispose();
      avatarRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[280px]" />;
};
