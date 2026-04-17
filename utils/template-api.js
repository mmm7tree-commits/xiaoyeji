const http = require("./http");
const templateRuntime = require("./template-runtime");

function appendQuery(path, query) {
  const pairs = Object.keys(query || {})
    .filter((key) => query[key] !== undefined && query[key] !== null && query[key] !== "")
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);

  if (!pairs.length) {
    return path;
  }

  return `${path}?${pairs.join("&")}`;
}

function getFeaturedTemplate() {
  return http.request({
    path: "/templates/featured"
  }).then((template) => templateRuntime.normalizeTemplateData(template));
}

function getTemplateCategories() {
  return http.request({
    path: "/templates/categories"
  });
}

function getTemplateList(params) {
  return http.request({
    path: appendQuery("/templates", params || {})
  }).then((templates) => templateRuntime.normalizeTemplateList(templates));
}

function getTemplateDetail(id) {
  return http.request({
    path: `/templates/${id}`
  }).then((template) => templateRuntime.normalizeTemplateData(template));
}

module.exports = {
  getFeaturedTemplate,
  getTemplateCategories,
  getTemplateList,
  getTemplateDetail
};
