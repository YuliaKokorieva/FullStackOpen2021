describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Yulia K",
      username: "Yulia",
      password: "password",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("login").click();
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("Yulia");
      cy.get("#password").type("password");
      cy.get("#login-button").click();
      cy.contains("Yulia K logged-in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("Yulia");
      cy.get("#password").type("wrong_password");
      cy.get("#login-button").click();
      cy.contains("wrong credentials");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "Yulia", password: "password" });
    });

    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#input-title").type("Blog by Cypress");
      cy.get("#input-author").type("author");
      cy.get("#input-url").type("abc.com");
      cy.get("#save-button").click();
      cy.contains("Blog by Cypress");
    });

    beforeEach(function () {
      cy.createBlog({
        title: "second blog",
        author: "new author",
        url: "nbc.com",
        likes: 3,
      });

      cy.visit("http://localhost:3000");
      cy.contains("view").click();
    });

    it("user can like a blog", function () {
      cy.get("#likeButton").click();
      cy.contains("likes:4");
    });

    it("user can delete blog", function () {
      cy.get("#remove-button").click();
      cy.get("blog to delete").should("not.exist");
    });
  });

  describe("user who did not create a blog", function () {
    it("cannot delete it", function () {
      cy.login({ username: "Yulia", password: "password" });
      cy.createBlog({
        title: "second blog",
        author: "new author",
        url: "nbc.com",
        likes: 3,
      });
      cy.visit("http://localhost:3000");
      cy.contains("logout").click();

      const user = {
        name: "Anna H",
        username: "Anna",
        password: "password",
      };
      cy.request("POST", "http://localhost:3003/api/users/", user);
      cy.visit("http://localhost:3000");

      cy.login({ username: "Anna", password: "password" });
      cy.contains("view").click();
      cy.get("#remove-button").should("not.exist");
    });
  });

  describe("Blogs ordered according to likes", function () {
    it("in descending order", function () {
      cy.login({ username: "Yulia", password: "password" });
      cy.createBlog({
        title: "first added: blog with 1 like",
        author: "new author",
        url: "nbc.com",
        likes: 1,
      });
      cy.createBlog({
        title: "second added: blog with 5 likes",
        author: "new author",
        url: "nbc.com",
        likes: 5,
      });
      cy.createBlog({
        title: "third added: blog with 8 likes",
        author: "new author",
        url: "nbc.com",
        likes: 8,
      });
      cy.visit("http://localhost:3000");
      cy.get(".blog").eq(0).should("contain", "third added: blog with 8 likes");
      cy.get(".blog")
        .eq(1)
        .should("contain", "second added: blog with 5 likes");
      cy.get(".blog").eq(2).should("contain", "first added: blog with 1 like");
    });
  });
});
