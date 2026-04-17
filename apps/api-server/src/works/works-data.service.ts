import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import { WorksSnapshot } from "./works.types";

function createInitialSnapshot(): WorksSnapshot {
  return {
    works: []
  };
}

@Injectable()
export class WorksDataService {
  private readonly dataFile = path.resolve(
    process.cwd(),
    process.env.PUBLIC_WORKS_DATA_FILE || "./data/public-works.json"
  );
  private readonly dataDir = path.dirname(this.dataFile);

  private ensureStoreFile() {
    fs.mkdirSync(this.dataDir, { recursive: true });

    if (!fs.existsSync(this.dataFile)) {
      fs.writeFileSync(
        this.dataFile,
        JSON.stringify(createInitialSnapshot(), null, 2),
        "utf8"
      );
    }
  }

  read(): WorksSnapshot {
    this.ensureStoreFile();
    const raw = fs.readFileSync(this.dataFile, "utf8");
    return JSON.parse(raw) as WorksSnapshot;
  }

  write(snapshot: WorksSnapshot) {
    this.ensureStoreFile();
    fs.writeFileSync(this.dataFile, JSON.stringify(snapshot, null, 2), "utf8");
  }

  update<T>(mutator: (snapshot: WorksSnapshot) => T): T {
    const snapshot = this.read();
    const result = mutator(snapshot);
    this.write(snapshot);
    return result;
  }
}
