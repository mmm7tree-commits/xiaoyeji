import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import { AdminStoreSnapshot } from "./admin-data.types";
import { createInitialAdminData } from "./admin-data.seed";

@Injectable()
export class AdminDataService {
  private readonly dataFile = path.resolve(
    process.cwd(),
    process.env.ADMIN_DATA_FILE || "./data/admin-store.json"
  );
  private readonly dataDir = path.dirname(this.dataFile);

  private ensureStoreFile() {
    fs.mkdirSync(this.dataDir, { recursive: true });

    if (!fs.existsSync(this.dataFile)) {
      fs.writeFileSync(
        this.dataFile,
        JSON.stringify(createInitialAdminData(), null, 2),
        "utf8"
      );
    }
  }

  read(): AdminStoreSnapshot {
    this.ensureStoreFile();
    const raw = fs.readFileSync(this.dataFile, "utf8");
    return JSON.parse(raw) as AdminStoreSnapshot;
  }

  write(snapshot: AdminStoreSnapshot) {
    this.ensureStoreFile();
    fs.writeFileSync(this.dataFile, JSON.stringify(snapshot, null, 2), "utf8");
  }

  update<T>(mutator: (snapshot: AdminStoreSnapshot) => T): T {
    const snapshot = this.read();
    const result = mutator(snapshot);
    this.write(snapshot);
    return result;
  }
}
