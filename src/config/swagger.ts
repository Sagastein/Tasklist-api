import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TASKLIST API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080/api/v1",
      },
    ],
    //add authentication
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};
export const specs = swaggerJsdoc(options);
