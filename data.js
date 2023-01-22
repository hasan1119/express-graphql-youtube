const users = [
  {
    id: 1,
    firstName: "Joy",
    lastName: "Sarkar",
    gander: "male",
    phone: "01792384909",
    email: "joy@sarkar.com",
    posts: [1, 2],
    createdAt: "2023-01-22T18:47:59.894Z",
    password: "Abc@s123",
  },
  {
    id: 2,
    firstName: "Ruhul",
    lastName: "Sarkar",
    gander: "male",
    phone: "01792384909",
    email: "joy@sarkar.com",
    posts: [3],
    createdAt: "2023-01-22T18:47:59.894Z",
    password: "Abc@s123",
  },
];

const posts = [
  {
    id: 1,
    title: "GraphQL",
    description: "SaA query language for your APIrkar",
    user: 1,
  },
  {
    id: 2,
    title: "JS",
    description: "SaA query language for your APIrkar",
    user: 1,
  },
  {
    id: 3,
    title: "PHP",
    description: "SaA query language for your APIrkar",
    user: 2,
  },
];

module.exports = { users, posts };
