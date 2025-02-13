import "reflect-metadata";
import { AppDataSource } from "./src/infra/db/typeOrm/dataSource";
import app from "./src/presentation/http/app";

(async () => {
	await AppDataSource.initialize();
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
