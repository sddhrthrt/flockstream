function interact(birds){
    _.each(birds, function(bird){
        var selection = _.filter(birds, function(b){ return areClose(b.x, b.y, bird.x, bird.y); });
        console.log('for', bird, ':', selection);
    });
}
