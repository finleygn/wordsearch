import search from "./search.ts";
import { Index, BlockData, MetaData, SearchQuery } from "../core/types.ts";

// In memory database client, accessing local database files
class DatabaseClient {
  public ready = false;
  private index: Index = {};
  private data: BlockData = {};
  private meta?: MetaData;

  constructor(
    private indexPath: string,
    private blockDataPath: string,
    private metaPath: string,
  ) {}

  public getMeta() {
    if(!this.meta) throw new Error("Unable to load meta");
    return this.meta;
  }

  async connect() {
    const rawIndex = await Deno.readTextFile(this.indexPath);
    const index = JSON.parse(rawIndex) as Index;

    const rawData = await Deno.readTextFile(this.blockDataPath);
    const data = JSON.parse(rawData) as BlockData;

    const metaData = await Deno.readTextFile(this.metaPath);
    const meta = JSON.parse(metaData) as MetaData;

    this.ready = true;

    this.index = index;
    this.data = data;
    this.meta = meta;
  }

  search(query: SearchQuery) {
    if(!this.ready) throw new Error("Database is not ready for queries");
    return search(this.index, this.data, query);
  }
}

export default DatabaseClient;