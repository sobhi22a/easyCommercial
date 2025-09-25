module.exports=(sequelize,DataTypes)=>{
    const Conditions = sequelize.define("Conditions",{
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
        requette:{
          type:DataTypes.STRING,
          length: 255,
          allowNull:false, 
        },
        message:{
          type:DataTypes.STRING,
          length: 255,
          allowNull:false,
          defaultValue:'Vous avez déjà réservé ce produit'  
        },
        compteur:{
         type:DataTypes.INTEGER,
         allowNull:false,  
         defaultValue:1
        },
        isactive:{
          type:DataTypes.CHAR(1),
          defaultValue:'Y',
          allowNull:false,
         },
        createdby:{
          type:DataTypes.INTEGER,
          allowNull:false,
        },
        qtymax:{
          type:DataTypes.INTEGER,
          allowNull:false, 
        },
    });
    return Conditions
}