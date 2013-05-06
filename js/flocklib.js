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
    return distance(div1.style.left, div1.style.top, div2.style.left, div2.style.top);
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
        _.each(selection, function(b){
            /* var = (1/n)E(i=1->n)vi
             *        1   n   
             * V   = ---  <   V
             *  ar    n   <    i
             *           i=1
             */
            var v = world.getVelocity(b);
            velocityar[0] += v[0];
            velocityar[1] += v[1];
            velocitycr[0] += parseFloat(b.style.left)-parseFloat(bird.style.left);
            velocitycr[1] += parseFloat(b.style.top)-parseFloat(bird.style.top);
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
        world.velocities[_.indexOf(world.birds, bird)][0] = velocityar[0]*varc+velocitycr[0]*vcrc;
        world.velocities[_.indexOf(world.birds, bird)][1] = velocityar[1]*varc+velocitycr[1]*vcrc;
        if(velocitysr[0]>0 && velocitysr[1]>0){
            world.velocities[_.indexOf(world.birds, bird)][0] = velocityar[0]*varc+velocitysr[0]*vsrc+velocitycr[0]*vcrc;
            world.velocities[_.indexOf(world.birds, bird)][1] = velocityar[1]*varc+velocitysr[1]*vsrc+velocitycr[0]*vcrc;
        }
    });
}
