const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("/* any invalid path", () => {
  it("status 404: responds with message 'not found'", () => {
    return request(app)
      .get("/api/thisiswrong")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not Found");
      });
  });
});

describe("GET /api/categories", () => {
  it("status 200: responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);
        expect(categories).toBeInstanceOf(Array);
        expect(
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          })
        );
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("status 200: responds with requested review object", () => {
    const reviewId = 1;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.objectContaining({
            review_id: reviewId,
            title: "Agricola",
            category: "euro game",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_body: "Farmyard fun!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
          })
        );
      });
  });
  it("status 404: responds with 404 if passed a valid number, but there is no review with that number", () => {
    const tooHighId = 10000;
    return request(app)
      .get(`/api/reviews/${tooHighId}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Review Not Found");
      });
  });
  it("status 400: responds with 400 if passed something that isn't a number", () => {
    const notANumber = "kitten";
    return request(app)
      .get(`/api/reviews/${notANumber}`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status 200: responds with requested review object, with comment count", () => {
    const reviewId = 3;
    return request(app)
      .get(`/api/reviews/${reviewId}`)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual({
          review_id: reviewId,
          title: "Ultimate Werewolf",
          category: "social deduction",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_body: "We couldn't find the werewolf!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          comment_count: 3,
        });
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("update votes on specified review if sent request body as follows {inc_vote: newVote}", () => {
    const reviewId = 2;
    const increaseVotes = { inc_votes: 3 };
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send(increaseVotes)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.objectContaining({
            review_id: 2,
            title: "Jenga",
            designer: "Leslie Scott",
            owner: "philippaclaire9",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Fiddly fun for all the family",
            category: "dexterity",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: 8,
          })
        );
      });
  });
  it("status 404: responds with 404 if passed a valid number, but there is no review with that number", () => {
    const tooHighId = 10000;
    return request(app)
      .patch(`/api/reviews/${tooHighId}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Review Not Found");
      });
  });
  it("status 400: responds with 400 if passed something that isn't a number as review id", () => {
    const notANumber = "wolf";
    return request(app)
      .patch(`/api/reviews/${notANumber}`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status 400: responds with 400 if passed something that isn't a number in votes object", () => {
    const reviewId = 2;
    const increaseVotes = { inc_votes: "Tapir" };
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send(increaseVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status 400: responds with 400 if passed something that a votes object without key of inc_votes", () => {
    const reviewId = 3;
    const increaseVotes = { votes: 2 };
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send(increaseVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  it("status 200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        expect(users).toBeInstanceOf(Array);
        expect(
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          })
        );
      });
  });
});

