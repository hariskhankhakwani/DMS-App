import express from "express";
import { errorMiddleware } from "./middleware/errorMiddleware";
import documentRoutes from "./routes/documentRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(express.json());
app.use(errorMiddleware);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);

export default app;
