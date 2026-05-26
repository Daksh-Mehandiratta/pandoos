import { registerRootComponent } from 'expo';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { playbackService } from './src/services/playbackService';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);

// Register the background playback service for react-native-track-player
TrackPlayer.registerPlaybackService(() => playbackService);
