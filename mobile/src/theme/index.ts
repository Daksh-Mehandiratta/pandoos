import { DefaultTheme } from '@react-navigation/native';

export const PANDA_THEME = {
  colors: {
    obsidian: '#0A0A0F', // Deep Black Background
    snow: '#FFFFFF', // Pure White for high contrast text
    bamboo: '#1ED760', // Neon Green accent (active states)
    glass: 'rgba(255, 255, 255, 0.05)', // Frosted glass backgrounds
    surface: '#121216', // Slightly lighter black for cards
    muted: '#888888', // Secondary text
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    round: 9999,
  }
};

// React Navigation Integration Theme
export const NavigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: PANDA_THEME.colors.bamboo,
    background: PANDA_THEME.colors.obsidian,
    card: PANDA_THEME.colors.surface,
    text: PANDA_THEME.colors.snow,
    border: 'transparent',
    notification: PANDA_THEME.colors.bamboo,
  },
};
