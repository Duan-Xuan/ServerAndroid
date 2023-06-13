var db = require('./db');
const prSchema = new db.mongoose.Schema(
    {
        name: { type: String, required: true },
        id_category: { type: db.mongoose.Schema.Types.ObjectId, ref: 'ctModel' },
        avatar: { type: String, required: true },
        description: { type: String, required: false },
        price: { type: db.mongoose.Schema.Types.Number, required: true },
    }
    ,
    {
        collection: 'Product',
        timestamps: true
    }
);
let prModel = db.mongoose.model('prModel', prSchema);

const ctSchema = new db.mongoose.Schema(
    {
        name: { type: String, required: true }
    },
    {
        collection: 'Category',
        timestamps: true
    }
);
let ctModel = db.mongoose.model('ctModel', ctSchema);

module.exports = { prModel, ctModel };