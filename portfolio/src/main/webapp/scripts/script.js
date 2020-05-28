/*
 * Configures and creates new typing visual for title on page load
 */
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
	/*
	 * After the typing animation is complete,
	 * reveal all the page content and create 
	 * breathing half tone out of main image
	 */
	onComplete: () => {
		const content = document.querySelector('.content-main');
		const footer = document.querySelector('footer');
		const img = document.querySelector('.portrait img');
		const portrait = document.querySelector('.portrait');
		content.style.opacity = 1;
		portrait.style.visibility = 'visible';
		footer.style.opacity = 1;

		// Configuration for breathing half tone
		new BreathingHalftone( img, {
		  dotSize: 1/120,
		  dotSizeThreshold: 0.01,
		  initVelocity: 0.7,
		  oscPeriod: 2,
		  oscAmplitude: 0.2,
		  channels: ['green', 'lum'],
		  friction: 0.2,
		  hoverDiameter: 0.4,
		  hoverForce: 0.01,
		  activeDiameter: 0.5,
		  activeForce: 0.03
		});
	}
}

const typed = new Typed('#typed', options);

/*
 * Starts obscuring secret message on page load
 */
const b = baffle(document.querySelector('.baffle'), {
	speed: 75
}).start();

/*
 * Sets text on subtitle text of secret message
 */
const setSecretMessageSubText = (text) => {
	const secretMessageSubtitle = document.querySelector('#secret-sub');
	secretMessageSubtitle.innerHTML = text;
}

/*
 * Reveals secret message and sets text on secret message subtitle
 */
const revealSecretMessage = () => {
	b.reveal(3000, setSecretMessageSubText('I truly mean it!'));
}

/**
 * Plays audio clip
 */
const playAudio = (audioClip) => {
	const audio = new Audio(audioClip);

	// lower the default volume
	audio.volume = 0.5;

	audio.play();
};
