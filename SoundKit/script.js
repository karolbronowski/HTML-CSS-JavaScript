function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`); // odtwarzanie dzwieku z przysku klawisza
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`);
  if (!audio) return;

  recObjects.map(el => {
    if(el.isRecording)
      el.recordSound(audio)
  });

  key.classList.add('active');
  setTimeout(() => {
    key.classList.remove('active');
  }, audio.duration * 200);
  audio.currentTime = 0;
  audio.play();
}

let Rec = function(recRef)  //funkcja do "nagrywnia" sekwencji przyciskanych dzwiekow
{
  this.recRef = recRef;
  this.recRef.addEventListener("click",() => {this.switchState()});
  
  this.isRecording = false;
  this.currentTime = 0;
  this.switchState = function()
  {
    if(this.isRecording)
    {
      this.isRecording = false;
      this.recRef.classList.remove('active');
      console.log("rec stop")
    }
    else
    {
      this.isRecording = true;
      this.recRef.classList.add('active');
      this.currentTime = Date.now();
      console.log(this.currentTime);
    }
  }

  this.recordedSounds = [];   

  this.recordSound = function(sound)    //nagrywanie funkcji 
  {
    this.recordedSounds.push(
      {
        sound: sound,
        time: Date.now() - this.currentTime
      });
      this.currentTime = Date.now();
  }

  this.play = function(i) // odtwarzanie 
  {
    i = i ? i : 0;
    if(this.recordedSounds <= 0) return;
    setTimeout(() => {
      this.recordedSounds[i].sound.currentTime = 0;
      this.recordedSounds[i].sound.play();
      if(i < this.recordedSounds.length-1) this.play(++i);
    }, this.recordedSounds[i].time);
  }
  console.log(this);
}

window.addEventListener('keydown', playSound);

let recBtns = Array.from(document.querySelectorAll('.record'));

console.log(recBtns);

let recObjects = recBtns.map((el) => {
  return new Rec(el);
});
// Array.from(document.querySelectorAll("Play")).map((el,id) => el.addEventListener('click',recObjects[id].play));
document.querySelectorAll(".play").forEach((el,id) => el.addEventListener('click',() => {recObjects[id].play()}));