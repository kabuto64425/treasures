import { defineConfig } from "vite";

export default defineConfig({
    build: {
        // sourcemap: trueを入れると、デベロッパーツールでソースコードが追える。公開したコードが読まれることにもなる。
        sourcemap: true,
        assetsInlineLimit: 0,
    },

    base: "/treasures/",

});

