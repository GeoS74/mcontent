const Contact = require('../models/Contact');
const mapper = require('../mappers/contact.mapper');

/**
 * Cписок доступных полей контактных данных жёстко зафиксирован и
 * в момент создания базы данных создаётся автоматически и изменению не подлежит
 *
 */

module.exports.get = async (ctx) => {
  const contact = await _get(ctx.params.alias);

  if (!contact) {
    ctx.throw(404, 'contact data not found');
  }
  ctx.status = 200;
  ctx.body = mapper(contact);
};

module.exports.getAll = async (ctx) => {
  const contacts = await _getAll();

  ctx.status = 200;
  ctx.body = contacts.map((t) => (mapper(t)));
};

module.exports.update = async (ctx) => {
  const contact = await _updateTemplateTag(ctx.params.alias, ctx.request.body);

  if (!contact) {
    ctx.throw(404, 'contact field not found');
  }

  ctx.status = 200;
  ctx.body = mapper(contact);
};

function _getAll() {
  return Contact
    .find({})
    .sort({ _id: 1 });
}

function _updateTemplateTag(alias, {
  value,
}) {
  return Contact.findOneAndUpdate(
    { alias },
    {
      value,
    },
    {
      new: true,
    },
  );
}

function _get(alias) {
  return Contact.findOne({ alias });
}
