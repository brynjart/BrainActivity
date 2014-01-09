
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var thoughts = require('./routes/thoughts');
var ThoughtProvider = require('./thoughtprovider').ThoughtProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3006);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}



app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

//REST API
app.get('/thoughts', thoughts.findAll);
app.get('/thoughts/:id', thoughts.findById);
app.post('/thoughts', thoughts.addThought);
//app.post('/thoughts/:id', thoughts.updateThought);  //todo update as pos with update parameter
app.put('/thoughts/:id', thoughts.updateThought);
app.delete('/thoughts/:id', thoughts.deleteThought);

/*
app.get('/thoughts', function(req, res){
    thoughtProvider.findAll( function(error,docs){
        if(error){

        }
        else{
            res.send(docs);

        }

    })
});

app.get('/thoughts/:id', function(req, res){
    thoughtProvider.findById( function(error,docs){
        if(error){

        }
        else{
            res.send(docs);
        }

    })
});

app.post('/thoughts', function(req, res){
    thoughtProvider.addThought( function(error,docs){
        if(error){

        }
        else{
            res.render('index', {
                title: 'Dagbókin',
                thoughts:docs
            });
        }

    })
});

app.put('/thoughts/:id', function(req, res){
    thoughtProvider.updateThought( function(error,docs){
        if(error){

        }
        else{
            res.render('index', {
                title: 'Dagbókin',
                thoughts:docs
            });
        }

    })
});

app.delete('/thougts/:id', function(req, res){
    thoughtProvider.delteThought( function(error,docs){
        if(error){

        }
        else{
            res.render('index', {
                title: 'Dagbókin',
                thoughts:docs
            });
        }

    })
});
*/
//html views
app.get('/', function(req, res){
    thoughtProvider.findAll( function(error,docs){
        if(error){

        }
        else{
            res.render('index', {
                title: 'Dagbókin',
                thoughts:docs
            });
        }

    })
});

app.get('/thought/new', function(req, res) {
    res.render('thought_new.jade', {
        title: 'New thought'
    });
});

app.post('/thought/new', function(req, res){
    thoughtProvider.save({
        timeObject:{
                    title: req.param('title'),
                    body: req.param('body')
        }
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/thought/:id', function(req, res) {
    thoughtProvider.findById(req.params.id, function(error, thought) {
        console.log(req.params.id);
        res.render('thought_show.jade',
            {
                title: thought.timeObject.title,
                body: thought.timeObject.body,
                thought:thought

            });
    });
});

app.post('/thought/addComment', function(req, res) {
    thoughtProvider.addCommentToThought(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
    } , function( error, docs) {
        res.redirect('/thought/' + req.param('_id'))
    });
});

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});