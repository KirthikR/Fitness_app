import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  loadAsync: jest.fn().mockResolvedValue(true),
}));
jest.mock('expo-asset');
jest.mock('expo-linear-gradient', () => 'LinearGradient');
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Mock SVG components
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: 'Svg',
    Circle: () => React.createElement('Circle'),
    Path: () => React.createElement('Path'),
    Rect: () => React.createElement('Rect'),
  };
});

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.FadeIn = () => ({ duration: jest.fn() });
  Reanimated.default.FadeInDown = { 
    delay: () => ({ duration: () => ({ springify: jest.fn() }) }) 
  };
  Reanimated.default.SlideInUp = { springify: jest.fn() };
  return Reanimated;
});

// Mock the router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/home',
  Tabs: { 
    Screen: jest.fn(),
  },
}));

// ⚠️ FIXED: Use correct mock for NativeAnimatedHelper
// The path has changed in recent React Native versions
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  __esModule: true,
  default: {
    API: {},
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
}), { virtual: true });  // Add virtual: true flag for modules that might not exist