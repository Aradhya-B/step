/**
 * Plays audio clip
 */
const playAudio = (audioClip) => {
	const audio = new Audio(audioClip);
	audio.volume = 0.5;
	audio.play();
};

// Typing animation configuration for title 
const options = {
	strings: [
		'Who the <strong>fork</strong> is Aradhya?',
		'Let\'s check the dictionary.',
		'^500 aradhya ▪ <em>noun</em> ^500'
	],
	typeSpeed: 35,
	backSpeed: 35,
	backDelay: 500,
	showCursor: false,
	onComplete: () => {
		const content = document.querySelector('.content-main');
		const footer = document.querySelector('footer');
		const img = document.querySelector('.portrait img');
		const portrait = document.querySelector('.portrait');
		content.style.opacity = 1;
		portrait.style.visibility = 'visible';
		footer.style.opacity = 1;
		createBreathingHalftoneImage(img);
	}
}
const typed = new Typed('#typed', options);

// Breathing halftone configuration on portrait image
const createBreathingHalftoneImage = (img) => {
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
}

// Baffle config and functions

const b = baffle(document.querySelector('.baffle'), {
	speed: 75
}).start();

const setSecretMessageSubText = (text) => {
	const secretMessageSubtitle = document.querySelector('#secret-sub');
	secretMessageSubtitle.innerHTML = text;
}

const revealSecretMessage = () => {
	b.reveal(3000, setSecretMessageSubText('I truly mean it!'));
}
