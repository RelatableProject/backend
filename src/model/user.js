import {database} from "../database.js";
import {DataTypes} from "sequelize";
import {gql} from "apollo-server";
import {getMutations, getQuerys, getRelations} from "../utils/modelUtils.js";
import IdentificationType from "./identificationType.js";
import Institution from "./institution.js";
import Role from "./role.js";
import StudentDetail from "./studentDetail.js";


const model = database.define('User', {
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
    institutionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    identification: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
}, {
    tableName: 'Users',
    timestamps: true
});


const typeDefs = gql`
    type User {
        id: Int!
        firstName: String!
        lastName: String!
        role: Role!
        institutionId: String!
        identificationType: IdentificationType!
        identification: String!
        institutions: [Institution]!
        studentDetail: StudentDetail
        name: String!
        isActive: Boolean!        
    }
    
    extend type Query {
        users: [User]
        user(id: Int!): User
    }
    
    extend type Mutation {
        createUser(firstName: String!, lastName: String!, institutionId: String!, identificationTypeId: Int!, identification: String!, roleId: Int!, institutionsIds: [Int!]!, studentDetail: StudentDetailInput): User
        updateUser(id: Int!, firstName: String, lastName: String, institutionId: String, identificationTypeId: Int, identification: String, roleId: Int, studentDetail: StudentDetailInput): User
        deleteUser(id: Int!): User
    }
`

let include = [
    model.hasOne(StudentDetail.model, {as: 'studentDetail', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'userId', field: 'userId'}}),
    model.belongsTo(Role.model, {as: 'role', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'roleId', field: 'roleId'}, targetKey: 'id'}),
    model.belongsTo(IdentificationType.model, {as: 'identificationType', onDelete: 'RESTRICT', onUpdate: 'CASCADE', foreignKey: {allowNull: false, name: 'identificationTypeId', field: 'identificationTypeId'}}),
    model.belongsToMany(Institution.model, {as: 'institutions', through: 'UserInstitutions', foreignKey: {name: 'userId', field: 'userId'}}),
];

const resolvers = {
   Query: {
       ...getQuerys(model,)
   },
   Mutation: {
       ...getMutations(model,),
       updateUser: async (_, args) => {
           const user = await model.findByPk();
           await model.update(args, {where: {id: args.id}});
           if (args.studentDetail) {
               if (user.studentDetail) await StudentDetail.model.update(args.studentDetail, {where: {id: user.studentDetail.id}});
               else await user.createStudentDetail(args.studentDetail);
           }
           return await model.findByPk(args.id);
       },
       createUser: async (_, args) => {
           let role = await Role.model.findByPk(args.roleId);
           if (role.isStudent && !args.studentDetail) throw new Error('Student must have a student detail');
           const user = await model.create(args);
           await user.setInstitutions(args.institutionsIds);
           if (args.studentDetail) {
               await user.createStudentDetail(args.studentDetail);
           }
           return user;
       },
   },
    User: {
        ...getRelations(model, include),
        name: (user) => `${user.firstName} ${user.lastName}`
    }
};


export default { model, typeDefs, resolvers };
