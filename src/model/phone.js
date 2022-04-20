import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import { getQuerys, getMutations, getDefaultResolver, getRelations } from "../utils/modelUtils.js";


const model = database.define('Phone', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isSms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isCall: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isWhatsapp: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isPrincipal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    tableName: 'Phones',
    timestamps: true
});

const include = [
    //model.belongsTo(model, {as: 'nombre', onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'nombreColumna', field: 'nombreColumna'}}),

];

const typeDefs = gql`
    type Phone {
        id: Int!
        number: String!
        isSms: Boolean!
        isCall: Boolean!
        isWhatsapp: Boolean!
        isPrincipal: Boolean!
        isActive: Boolean!
        customer: Customer!
    }
    
    input PhoneInputCreate {
        number: String!
        isSms: Boolean
        isCall: Boolean
        isWhatsapp: Boolean
        isPrincipal: Boolean!
        isActive: Boolean
    }
    
    extend type Query {
        phones: [Phone]
        phone(id: Int!): Phone
    }
    extend type Mutation {
        createPhone(number: String!, isSms: Boolean, isCall: Boolean, isWhatsapp: Boolean, isPrincipal: Boolean!, isActive: Boolean, customerId: Int!): Phone
        updatePhone(id: Int!, number: String, isSms: Boolean, isCall: Boolean, isWhatsapp: Boolean, isPrincipal: Boolean, isActive: Boolean): Phone
        deletePhone(id: Int!): Phone
    }
`

const resolvers = {
   Query: {
      ...getQuerys(model),
   },
   Mutation: {
      ...getMutations(model),
   },
   Phone: {
      ...getRelations(model, include),
       customer: async (root) => await root.getCustomer(),

   }
};


export default { model, typeDefs, resolvers };
