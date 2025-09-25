module.exports=(sequelize,DataTypes)=>{
    const Parametres = sequelize.define("Parametres",{
        parametre_id :{
          type:DataTypes.INTEGER,
          primaryKey:true,
          autoIncrement:true
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
    return Parametres
}