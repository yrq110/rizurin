const HASH  = '#';
const EMPTY_STRING = '';
const RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
const RGB_PAREN = 'rgb(';
const ZERO = '0';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

export class Color {

  static rgbToHex(r: number, g: number, b: number) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  static hexToRgb(hex: string): RGB {
    let val = hex;
    val = val.replace(HASH, EMPTY_STRING);
    const bigint = parseInt(val, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  static getNormalColors(color: RGB) {
    const t = c => Number(c / 255).toFixed(2);
    return [t(color.r), t(color.g), t(color.b)];
  }

  static getRandomColor() {
    let randColor = ((Math.random() * 0xffffff) << 0).toString(16);
    while (randColor.length < 6) {
      randColor = ZERO + randColor;
    }
    // console.warn('getrandom color:', randColor);
    return HASH + randColor;
  }

  static getRGB(color: string): RGB {
    let rgb;
    // color string
    if (color[0] === HASH) {
      // hex
      return Color.hexToRgb(color.substring(1));
    }  if (color.substr(0, 4) === RGB_PAREN) {
      // rgb string
      rgb = RGB_REGEX.exec(color.replace(/ /g, ''));
      return {
        r: parseInt(rgb[1], 10),
        g: parseInt(rgb[2], 10),
        b: parseInt(rgb[3], 10),
      };
    }
      // default
    return {
      r: 0,
      g: 0,
      b: 0,
    };

  }
  // convert any color string to RGBA object
  // from https://github.com/component/color-parser
  // colorToRGBA(str: string): RGBA {
  //   str = str || 'black';
  //   return (
  //     Color.hex3ColorToRGBA(str) ||
  //     Color.hex6ColorToRGBA(str)
  //     // Color._rgbColorToRGBA(str) ||
  //     // Color._rgbaColorToRGBA(str)
  //   );
  // },
  // Parse rgb(n, n, n)
  // _rgbColorToRGBA(str: string): RGBA {
  //   if (str.indexOf('rgb(') === 0) {
  //     str = str.match(/rgb\(([^)]+)\)/)[1];
  //     var parts = str.split(/ *, */).map(Number);
  //     return {
  //       r: parts[0],
  //       g: parts[1],
  //       b: parts[2],
  //       a: 1
  //     };
  //   }
  // },
  // Parse rgba(n, n, n, n)
  // _rgbaColorToRGBA(str: string): RGBA {
  //   if (str.indexOf('rgba(') === 0) {
  //     str = str.match(/rgba\(([^)]+)\)/)[1];
  //     var parts = str.split(/ *, */).map(Number);
  //     return {
  //       r: parts[0],
  //       g: parts[1],
  //       b: parts[2],
  //       a: parts[3]
  //     };
  //   }
  // },
  // Parse #nnnnnn
  static hex6ColorToRGBA(str: string): RGBA | null {
    if (str[0] === '#' && str.length === 7) {
      return {
        r: parseInt(str.slice(1, 3), 16),
        g: parseInt(str.slice(3, 5), 16),
        b: parseInt(str.slice(5, 7), 16),
        a: 1,
      };
    }
    return null;
  }
  // Parse #nnn
  static hex3ColorToRGBA(str: string): RGBA | null {
    if (str[0] === '#' && str.length === 4) {
      return {
        r: parseInt(str[1] + str[1], 16),
        g: parseInt(str[2] + str[2], 16),
        b: parseInt(str[3] + str[3], 16),
        a: 1,
      };
    }
    return null;
  }
}
