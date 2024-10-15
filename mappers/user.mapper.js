module.exports = (data) => ({
  uid: data._id,
  email: data.email,
  photo: data.photo || '',
  name: data.name || '',
});
