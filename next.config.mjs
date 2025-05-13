/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";

const nextConfig = {
  // 配置pageExtensions包含MDX文件
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/, // 添加这行来处理.md文件
  // 可选：添加markdown插件
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// 合并MDX配置与Next.js配置
export default withMDX(nextConfig);
