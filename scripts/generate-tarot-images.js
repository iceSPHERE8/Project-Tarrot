// scripts/generate-tarot-images.ts
import fs from "fs";
import path from "path";

const facesDir = path.join(process.cwd(), "public/tarot/faces");
const files = fs
    .readdirSync(facesDir)
    .filter((f) => f.endsWith(".png")) // 只保留 png
    .map((f) => {
        // 从文件名提取数字（比如 0001、0010、0023）
        const match = f.match(/(\d{4})\.png$/);
        return { name: f, num: match ? parseInt(match[1]) : 9999 };
    })
    .sort((a, b) => a.num - b.num) // 按数字排序
    .map((item) => item.name); // 只返回文件名

if (files.length === 0) {
    console.error(
        "错误：没有找到任何图片！检查 public/tarot/faces 路径和文件名"
    );
    process.exit(1);
}

const content = `// 此文件自动生成，请勿手动修改（共 ${files.length} 张）
export const TAROT_CARD_IMAGES = [
${files.map((f) => `  "/tarot/faces/${f}",`).join("\n")}
];

export const TOTAL_CARDS = ${files.length};
`;

fs.writeFileSync("src/lib/tarot-images.generated.js", content);
console.log(`成功生成 ${files.length} 张卡牌路径！`);
