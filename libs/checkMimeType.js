module.exports.isImage = (mimeType) => {
  if (/^image\/\w+/.test(mimeType)) {
    return true;
  }
  return false;
};
