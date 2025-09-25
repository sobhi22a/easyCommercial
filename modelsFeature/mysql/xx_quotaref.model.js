module.exports=(sequelize,DataTypes)=>{
    const Xx_quotaref = sequelize.define("Xx_quotaref",{
        idBccQuota_id :{
          type:DataTypes.INTEGER,
          primaryKey:true,
          autoIncrement:true
        },
        reference :{
          type:DataTypes.INTEGER,
          allowNull:false
        },
        c_bpartner_id :{
          type:DataTypes.INTEGER,
          allowNull:false
        },
        documentno:{
          type:DataTypes.STRING,
          allowNull:false, 
        },
        statusCmd:{
          type:DataTypes.CHAR(1),
          allowNull:false,
          defaultValue:'N'  
        },
        c_order_id:{
         type:DataTypes.INTEGER,
         allowNull:false,  
        },
        createdby:{
          type:DataTypes.STRING,
          allowNull:false,
         },
        traiter:{
          type:DataTypes.CHAR(1),
          allowNull:false,
          defaultValue:'N'  
        },
        confirmer:{
          type:DataTypes.CHAR(1),
          allowNull:false,
          defaultValue:'N' 
        },
        ad_user_id:{
          type:DataTypes.INTEGER,
          allowNull:false,
        },
        nomTiers:{
            type:DataTypes.STRING,
          allowNull:false, 
        },
        ad_org_id:{
          type:DataTypes.INTEGER,
          allowNull:false,
        },
        dateTraiter:{
          field: 'dateTraiter',
          type: DataTypes.DATE,
          allowNull:true,
        },
         dateConfirmer:{
          field: 'dateConfirmer',
          type: DataTypes.DATE,
          allowNull:true, 
        },
        status:{
          type:DataTypes.CHAR(1),
          allowNull:false,
          defaultValue:'N' 
        },
        modifierDC:{
          type:DataTypes.CHAR(1),
          allowNull:false,
          defaultValue:'N' 
        },
        id_svc:{
          type:DataTypes.INTEGER,
          allowNull:false,
        },
        createdAt: {
          field: 'createdAt',
          type: DataTypes.DATE,
          allowNull:false,
          defaultValue: DataTypes.fn('NOW')
        },
        updatedAt: {
            field: 'updatedAt',
            type: DataTypes.DATE,
            defaultValue: DataTypes.fn('NOW'),
            allowNull:true
        },
    });
    return Xx_quotaref
}