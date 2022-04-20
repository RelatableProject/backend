import InstitutionType from './institutionType.js';
import Institution from './institution.js';
import Program from "./program.js";
import Role from "./role.js";
import IdentificationType from "./identificationType.js";
import User from "./user.js";
import StudentDetail from "./studentDetail.js";
import Municipality from "./municipality.js";
import Project from "./project.js";
import Gender from "./gender.js";
import EducationLevel from "./educationLevel.js";
import Address from "./address.js";
import Phone from "./phone.js";
import Customer from "./customer.js";

const typeDefs = [InstitutionType.typeDefs, Institution.typeDefs, Program.typeDefs, Role.typeDefs, IdentificationType.typeDefs, StudentDetail.typeDefs, User.typeDefs, Municipality.typeDefs, Project.typeDefs,
Gender.typeDefs, EducationLevel.typeDefs, Address.typeDefs, Phone.typeDefs, Customer.typeDefs];
const resolvers = [InstitutionType.resolvers, Institution.resolvers, Program.resolvers, Role.resolvers, IdentificationType.resolvers, StudentDetail.resolvers,  User.resolvers, Municipality.resolvers, Project.resolvers,
Gender.resolvers, EducationLevel.resolvers, Address.resolvers, Phone.resolvers, Customer.resolvers];

export default {
  typeDefs,
  resolvers,
};
