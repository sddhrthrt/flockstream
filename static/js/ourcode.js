var world  = new Object();
world.width = 800;
world.height = 600;
world.values = [];
world.velocities = [];
world.pos = [];
$.ajax({
    url: '/_get_similarity_values',
    type: 'POST',
    dataType: 'json',
    success: function(data){
        world.values = data.values;
    }
})
$.ajax({
    url: '/_get_positions',
    type: 'POST',
    dataType: 'json',
    success: function(data){
        world.positions = data.positions;
    }
})
world.getVelocity = function(bird){
    return world.velocities[_.indexOf(world.birds, bird)];
}
function step(){
    _.each(world.birds, move);
    redraw_world();
}
function redraw_world(){
    var sky = document.getElementById('sky');
    if(sky){
        var skyctx = sky.getContext('2d');
        skyctx.clearRect(0,0,sky.width,sky.height) 
        _.each(world.positions, function(pos){
            skyctx.beginPath();
            skyctx.arc(pos[0], pos[1], 4, 0, Math.PI*2, true);
            skyctx.closePath();
            skyctx.fill();
        });
    }
}
function draw_vector(position, x_component, y_component, type){
    var type = typeof type !== 'undefined' ? type : 0;
    var types = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    var sky = document.getElementById('sky');
    var skyctx = sky.getContext('2d');
    skyctx.strokeStyle = types[type];
    skyctx.strokeStyle = '#00000'; 
    skyctx.beginPath();
    skyctx.moveTo(position[0], position[1]);
    skyctx.lineTo(position[0]+x_component, position[1]+y_component);
    skyctx.closePath();
    skyctx.stroke();
}
function move(bird){
    id = parseInt(bird.id);
    newx = world.positions[id][0] + Math.floor(world.velocities[id][0]);
    newy = world.positions[id][1] + Math.floor(world.velocities[id][1]);
    newx = newx<0?world.width:newx;
    newx = newx>world.width?0:newx;
    newy = newy<0?world.height:newy;
    newy = newy>world.height?0:newy;
    world.positions[id][0] = newx;
    world.positions[id][1] = newy;
    //bird.style.left = newx+'px';
    //bird.style.top = newy+'px';
    interact(world);
}
function randomize(n){
    //Generate random values for these things.
//    world.values = [];
    world.velocities = [];
//    world.pos = [];
    velocity_unit = 10;
//    for(i=0;i<50;i++) world.values.push(Math.random());
//    for(i=0;i<50;i++){
//        world.pos.push([Math.random()*world.width, Math.random()*world.height]);
//    }

    for(i=0;i<n;i++){
        world.velocities.push([Math.random()*velocity_unit-velocity_unit/2, Math.random()*velocity_unit-velocity_unit/2]);
    }
}
function setUp(world){
//    var i = 0;
//    var sky = document.getElementById('sky');
//    var counter = 0;
//    _.each(world.pos, function(position){
//        sky.innerHTML += "<div class='black bird' id="+counter+" style='left:"+position[0]+"px;top:"+position[1]+"px;'></div>";
//        counter += 1;
//    });

    var i = 0;
    var birds = [];
    _.each(world.positions, function(p){
        var bird = new Object();
        bird.id = i;
        i++;
        birds.push(bird);
    });
    randomize(birds.length);
    world.birds = birds;
}

setUp(world);
//step();
setInterval(step, 500);
function clear_all(){
    $.ajax({
        url: '/_clear_all',
        type: 'POST',
        success: function(data){
            $('#cleared')[0].innerHTML='cleared!';
            console.log($('#cleared'));
            setTimeout(function(){
                $('#cleared').hide();
            }, 2000);
            window.location.replace('/');
        }
    })
}
