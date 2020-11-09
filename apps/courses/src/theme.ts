import { extendTheme } from '@chakra-ui/core';

const buttonColors = (c) => {
  const fill = (type) => {
    if (c === 'gray') {
      if (type === 'regular') return `${c}.300`;
      if (type === 'hover') return `${c}.400`;
      if (type === 'active') return `${c}.500`;
    } else if (c === 'black') {
      if (type === 'regular') return `gray.900`;
      if (type === 'hover') return `gray.800`;
      if (type === 'active') return `gray.700`;
    } else if (c === 'white') {
      if (type === 'regular') return `white`;
      if (type === 'hover') return `gray.50`;
      if (type === 'active') return `gray.100`;
    }

    if (type === 'regular') return `${c}.400`;
    if (type === 'hover') return `${c}.500`;
    if (type === 'active') return `${c}.600`;
  };

  const regularFill = fill('regular');
  const hoverFill = fill('hover');
  const activeFill = fill('active');
  const color = ['gray', 'yellow', 'cyan', 'white'].includes(c)
    ? 'black'
    : 'white';

  return { regularFill, hoverFill, activeFill, color };
};

export default extendTheme({
  styles: {
    global: {
      '*:focus': {
        outline: 'none !important',
        boxShadow: 'none !important',
      },
      '.chakra-progress[variant="controlled-motion"] .chakra-progress__indicator': {
        transition: 'none',
      },
    },
  },
  colors: {
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EDEDED',
      300: '#DFDFDF',
      400: '#BCBCBC',
      500: '#9D9D9D',
      600: '#747474',
      700: '#606060',
      800: '#323232',
      900: '#202020',
    },
    magenta: {
      50: '#F6E3EC',
      100: '#E9B9D0',
      200: '#DD8CB2',
      300: '#D26194',
      400: '#CA437E',
      500: '#BD2C6A',
      600: '#AA235E',
      700: '#952558',
      800: '#7C1E4E',
      900: '#641947',
    },
    red: {
      50: '#FFE5EC',
      100: '#FCC4D0',
      200: '#EA8396',
      300: '#DC6173',
      400: '#D45060',
      500: '#C12A45',
      600: '#B10C33',
      700: '#A30B2C',
      800: '#920B28',
      900: '#7A051E',
    },
    orange: {
      50: '#FCEEDE',
      100: '#F7D3AD',
      200: '#F1B77A',
      300: '#EB9A47',
      400: '#E88522',
      500: '#E27101',
      600: '#E06113',
      700: '#D14D02',
      800: '#CF3C00',
      900: '#C6260A',
    },
    yellow: {
      50: '#FEF7DE',
      100: '#FCEAAB',
      200: '#FADD73',
      300: '#F7D136',
      400: '#EBBD0A',
      500: '#D7A30A',
      600: '#B97F0C',
      700: '#97600D',
      800: '#82500A',
      900: '#734301',
    },
    green: {
      50: '#E6F3E6',
      100: '#C2E0C1',
      200: '#9BCC9A',
      300: '#73B973',
      400: '#56AB56',
      500: '#399D3A',
      600: '#308B31',
      700: '#267D28',
      800: '#267D28',
      900: '#034F0C',
    },
    teal: {
      50: '#DFF1F1',
      100: '#AEDEDC',
      200: '#79C9C5',
      300: '#3EB3AD',
      400: '#00A39B',
      500: '#009289',
      600: '#00837C',
      700: '#006F6A',
      800: '#005C59',
      900: '#004A48',
    },
    cyan: {
      50: '#D8F6FA',
      100: '#D8F6FA',
      200: '#7CD8E4',
      300: '#50CFE0',
      400: '#0FC2DA',
      500: '#00AFC9',
      600: '#00A2B7',
      700: '#008EA3',
      800: '#007485',
      900: '#00525B',
    },
    blue: {
      50: '#E4EFF5',
      100: '#BCD8E7',
      200: '#96C0D7',
      300: '#75A7C6',
      400: '#578CB1',
      500: '#427FAB',
      600: '#3470A0',
      700: '#346692',
      800: '#245382',
      900: '#223F64',
    },
    indigo: {
      50: '#E7E8EE',
      100: '#C2C6D7',
      200: '#9BA2BC',
      300: '#767EA1',
      400: '#5B638F',
      500: '#49558E',
      600: '#3A4583',
      700: '#2F3971',
      800: '#212962',
      900: '#181F54',
    },
    violet: {
      50: '#F1E3EF',
      100: '#DCBAD7',
      200: '#C68DBE',
      300: '#AE62A4',
      400: '#9D4392',
      500: '#8E2183',
      600: '#7C0C78',
      700: '#650869',
      800: '#530765',
      900: '#430258',
    },
  },
  fonts: {
    heading: `"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `"Fira Code", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '4rem',
    hero: '6rem',
  },
  letterSpacings: {
    tight: '-0.04em',
    normal: '0',
    wide: '0.08em',
    wider: '0.16em',
    widest: '0.24em',
  },
  lineHeights: {
    normal: 'normal',
    none: '1',
    shorter: '1.1',
    short: '1.3',
    base: '1.5',
    tall: '1.6',
    taller: '2',
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 'medium',
      },
      variants: {
        solid: (props) => {
          const { colorScheme: c } = props;
          const { regularFill, hoverFill, activeFill, color } = buttonColors(c);

          return {
            color,
            bg: regularFill,
            _hover: {
              bg: hoverFill,
            },
            _active: {
              bg: activeFill,
            },
          };
        },
        outline: (props) => {
          const { colorScheme: c } = props;
          const { regularFill, hoverFill, activeFill, color } = buttonColors(c);

          return {
            border: '2px solid',
            borderColor: regularFill,
            color: regularFill,
            bg: 'transparent',
            _hover: {
              borderColor: hoverFill,
              bg: hoverFill,
              color,
            },
            _active: {
              borderColor: activeFill,
              bg: activeFill,
              color,
            },
          };
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: 'sm',
        fontWeight: 'bold',
        color: 'gray.700',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'medium',
      },
      sizes: {
        hero: {
          fontSize: ['6xl', null, null, null, 'hero'],
        },
      },
    },
    Modal: {
      baseStyle: {
        content: {
          p: [4, 8, null, null, 12],
        },
      },
    },
  },
});
