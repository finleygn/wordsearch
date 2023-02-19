import search from "./search.ts";
import { Index, BlockData, SearchQuery } from "../core/types.ts";

// In memory database client, accessing local database files
class DatabaseClient {
  public ready = false;
  private indexPath: string;
  private blockDataPath: string;
  private index: Index = {};
  private data: BlockData = {};

  constructor(indexPath: string, blockDataPath: string) {
    this.indexPath = indexPath;
    this.blockDataPath = blockDataPath;
    this.ready = false;
  }

  async connect() {
    const rawIndex = await Deno.readTextFile(this.indexPath);
    const index = JSON.parse(rawIndex) as Index;

    const rawData = await Deno.readTextFile(this.blockDataPath);
    const data = JSON.parse(rawData) as BlockData;
    this.ready = true;

    this.index = index;
    this.data = data;
  }

  search(query: SearchQuery) {
    if(!this.ready) throw new Error("Database is not ready for queries");
    return search(this.index,this.data,query);
  }
}

export default DatabaseClient;