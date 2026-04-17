const runtime = require("../config/legacy-runtime");
const clientIdentity = require("./client-identity");

function uploadPhoto(photo) {
  if (photo && photo.asset && photo.asset.publicUrl) {
    return Promise.resolve(photo);
  }

  const filePath = photo.localPath || photo.path || photo.tempPath;
  if (!filePath) {
    return Promise.reject(new Error("照片缺少本地路径，暂时无法上传到服务端"));
  }

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${runtime.apiBaseUrl}/assets/work-photos`,
      filePath,
      name: "file",
      header: {
        "X-Xiaoyeji-Client-Id": clientIdentity.getClientId()
      },
      formData: {
        sourceLocalPath: photo.localPath || photo.path || "",
        sourceTempPath: photo.tempPath || ""
      },
      success: (response) => {
        try {
          const payload = JSON.parse(response.data || "{}");
          if (response.statusCode >= 200 && response.statusCode < 300 && payload.ok) {
            const asset = payload.data;
            resolve(Object.assign({}, photo, {
              localPath: photo.localPath || photo.path || "",
              source: asset.source,
              asset: {
                assetId: asset.assetId,
                storageDriver: asset.persisted.storageDriver,
                relativePath: asset.persisted.relativePath,
                publicUrl: asset.persisted.publicUrl,
                mimeType: asset.persisted.mimeType,
                uploadedAt: asset.uploadedAt
              },
              previewUrl: asset.previewUrl,
              fulfillmentUrl: asset.fulfillmentUrl
            }));
            return;
          }
          reject(new Error(payload.message || "图片上传失败"));
        } catch (error) {
          reject(new Error("图片上传结果解析失败"));
        }
      },
      fail: () => {
        reject(new Error("图片上传失败，请确认本地服务已启动"));
      }
    });
  });
}

function ensurePhotosUploaded(photos) {
  const safePhotos = Array.isArray(photos) ? photos : [];
  return Promise.all(safePhotos.map((photo) => uploadPhoto(photo)));
}

module.exports = {
  ensurePhotosUploaded
};
