var dog, dog2, happyDog, database, foods, foodStock, currentHour, currentMinute; 
var dogImg, happyDogImg, foodImg;
var hr, mn, sc;
var feedButton;
var addFood;
var food;
var col;
var foodArray = [];
var testButton;
var livingRoom, livingRoomImg;
var bedRoom, bedRoomImg;
var garden, gardenImg;
var gameState = "hungary";

function preload()  {    
  dogImg = loadImage('images/dog.png');
  happyDogImg = loadImage('images/happy dog.png');
  foodImg = loadImage('images/milk.png');  
  livingRoomImg = loadImage('images/Living Room.png') ; 
  bedRoomImg = loadImage('images/Bed Room.png');
  gardenImg = loadImage('images/Garden.png');
}

function setup() {
  createCanvas(800,600); 
  col = color(239, 95, 95); 

  //Creating feed button.
  feedButton = createButton('CLICK TO FEED THE DOG');
  feedButton.position(400, 75);
  feedButton.style('background-color', col);
  feedButton.size(110, 110);

  //Creating add food button.
  addFood = createButton('ADD FOOD');
  addFood.position(600, 75);
  addFood.style('background-color', col);
  addFood.size(110, 110); 

  dog = createSprite(600, 315, 200, 200);
  dog.addImage(dogImg);
  dog.scale = 0.5; 
  dog.visible = false;

  dog2 = createSprite(600, 315, 200, 200);
  dog2.addImage(happyDogImg);
  dog2.scale = 0.5;
  dog2.visible = false;

  livingRoom = createSprite(615, 300, 50, 50);
  livingRoom.addImage(livingRoomImg);
  livingRoom.scale = 0.75;
  livingRoom.visible = false;

  bedRoom = createSprite(615, 300, 50, 50);
  bedRoom.addImage(bedRoomImg);
  bedRoom.scale = 0.75;
  bedRoom.visible = false;

  garden = createSprite(615, 300, 50, 50);
  garden.addImage(gardenImg);
  garden.scale = 0.75;
  garden.visible = false;
  
  database = firebase.database(); 

  currentHour = hr;
  currentMinute = mn;

  database.ref('food').on('value', function(data){
    foodStock = data.val();
  })
  gardenUpdate(mn, 3);
}

 
function draw() {
  //setting the background to gray.
  background("grey");
   //Calling the livingRoomUpdate function.
   livingRoomUpdate(mn, 1);
   //Calling the bedroomUpdate function.
   bedroomUpdate(mn, 2);  
   //Calling the gardenUpdate function.
   gardenUpdate(mn, 3);
   //Calling the updateHunger function.
   updateHunger(mn);

  //Creating border.
  textSize(10); 
  push();
  strokeWeight(7);
  stroke(0);
  line(425, 1, 425, 600);
  pop();    

  //If game state is equal to hungary then the dog sprite is created.
  if(gameState === "hungry")  {
    garden.visible = false;    
    dog.visible = true;
  }
  if(gameState === "food fed") {
    dog.visible = false;
    dog2.visible = true;
  }
  if(gameState === "Livingroom")  {
    dog2.visible = false;
    livingRoom.visible = true;
  }
  if(gameState === "Bedroom") {
    livingRoom.visible = false;
    bedRoom.visible = true;
  }
  if(gameState === "Garden") {
    bedRoom.visible = false;
    garden.visible = true;
  }  

  //If hour is not undefined and feedbutton is pressed the the text last feed will show.
  if(hr != undefined  && feedButton.mousePressed())  {
    push();
    fill("black");
    textSize(20);
    textStyle(BOLD);
    text("LAST FEED "+hr +":" + mn, 40, 520);
    pop();
  }

  //Showing the position of the cursor.
  fill("black");
  text(mouseX + "," + mouseY, 10, 10);

  //If foodstock is 0 then the dog's image will return from happy dogto normal dog.
  if(foodStock === 0) {
    dog.addImage(dogImg);
  }

  //Things that is going to take place when the feedbutton is pressed.
  feedButton.mousePressed(() =>{            
    if(foodStock != 0)  {            
      hr = hour();
      mn = minute();
      updateHour();
      updateMinute();
      writeStock(foodStock);
      gameState = "food feed";
    }       
  }) 

  //Adding the foodstock when the addFood button is pressed.
  addFood.mousePressed(() =>{
    if(foodStock === 0) {
      addStocks(foodStock);
    }
  })    

  //Showing the food remaining text.
  if(foodStock != undefined) {  
    push();  
    textSize(20);
    textStyle(BOLD);
    //Changing the colour of the food remaining text to red when the food stocks is 0.
    if(foodStock === 0) {
      fill("red");
    }
    text("FOOD REMAINING : "+foodStock,40,490);
    pop();
  }

  //Making the loop for the food image.
  imageMode(CENTER);
  y = 150;
  for(var i=0;i<foodStock;i++){
    if(i%5==0){
      x=80;
      y=y+50;
    }
    image(foodImg,x,y,50,50);
    x=x+30;
  }

  //If game state is not hungary the the feedbutton will hide.
  if(gameState != "hungary" ) {
    feedButton.hide();
  }
  //If game state is hungary is hungary the feedbutton will show.
  else{
  feedButton.show();
  }

  //Showing the gameState.
  if(gameState != 0)  {
    push();
    textSize(20);
    textStyle(BOLD);
    text(gameState, 55, 590);
    pop();
  }  

  drawSprites(); 
}

function writeStock(x) {
  //X is the foodstock
 if(x <= 0) {
   x = 0;
 }
 else{
   x = x-2;   
 }
 database.ref('/').update({
   food:x
 })
}

function addStocks(x) {
  //X is the foodstock
  if(30 <= x) {
    x = 30;
  }
  else  {
    x += 30;
  }
  database.ref('/').update({
    food:x
  })
}

function updateHour(x) {
  x = hr
  database.ref('/').update({
    hour:hr
  })
}

function updateMinute(x)  {
  x = mn
  database.ref('/').update({
    minute:x
  })
}

function livingRoomUpdate(x, y)  {
  var r;
  r = minute();
  
  if(r - x === y) {    
    gameState = "livingRoom";
  } 

}
function bedroomUpdate(x, y) {
  var r;
  r = minute();
  if(r - x === y) {    
    gameState = "bedroom";
  }  
}
function gardenUpdate(x, y) {
  var r;
  r = minute();
  if(r - x === y) {    
    gameState = "garden";
  }  
}
function updateHunger(x) {
  var r;
  r = minute();
  if(r - x === 4) {
    gameState = "hungary";
  }
}
