// utils/avatarColor.ts

export class AvatarColor {
  private colors: string[] = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#EDED13", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#800000", // Maroon
    "#808000", // Olive
    "#800080", // Purple
    "#008080", // Teal
    "#FFA500", // Orange
    "#A52A2A", // Brown
    "#8A2BE2", // BlueViolet
    "#FFC0CB", // Pink
    "#228B22", // ForestGreen
    "#000000", // Black
  ];

  /**
   * 根据索引获取对应的颜色。
   * @param index - 候选人的索引
   * @returns 颜色的十六进制字符串
   */
  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }
}
