// utils/trueRandom.ts   ← 新建这个文件（只写一次，全项目通用）
let entropyPool = 0;
let lastTime = performance.now();

export function addClickEntropy(x, y) {
  const now = performance.now();
  const timeDelta = now - lastTime;

  // 把鼠标坐标、时间差、微小性能波动全部塞进熵池
  entropyPool += x * 31 + y * 73 + timeDelta * 17 + Math.random() * 1000;
  lastTime = now;
}

export function getTrueRandomInt(max) {
  // 优先用 Web Crypto（密码学级真随机）
  if (window.crypto?.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  // 兜底：用我们自己收集的熵 + Math.random 混合
  entropyPool = (entropyPool * 1664525 + 1013904223) % 4294967296; // 线性同余增强
  return Math.abs(Math.floor(entropyPool % max));
}