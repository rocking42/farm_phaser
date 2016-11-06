// Game state is an object with a series of methods to that have specific namestates
var GameState = {
  preload: function() {
    // preload the images from the asset source passing in two arguments one for name and the other location
    this.load.image("background", "asset/images/background.png");
    this.load.image("arrow", "asset/images/arrow.png");
    // this.load.image("chicken", "asset/images/chicken.png");
    // this.load.image("horse", "asset/images/horse.png");
    // this.load.image("pig", "asset/images/pig.png");
    // this.load.image("sheep", "asset/images/sheep3.png");

    // when loading spritesheets specify the key, the location, width, height and how many frames
    this.load.spritesheet('chicken', 'asset/images/chicken_spritesheet.png', 131, 200, 3);
    this.load.spritesheet('horse', 'asset/images/horse_spritesheet.png', 212, 200, 3);
    this.load.spritesheet('pig', 'asset/images/pig_spritesheet.png', 297, 200, 3);
    this.load.spritesheet('sheep', 'asset/images/sheep_spritesheet.png', 244, 200, 3);
    this.load.spritesheet('cow', 'asset/images/cow.png', 54, 32, 3);
    //loadiong up the audio assets giving the audio for ios and android and phaser has auto detection for which sound to play
    this.load.audio('chickenSound', ['asset/audio/chicken.ogg', 'asset/audio/chicken.mp3']);
    this.load.audio('horseSound', ['asset/audio/horse.ogg', 'asset/audio/horse.mp3']);
    this.load.audio('pigSound', ['asset/audio/pig.ogg', 'asset/audio/pig.mp3']);
    this.load.audio('sheepSound', ['asset/audio/sheep.ogg', 'asset/audio/sheep.mp3']);
    this.load.audio('cowSound', ['asset/audio/cow.ogg', 'asset/audio/cow.mp3']);

  },
  create: function() {
    // scales the game to the screen width
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // center the page horizontally and vertically
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;


    // adding the background simply specifying it to be in the top left corner
    this.background = this.game.add.sprite(0, 0, 'background');
    // array of object cotaining sprite references
    var animalData = [
      {key: 'chicken', text: "CHICKEN", audio:'chickenSound'},
      {key: 'horse', text: "HORSE", audio:'horseSound'},
      {key: 'pig', text: 'PIG', audio:'pigSound'},
      {key: 'sheep', text: 'SHEEP', audio:'sheepSound'},
      {key: 'cow', text: 'COW', audio:'cowSound'}
    ];
    // create a group to store all animale
    this.animals = this.game.add.group();
    var animal;
    // add the animals to the group
    for (var i = 0; i < animalData.length; i++) {
      element = animalData[i];
      // create an animal storing it in a variable passing in parameters for width, height, image name and which sprite as this is a sprite sheet
      animal = this.animals.create(-1000, this.game.world.centerY, element.key, 0);

      animal.customParams = {text: element.text, sound: this.game.add.audio(element.audio)};
      // anchor point set to middle of image
      animal.anchor.setTo(0.5);
      // create animal animation passing in frames to play, number of frames per second and whether it is on a loop
      if (element.text === "COW") {
        animal.scale.setTo(4);
        animal.animations.add('animate', [0,1,2,1,0,1], 3, false);
      }
      else {
        animal.animations.add('animate', [0,1,2,1,0,1], 3, false);
      }
      // allow user input
      animal.inputEnabled = true;
      // only respond to clicking the image
      animal.input.pixelPerfectClick = true;
      // add event hadler for touch and click
      animal.events.onInputDown.add(this.animateAnimal, this);

    }
    // place first animal in the middle
    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

    // show animal text
    this.showText(this.currentAnimal);
    // left arrow
    this.leftArrow = this.game.add.sprite(100, this.game.world.centerY, "arrow");
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.setTo(-1, 1);
    // Adds a custom function so as to not colide with framework functions
    this.leftArrow.customParams = {direction: -1};
    // left arrow allow user input
    this.leftArrow.inputEnabled = true;
    // makes sure only the pixels of the image are clickable but is expensive in terms of computing power
    this.leftArrow.input.pixelPerfectClick = true;
    // add event to left arrow
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

    // right arrow
    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, "arrow");
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = {direction: 1};
    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);


  },
  // this is executed multiple times per second
  update: function() {
    // updates the rotate multiple times per second
    // this.sheep.angle += 0.5;
  },
  // add function to the arrow click event handler
  switchAnimal: function(sprite, event) {
    // ensures the movement has finished before clicks are allowed again
    if(this.isMoving) {
      return false;
    }
    this.isMoving = true;

    // hide text
    this.animalText.visible = false;

    var newAnimal, endX;
    // 1. get the direction of the arrow
    if(sprite.customParams.direction > 0) {
      newAnimal = this.animals.next();
      // sets the starting point of the new animal
      newAnimal.x = -newAnimal.width/2;
      endX = 640 + this.currentAnimal.width/2;
    }
    else {
      newAnimal = this.animals.previous();
      newAnimal.x = 640 + newAnimal.width/2;
      endX = -this.currentAnimal.width/2;
    }
    // adds an animated change specifying the time in ms
    var newAnimalMovement = this.game.add.tween(newAnimal);
    newAnimalMovement.to({x: this.game.world.centerX}, 1000);
    // ensures the movement has finished before a second movement takes place
    newAnimalMovement.onComplete.add(function() {
      this.isMoving = false;
      this.showText(newAnimal);
    }, this);
    // calls the animation
    newAnimalMovement.start();
    // sets the animation for the current animal as well as animation speed in ms
    var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
    currentAnimalMovement.to({x: endX}, 1000);
    currentAnimalMovement.start();
    //sets the new animal to the current animal
    this.currentAnimal = newAnimal;
  },
  animateAnimal: function(sprite, event) {
    sprite.play('animate');
    sprite.customParams.sound.play();
  },
  showText: function(animal) {
    if(!this.animalText) {
      var style = {
        font: 'bold 30pt Arial',
        fill: 'red',
        align: 'center'
      };
      this.animalText = this.game.add.text(this.game.width/2, this.game.height * 0.85, '', style);
      this.animalText.anchor.setTo(0.5);
    }
    this.animalText.setText(animal.customParams.text);
    this.animalText.visible = true;
  }

};
// Create a phaser game and store it in a variable
var game = new Phaser.Game(640, 360, Phaser.AUTO);
// add the gamestate object to the game variable
game.state.add('GameState', GameState);
// finaly start the game
game.state.start("GameState");
