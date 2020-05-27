// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Plays audio clip
 */
const playAudio = (audioClip) => {
	const audio = new Audio(audioClip);
	audio.volume = 0.5;
	audio.play();
};

var img = document.querySelector('.portrait img');

new BreathingHalftone( img, {
  dotSize: 1/120,
  dotSizeThreshold: 0.01,
  initVelocity: 0.7,
  oscPeriod: 2,
  oscAmplitude: 0.2,
  channels: ['green', 'lum'],
  friction: 0.2,
  hoverDiameter: 0.3,
  hoverForce: 0.004,
  activeDiameter: 0.4,
  activeForce: 0.008
});

