import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> calls createBlog", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const inputTitle = screen.getByPlaceholderText("title");
  const inputAuthor = screen.getByPlaceholderText("author");
  const inputUrl = screen.getByPlaceholderText("url");

  const submitButton = screen.getByText("save");

  await user.type(inputTitle, "testing a form...");
  await user.type(inputAuthor, "author");
  await user.type(inputUrl, "abc.com");
  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  console.log(createBlog.mock.calls[0][0].title);
  expect(createBlog.mock.calls[0][0].title).toBe("testing a form...");
});
