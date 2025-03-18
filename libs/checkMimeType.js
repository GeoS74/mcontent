module.exports.isImage = (mimeType) => {
  if (/^image\/\w+/.test(mimeType)) {
    return true;
  }
  return false;
};

module.exports.isPDF = (mimeType) => {
  if (/^application\/pdf/.test(mimeType)) {
    return true;
  }
  return false;
};
