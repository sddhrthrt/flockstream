function distance(x1, y1, x2, y2){
    xd = parseInt(x1)-parseInt(x2);
    yd = parseInt(y1)-parseInt(y2);
    dist = Math.sqrt(xd*xd+yd*yd);
    return dist;
}
function divDistance(div1, div2){
    return distance(div1.style.left, div1.style.top, div2.style.left, div2.style.top);
}
function interact(world){
    _.each(world.birds, function(bird){
        var selection = _.filter(world.birds, function(b){ return divDistance(b, bird)<50; });
        var velocityar = [0.0, 0.0];
        _.each(selection, function(b){
            var v = world.getVelocity(b);
            velocityar[0] += v[0];
            velocityar[1] += v[1];
        });
        velocityar[0] = velocityar[0]/selection.length;
        velocityar[1] = velocityar[1]/selection.length;
        var selection = _.without(_.filter(world.birds, function(b){ return divDistance(b, bird)<10; }), bird);
        var velocitysr = [0.0, 0.0];
        var vc = world.getVelocity(bird);
        _.each(selection, function(b){
            var v = world.getVelocity(b),
                d = divDistance(b, bird);
            if(d!=0){
                velocitysr[0] += (0-(v[0]+vc[1]))/d;
                velocitysr[1] += (0-(v[1]+vc[1]))/d;
            }
        });
        world.velocities[_.indexOf(world.birds, bird)][0] = velocityar[0];
        world.velocities[_.indexOf(world.birds, bird)][1] = velocityar[1];
        if(velocitysr[0]>0 && velocity[1]>0){
            world.velocities[_.indexOf(world.birds, bird)][0] = velocityar[0]*0.2+velocitysr[0]*0.8;
            world.velocities[_.indexOf(world.birds, bird)][1] = velocityar[1]*0.2+vecolitysr[1]*0.8;
        }
    });
}
