function Response() {
  if (!(this instanceof Response)) {
    return new Response();
  }
  this.status = {};
  this.message = "";
}

module.exports = Response;
