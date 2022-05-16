const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

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
        expect(review).toEqual({
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
        });
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
});

describe("PATCH /api/reviews/:review_id", () => {
  it("update votes on specified review if sent request body as follows {inc_vote: newVote}", () => {
    const reviewId = 2;
    const increaseVotes = { inc_votes: 2 };
    return request(app)
      .patch(`/api/reviews/${reviewId}`)
      .send(increaseVotes)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: new Date(1610964101251),
          votes: 7,
        });
      });
  });
});
