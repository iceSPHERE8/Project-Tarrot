// components/Tooltip.jsx
import { useState } from "react";
import { Html } from "@react-three/drei";

export default function Tooltip({ children, text }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState([0, 0, 0]); // 鼠标在3D空间的位置

  const handlePointerOver = (e) => {
    e.stopPropagation();           // 防止事件冒泡触发父级
    setVisible(true);
    // 把鼠标在3D场景中的位置记录下来（drei 自动给了我们）
    setPosition([e.point.x, e.point.y, e.point.z]);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setVisible(false);
  };

  const handlePointerMove = (e) => {
    if (visible) {
      // 实时跟随鼠标（稍微抬高一点避免遮住牌）
      setPosition([e.point.x, e.point.y, e.point.z]);
    }
  };

  return (
    <group
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
    >
      {children}

      {/* 鼠标跟随的提示框 */}
      {visible && (
        <Html position={[position[0] + 1.5, position[1], position[2] + 2.5]}>
          <div className="pointer-events-none">
            <div
              className="px-1 text-xs font-medium text-[#08060b] 
                         bg-[#d8d3d7]/95 backdrop-blur-md 
                         shadow-xl
                         whitespace-nowrap
                         animate-in fade-in zoom-in-95 duration-150"
            >
              {text}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}