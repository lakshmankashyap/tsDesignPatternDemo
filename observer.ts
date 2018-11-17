interface Subject {
  registerObserver(o: Observer);
  removeObserver(o: Observer);
  notifyObservers();
} 

interface Observer {
  update(temperature: number);
}
class WeatherStation implements Subject {
  private temperature: number;
  private observers: Observer[] = [];

  public registerObserver(o: Observer) {
    this.observers.push(o);
  }

  public removeObserver(o: Observer) {
    let index = this.observers.indexOf(o);
    this.observers.splice(index, 1);
  }

  public notifyObservers() {
    for (let observer of this.observers) {
      observer.update(this.temperature);
    }
  }
  
  setTemperature(temp: number) {
    console.log(`WeatherStation: new temperature measurement: ${temp}`);
    this.temperature = temp;
    this.notifyObservers();
  }

}

class TemperatureDisplay implements Observer{
  private subject: Subject;

  constructor(weatherStation: Subject) {
    this.subject = weatherStation;
    weatherStation.registerObserver(this);
  }
  public update(temperature: number) {
    console.log(`TemperatureDisplay: I need to update my display`);
    // logic to update  
  }
}

class Fan implements Observer{
  private subject: Subject;

  constructor(weatherStation: Subject) {
    this.subject = weatherStation;
    weatherStation.registerObserver(this);
  }
  public update(temperature: number) {
    if (temperature > 25) {
      console.log('[Fan]: its hot here, turning myself on');
    } else {
      console.log('[Fan]: its hot here, turning myself off');
    }
  }
}

let weatherStation = new WeatherStation();
let temperatureDisplay = new TemperatureDisplay(weatherStation);
let fan = new Fan(weatherStation);
weatherStation.setTemperature(20);
weatherStation.setTemperature(30);
