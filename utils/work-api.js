const http = require("./http");
const store = require("./store");

function createWork(payload) {
  return http.request({
    path: "/works",
    method: "POST",
    data: payload
  }).then((work) => {
    store.upsertWorkCache(work);
    return work;
  });
}

function getWorkList(statusCode) {
  return http.request({
    path: "/works",
    data: statusCode && statusCode !== "all" ? { statusCode } : {}
  }).then((works) => {
    store.replaceWorksCache(works);
    return works;
  });
}

function getWorkDetail(id) {
  return http.request({
    path: `/works/${id}`
  }).then((work) => {
    store.upsertWorkCache(work);
    return work;
  });
}

function deleteWork(id) {
  return http.request({
    path: `/works/${id}`,
    method: "DELETE"
  }).then((result) => {
    store.deleteWork(id);
    return result;
  });
}

module.exports = {
  createWork,
  getWorkList,
  getWorkDetail,
  deleteWork
};
