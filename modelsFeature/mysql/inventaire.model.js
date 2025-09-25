module.exports=(sequelize,DataTypes)=>{
    const Inventaire = sequelize.define("Inventaire",{
        condition_id :{
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
        quantity:{
          type:DataTypes.STRING,
          length: 255,
          allowNull:true, 
        },
        ppa:{
          type:DataTypes.STRING,
          length: 255,
          allowNull:true,
        },
        date:{
         type:DataTypes.STRING,
         allowNull:true,  
        },
        lot:{
         type:DataTypes.STRING,
         allowNull:true,  
        },
        empl:{
         type:DataTypes.STRING,
         allowNull:true,  
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
    return Inventaire
}