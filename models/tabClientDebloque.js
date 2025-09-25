const connectMySql = require("../config/dbSql");

class tabClientDebloque {
  constructor(row) {
    this.row = row;
  }

  static GetClientFromUnlocked(e) {
    return new Promise((resolve, reject) => {
      connectMySql.query(
        "select dd.idDemDep, cb.idClientDebloque, dd.bpartner_name,cb.demandeReafectPar,cb.typeOperation,cb.isBalance, dd.id_org,dd.bpartner_id " +
          "from clientdebloque cb " +
          "inner join  demandedeploque dd on cb.idDemDep=dd.idDemDep " +
          "where cb.idSuperViseur=? and cb.dateCreation=? and cb.supp=? and dd.supp=? order by cb.isBalance desc",
        [e.idSuperViseur, e.dateCreation, 0, 0],
        (err, reponse) => {
          if (err) reject(err);
          resolve(reponse);
        }
      );
    });
  }

  static GetListClientSeuilToday(e) {
    return new Promise((resolve, reject) => {
      connectMySql.query(
        `SELECT idDemDep, idDemDep AS idClientDebloque, bpartner_name, bpartner_status AS typeOperation, indiceOper AS demandeReafectPar, 
        isBalance, isSeuil,id_org,bpartner_id
          FROM demandedeploque WHERE superViseurRegion = ? AND isSeuil = ? AND dateCreation=? AND supp=?`,
        [e.idSuperViseur, 'Y', e.dateCreation, 0],
        (err, reponse) => {
          if (err) throw err;
          resolve(reponse);
        }
      );
    })
  }

  static GetListClientCommandValide(e) {
    return new Promise((resolve, reject) => {
      connectMySql.query(
        `SELECT idDemDep, idDemDep AS idClientDebloque, bpartner_name, bpartner_status AS typeOperation, indiceOper AS demandeReafectPar, 
        isBalance, isSeuil,id_org,bpartner_id
          FROM demandedeploque WHERE modifyBy = ? AND prosper IN (4, 3, 2) AND dateCreation=? AND supp=?`,
        [e.modifyBy, e.dateCreation, 0],
        (err, reponse) => {
          if (err) throw err;
          resolve(reponse);
        }
      );
    })
  }

  static select(e, cb) {
    var indice = e.indice;
    switch (indice) {
      case 221:
        connectMySql.query(
          "select dem.indiceOper,dem.bpartner_name,dem.superViseurName,cld.typeOperation,dem.region,dem.prosper,dem.dateCreation as ddem,cld.dateCreation as dd,dem.timeCreation as tdem ,cld.timeCreation as td  from demandedeploque dem inner join clientdebloque cld on dem.idDemDep=cld.idDemDep where cld.idSuperViseur=? and cld.supp=? and dem.supp=? and cld.dateCreation>=? and cld.dateCreation<=? order by dem.region",
          [e.id_user, 0, 0, e.dateCreation1, e.dateCreation2],
          (err, reponse) => {
            if (err) throw err;
            cb(reponse);
          }
        );
        break;
      case 2211:
        connectMySql.query(
          "select dem.indiceOper,dem.bpartner_name,dem.superViseurName,cld.typeOperation,dem.region,dem.prosper,dem.dateCreation as ddem,cld.dateCreation as dd,dem.timeCreation as tdem ,cld.timeCreation as td  from demandedeploque dem inner join clientdebloque cld on dem.idDemDep=cld.idDemDep where cld.supp=? and dem.supp=? and cld.dateCreation>=? and cld.dateCreation<=? order by dem.region",
          [0, 0, e.dateCreation1, e.dateCreation2],
          (err, reponse) => {
            if (err) throw err;
            cb(reponse);
          }
        );
        break;
    }
  }

  static async insert(e) {
    try {
      if (e.indice === 0) {
        const query = `
          INSERT INTO clientdebloque SET 
            idDemDep = ?, 
            typeOperation = ?, 
            demandeReafectPar = ?, 
            reafecterPar = ?, 
            reafecterA = ?, 
            idSuperViseur = ?, 
            dateCreation = ?, 
            timeCreation = ?, 
            creePar = ?
        `;
  
        await new Promise((resolve, reject) => {
          connectMySql.query(
            query,
            [
              e.idDemDep,
              e.typeOperation,
              e.demandeReafectPar,
              e.reafecterPar,
              e.reafecterA,
              e.id_user,
              e.dateCreation,
              e.timeCreation,
              e.creePar,
            ],
            (err, results) => {
              if (err) return reject(err);
              resolve(results);
            }
          );
        });
      }
    } catch (error) {
      console.error("Insert failed:", error);
      throw error;
    }
  }
  

  static delete(e) {
    var indice = e.indice;
    switch (indice) {
      case 0:
        connectMySql.query(
          "update demandedeploque set supp=?,modifyBy=? where idDemDep=?",
          [1, e.user_id, e.idDemDep],
          (err) => {
            if (err) throw err;
          }
        );
        break;
    }
  }
  static update(e) {
    var indice = e.indice;
    switch (indice) {
      case 1:
        connectMySql.query(
          "update clientdebloque set modifierPar=?,dateModif=?,timeModif=?,supp=? where idClientDebloque=?",
          [e.modifierPar, e.dateModif, e.timeModif, 1, e.idClientDebloque],
          (err) => {
            if (err) throw err;
          }
        );
        break;
    }
  }

  static updateFeature(e, cb) {
    connectMySql.query(`${e}`, (err, result) => {
      if (err) throw err;
      cb(result);
    });
  }
}

module.exports = tabClientDebloque;
