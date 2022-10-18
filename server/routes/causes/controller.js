const Recipient = require('../../models/Recipient');

class CausesController{
  constructor(db){
    this.db = db;
  }

  async index(userId, limit, offset) {
    offset = offset || 0;
    limit = limit || 10;
    const causes = await Recipient.findAll({where: {manager: userId}, offset, limit});
    return causes;
  }

  async getCause(causeId) {
    const cause = await Recipient.findByPk(causeId);
    return cause;
  }

  async createCause(causeObj, userId) {
    return Recipient.create({...causeObj, manager: userId});
  }

  async deleteCause(causeId) {
    return Recipient.destroy({where: {id: causeId}});
  }

}

module.exports = CausesController;