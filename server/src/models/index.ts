import Sequelize, {
  DefineAttributes,
  DefineAttributeColumnOptions,
  Instance
} from 'sequelize';
import { decamelize } from 'humps';
import { User, News, Invitation } from '../types/models';

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const models = {
  sequelize,
  Sequelize,
  User: sequelize.import<Instance<User>, User>(__dirname + '/user.ts'),
  News: sequelize.import<Instance<News>, News>(__dirname + '/news.ts'),
  Invitation: sequelize.import<Instance<Invitation>, Invitation>(
    __dirname + '/invitation.ts'
  )
};

// convert camelCased fields to under_score
sequelize.addHook('beforeDefine', (attributes: DefineAttributes) => {
  Object.keys(attributes).forEach(key => {
    const column = attributes[key] as DefineAttributeColumnOptions;

    if (typeof column !== 'function' && !column.field) {
      column.field = decamelize(key);
    }
  });
});

Object.keys(models).forEach(key => {
  const model = (models as any)[key];

  if (model.associate) {
    model.associate(models);
  }
});

export default models;
