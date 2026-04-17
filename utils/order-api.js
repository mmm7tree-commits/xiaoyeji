const http = require("./http");
const store = require("./store");

function getOrderList(statusCode) {
  return http.request({
    path: "/orders",
    data: statusCode && statusCode !== "all" ? { statusCode } : {}
  }).then((orders) => {
    store.replaceOrdersCache(orders);
    return orders;
  });
}

function getOrderDetail(id) {
  return http.request({
    path: `/orders/${id}`
  }).then((order) => {
    store.upsertOrderCache(order);
    return order;
  });
}

function createOrder(payload) {
  return http.request({
    path: "/orders",
    method: "POST",
    data: payload
  }).then((order) => {
    store.upsertOrderCache(order);
    return order;
  });
}

function closeOrder(id) {
  return http.request({
    path: `/orders/${id}/close`,
    method: "POST"
  }).then((order) => {
    store.upsertOrderCache(order);
    return order;
  });
}

function openPayAction(id) {
  return http.request({
    path: `/orders/${id}/pay-action`,
    method: "POST"
  });
}

module.exports = {
  getOrderList,
  getOrderDetail,
  createOrder,
  closeOrder,
  openPayAction
};
