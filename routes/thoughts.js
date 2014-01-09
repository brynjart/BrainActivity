var ThoughtProvider = require('../thoughtprovider').ThoughtProvider;

var thoughtProvider = new ThoughtProvider('localhost', 27017);

exports.findAll = function(req, res) {
    thoughtProvider.findAll( function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(result));
            res.send(result);
        }
    });
};

exports.findById = function(req, res) {
    console.log('Find by Id: ' + req.params.id);
    thoughtProvider.findById(req.params.id, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(result));
            res.send(result);
        }
    });
};


exports.addThought = function(req, res) {
    var thought = req.body;
    console.log('Adding thought: ' + JSON.stringify(thought));
    thoughtProvider.addThought(req.body, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(result[0]));
            res.send(result[0]);
        }
    });
}

exports.updateThought = function(req, res) {
    var id = req.params.id;
    var thought = req.body;
    console.log('Updating thought: ' + JSON.stringify(thought));
    thoughtProvider.updateThought(id, req.body, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(result));
            res.send(result);
        }
    });
}

exports.deleteThought = function(req, res) {
    var id = req.params.id;
    console.log('Deleting thought: ' + id);

    thoughtProvider.deleteThought(id, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
}