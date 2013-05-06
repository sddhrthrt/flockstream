var world  = new Object();
world.width = 1200;
world.height = 661;
world.values = [];
world.velocities = [];
world.pos = [];
world.getVelocity = function(bird){
    return world.velocities[_.indexOf(world.birds, bird)];
}
function step(){
    _.each(world.birds, move);
}

function move(bird){
    id = parseInt(bird.id);
    newx = parseInt(bird.style.left) + Math.floor(world.velocities[id][0]);
    newy = parseInt(bird.style.top) + Math.floor(world.velocities[id][1]);
    newx = newx<0?world.width:newx;
    newx = newx>world.width?0:newx;
    newy = newy<0?world.height:newy;
    newy = newy>world.height?0:newy;
    bird.style.left = newx+'px';
    bird.style.top = newy+'px';
    interact(world);
}
function randomize(){
    //Generate random values for these things.
    world.values = [];
    world.velocities = [];
    world.pos = [];
    velocity_unit = 10;
    for(i=0;i<50;i++) world.values.push(Math.random());
    for(i=0;i<50;i++){
        world.pos.push([Math.random()*world.width, Math.random()*world.height]);
    }
    for(i=0;i<50;i++){
        world.velocities.push([Math.random()*velocity_unit-velocity_unit/2, Math.random()*velocity_unit-velocity_unit/2]);
    }
}
function setUp(world){
    var i = 0;
    var sky = document.getElementById('sky');
    randomize();
    var counter = 0;
    _.each(world.pos, function(position){
        sky.innerHTML += "<div class='black bird' id="+counter+" style='left:"+position[0]+";top:"+position[1]+";'></div>";
        counter += 1;
    });
    var birds = document.getElementsByClassName('bird');
    world.birds = birds;
}

//setUp(world);
setInterval(step, 600);
