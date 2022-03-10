const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Orders = mongoose.model(
  'Order',
  new Schema({
    meal_id: { type: Schema.Types.ObjectId, ref: 'Meal' }, //el meal_id debe ser una referencia a Meal
    user_id: String, //Por el momento se deja como un String, cuando tengamos la autenticación creada vamos a cambiar eso
    date: { type: Date, default: Date.now },
  })
);

module.exports = Orders;
