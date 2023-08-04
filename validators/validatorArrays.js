const {check, checkSchema, oneOf} = require('express-validator');

// exists 존재하면 참
// isEmpty 비어있어야 참

const postReigister = [
  check('email', 'email error')
    .normalizeEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  check('password', 'password error').isString().isLength({min: 7, max: 30}),
  check('passwordConfirm', 'password confirm error')
    .isString()
    .isLength({min: 7, max: 30}),
  check('agreeService', 'agreeService error').isBoolean(),
  check('agreePrivacy', 'agreePrivacy error').isBoolean(),
];

// 관리자 회원가입
const postAdminReigister = [
  check('email', 'email error')
    .normalizeEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  check('password', 'password error').isString().isLength({min: 7, max: 30}),
  check('passwordConfirm', 'password confirm error')
    .isString()
    .isLength({min: 7, max: 30}),
];

const postLogin = [
  check('email', 'email error')
    .normalizeEmail()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  check('password', 'password error').isString().isLength({min: 10, max: 30}),
];

const postDidCredential = [];

module.exports = {
  postReigister,
  postAdminReigister,
  postLogin,
  postDidCredential,
};