describe("GET /api/reviews", () => {
  it("status 200: responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeInstanceOf(Array);
        expect(
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          })
        );
      });
  });
  it("returns reviews, sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("accepts query to sort reviews by any valid numeric column", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  it("accepts query to sort reviews alphabetically by valid columns: title, owner, category, designer", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("designer", {
          descending: true,
        });
      });
  });
  it("accepts order to sort reviews ascending or descending", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeSortedBy("owner", {
          descending: false,
        });
      });
  });
  it("filters by category, if one is specified", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(11);
        expect(reviews).toBeInstanceOf(Array);
        expect(
          reviews.forEach((review) => {
            expect(review.category).toBe("social deduction");
          })
        );
      });
  });
  it("returns by an empty array, if category with no reviews is specified", () => {
    return request(app)
      .get("/api/reviews?category=children%27s+games")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(0);
        expect(reviews).toBeInstanceOf(Array);
      });
  });
  it("status 400: if user tries to enter a non-valid sort_by query", () => {
    const invalidSortBy = "muffin";
    return request(app)
      .get(`/api/reviews?sort_by=${invalidSortBy}`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid sort query");
      });
  });
  it("status 400: if user tries to enter a non-valid order_by query", () => {
    const invalidOrderBy = "crisps";
    return request(app)
      .get(`/api/reviews?order_by=${invalidOrderBy}`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid order query");
      });
  });
  it("status 404: if user tries to enter a non-valid category in query", () => {
    const invalidCategory = "colour";
    return request(app)
      .get(`/api/reviews?category=${invalidCategory}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid category query");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("status 200: responds with array of comments for the given review_id", () => {
    const reviewId = 3;
    return request(app)
      .get(`/api/reviews/${reviewId}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.arrayContaining([
            {
              comment_id: 2,
              votes: 13,
              created_at: "2021-01-18T10:09:05.410Z",
              author: "mallionaire",
              body: "My dog loved this game too!",
              review_id: 3,
            },
            {
              comment_id: 3,
              votes: 10,
              created_at: "2021-01-18T10:09:48.110Z",
              author: "philippaclaire9",
              body: "I didn't know dogs could play games",
              review_id: 3,
            },
            {
              comment_id: 6,
              votes: 10,
              created_at: "2021-03-27T19:49:48.110Z",
              author: "philippaclaire9",
              body: "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
              review_id: 3,
            },
          ])
        );
      });
  });
  it("status 404: responds with 'No Review Found' if passed a valid number, but one that has no corresponding review", () => {
    const tooHighId = 10000;
    return request(app)
      .get(`/api/reviews/${tooHighId}/comments`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Review Not Found");
      });
  });
  it("status 400: responds with 'Bad Request' if passed something that isn't a number", () => {
    const notANumber = "frog";
    return request(app)
      .get(`/api/reviews/${notANumber}/comments`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status 200: returns array of 0, if there is a review but it contains no comments", () => {
    const reviewId = 1;
    return request(app)
      .get(`/api/reviews/${reviewId}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual([]);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("status 201: responds with posted comment with comment_id and correct review_id if sent correct format request body", () => {
    const newComment = { username: "bainesface", body: "loved it" };
    const reviewId = 2;
    return request(app)
      .post(`/api/reviews/${reviewId}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postedComment } = body;
        expect(postedComment).toEqual(
          expect.objectContaining({
            body: "loved it",
            author: "bainesface",
            comment_id: 7,
            created_at: expect.any(String),
            review_id: 2,
            votes: 0,
          })
        );
      });
  });
  it("status 400: responds with 400 if posted comment doesn't contain both keys", () => {
    const newComment = { username: "bainesface", commentBody: "hated it" };
    const reviewId = 3;
    return request(app)
      .post(`/api/reviews/${reviewId}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
  it("status 404: responds with 404 if passed a valid number, but there is no review with that number", () => {
    const tooHighId = 10000;
    const newComment = { username: "bainesface", body: "it was OK" };
    return request(app)
      .post(`/api/reviews/${tooHighId}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Review Not Found");
      });
  });
  it("status 404: responds with 404 if user not in database tries to post", () => {
    const newComment = { username: "swirly_wurly", body: "loved it" };
    const reviewId = 2;
    return request(app)
      .post(`/api/reviews/${reviewId}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("User Not Found");
      });
  });
  it("status 400: responds with 'Bad Request' if passed something in path that isn't a number", () => {
    const notANumber = "wispa";
    return request(app)
      .post(`/api/reviews/${notANumber}/comments`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("deletes comment if given valid comment id", () => {
    const commentId = 2;
    return request(app).delete(`/api/comments/${commentId}`).expect(204);
  });
  it("status 404: returns 404 if comment_id doesn't exist", () => {
    const tooHighId = 1000;
    return request(app)
      .delete(`/api/comments/${tooHighId}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Comment not found");
      });
  });
  it("status 400: returns 400 if comment_id is not a number", () => {
    const notANumber = "turtle";
    return request(app)
      .delete(`/api/comments/${notANumber}`)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api", () => {
  it("returns JSON describing all endpoints on API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(endpoints).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/categories": {
            description: "serves an array of all categories",
            queries: [],
            exampleResponse: {
              categories: [
                {
                  description:
                    "Players attempt to uncover each other's hidden role",
                  slug: "social deduction",
                },
              ],
            },
          },
          "GET /api/reviews": {
            description: "serves an array of all reviews",
            queries: ["category", "sort_by", "order_by"],
            exampleResponse: {
              reviews: [
                {
                  title: "One Night Ultimate Werewolf",
                  designer: "Akihisa Okui",
                  owner: "mallionaire",
                  review_img_url:
                    "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  category: "hidden-roles",
                  created_at: 1610964101251,
                  votes: 5,
                },
              ],
            },
          },
          "GET /api/users": {
            description: "serves an array of all users",
            exampleResponse: {
              users: [
                {
                  username: "mallionaire",
                  name: "haz",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                },
                {
                  username: "philippaclaire9",
                  name: "philippa",
                  avatar_url:
                    "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
                },
              ],
            },
          },
          "GET /api/reviews/:review_id": {
            description: "serves review object with specified review_id",
            queries: [],
            exampleResponse: {
              review: {
                review_id: "1",
                title: "Agricola",
                category: "euro game",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_body: "Farmyard fun!",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                created_at: "2021-01-18T10:00:20.514Z",
                votes: "1",
                comment_count: "0",
              },
            },
          },
          "PATCH /api/reviews/:review_id": {
            description:
              "updates votes of specified review by number of votes sent on request and returns updated review",
            queries: [],
            exampleRequest: { inc_votes: 3 },
            exampleResponse: {
              review: {
                review_id: "2",
                title: "Jenga",
                designer: "Leslie Scott",
                owner: "philippaclaire9",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Fiddly fun for all the family",
                category: "dexterity",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: "8",
              },
            },
          },
          "GET /api/reviews/:review_id/comments": {
            description:
              "responds with array of comments for the given review_id",
            queries: [],
            exampleResponse: {
              review: [
                {
                  comment_id: "2",
                  votes: "13",
                  created_at: "2021-01-18T10:09:05.410Z",
                  author: "mallionaire",
                  body: "My dog loved this game too!",
                  review_id: "3",
                },
                {
                  comment_id: "3",
                  votes: "10",
                  created_at: "2021-01-18T10:09:48.110Z",
                  author: "philippaclaire9",
                  body: "I didn't know dogs could play games",
                  review_id: "3",
                },
              ],
            },
          },
          "POST /api/reviews/:review_id/comments": {
            description:
              "responds with posted comment if sent new comment in an object with keys username and body",
            queries: [],
            exampleRequest: { username: "bainesface", body: "loved it" },
            exampleResponse: {
              body: "loved it",
              author: "bainesface",
              comment_id: "7",
              created_at: "2022-05-19T22:23:40.331Z",
              review_id: "2",
              votes: "0",
            },
          },
          "DELETE /api/comments/:comment_id": {
            description:
              "deletes comment if given valid comment id, returns 204 if successful",
            queries: [],
          },
        });
      });
  });
});
