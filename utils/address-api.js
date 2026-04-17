const http = require("./http");
const store = require("./store");

function syncAddresses(addresses) {
  store.replaceAddressesCache(addresses);
  return addresses;
}

function getAddressList() {
  return http.request({
    path: "/addresses"
  }).then(syncAddresses);
}

function createAddress(payload) {
  return http.request({
    path: "/addresses",
    method: "POST",
    data: payload
  }).then(() => getAddressList());
}

function updateAddress(id, payload) {
  return http.request({
    path: `/addresses/${id}`,
    method: "PUT",
    data: payload
  }).then(() => getAddressList());
}

function setDefaultAddress(id) {
  return http.request({
    path: `/addresses/${id}/default`,
    method: "POST"
  }).then(() => getAddressList());
}

function deleteAddress(id) {
  return http.request({
    path: `/addresses/${id}`,
    method: "DELETE"
  }).then(() => getAddressList());
}

module.exports = {
  getAddressList,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress
};
