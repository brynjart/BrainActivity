var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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

var thoughtProvider = new ThoughtProvider('localhost', 27017);

app.get('/', function(req, res){
    thoughtProvider.findAll( function(error,docs){
        if(error){

        }
        else{
            res.render('index', {
                title: 'Dagbókin mín',
                articles:docs
            });
        }

    })
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
