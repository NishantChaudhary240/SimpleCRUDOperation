
import "dotenv/config";
import { createServer } from "node:http";
import { sequelize } from "./database";
import Employee from "./models/Employee";

const PORT = Number(process.env.PORT || 5001);

const server = createServer(async (req, res) => {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Check server
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ message: "Server is running!" }));
      return;
    }

    // Get all employees - READ
    if (req.method === "GET" && req.url === "/api/employees") {
      const employees = await Employee.findAll();

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(employees));
      return;
    }

    // Create an employee - CREATE
    if (req.method === "POST" && req.url === "/api/employees") {
      let body = "";

      for await (const chunk of req) {
        body += chunk;
      }

      const data = JSON.parse(body);

      const employee = await Employee.create({
        name: data.name,
        age: data.age,
        department: data.department,
        salary: data.salary,
        mobile: data.mobile || null,
      });

      res.writeHead(201, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Employee created successfully",
          employee,
        })
      );
      return;
    }

    // Update an employee - UPDATE
    if (
      req.method === "PUT" &&
      req.url?.match(/^\/api\/employees\/\d+$/)
    ) {
      const id = Number(req.url.split("/").pop());

      let body = "";

      for await (const chunk of req) {
        body += chunk;
      }

      const data = JSON.parse(body);

      const employee = await Employee.findByPk(id);

      if (!employee) {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "Employee not found" }));
        return;
      }

      await employee.update({
        name: data.name,
        age: data.age,
        department: data.department,
        salary: data.salary,
        mobile: data.mobile || null,
      });

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Employee updated successfully",
          employee,
        })
      );
      return;
    }

    // Delete an employee - DELETE
    if (
      req.method === "DELETE" &&
      req.url?.match(/^\/api\/employees\/\d+$/)
    ) {
      const id = Number(req.url.split("/").pop());

      const employee = await Employee.findByPk(id);

      if (!employee) {
        res.writeHead(404, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify({ message: "Employee not found" }));
        return;
      }

      await employee.destroy();

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: "Employee deleted successfully",
        })
      );
      return;
    }

    // Route not found
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ message: "Route not found" }));
  } catch (error) {
    console.error("Request error:", error);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");

    await Employee.sync();
    console.log("Employee table ready!");

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
