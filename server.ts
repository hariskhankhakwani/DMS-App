import 'reflect-metadata';  // MUST be first
import app from "./src/presentation/app";
import { AppDataSource } from './src/infra/db/typeOrm/dataSource';

(async() => {await AppDataSource.initialize();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();