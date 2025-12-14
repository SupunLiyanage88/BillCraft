declare module 'colorthief' {
  type Color = [number, number, number];
  
  export default class ColorThief {
    /**
     * Get the dominant color from an image
     * @param img HTML Image element
     * @param quality Quality is an optional argument (default 10) to determine the resolution at which the image is sampled
     * @returns Array of RGB values [r, g, b]
     */
    getColor(img: HTMLImageElement, quality?: number): Color;
    
    /**
     * Get a color palette from an image
     * @param img HTML Image element
     * @param colorCount Number of colors in the palette (2-10, default 10)
     * @param quality Quality is an optional argument (default 10) to determine the resolution at which the image is sampled
     * @returns Array of RGB color arrays
     */
    getPalette(img: HTMLImageElement, colorCount?: number, quality?: number): Color[];
  }
}
