var mongoose=require('mongoose');
var Schema = mongoose.Schema
var bcrypt= require('bcrypt-nodejs');
var SALT_WORK_FACTOR=10;
var inventorySchema= new Schema({
    category: {type:Schema.Types.ObjectId, ref:'category'},
    subCategory:{type:Schema.Types.ObjectId, ref:'subcategory'},
    type:String,
    name:String,
    description:String,
    address:String,
    lg:String,
    state:String,
    country:String,
    profilePic:String,
    allPic:String,
    status:String,
    rate:Number,
    biddingSettings:{type:Schema.Types.ObjectId, ref:'inventorySettings'},
    biddingHistory:[{type:Schema.Types.ObjectId, ref:'biddingHistory'}],
    inventoryTags:{type:Schema.Types.ObjectId, ref:'tags'},
    dateCreated:{ type: Date, default: Date.now },
    lastUpdated:{ type: Date, default: Date.now }
});
var categorySchema= new Schema({
    name: String,
    description: String,
    avartar:String,
    subCategories:[{type:Schema.Types.ObjectId, ref:'subcategory'}],
    dateCreated:{type: Date, default: Date.now}

})
var subCategorySchema= new Schema({
    category:{type:Schema.Types.ObjectId, ref:'category'},
    SubCategoryname: String,
    description: String,
    avartar:String,
    dateCreated:{type: Date, default: Date.now}
})

var inventorySettingsSchema= new Schema({
    propertyId: {type:Schema.Types.ObjectId, ref:'inventory'},
    startingPrice: Number,
    reservePrice:Number,
    buyNowPrice: Number,
    biddingRate: Number,
    startTimeReadable:String,
    startTimeStamp:String,
    closeTimeReadable:String,
    closeTimeStamp:String,
    dateCreated:{ type: Date, default: Date.now },
    lastUpdated:{ type: Date, default: Date.now }
})
var biddingHistorySchema= new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'user'},
    inventory:{type:Schema.Types.ObjectId, ref:'inventory'},
    price:Number,
    state:String,
    ipaddress:String,
    browser:String,
    operatingSystem:String,
    medium:String,
    referrer:String,
    timestamp:{type:Date, default:Date.now}
})
var userSchema= new Schema({
    firstName:String,
    lastName:String,
    userName:{type:String, required:true, index:{unique:true, dropDups: true}},
    email:{type:String, required:true, index:{unique:true, dropDups: true}},
    password:{type:String, required:true},
    phone:String,
    userBids:[{type:Schema.Types.ObjectId, ref:'inventory'}],
    userAuctions:[{type:Schema.Types.ObjectId, ref:'inventory'}],
    dateCreated:{ type: Date, default: Date.now },
    lastLogin:{ type: Date, default: Date.now }
})

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
var tagSchema= new Schema({
    propertyId:{type:Schema.Types.ObjectId, ref:'inventory'},
    tags:String,
    dateCreated:{ type: Date, default: Date.now },
    lastUpdated:{ type: Date, default: Date.now }
})

var emailSubscriberSchema= new Schema({
    emailAddress:String,
    source:String,
    dateCreated:{ type: Date, default: Date.now }
})
module.exports.inventory = mongoose.model('inventory', inventorySchema);
module.exports.category= mongoose.model('category', categorySchema);
module.exports.subcategory= mongoose.model('subcategory', subCategorySchema);
module.exports.inventorySettings = mongoose.model('inventorySettings', inventorySettingsSchema);
module.exports.biddingHistory = mongoose.model('biddingHistory', biddingHistorySchema);
module.exports.user = mongoose.model('user', userSchema);
module.exports.tags = mongoose.model('tags', tagSchema);
module.exports.emailSubscriber = mongoose.model('emailSubscriber', emailSubscriberSchema);
