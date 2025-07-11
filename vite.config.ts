import { defineConfig } from "vite";

export default defineConfig({
    build: {
        // sourcemap: trueを入れると、デベロッパーツールでソースコードが追える。公開したコードが読まれることにもなる。
        sourcemap: false,
        assetsInlineLimit: 0,
    },
    server: {
        hmr: false,
    },
    assetsInclude: ['**/*.mp3'],
    base: "/treasures/",
    // netlify,itch.ioなどに手動アップロードするためのdistフォルダをビルド生成するときはbaseを↓に変更する
    // base: "./"
});

