const mongoose = require('mongoose');

// 새로운 스키마 생성
const Schema = mongoose.Schema;

// 키 밸류로 스키마 정의하기
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    reqruie: true
  },
  imageUrl: {
    type: String,
    reqruie: true
  },
  // user와 관계있다는 것을 명시
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       // update the product
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(result => {
//         // console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
//   static updateById(prodId, title, price, description, imageUrl) {
//     const db = getDb();
//     return db
//       .collection('proudcts')
//       .update(
//         { _id: new mongodb.ObjectId(prodId) },
//         { $set: { title, price, description, imageUrl } }
//       )
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static fetchAll() {
//     const db = getDb();
//     // promise를 반환하지 않고 cursor를 반환한다. cursor는 일종의 object이다.
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(prodId) {
//     const db = getDb();

//     return db
//       .collection('products')
//       .findOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(product => {
//         // console.log(product);
//         return product;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static deleteById(prodId) {
//     const db = getDb();

//     return db
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(result => {
//         console.log('Delete!');
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;
