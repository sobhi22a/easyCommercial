module.exports=(sequelize,DataTypes)=>{
    const InventaireProduits = sequelize.define("InventaireProduits",{
        id :{
          type:DataTypes.INTEGER,
          primaryKey:true,
          autoIncrement:true
        },
        m_product_id :{
          type:DataTypes.INTEGER,
          allowNull:false
        },
        name :{
          type:DataTypes.STRING,
          length: 255,
          allowNull:false
        },
        empl:{
         type:DataTypes.STRING,
         allowNull:true,  
        },
        isFinished:{
          type:DataTypes.CHAR(1),
          allowNull:false,
          defaultValue:'N'  
        },
        createdBy:{
          type:DataTypes.INTEGER,
          allowNull:false,
        },
        createdAt:{
          type:DataTypes.STRING,
          allowNull:false, 
        },
    });
    return InventaireProduits
}