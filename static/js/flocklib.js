var varc = 1;
var vsrc = 0.9;
var vcrc = 0.001;
function distance(x1, y1, x2, y2){
    xd = parseFloat(x1)-parseFloat(x2);
    yd = parseFloat(y1)-parseFloat(y2);
    dist = Math.sqrt(xd*xd+yd*yd);
    return dist;
}
function divDistance(div1, div2){
    var i1 = _.indexOf(world.birds, div1),
        i2 = _.indexOf(world.birds, div2);
    return distance(world.positions[i1][0], world.positions[i1][1], world.positions[i2][0], world.positions[i2][1]);
}
function getPosition(div){
    return world.positions[_.indexOf(world.birds, div)];
}
function interact(world){
    _.each(world.birds, function(bird){
        /* Now, going to each bird, we have to run the following algorithm. 
         * We are going to find out var, vsr, vcr, vsim and vdsim.
         * We'll add them up to make a nice new velocity,
         * then assign them to the bird.
         */
        /* First, 'filter' birds for close ones
         */
        var selection = _.filter(world.birds, function(b){ return divDistance(b, bird)<50; });
        var velocityar = [0.0, 0.0];
        var velocitycr = [0.0, 0.0];
        var aforce = [0.0, 0.0];
        var vc = world.getVelocity(bird);
        _.each(selection, function(b){
            /* var = (1/n)E(i=1->n)vi
             *        1   n   
             * V   = ---  <   V
             *  ar    n   <    i
             *           i=1
             */
            var v = world.getVelocity(b);
            var d = divDistance(b, bird);
            var vectorforce = [0.0, 0.0];
            if(d!=0){
                vectorforce[0] += (getPosition(bird)[0]-getPosition(b)[0])/d;
                vectorforce[1] += (getPosition(bird)[1]-getPosition(b)[1])/d;
            }
            var mag = world.values[_.indexOf(world.birds, bird)][_.indexOf(world.birds, b)];
            velocityar[0] += v[0];
            velocityar[1] += v[1];
            velocitycr[0] += getPosition(b)[0]-getPosition(bird)[1];
            velocitycr[1] += getPosition(b)[1]-getPosition(bird)[1];
            if(mag){
                aforce[0] += vectorforce[0]*mag*0.002;
                aforce[1] += vectorforce[1]*mag*0.002;
            }else{
                aforce[0] += (-1/vectorforce[0])*.01;
                aforce[1] += (-1/vectorforce[1])*.01;
            }
        });
        velocityar[0] = velocityar[0]/selection.length;
        velocityar[1] = velocityar[1]/selection.length;
        var selection = _.without(_.filter(world.birds, function(b){ return divDistance(b, bird)<10; }), bird);
        var velocitysr = [0.0, 0.0];
        var vc = world.getVelocity(bird);
        _.each(selection, function(b){
            /* vsr = E(i=1->n)(vi-vc)/d(Fi,Ac)
             *           ________
             *        n  V  + V
             * V   =  <   i    c
             *  ar    < ----------- 
             *       i=1 d(Fi, Ac)
             */
            var v = world.getVelocity(b),
                d = divDistance(b, bird);
            if(d!=0){
                velocitysr[0] += (0-(v[0]+vc[1]))/d;
                velocitysr[1] += (0-(v[1]+vc[1]))/d;
            }
        });
        draw_vector(getPosition(bird), velocityar[0], velocityar[1], 1);
        draw_vector(getPosition(bird), velocitycr[0], velocitycr[1], 2);
        draw_vector(getPosition(bird), velocitysr[0], velocitysr[1], 3);
        world.velocities[_.indexOf(world.birds, bird)][0] = velocityar[0]*varc+velocitycr[0]*vcrc+aforce[0];
        world.velocities[_.indexOf(world.birds, bird)][1] = velocityar[1]*varc+velocitycr[1]*vcrc+aforce[1];
        if(velocitysr[0]>0 && velocitysr[1]>0){
            world.velocities[_.indexOf(world.birds, bird)][0] = velocityar[0]*varc+velocitysr[0]*vsrc+velocitycr[0]*vcrc+aforce[0];
            world.velocities[_.indexOf(world.birds, bird)][1] = velocityar[1]*varc+velocitysr[1]*vsrc+velocitycr[0]*vcrc+aforce[1];
        }
    });
}
