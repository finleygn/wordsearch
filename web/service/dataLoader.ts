import { join } from "https://deno.land/std@0.177.0/path/mod.ts";
import { DatabaseClient } from '../../database/main.ts';

/**
 * Scan db directory for different indexes, map by name
 */
class DataLoader {
  private clients: Record<string, DatabaseClient> = {}
  private dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  public async setup() {
    const directory = await Deno.readDir(this.dir);


    for await (const entry of directory) {
      if(entry.isDirectory) {
        // Attempt add to clients

        this.clients[entry.name] = new DatabaseClient(
          join(this.dir, entry.name, "index"),
          join(this.dir, entry.name, "block"),
          join(this.dir, entry.name, "meta.json")
        )
      }
    }
  }

  public async connect() {
    for(const [name, client] of Object.entries(this.clients)) {
      try {
        await client.connect();
        console.log("Loaded", name);
      } catch(e) {
        console.log("Failed to load", name);
        throw e;
      }
    }
  }

  public getClients() { return this.clients }
}

export default DataLoader;