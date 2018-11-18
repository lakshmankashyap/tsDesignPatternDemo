class BlurayPlayer {
  on() {
    console.log(`[BlurayPlayer] turning on..`);  
  }

  turnOff() {
    console.log(`[BluerayPlayer] turning off..`);
  }

  play() {
    console.log(`Playing [BluerayPlayer] disc...`);
  }
}

class Amplifier {
  on() {
    console.log(`[Amp] turning on..`);  
  }

  turnOff() {
    console.log(`[Amp] turning off..`);
  }

  setSource(source: string) {
    console.log(`[Amp] Setting Source to ${source}`);
  }

  setVolume(volumeLevel: number) {
    console.log(`[Amp] Setting volume to ${volumeLevel}`);
  }
}

class Lights{
  dim() {
    console.log(`[Lights] Lights are dimming`);
  }
}

class TV{
  turnOn() {
    console.log(`[TV] TV turning on..`);
  }

  turnOff() {
    console.log(`[TV] TV turning off..`);
  }
}

class PopcornMaker{
  turnOn() {
    console.log(`[PopcornMaker] PopcornMaker turning on..`);
  }

  turnOff() {
    console.log(`[PopcornMaker] PopcornMaker turning off..`);
  }

  pop() {
    console.log(`[PopcornMaker] Poping Corn`);
  }
}

class HomeTheaterFacade{

  private bluray: BlurayPlayer;
  private amp: Amplifier;
  private lights: Lights;
  private tv: TV;
  private popcornMaker: PopcornMaker;

  constructor(amp: Amplifier, bluray: BlurayPlayer, lights: Lights, tv: TV, popcornMaker: PopcornMaker){
    this.amp = amp;
    this.bluray = bluray;
    this.lights = lights;
    this.tv = tv;
    this.popcornMaker = popcornMaker;
  }

  public watchMovie() {
    this.popcornMaker.turnOn();
    this.popcornMaker.pop();

    this.lights.dim();

    this.tv.turnOn();

    this.amp.on();
    this.amp.setSource('bluray');
    this.amp.setVolume(11);

    this.bluray.on();
    this.bluray.play();
  }

  public endMovie() {
    this.popcornMaker.turnOff();
    this.amp.turnOff();
    this.tv.turnOff();
    this.bluray.turnOff();
  }
}

let bluray = new BlurayPlayer();
let amp = new Amplifier();
let lights = new Lights();
let tv = new TV();
let popcornMaker = new PopcornMaker();

let hometheater = new HomeTheaterFacade(amp, bluray, lights, tv, popcornMaker);
hometheater.watchMovie();