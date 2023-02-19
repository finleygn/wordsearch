.PHONY: benchmark compile

benchmark:
	deno run --allow-all --allow-hrtime ./benchmark/run.ts

compile:
	deno compile --allow-read --allow-write --output wrdsrch-compile ./cli/entry.ts