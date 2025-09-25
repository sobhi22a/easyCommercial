const connectMySql = require('../config/dbSql')

class tabDemandeDebloque {
    constructor(row){
        this.row=row
    }

    static selectFeature(e,cb) {
        connectMySql.query(`${e}`,(err,reponse)=>{
         if(err) throw err
          cb(reponse)
        })
    }
    static selectPromise(e) {
        return new Promise((resolve, reject) => {
          connectMySql.query(`${e}`, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
      }

    static selectFeaturePromise(e) {
        return new Promise((resolve, reject) => {
          connectMySql.query(`${e}`, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response);
            }
          });
        });
    }

    static FindDemendeDeploqueById(data) {
      return new Promise((resolve, reject) => {
        connectMySql.query('select * from demandedeploque where idDemDep=? and supp=?',[data.idDemDep,0],(err,reponse)=>{
          if(err) reject(err)
          resolve(reponse)
      })
      });
    }

    static FindRecouvBySVC(e) {
      return new Promise((resolve, reject) => {
          const opersIds = Array.isArray(e.opersIds) ? e.opersIds.join(',') : e.opersIds;  
  
          connectMySql.query(`
              SELECT * FROM demandedeploque 
              WHERE supp = ? 
              AND dateCreation >= ? 
              AND dateCreation <= ? 
              AND user_id IN (${opersIds.split(',').map(() => '?').join(',')})`, 
              [0, e.dateCreation1, e.dateCreation2, ...opersIds.split(',')], (err, reponse) => {
              if (err) {
                  console.error('Error executing query:', err);
                  reject(err);
              } else {
                  resolve(reponse);
              }
          });
      });
  }

    
    static FindOperBySVC(id_user) {
      return new Promise((resolve, reject) => {
        connectMySql.query('SELECT ad_user_id FROM users WHERE id_svc = ?',
          [id_user],(err,reponse)=>{
          if(err) reject(err)
          resolve(reponse)
      })
      });
    } 
    
    static select (e,cb){
        var indice = e.indice
        switch(indice){
            case 1:
                connectMySql.query('select * from demandedeploque where idDemDep=? and supp=?',[e.idDemDep,0],(err,reponse)=>{
                    if(err) throw err
                    cb(reponse)
                })
            break;
            case 2:
                connectMySql.query('select * from demandedeploque where id_org=? and supp=?',
                [e.id_org,0],(err,reponse)=>{
                  if(err) throw err
                    cb(reponse)
                 })
            break;
            case 22:
                connectMySql.query('select * from demandedeploque where supp=? and dateCreation>=? and dateCreation<=?',
                [0,e.dateCreation1,e.dateCreation2],(err,reponse)=>{
                  if(err) throw err
                    cb(reponse)
                 })
            break;
            case 4:
            connectMySql.query('select * from demandedeploque where user_id=? and dateCreation=? and supp=? order by idDemDep desc',[e.user_id,e.dateCreation,0],(err,reponse)=>{
                if(err) throw err
                cb(reponse)
            })
            break;
            
            case 405:
            connectMySql.query('select * from demandedeploque where bpartner_id=? and user_id=? and dateCreation=? and supp=?',[e.bpartner_id,e.user_id,e.dateCreation,0],(err,reponse)=>{
               if(err) throw err
                cb(reponse)
            })
            break;
            case 1115:
            connectMySql.query('select * from demandedeploque where superViseurRegion=? and valide=? and dateCreation=? and supp=?',
            [e.user_id,'N',e.dateCreation,0],(err,reponse)=>{
              if(err) throw err
                cb(reponse)
             })
            break;
            case 11155:
                connectMySql.query('select * from demandedeploque where valide=? and dateCreation=? and supp=?',
                ['N',e.dateCreation,0],(err,reponse)=>{
                  if(err) throw err
                    cb(reponse)
                 })
            break;
 
        }
    }

    static insert(e) {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO demandedeploque 
          SET 
            id_org = ?, 
            indiceOper = ?, 
            user_id = ?, 
            bpartner_id = ?, 
            bpartner_name = ?, 
            bpartner_status = ?, 
            region = ?, 
            id_region = ?, 
            prosper = ?, 
            bp_lastOper = ?, 
            superViseurRegion = ?, 
            superViseurName = ?, 
            balance = ?, 
            numTelephone = ?, 
            dateCreation = ?, 
            timeCreation = ?, 
            createdBy = ?, 
            lastCommande = ?, 
            clientExcellent = ?,
            zcreditMessage = ?,
            isSeuil = ?,
            isBalance = ?
        `;
    
        const values = [
          e.id_org,
          e.indiceOper,
          e.user_id,
          e.bpartner_id,
          e.bpartner_name,
          e.bpartner_status,
          e.region,
          e.id_region,
          e.prosper,
          e.bp_lastOper,
          e.superViseurRegion,
          e.superViseurName,
          e.balance,
          e.numTelephone,
          e.dateCreation,
          e.timeCreation,
          e.user_id, // Assuming createdBy is the user_id
          e.lastCommande,
          e.clientExcellent,
          e.zcreditMessage,
          e.isSeuil,
          e.isBalance
        ];
    
        connectMySql.query(query, values, (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        });
      });
    }

    static delete (e){
      var indice = e.indice
      switch(indice){
        case 0:
         connectMySql.query('update demandedeploque set supp=?,modifyBy=? where idDemDep=?',[1,e.user_id,e.idDemDep],(err)=>{if(err) throw err})
        break;
        }
    }

    static updatePromise(sql) {
      return new Promise((resolve, reject) => {
        connectMySql.query(`${sql}`, (err, result) => {
          if (err) reject (err);
            resolve(result.affectedRows);
        });
      });
    }

    static updateProspect(statutProsper, indiceOper, id_user, idDemDeploque) {
      return new Promise((resolve, reject) => {
        const sql = `UPDATE demandedeploque SET 
                  prosper=${statutProsper},
                  zcreditMessage='${indiceOper}',
                  modifyBy=${id_user}
                  WHERE idDemDep = ${idDemDeploque}`;
        connectMySql.query(`${sql}`, (err, result) => {
          if (err) reject (err);
            resolve(result.affectedRows);
        });
      });
    }
    static UpdateValide(e) {
      return new Promise((resolve, reject) => {
        const query = `
          UPDATE demandedeploque 
            SET valide = ?,
            description = ?,
            modifyBy = ? 
          WHERE idDemDep = ?
        `;
    
        connectMySql.query(
          query,
          [
            e.valide, 
            e.description, 
            e.modifyBy, 
            e.idDemdep
          ],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });
    }
    static update (e){
        var indice = e.indice
        switch(indice){
          case 1:
              //indice:1,valide:valide,description:description,modifyBy:indiceOper,idDemdep:idDemDeploque}
           connectMySql.query('update demandedeploque set valide=?,description=?,modifyBy=? where idDemDep=?'
           ,[e.valide,e.description,e.modifyBy,e.idDemdep],(err)=>{
               if(err) throw err
            })
          break;
          case 11:
              connectMySql.query('update demandedeploque set valide=?,modifyBy=? where idDemDep=?',['N',e.modifyBy,e.idDemDep],(err)=>{
                  if(err) throw err 
              })
          break;
          }
      }
}

module.exports=tabDemandeDebloque