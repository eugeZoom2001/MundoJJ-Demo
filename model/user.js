const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'nombre obligatirio'],
    maxlength: 50,
    minlength: 3,
    unique:true
  },
  email: {
    type: String,
    required: [true, 'mail obligatorio'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'email invalido',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password obligatorio'],
    minlength: 4,
  },
  renovable:{
    type:Boolean,
    default:false
  }
})

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.nombre },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

UserSchema.method.isRenovable = () => {
  return this.renovable
}

module.exports = mongoose.model('User', UserSchema)
