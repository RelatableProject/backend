import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getQuerys, getMutations, getRelations, forAsync, getAge} from "../utils/modelUtils.js";
import IdentificationType from "./identificationType.js";
import User from "./user.js";
import Project from "./project.js";
import Gender from "./gender.js";
import EducationLevel from "./educationLevel.js";
import Phone from "./phone.js";
import Address from "./address.js";


const model = database.define('Customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    identification: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    stratum: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    familyPosition: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    occupation: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Customers',
    timestamps: true
});

const include = [
    model.belongsTo(IdentificationType.model, {as: 'identificationType', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'identificationTypeId', field: 'identificationTypeId'}}),
    model.belongsToMany(User.model, {as: 'usersSuppliers', through: 'CustomerUsersSuppliers'}),
    model.belongsTo(Project.model, {as: 'project', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'projectId', field: 'projectId'}}),
    model.belongsTo(Gender.model, {as: 'gender', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'genderId', field: 'genderId'}}),
    model.belongsTo(EducationLevel.model, {as: 'educationLevel', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'educationLevelId', field: 'educationLevelId'}}),
    model.hasMany(Phone.model, {as: 'phones', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'customerId', field: 'customerId'}}),
    model.hasMany(Address.model, {as: 'addresses', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'customerId', field: 'customerId'}})
];

Phone.model.belongsTo(model, {as: 'customer', onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'customerId', field: 'customerId'}});
Address.model.belongsTo(model, {as: 'customer', onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'customerId', field: 'customerId'}});
Project.model.hasMany(model, {as: 'customers', onDelete: 'CASCADE', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'projectId', field: 'projectId'}});

const typeDefs = gql` 
    type Customer {
        id: Int!
        firstName: String!
        lastName: String!
        name: String!
        identification: String!
        age: Int!
        birthDate: Date!
        stratum: Int!
        familyPosition: Int!
        identificationType: IdentificationType!
        usersSuppliers: [User]
        project: Project!
        educationLevel: EducationLevel!
        gender: Gender!
        phones: [Phone]!
        addresses: [Address]!
        occupation: String!
        createdAt: Date!
        updatedAt: Date!
    }
    
    extend type Query {
        customers: [Customer]
        customer(id: Int!): Customer
        customersByProject(projectId: Int!): [Customer]
    }
    
    extend type Mutation {
        createCustomer(firstName: String!, lastName: String!, identification: String!, birthDate: Date!, stratum: Int!, familyPosition: Int!, occupation: String!, identificationTypeId: Int!, projectId: Int!, genderId: Int!, educationLevelId: Int!, phones: [PhoneInputCreate], addresses: [AddressInput]): Customer
        updateCustomer(id: Int!, firstName: String, lastName: String, occupation: String, identification: String, birthDate: Date, stratum: Int, familyPosition: Int, identificationTypeId: Int, projectId: Int, genderId: Int, educationLevelId: Int): Customer
        deleteCustomer(id: Int!): Customer
    }
`

const resolvers = {
   Query: {
      ...getQuerys(model),
       customersByProject: async (_, {projectId}) => await model.findAll({where: {projectId}})
   },
   Mutation: {
      ...getMutations(model),
       createCustomer: async (_, args) => {
           const customer = await model.create(args);
           if (args.phones)
               for (const item of args.phones) await customer.createPhone(item);
           if (args.addresses)
               for (const item of args.addresses) await customer.createAddress(item);
           return customer;
       }
   },
   Customer: {
      ...getRelations(model, include),
       name: (root) => `${root.firstName} ${root.lastName}`,
       age: (root) => getAge(root.birthDate),
   }
};


export default { model, typeDefs, resolvers };
