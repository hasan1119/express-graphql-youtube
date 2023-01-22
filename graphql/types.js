const {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLError,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLScalarType,
  GraphQLInputObjectType,
  Kind,
} = require("graphql");
const { users, posts } = require("../data");

// GenderEnumType
const GenderEnumType = new GraphQLEnumType({
  name: "GenderEnumType",
  description: "Enum type for gander",
  values: {
    male: {
      value: "male",
    },
    female: {
      value: "female",
    },
  },
});

// date validator
const validateDate = (value) => {
  const date = new Date(value);
  if (date.toString() === "Invalid Date") {
    throw new GraphQLError(`${value} is not a valid date`);
  } else {
    return date.toISOString();
  }
};

// DateType
const DateType = new GraphQLScalarType({
  name: "DateType",
  description: "It represents a date",
  parseValue: validateDate,
  parseLiteral: (AST) => {
    if (AST.kind === Kind.STRING || AST.kind === Kind.INT) {
      return validateDate(AST.value);
    } else {
      throw GraphQLError(`${AST.value} is not a number or string!`);
    }
  },
  serialize: validateDate,
});

// email validator
function validateEmail(email) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(regex)) {
    return email;
  }
  throw new GraphQLError(`${value} is not a valid Email`);
}

// Email Type
const EmailType = new GraphQLScalarType({
  name: "EmailType",
  description: "It is for email",
  parseValue: validateEmail,
  parseLiteral: (AST) => {
    if (AST.kind === Kind.STRING) {
      return validateEmail(AST.value);
    } else {
      throw GraphQLError(`${AST.value} is not a string!`);
    }
  },
  serialize: validateEmail,
});

function passwordValidator(password) {
  var pwdRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if (pwdRegex.test(password)) {
    return password;
  } else {
    throw new GraphQLError("Password is not enough strong!");
  }
}

// password Type
const PasswordType = new GraphQLScalarType({
  name: "PasswordType",
  description:
    "It is for strong password with one uppercase, one lowercase, 1 simple , 1 number",
  parseValue: passwordValidator,
  parseLiteral: (AST) => {
    if (AST.kind === Kind.STRING) {
      return passwordValidator(AST.value);
    } else {
      throw new GraphQLError("Password is not a string!");
    }
  },
});

// post type
const PostType = new GraphQLObjectType({
  name: "Post",
  description: "It represents a single post",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    user: {
      type: UserType,
      resolve: (post, args) => {
        return users.find((user) => user.id == post.user);
      },
    },
  }),
});

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  description: "It represents a single user!",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gander: {
      type: GenderEnumType,
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: EmailType,
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (user) => {
        return posts.filter((post) => {
          if (user.posts.includes(post.id)) {
            return true;
          }
          {
            return false;
          }
        });
      },
    },
    createdAt: {
      type: DateType,
    },
    password: {
      type: PasswordType,
    },
  }),
});

// UserTypeInput
const UserTypeInput = new GraphQLInputObjectType({
  name: "UserTypeInput",
  description: "Taking input to add a new user",
  fields: () => ({
    firstName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    lastName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    gander: {
      type: new GraphQLNonNull(GenderEnumType),
    },
    phone: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(EmailType),
    },
    createdAt: {
      type: DateType,
    },
    password: {
      type: PasswordType,
    },
  }),
});

// update user input type
const UpdateUserTypeInput = new GraphQLInputObjectType({
  name: "UpdateUserTypeInput",
  description: "Taking input to update an existing user",
  fields: () => ({
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    gander: {
      type: GenderEnumType,
    },
    phone: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
  }),
});

// Root Query Type
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    users: {
      type: new GraphQLList(new GraphQLNonNull(UserType)),
      resolve: () => {
        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        const user = users.find((user) => user.id == id);
        return user;
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: () => {
        return posts;
      },
    },
    post: {
      type: PostType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        return posts.find((post) => post.id == id);
      },
    },
  }),
});

// Root Mutation Type
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        input: {
          type: UserTypeInput,
        },
      },
      resolve: (
        _,
        {
          input: {
            firstName,
            lastName,
            gander,
            phone,
            email,
            createdAt,
            password,
          },
        }
      ) => {
        const user = {
          id: users.length + 1,
          firstName,
          lastName,
          gander,
          phone,
          email,
          posts: [],
          createdAt,
          password,
        };

        users.push(user);
        return user;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLID,
        },
        input: {
          type: UpdateUserTypeInput,
        },
      },
      resolve: (
        _,
        { id, input: { firstName, lastName, gander, phone, email } }
      ) => {
        let updatedUser = null;
        users.forEach((user) => {
          if (user.id == id) {
            if (firstName) {
              user.firstName = firstName;
            }
            if (lastName) {
              user.lastName = lastName;
            }
            if (gander) {
              user.gander = gander;
            }
            if (phone) {
              user.phone = phone;
            }
            if (email) {
              user.email = email;
            }

            updatedUser = user;
          }
        });

        return updatedUser;
      },
    },
    deleteUser: {
      type: GraphQLNonNull(GraphQLBoolean),
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (_, { id }) => {
        const index = users.findIndex((user) => user.id == id);
        if (index >= 0) {
          users.splice(index, 1);
          return true;
        } else {
          return false;
        }
      },
    },
  }),
});

module.exports = {
  RootQueryType,
  UserType,
  RootMutationType,
};
