class UnitOfWork {
    constructor(sequelize) {
      this.sequelize = sequelize;
      this.transaction = null;
    }
  
    async start() {
      this.transaction = await this.sequelize.transaction();
    }
  
    async commit() {
      await this.transaction.commit();
    }
  
    async rollback() {
      await this.transaction.rollback();
    }
  
    getTransaction() {
      return this.transaction;
    }
  }
  