var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mtc', {useNewUrlParser: true});
const findOrCreate = require('mongoose-findorcreate');



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('we live');
});

const playlistSchema = new mongoose.Schema({
    id: Number,
    userId: String,
    aSideLinks: String,
    bSideLinks: String,
    aTitles: String,
    bTitles: String,
    tapeDeck: String,
    tapeLabel: String,
});
playlistSchema.plugin(findOrCreate);
const Playlist = mongoose.model('Playlist', playlistSchema);


const userSchema = new mongoose.Schema({
    id: Number,
    googleId: String,
});
userSchema.plugin(findOrCreate);
const User = mongoose.model('User', userSchema);


const findCreate = function (googleInfo, callback) {
    // uses a findOrCreate plugin to check and if not found add a user to our tables;
    //googleInfo is an object passed through with the profile.id
    const {googleId} = googleInfo
    User.findOrCreate({googleId: googleId}, function(err, user, created) {
        if(created === true){
            console.log(`User ${googleId} was created`)
            callback(null, user);
        } else 
            User.findOrCreate({googleId: googleId}, function(err, user, created) {
            if(created === false){
                console.log(`User ${googleId} exists`);
                callback(null, user);
            }
        })
    })
};

const storePlaylist = function(plDetails, callback){
    // plDetails is an object with all of our columns needing to be saved
    // when sending in request, please be sure  to include all fields, all are stings. 
    const {userId, aSideLinks, bSideLinks, aTitles, bTitles, tapeDeck, tapeLabel} = plDetails;
    const playlistInfo = new Playlist({
        userId,
        aSideLinks,
        bSideLinks,
        aTitles,
        bTitles,
        tapeDeck,
        tapeLabel,
    });
    playlistInfo.save((err) => {
        if(err) {
            callback(err);
        } else {
            callback('Success')
        }
    });
};





module.exports.findCreate = findCreate;
module.exports.Playlist = Playlist;
module.exports.User = User;
module.exports.storePlaylist = storePlaylist;