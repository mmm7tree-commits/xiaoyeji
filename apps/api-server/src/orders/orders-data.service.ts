import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import { OrdersSnapshot } from "./orders.types";

function createInitialSnapshot(): OrdersSnapshot {
  return {
    orders: []
  };
}

@Injectable()
export class OrdersDataService {
  private readonly dataFile = path.resolve(
    process.cwd(),
    process.env.PUBLIC_ORDERS_DATA_FILE || "./data/public-orders.json"
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

  read() {
    this.ensureStoreFile();
    return JSON.parse(fs.readFileSync(this.dataFile, "utf8")) as OrdersSnapshot;
  }

  write(snapshot: OrdersSnapshot) {
    this.ensureStoreFile();
    fs.writeFileSync(this.dataFile, JSON.stringify(snapshot, null, 2), "utf8");
  }

  update<T>(mutator: (snapshot: OrdersSnapshot) => T) {
    const snapshot = this.read();
    const result = mutator(snapshot);
    this.write(snapshot);
    return result;
  }
}
